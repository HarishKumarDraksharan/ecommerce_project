package com.shopsphere.service;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.shopsphere.entity.Order;
import com.shopsphere.entity.Payment;
import com.shopsphere.enums.PaymentStatus;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.PaymentRepository;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * PaymentService – Razorpay integration.
 * 1. createRazorpayOrder  → frontend uses this to open Razorpay checkout
 * 2. verifyPayment        → called after payment, verifies HMAC signature
 */
@Service
@Slf4j
public class PaymentService {

    @Value("${razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.currency:INR}")
    private String currency;

    private RazorpayClient razorpayClient;

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @PostConstruct
    public void init() {
        try {
            razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
        } catch (RazorpayException e) {
            log.error("Failed to initialize Razorpay client: {}", e.getMessage());
        }
    }

    // ── Create Razorpay Order ─────────────────────────────────

    @Transactional
    public String createRazorpayOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));

        try {
            // Razorpay expects amount in paise (1 INR = 100 paise)
            int amountInPaise = order.getTotalAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .intValue();

            JSONObject options = new JSONObject();
            options.put("amount", amountInPaise);
            options.put("currency", currency);
            options.put("receipt", order.getOrderNumber());
            options.put("payment_capture", 1);

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(options);
            String razorpayOrderId = razorpayOrder.get("id");

            // Store Razorpay order ID in our payment record
            Payment payment = order.getPayment();
            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setStatus(PaymentStatus.INITIATED);
            paymentRepository.save(payment);

            log.info("Razorpay order created: {} for order: {}", razorpayOrderId, order.getOrderNumber());
            return razorpayOrderId;

        } catch (RazorpayException e) {
            log.error("Razorpay order creation failed: {}", e.getMessage());
            throw new BadRequestException("Payment initialization failed: " + e.getMessage());
        }
    }

    // ── Verify Payment Signature ──────────────────────────────

    @Transactional
    public void verifyPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + razorpayOrderId));

        // Verify HMAC-SHA256 signature
        String payload = razorpayOrderId + "|" + razorpayPaymentId;
        boolean isValid = verifySignature(payload, razorpaySignature, razorpayKeySecret);

        if (!isValid) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setFailureReason("Signature verification failed");
            paymentRepository.save(payment);
            throw new BadRequestException("Payment signature verification failed. Possible fraud attempt.");
        }

        // Update payment record
        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setRazorpaySignature(razorpaySignature);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Update order status
        Order order = payment.getOrder();
        order.setStatus(com.shopsphere.enums.OrderStatus.CONFIRMED);
        orderRepository.save(order);

        log.info("Payment verified successfully: {}", razorpayPaymentId);
    }

    // ── HMAC Signature Verification ───────────────────────────

    private boolean verifySignature(String payload, String signature, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(payload.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString().equals(signature);
        } catch (Exception e) {
            log.error("Signature verification error: {}", e.getMessage());
            return false;
        }
    }
}
