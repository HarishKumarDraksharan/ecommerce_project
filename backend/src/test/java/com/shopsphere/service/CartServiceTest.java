package com.shopsphere.service;

import com.shopsphere.entity.Cart;
import com.shopsphere.entity.User;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.CouponRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CouponRepository couponRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    void getCartByUserIdCreatesAndSavesCartWhenMissing() {
        Long userId = 7L;
        User user = User.builder().build();
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(cartRepository.save(org.mockito.ArgumentMatchers.any(Cart.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Cart cart = cartService.getCartByUserId(userId);

        assertNotNull(cart);
        assertSame(user, cart.getUser());
        verify(cartRepository).save(cart);
    }

    @Test
    void getCartByUserIdUsesWritableTransaction() throws NoSuchMethodException {
        Transactional transaction = CartService.class
                .getMethod("getCartByUserId", Long.class)
                .getAnnotation(Transactional.class);

        assertNotNull(transaction);
        assertFalse(transaction.readOnly());
    }

    @Test
    void cartSummaryUsesWritableTransactionWhenCreatingMissingCart() throws NoSuchMethodException {
        Transactional transaction = CartService.class
                .getMethod("calculateSummary", Long.class)
                .getAnnotation(Transactional.class);

        assertNotNull(transaction);
        assertFalse(transaction.readOnly());
    }

    @Test
    void calculateSummaryCreatesMissingCart() {
        Long userId = 7L;
        User user = User.builder().build();
        when(cartRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(cartRepository.save(org.mockito.ArgumentMatchers.any(Cart.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        ReflectionTestUtils.setField(cartService, "gstRate", BigDecimal.valueOf(18));
        ReflectionTestUtils.setField(cartService, "flatShippingCharge", BigDecimal.valueOf(49));
        ReflectionTestUtils.setField(cartService, "freeShippingThreshold", BigDecimal.valueOf(999));

        CartService.CartSummary summary = cartService.calculateSummary(userId);

        assertEquals(0, summary.getItemCount());
        assertEquals(BigDecimal.ZERO, summary.getSubtotal());
        verify(cartRepository).save(org.mockito.ArgumentMatchers.any(Cart.class));
    }

    @Test
    void cartMutationsRemainWritableTransactions() throws NoSuchMethodException {
        assertWritableTransaction("addItem", Long.class, Long.class, int.class);
        assertWritableTransaction("updateItemQuantity", Long.class, Long.class, int.class);
        assertWritableTransaction("removeItem", Long.class, Long.class);
        assertWritableTransaction("clearCart", Long.class);
        assertWritableTransaction("applyCoupon", Long.class, String.class);
        assertWritableTransaction("removeCoupon", Long.class);
    }

    @Test
    void existingReadOnlyServiceDefaultDoesNotOverrideWritableMethods() {
        assertTrue(CartService.class.getAnnotation(Transactional.class).readOnly());
    }

    private void assertWritableTransaction(String methodName, Class<?>... parameterTypes)
            throws NoSuchMethodException {
        Transactional transaction = CartService.class
                .getMethod(methodName, parameterTypes)
                .getAnnotation(Transactional.class);

        assertNotNull(transaction, methodName);
        assertFalse(transaction.readOnly(), methodName);
    }
}
