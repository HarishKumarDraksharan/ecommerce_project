package com.shopsphere.repository;

import com.shopsphere.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> {

    Optional<Product> findBySlug(String slug);

    Optional<Product> findBySku(String sku);

    boolean existsBySku(String sku);

    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);

    Page<Product> findBySubCategoryIdAndActiveTrue(Long subCategoryId, Pageable pageable);

    List<Product> findByFeaturedTrueAndActiveTrueOrderByCreatedAtDesc();

    List<Product> findByBestSellerTrueAndActiveTrueOrderByTotalSoldDesc();

    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY p.totalSold DESC")
    List<Product> findTrendingProducts(Pageable pageable);

    @Query("""
        SELECT p FROM Product p
        WHERE p.active = true AND p.discountPercent > 0
        ORDER BY p.discountPercent DESC, p.totalSold DESC
        """)
    List<Product> findDealProducts(Pageable pageable);

    @Query("""
        SELECT p FROM Product p
        WHERE p.active = true
          AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%'))
               OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))
        """)
    Page<Product> searchProducts(@Param("query") String query, Pageable pageable);

    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.active = true ORDER BY p.brand")
    List<String> findAllBrands();

    @Modifying
    @Query("UPDATE Product p SET p.avgRating = :rating, p.reviewCount = :count WHERE p.id = :id")
    void updateRatingStats(@Param("id") Long id,
                           @Param("rating") java.math.BigDecimal rating,
                           @Param("count") Integer count);

    @Modifying
    @Query("UPDATE Product p SET p.stockQuantity = p.stockQuantity - :qty WHERE p.id = :id AND p.stockQuantity >= :qty")
    int decrementStock(@Param("id") Long id, @Param("qty") Integer qty);

    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.lowStockThreshold AND p.active = true")
    List<Product> findLowStockProducts();

    @Query("SELECT p FROM Product p ORDER BY p.totalSold DESC")
    List<Product> findTopSellingProducts(Pageable pageable);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.active = true")
    Long countActiveProducts();
}
