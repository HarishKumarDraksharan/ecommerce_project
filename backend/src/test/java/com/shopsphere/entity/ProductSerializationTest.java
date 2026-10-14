package com.shopsphere.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopsphere.controller.ProductController;
import com.shopsphere.dto.response.ApiResponse;
import com.shopsphere.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ProductSerializationTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void productIncludesCategoryAndSubcategoryDetailsWithoutBackReferencesOrProxyProperties()
            throws Exception {
        Category category = new ProxyCategory();
        category.setId(3L);
        category.setName("Electronics");
        category.setSlug("electronics");
        SubCategory subCategory = new ProxySubCategory();
        subCategory.setId(12L);
        subCategory.setName("Mobile Phones");
        subCategory.setSlug("mobile-phones");
        subCategory.setCategory(category);
        category.getSubCategories().add(subCategory);
        Product product = Product.builder()
                .id(21L)
                .name("Example Phone")
                .slug("example-phone")
                .category(category)
                .subCategory(subCategory)
                .thumbnailUrl("/uploads/example-phone.jpg")
                .images(List.of("/uploads/example-phone.jpg", "/uploads/example-phone-side.jpg"))
                .build();

        ProductService productService = mock(ProductService.class);
        when(productService.getAllProducts(0, 12, "createdAt", "desc"))
                .thenReturn(new PageImpl<>(List.of(product), PageRequest.of(0, 12), 1));
        ProductController controller = new ProductController(productService);
        ResponseEntity<ApiResponse<Page<Product>>> response =
                controller.getAllProducts(0, 12, "createdAt", "desc");
        JsonNode pageJson = objectMapper.readTree(objectMapper.writeValueAsString(response.getBody()))
                .get("data");
        JsonNode json = pageJson.get("content").get(0);

        assertEquals(0, pageJson.get("number").asInt());
        assertEquals(12, pageJson.get("size").asInt());
        assertEquals(1, pageJson.get("totalElements").asLong());
        assertEquals(1, pageJson.get("totalPages").asInt());
        assertEquals("Electronics", json.get("category").get("name").asText());
        assertEquals("electronics", json.get("category").get("slug").asText());
        assertEquals("Mobile Phones",
                json.get("category").get("subCategories").get(0).get("name").asText());
        assertEquals("mobile-phones", json.get("subCategory").get("slug").asText());
        assertEquals("/uploads/example-phone.jpg", json.get("thumbnailUrl").asText());
        assertEquals("/uploads/example-phone.jpg", json.get("images").get(0).asText());
        assertEquals("/uploads/example-phone-side.jpg", json.get("images").get(1).asText());
        assertFalse(json.get("category").has("hibernateLazyInitializer"));
        assertFalse(json.get("category").get("subCategories").get(0)
                .has("hibernateLazyInitializer"));
        assertFalse(json.get("category").get("subCategories").get(0).has("category"));
    }

    public static class ProxyCategory extends Category {
        public Object getHibernateLazyInitializer() {
            return new Object();
        }
    }

    public static class ProxySubCategory extends SubCategory {
        public Object getHibernateLazyInitializer() {
            return new Object();
        }
    }
}
