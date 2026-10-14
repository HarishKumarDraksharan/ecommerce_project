package com.shopsphere.service;

import com.shopsphere.entity.Product;
import com.shopsphere.entity.Category;
import com.shopsphere.entity.SubCategory;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.dto.response.ProductMediaResponse;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.SubCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private SubCategoryRepository subCategoryRepository;

    @Mock
    private FileStorageService fileStorageService;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(productRepository, subCategoryRepository, fileStorageService);
    }

    @Test
    void getTrendingProductsRequestsFiveProductsFromRepository() {
        List<Product> products = List.of(Product.builder().id(1L).build());
        when(productRepository.findTrendingProducts(argThat(pageable ->
                pageable.getPageNumber() == 0 && pageable.getPageSize() == 5)))
                .thenReturn(products);

        assertSame(products, productService.getTrendingProducts());

        verify(productRepository).findTrendingProducts(argThat(pageable ->
                pageable.getPageNumber() == 0 && pageable.getPageSize() == 5));
    }

    @Test
    void getDealProductsRequestsFiveProductsFromRepository() {
        List<Product> products = List.of(Product.builder().id(1L).build());
        when(productRepository.findDealProducts(argThat(pageable ->
                pageable.getPageNumber() == 0 && pageable.getPageSize() == 5)))
                .thenReturn(products);

        assertSame(products, productService.getDealProducts());

        verify(productRepository).findDealProducts(argThat(pageable ->
                pageable.getPageNumber() == 0 && pageable.getPageSize() == 5));
    }

    @Test
    void createProductRejectsSubcategoryFromAnotherCategory() {
        Product product = productWithCategory(10L, 30L);
        when(subCategoryRepository.findById(30L))
                .thenReturn(Optional.of(subCategoryWithCategory(30L, 20L)));

        assertThrows(BadRequestException.class, () -> productService.createProduct(product, null));
    }

    @Test
    void updateProductRejectsSubcategoryFromAnotherCategory() {
        Product existing = Product.builder().id(1L).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(subCategoryRepository.findById(30L))
                .thenReturn(Optional.of(subCategoryWithCategory(30L, 20L)));

        assertThrows(BadRequestException.class,
                () -> productService.updateProduct(1L, productWithCategory(10L, 30L), null));
    }

    @Test
    void createProductAcceptsSubcategoryFromSelectedCategory() {
        SubCategory subCategory = subCategoryWithCategory(30L, 10L);
        Product product = productWithCategory(10L, 30L);
        when(subCategoryRepository.findById(30L)).thenReturn(Optional.of(subCategory));
        when(productRepository.save(product)).thenReturn(product);

        assertSame(product, productService.createProduct(product, null));
        verify(productRepository).save(product);
    }

    @Test
    void addProductImagesAppendsImagesAndSetsMissingThumbnail() {
        Product product = Product.builder()
                .id(12L)
                .slug("example-product")
                .images(new ArrayList<>(List.of("/uploads/existing.jpg")))
                .build();
        MultipartFile image = new MockMultipartFile(
                "images", "new.jpg", "image/jpeg", new byte[]{1, 2, 3});
        when(productRepository.findById(12L)).thenReturn(Optional.of(product));
        when(fileStorageService.storeFiles(List.of(image))).thenReturn(List.of("/uploads/new.jpg"));
        when(productRepository.save(product)).thenReturn(product);

        ProductMediaResponse result = productService.addProductImages(12L, List.of(image));

        assertEquals("/uploads/new.jpg", result.getThumbnailUrl());
        assertEquals(List.of("/uploads/existing.jpg", "/uploads/new.jpg"), result.getImages());
        verify(productRepository).save(product);
    }

    @Test
    void addProductImagesPreservesExistingThumbnailAndGallery() {
        Product product = Product.builder()
                .id(12L)
                .slug("example-product")
                .thumbnailUrl("/uploads/original-thumbnail.jpg")
                .images(new ArrayList<>(List.of("/uploads/original-thumbnail.jpg")))
                .build();
        MultipartFile image = new MockMultipartFile(
                "images", "additional.jpg", "image/jpeg", new byte[]{1, 2, 3});
        when(productRepository.findById(12L)).thenReturn(Optional.of(product));
        when(fileStorageService.storeFiles(List.of(image)))
                .thenReturn(List.of("/uploads/additional.jpg"));
        when(productRepository.save(product)).thenReturn(product);

        ProductMediaResponse result = productService.addProductImages(12L, List.of(image));

        assertEquals("/uploads/original-thumbnail.jpg", result.getThumbnailUrl());
        assertEquals(
                List.of("/uploads/original-thumbnail.jpg", "/uploads/additional.jpg"),
                result.getImages());
    }

    @Test
    void addProductImagesRejectsAnEmptyUpload() {
        MultipartFile emptyImage = new MockMultipartFile(
                "images", "empty.jpg", "image/jpeg", new byte[0]);

        assertThrows(BadRequestException.class,
                () -> productService.addProductImages(12L, List.of(emptyImage)));

        verify(fileStorageService, never()).storeFiles(org.mockito.ArgumentMatchers.anyList());
        verify(productRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    private Product productWithCategory(Long categoryId, Long subCategoryId) {
        return Product.builder()
                .name("Example")
                .sku("SKU-EXAMPLE")
                .category(Category.builder().id(categoryId).build())
                .subCategory(SubCategory.builder().id(subCategoryId).build())
                .build();
    }

    private SubCategory subCategoryWithCategory(Long subCategoryId, Long categoryId) {
        return SubCategory.builder()
                .id(subCategoryId)
                .category(Category.builder().id(categoryId).build())
                .build();
    }
}
