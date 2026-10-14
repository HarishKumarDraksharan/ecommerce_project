package com.shopsphere.dto.response;

import com.shopsphere.entity.Cart;
import com.shopsphere.entity.CartItem;
import com.shopsphere.entity.Coupon;
import com.shopsphere.entity.Product;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private Long id;
    private List<CartItemResponse> items;
    private CouponResponse coupon;
    private BigDecimal couponDiscount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CartResponse from(Cart cart) {
        return CartResponse.builder()
                .id(cart.getId())
                .items(cart.getItems().stream().map(CartItemResponse::from).toList())
                .coupon(cart.getCoupon() == null ? null : CouponResponse.from(cart.getCoupon()))
                .couponDiscount(cart.getCouponDiscount())
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private Long id;
        private ProductResponse product;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal totalPrice;

        private static CartItemResponse from(CartItem item) {
            return CartItemResponse.builder()
                    .id(item.getId())
                    .product(ProductDetails.from(item.getProduct()))
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .totalPrice(item.getTotalPrice())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CouponResponse {
        private Long id;
        private String code;
        private String description;
        private String discountType;
        private BigDecimal discountValue;
        private BigDecimal maxDiscountAmount;
        private BigDecimal minOrderAmount;
        private Integer maxUsageCount;
        private Integer usageCount;
        private Integer perUserLimit;
        private LocalDateTime validFrom;
        private LocalDateTime validUntil;
        private boolean active;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        private static CouponResponse from(Coupon coupon) {
            return CouponResponse.builder()
                    .id(coupon.getId())
                    .code(coupon.getCode())
                    .description(coupon.getDescription())
                    .discountType(coupon.getDiscountType() == null
                            ? null : coupon.getDiscountType().name())
                    .discountValue(coupon.getDiscountValue())
                    .maxDiscountAmount(coupon.getMaxDiscountAmount())
                    .minOrderAmount(coupon.getMinOrderAmount())
                    .maxUsageCount(coupon.getMaxUsageCount())
                    .usageCount(coupon.getUsageCount())
                    .perUserLimit(coupon.getPerUserLimit())
                    .validFrom(coupon.getValidFrom())
                    .validUntil(coupon.getValidUntil())
                    .active(coupon.isActive())
                    .createdAt(coupon.getCreatedAt())
                    .updatedAt(coupon.getUpdatedAt())
                    .build();
        }
    }

    private static class ProductDetails {
        private static ProductResponse from(Product product) {
            return ProductResponse.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .slug(product.getSlug())
                    .sku(product.getSku())
                    .description(product.getDescription())
                    .shortDescription(product.getShortDescription())
                    .price(product.getPrice())
                    .originalPrice(product.getOriginalPrice())
                    .discountPercent(product.getDiscountPercent())
                    .stockQuantity(product.getStockQuantity())
                    .inStock(product.isInStock())
                    .lowStock(product.isLowStock())
                    .categoryId(product.getCategory() == null ? null : product.getCategory().getId())
                    .categoryName(product.getCategory() == null ? null : product.getCategory().getName())
                    .subCategoryId(product.getSubCategory() == null ? null : product.getSubCategory().getId())
                    .subCategoryName(product.getSubCategory() == null
                            ? null : product.getSubCategory().getName())
                    .brand(product.getBrand())
                    .color(product.getColor())
                    .size(product.getSize())
                    .images(product.getImages())
                    .thumbnailUrl(product.getThumbnailUrl())
                    .avgRating(product.getAvgRating())
                    .reviewCount(product.getReviewCount())
                    .featured(product.isFeatured())
                    .bestSeller(product.isBestSeller())
                    .totalSold(product.getTotalSold())
                    .createdAt(product.getCreatedAt())
                    .build();
        }
    }
}
