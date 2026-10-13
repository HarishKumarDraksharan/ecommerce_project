package com.shopsphere.service;

import com.shopsphere.entity.*;
import com.shopsphere.enums.OrderStatus;
import com.shopsphere.enums.PaymentMethod;
import com.shopsphere.enums.PaymentStatus;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * OrderService – place orders, track status, cancel, and request returns.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final EmailService emailService;

    private static final AtomicInteger orderSequence = new AtomicInteger(0);

    // ── Place Order ──────────────────────────────────────────

    @Transactional
    public Order placeOrder(Long userId, Long addressId, PaymentMethod paymentMethod, String couponCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", addressId));

        if (!address.getUser().getId().equals(userId)) {
            throw new BadRequestException("Address does not belong to the current user");
        }

        Cart cart = cartService.getCartByUserId(userId);
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot place order with empty cart");
        }

        CartService.CartSummary summary = cartService.calculateSummary(userId);

        // Build order
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .status(OrderStatus.PENDING)
                .subtotal(summary.getSubtotal())
                .discountAmount(summary.getCouponDiscount())
                .couponCode(summary.getCouponCode())
                .shippingCharge(summary.getShippingCharge())
                .taxAmount(summary.getTaxAmount())
                .totalAmount(summary.getTotalAmount())
                // Address snapshot
                .shippingFullName(address.getFullName())
                .shippingPhone(address.getPhone())
                .shippingAddressLine1(address.getAddressLine1())
                .shippingAddressLine2(address.getAddressLine2())
                .shippingCity(address.getCity())
                .shippingState(address.getState())
                .shippingPincode(address.getPincode())
                .shippingCountry(address.getCountry())
                .expectedDeliveryDate(LocalDateTime.now().plusDays(5))
                .build();

        // Build order items from cart and decrement stock
        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            Product product = cartItem.getProduct();

            int decremented = productRepository.decrementStock(product.getId(), cartItem.getQuantity());
            if (decremented == 0) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }
            product.setTotalSold(product.getTotalSold() + cartItem.getQuantity());
            productRepository.save(product);

            return OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .productImage(product.getThumbnailUrl())
                    .productSku(product.getSku())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getUnitPrice())
                    .build();
        }).collect(Collectors.toList());

        order.setItems(orderItems);

        // Create initial payment record
        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(paymentMethod)
                .status(PaymentStatus.PENDING)
                .amount(summary.getTotalAmount())
                .build();
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        // Clear the cart
        cartService.clearCart(userId);

        // Send order confirmation email
        emailService.sendOrderConfirmationEmail(user.getEmail(), user.getFirstName(), savedOrder);

        log.info("Order placed: {} for user: {}", savedOrder.getOrderNumber(), user.getEmail());
        return savedOrder;
    }

    // ── Order History ────────────────────────────────────────

    public Page<Order> getUserOrders(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public Order getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Order does not belong to the current user");
        }
        return order;
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));
    }

    // ── Status Management ─────────────────────────────────────

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        validateStatusTransition(order.getStatus(), newStatus);
        order.setStatus(newStatus);

        if (newStatus == OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        } else if (newStatus == OrderStatus.CANCELLED) {
            order.setCancelledAt(LocalDateTime.now());
            order.setCancellationReason(reason);
            restoreStock(order);
        } else if (newStatus == OrderStatus.RETURNED) {
            order.setReturnReason(reason);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrder(Long orderId, Long userId, String reason) {
        Order order = getOrderById(orderId, userId);

        if (!order.getStatus().equals(OrderStatus.PENDING) &&
                !order.getStatus().equals(OrderStatus.CONFIRMED)) {
            throw new BadRequestException("Order cannot be cancelled in status: " + order.getStatus());
        }

        return updateOrderStatus(orderId, OrderStatus.CANCELLED, reason);
    }

    @Transactional
    public Order requestReturn(Long orderId, Long userId, String reason) {
        Order order = getOrderById(orderId, userId);

        if (!order.getStatus().equals(OrderStatus.DELIVERED)) {
            throw new BadRequestException("Returns can only be requested for delivered orders");
        }

        if (order.getDeliveredAt() != null &&
                order.getDeliveredAt().isBefore(LocalDateTime.now().minusDays(7))) {
            throw new BadRequestException("Return window has expired (7 days from delivery)");
        }

        order.setStatus(OrderStatus.RETURN_REQUESTED);
        order.setReturnReason(reason);
        return orderRepository.save(order);
    }

    // ── Admin: All Orders ────────────────────────────────────

    public Page<Order> getAllOrders(int page, int size, OrderStatus status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (status != null) {
            return orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        }
        return orderRepository.findAll(pageable);
    }

    // ── Helpers ───────────────────────────────────────────────

    private String generateOrderNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int seq = orderSequence.incrementAndGet() % 9999;
        return String.format("SS-%s-%04d", date, seq);
    }

    private void restoreStock(Order order) {
        order.getItems().forEach(item -> {
            productRepository.findById(item.getProduct().getId()).ifPresent(product -> {
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            });
        });
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        // Simplified validation – extend for full state machine
        if (current == OrderStatus.CANCELLED || current == OrderStatus.RETURNED) {
            throw new BadRequestException("Cannot change status of a " + current + " order");
        }
    }
}
