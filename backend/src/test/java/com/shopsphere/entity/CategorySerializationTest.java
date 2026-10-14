package com.shopsphere.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

class CategorySerializationTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void categoryIncludesSubcategoryDetailsWithoutSerializingBackReferences() throws Exception {
        SubCategory subCategory = SubCategory.builder()
                .id(12L)
                .name("Mobile Phones")
                .slug("mobile-phones")
                .description("Phones and accessories")
                .build();
        Category category = Category.builder()
                .id(3L)
                .name("Electronics")
                .slug("electronics")
                .subCategories(List.of(subCategory))
                .build();
        subCategory.setCategory(category);

        JsonNode json = objectMapper.readTree(objectMapper.writeValueAsString(category));

        assertEquals("Electronics", json.get("name").asText());
        assertEquals(1, json.get("subCategories").size());
        assertEquals("Mobile Phones", json.get("subCategories").get(0).get("name").asText());
        assertEquals("mobile-phones", json.get("subCategories").get(0).get("slug").asText());
        assertFalse(json.has("products"));
        assertFalse(json.get("subCategories").get(0).has("category"));
        assertFalse(json.get("subCategories").get(0).has("products"));
    }
}
