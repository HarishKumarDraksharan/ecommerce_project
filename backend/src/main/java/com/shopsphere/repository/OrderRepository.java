package com.shopsphere.repository;

import com.shopsphere.entity.Order;
import com.shopsphere.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'DELIVERED'")
    BigDecimal calculateTotalRevenue();

    @Query("""
        SELECT SUM(o.totalAmount) FROM Order o
        WHERE o.status = 'DELIVERED'
          AND o.createdAt BETWEEN :start AND :end
        """)
    BigDecimal calculateRevenueByDateRange(@Param("start") LocalDateTime start,
                                            @Param("end") LocalDateTime end);

    @Query("""
        SELECT MONTH(o.createdAt) as month, SUM(o.totalAmount) as revenue
        FROM Order o
        WHERE o.status = 'DELIVERED' AND YEAR(o.createdAt) = :year
        GROUP BY MONTH(o.createdAt)
        ORDER BY MONTH(o.createdAt)
        """)
    List<Object[]> getMonthlyRevenue(@Param("year") int year);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :since")
    Long countRecentOrders(@Param("since") LocalDateTime since);

    @Query("SELECT COUNT(o) FROM Order o")
    Long countTotalOrders();
}
