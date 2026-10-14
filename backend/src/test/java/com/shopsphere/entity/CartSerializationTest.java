package com.shopsphere.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.controller.CartController;
import com.shopsphere.dto.response.ApiResponse;
import com.shopsphere.dto.response.CartResponse;
import com.shopsphere.entity.Category;
import com.shopsphere.entity.SubCategory;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.service.CartService;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CartSerializationTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void cartResponseMapsProductProxyToClientFieldsWithoutProxyProperties() throws Exception {
        User user = User.builder()
                .id(7L)
                .firstName("Shop")
                .lastName("User")
                .email("shop.user@example.test")
                .password("not-a-real-password")
                .build();
        Cart cart = Cart.builder()
                .id(9L)
                .user(user)
                .build();
        user.setCart(cart);

        Category category = Category.builder().id(4L).name("Electronics").slug("electronics").build();
        SubCategory subCategory = SubCategory.builder()
                .id(8L).name("Mobile Phones").slug("mobile-phones").category(category).build();
        Product product = new ProxyProduct();
        product.setId(21L);
        product.setName("Example Phone");
        product.setSlug("example-phone");
        product.setSku("SKU-EXAMPLE");
        product.setBrand("Example");
        product.setCategory(category);
        product.setSubCategory(subCategory);
        product.setPrice(BigDecimal.valueOf(25));
        product.setStockQuantity(5);
        product.setThumbnailUrl("/uploads/example-phone.jpg");
        product.setImages(java.util.List.of("/uploads/example-phone.jpg", "/uploads/example-phone-side.jpg"));
        CartItem item = CartItem.builder()
                .id(31L)
                .cart(cart)
                .product(product)
                .quantity(2)
                .unitPrice(BigDecimal.valueOf(25))
                .build();
        cart.getItems().add(item);
        CartResponse cartResponse = CartResponse.from(cart);

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("shop.user@example.test")
                .password("not-a-real-password")
                .authorities("ROLE_USER")
                .build();
        UserRepository userRepository = mock(UserRepository.class);
        CartService cartService = mock(CartService.class);
        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));
        when(cartService.getCartResponseByUserId(7L)).thenReturn(cartResponse);
        CartController controller = new CartController(cartService, userRepository);
        ResponseEntity<ApiResponse<CartResponse>> response = controller.getCart(userDetails);
        JsonNode json = objectMapper.readTree(objectMapper.writeValueAsString(response.getBody()))
                .get("data");

        assertEquals(9L, json.get("id").asLong());
        assertFalse(json.has("user"));
        assertEquals(1, json.get("items").size());
        assertFalse(json.get("items").get(0).has("cart"));
        assertEquals("Example Phone", json.get("items").get(0).get("product").get("name").asText());
        assertEquals("example-phone", json.get("items").get(0).get("product").get("slug").asText());
        assertEquals("Electronics",
                json.get("items").get(0).get("product").get("categoryName").asText());
        assertEquals("Mobile Phones",
                json.get("items").get(0).get("product").get("subCategoryName").asText());
        assertEquals("/uploads/example-phone.jpg",
                json.get("items").get(0).get("product").get("thumbnailUrl").asText());
        assertEquals(2, json.get("items").get(0).get("product").get("images").size());
        assertEquals(2, json.get("items").get(0).get("quantity").asInt());
        assertEquals(25, json.get("items").get(0).get("unitPrice").decimalValue().intValue());
        assertFalse(json.get("items").get(0).get("product").has("hibernateLazyInitializer"));
        assertFalse(json.toString().contains("not-a-real-password"));
    }

    public static class ProxyProduct extends Product {
        public Object getHibernateLazyInitializer() {
            return new Object();
        }
    }
}
