package com.shopsphere.controller;

import com.shopsphere.dto.response.ApiResponse;
import com.shopsphere.dto.response.ProductMediaResponse;
import com.shopsphere.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Method;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ProductControllerImageUploadTest {

    @Test
    void imageUploadIsAdminOnlyMultipart() throws Exception {
        Method uploadMethod = ProductController.class.getMethod(
                "addProductImages", Long.class, List.class);

        assertEquals(
                "hasAnyAuthority('ROLE_ADMIN', 'ROLE_SUPER_ADMIN')",
                uploadMethod.getAnnotation(PreAuthorize.class).value());
        assertEquals("/{id}/images", uploadMethod.getAnnotation(PostMapping.class).value()[0]);
        assertEquals(
                MediaType.MULTIPART_FORM_DATA_VALUE,
                uploadMethod.getAnnotation(PostMapping.class).consumes()[0]);
    }

    @Test
    void imageUploadReturnsOnlyProductMediaFields() {
        ProductService productService = mock(ProductService.class);
        ProductController controller = new ProductController(productService);
        ProductMediaResponse media = new ProductMediaResponse(
                12L, "example-product", "/uploads/example.jpg", List.of("/uploads/example.jpg"));
        MultipartFile image = mock(MultipartFile.class);
        when(productService.addProductImages(12L, List.of(image))).thenReturn(media);

        ResponseEntity<ApiResponse<ProductMediaResponse>> response =
                controller.addProductImages(12L, List.of(image));

        assertNotNull(response.getBody());
        assertEquals(12L, response.getBody().getData().getId());
        assertEquals("example-product", response.getBody().getData().getSlug());
        assertEquals("/uploads/example.jpg", response.getBody().getData().getThumbnailUrl());
        assertEquals(List.of("/uploads/example.jpg"), response.getBody().getData().getImages());
        verify(productService).addProductImages(12L, List.of(image));
    }
}
