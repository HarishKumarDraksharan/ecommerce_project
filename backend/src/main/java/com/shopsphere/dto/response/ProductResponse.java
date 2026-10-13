package com.shopsphere.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** Product data returned to frontend */
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String sku;
    private String description;
    private String shortDescription;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private BigDecimal discountPercent;
    private Integer stockQuantity;
    private boolean inStock;
    private boolean lowStock;
    private String categoryName;
    private Long categoryId;
    private String subCategoryName;
    private Long subCategoryId;
    private String brand;
    private String color;
    private String size;
    private List<String> images;
    private String thumbnailUrl;
    private BigDecimal avgRating;
    private Integer reviewCount;
    private boolean featured;
    private boolean bestSeller;
    private Long totalSold;
    private LocalDateTime createdAt;
}
