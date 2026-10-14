package com.shopsphere.service;

import com.shopsphere.entity.*;
import com.shopsphere.dto.response.CartResponse;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

/**
 * CartService – manages the user's shopping cart.
 * Handles add/update/remove items, coupon application, and total calculation.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;

    @Value("${app.gst-rate:18.0}")
    private BigDecimal gstRate;

    @Value("${app.shipping-charge:49.0}")
    private BigDecimal flatShippingCharge;

    @Value("${app.free-shipping-above:999.0}")
    private BigDecimal freeShippingThreshold;

    // ── Get Cart ─────────────────────────────────────────────

    @Transactional
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> createCartForUser(userId));
    }

    @Transactional
    public CartResponse getCartResponseByUserId(Long userId) {
        return CartResponse.from(getCartByUserId(userId));
    }

    // ── Add Item ─────────────────────────────────────────────

    @Transactional
    public Cart addItem(Long userId, Long productId, int quantity) {
        Cart cart = getCartByUserId(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        if (!product.isActive()) {
            throw new BadRequestException("Product is not available: " + product.getName());
        }
        if (product.getStockQuantity() < quantity) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        // Check if item already in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            int newQty = existingItem.get().getQuantity() + quantity;
            if (newQty > product.getStockQuantity()) {
                throw new BadRequestException("Cannot add more than available stock (" + product.getStockQuantity() + ")");
            }
            existingItem.get().setQuantity(newQty);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .unitPrice(product.getPrice())
                    .build();
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public CartResponse addItemResponse(Long userId, Long productId, int quantity) {
        return CartResponse.from(addItem(userId, productId, quantity));
    }

    // ── Update Item Quantity ──────────────────────────────────

    @Transactional
    public Cart updateItemQuantity(Long userId, Long cartItemId, int quantity) {
        Cart cart = getCartByUserId(userId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            if (item.getProduct().getStockQuantity() < quantity) {
                throw new BadRequestException("Insufficient stock");
            }
            item.setQuantity(quantity);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public CartResponse updateItemQuantityResponse(Long userId, Long cartItemId, int quantity) {
        return CartResponse.from(updateItemQuantity(userId, cartItemId, quantity));
    }

    // ── Remove Item ──────────────────────────────────────────

    @Transactional
    public Cart removeItem(Long userId, Long cartItemId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(i -> i.getId().equals(cartItemId));
        return cartRepository.save(cart);
    }

    @Transactional
    public CartResponse removeItemResponse(Long userId, Long cartItemId) {
        return CartResponse.from(removeItem(userId, cartItemId));
    }

    // ── Clear Cart ───────────────────────────────────────────

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear();
        cart.setCoupon(null);
        cart.setCouponDiscount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    // ── Apply Coupon ─────────────────────────────────────────

    @Transactional
    public Cart applyCoupon(Long userId, String couponCode) {
        Cart cart = getCartByUserId(userId);
        Coupon coupon = couponRepository.findByCodeIgnoreCase(couponCode)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found: " + couponCode));

        if (!coupon.isValid()) {
            throw new BadRequestException("Coupon is invalid or expired");
        }

        BigDecimal subtotal = calculateSubtotal(cart);

        if (subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new BadRequestException("Minimum order amount for this coupon is ₹" + coupon.getMinOrderAmount());
        }

        BigDecimal discount = calculateCouponDiscount(coupon, subtotal);
        cart.setCoupon(coupon);
        cart.setCouponDiscount(discount);

        return cartRepository.save(cart);
    }

    @Transactional
    public CartResponse applyCouponResponse(Long userId, String couponCode) {
        return CartResponse.from(applyCoupon(userId, couponCode));
    }

    @Transactional
    public Cart removeCoupon(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.setCoupon(null);
        cart.setCouponDiscount(BigDecimal.ZERO);
        return cartRepository.save(cart);
    }

    @Transactional
    public CartResponse removeCouponResponse(Long userId) {
        return CartResponse.from(removeCoupon(userId));
    }

    // ── Cart Summary Calculation ──────────────────────────────

    @Transactional
    public CartSummary calculateSummary(Long userId) {
        Cart cart = getCartByUserId(userId);

        BigDecimal subtotal       = calculateSubtotal(cart);
        BigDecimal couponDiscount = cart.getCouponDiscount() != null ? cart.getCouponDiscount() : BigDecimal.ZERO;
        BigDecimal afterDiscount  = subtotal.subtract(couponDiscount).max(BigDecimal.ZERO);
        BigDecimal shippingCharge = afterDiscount.compareTo(freeShippingThreshold) >= 0
                ? BigDecimal.ZERO : flatShippingCharge;
        BigDecimal taxAmount = afterDiscount.multiply(gstRate)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = afterDiscount.add(shippingCharge).add(taxAmount);

        return CartSummary.builder()
                .subtotal(subtotal)
                .couponDiscount(couponDiscount)
                .shippingCharge(shippingCharge)
                .taxAmount(taxAmount)
                .totalAmount(totalAmount)
                .couponCode(cart.getCoupon() != null ? cart.getCoupon().getCode() : null)
                .itemCount(cart.getItems().stream().mapToInt(CartItem::getQuantity).sum())
                .build();
    }

    // ── Helpers ───────────────────────────────────────────────

    private BigDecimal calculateSubtotal(Cart cart) {
        return cart.getItems().stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateCouponDiscount(Coupon coupon, BigDecimal subtotal) {
        BigDecimal discount;
        if (coupon.getDiscountType().name().equals("PERCENTAGE")) {
            discount = subtotal.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountAmount() != null) {
                discount = discount.min(coupon.getMaxDiscountAmount());
            }
        } else {
            discount = coupon.getDiscountValue();
        }
        return discount.min(subtotal);
    }

    private Cart createCartForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        Cart cart = Cart.builder().user(user).build();
        return cartRepository.save(cart);
    }

    // ── Inner DTO ─────────────────────────────────────────────

    @lombok.Data @lombok.Builder @lombok.NoArgsConstructor @lombok.AllArgsConstructor
    public static class CartSummary {
        private BigDecimal subtotal;
        private BigDecimal couponDiscount;
        private BigDecimal shippingCharge;
        private BigDecimal taxAmount;
        private BigDecimal totalAmount;
        private String couponCode;
        private int itemCount;
    }
}
