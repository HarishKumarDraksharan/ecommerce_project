package com.shopsphere.controller;

import com.shopsphere.dto.response.ApiResponse;
import com.shopsphere.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * PaymentController – Razorpay payment flow.
 * Base path: /api/payments
 */
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Payment initiation and verification with Razorpay")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/razorpay/create-order/{orderId}")
    @Operation(summary = "Create Razorpay payment order")
    public ResponseEntity<ApiResponse<String>> createRazorpayOrder(
            @PathVariable Long orderId) {
        String razorpayOrderId = paymentService.createRazorpayOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success("Razorpay order created", razorpayOrderId));
    }

    @PostMapping("/razorpay/verify")
    @Operation(summary = "Verify Razorpay payment after checkout")
    public ResponseEntity<ApiResponse<Void>> verifyPayment(
            @RequestBody Map<String, String> paymentData) {
        paymentService.verifyPayment(
                paymentData.get("razorpay_order_id"),
                paymentData.get("razorpay_payment_id"),
                paymentData.get("razorpay_signature")
        );
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully"));
    }
}
