package com.shopsphere.controller;

import com.shopsphere.dto.response.ApiResponse;
import com.shopsphere.entity.Cart;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * CartController – shopping cart management.
 * Base path: /api/cart
 */
@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart operations")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get the current user's cart")
    public ResponseEntity<ApiResponse<Cart>> getCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success(cartService.getCartByUserId(userId)));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get cart pricing summary (subtotal, tax, shipping, total)")
    public ResponseEntity<ApiResponse<CartService.CartSummary>> getSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success(cartService.calculateSummary(userId)));
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart")
    public ResponseEntity<ApiResponse<Cart>> addItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int quantity) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart",
                cartService.addItem(userId, productId, quantity)));
    }

    @PutMapping("/items/{cartItemId}")
    @Operation(summary = "Update cart item quantity")
    public ResponseEntity<ApiResponse<Cart>> updateQuantity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId,
            @RequestParam int quantity) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Cart updated",
                cartService.updateItemQuantity(userId, cartItemId, quantity)));
    }

    @DeleteMapping("/items/{cartItemId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<ApiResponse<Cart>> removeItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Item removed",
                cartService.removeItem(userId, cartItemId)));
    }

    @DeleteMapping
    @Operation(summary = "Clear all items from cart")
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared"));
    }

    @PostMapping("/coupon")
    @Operation(summary = "Apply a coupon code to cart")
    public ResponseEntity<ApiResponse<Cart>> applyCoupon(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String code) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Coupon applied",
                cartService.applyCoupon(userId, code)));
    }

    @DeleteMapping("/coupon")
    @Operation(summary = "Remove applied coupon from cart")
    public ResponseEntity<ApiResponse<Cart>> removeCoupon(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success("Coupon removed",
                cartService.removeCoupon(userId)));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow().getId();
    }
}
