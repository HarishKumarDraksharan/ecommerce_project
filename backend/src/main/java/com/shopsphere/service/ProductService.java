package com.shopsphere.service;

import com.shopsphere.entity.Product;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.*;

/**
 * ProductService – product CRUD, search, filtering, pagination, image upload.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;

    @Value("${app.pagination.default-page-size:12}")
    private int defaultPageSize;

    // ── Fetch Operations ─────────────────────────────────────

    public Page<Product> getAllProducts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), sort);
        return productRepository.findByActiveTrue(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + slug));
    }

    public Page<Product> getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
    }

    public Page<Product> getProductsBySubCategory(Long subCategoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.findBySubCategoryIdAndActiveTrue(subCategoryId, pageable);
    }

    public Page<Product> searchProducts(String query, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.searchProducts(query, pageable);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrueOrderByCreatedAtDesc();
    }

    public List<Product> getBestSellers() {
        return productRepository.findByBestSellerTrueAndActiveTrueOrderByTotalSoldDesc();
    }

    public List<Product> getTopSellingProducts(int limit) {
        return productRepository.findTopSellingProducts(PageRequest.of(0, limit));
    }

    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }

    public List<String> getAllBrands() {
        return productRepository.findAllBrands();
    }

    // ── Admin CRUD ───────────────────────────────────────────

    @Transactional
    public Product createProduct(Product product, List<MultipartFile> images) {
        if (productRepository.existsBySku(product.getSku())) {
            throw new BadRequestException("SKU already exists: " + product.getSku());
        }

        if (images != null && !images.isEmpty()) {
            List<String> imageUrls = fileStorageService.storeFiles(images);
            product.setImages(imageUrls);
            if (!imageUrls.isEmpty()) {
                product.setThumbnailUrl(imageUrls.get(0));
            }
        }

        // Auto-generate slug from name
        if (product.getSlug() == null || product.getSlug().isBlank()) {
            product.setSlug(generateSlug(product.getName()));
        }

        Product saved = productRepository.save(product);
        log.info("Product created: {} (ID: {})", saved.getName(), saved.getId());
        return saved;
    }

    @Transactional
    public Product updateProduct(Long id, Product updatedProduct, List<MultipartFile> newImages) {
        Product existing = getProductById(id);

        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setShortDescription(updatedProduct.getShortDescription());
        existing.setPrice(updatedProduct.getPrice());
        existing.setOriginalPrice(updatedProduct.getOriginalPrice());
        existing.setDiscountPercent(updatedProduct.getDiscountPercent());
        existing.setStockQuantity(updatedProduct.getStockQuantity());
        existing.setBrand(updatedProduct.getBrand());
        existing.setFeatured(updatedProduct.isFeatured());
        existing.setBestSeller(updatedProduct.isBestSeller());
        existing.setActive(updatedProduct.isActive());
        existing.setCategory(updatedProduct.getCategory());
        existing.setSubCategory(updatedProduct.getSubCategory());

        if (newImages != null && !newImages.isEmpty()) {
            List<String> newUrls = fileStorageService.storeFiles(newImages);
            existing.getImages().addAll(newUrls);
        }

        return productRepository.save(existing);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.setActive(false);  // Soft delete
        productRepository.save(product);
        log.info("Product soft-deleted: {}", id);
    }

    @Transactional
    public void updateStock(Long id, int quantity) {
        Product product = getProductById(id);
        if (quantity < 0 && product.getStockQuantity() + quantity < 0) {
            throw new BadRequestException("Insufficient stock for product: " + product.getName());
        }
        product.setStockQuantity(product.getStockQuantity() + quantity);
        productRepository.save(product);
    }

    @Transactional
    public void updateRatingStats(Long productId, BigDecimal avgRating, Integer reviewCount) {
        productRepository.updateRatingStats(productId, avgRating, reviewCount);
    }

    // ── Slug Generation ──────────────────────────────────────

    private String generateSlug(String name) {
        String slug = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
        // Ensure uniqueness
        String baseSlug = slug;
        int counter = 1;
        while (productRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + counter++;
        }
        return slug;
    }
}
