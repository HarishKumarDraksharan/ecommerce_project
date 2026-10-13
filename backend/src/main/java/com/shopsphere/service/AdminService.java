package com.shopsphere.service;

import com.shopsphere.entity.Order;
import com.shopsphere.entity.Product;
import com.shopsphere.enums.OrderStatus;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // KPI calculations
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.countTotalOrders();
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;
        long totalProducts = productRepository.countActiveProducts();

        stats.put("totalUsers", totalUsers);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalProducts", totalProducts);

        // Fetch monthly revenue array (12 months)
        int currentYear = LocalDate.now().getYear();
        List<Object[]> monthlyRaw = orderRepository.getMonthlyRevenue(currentYear);
        double[] monthlyRevenue = new double[12];
        for (Object[] row : monthlyRaw) {
            int monthIdx = ((Number) row[0]).intValue() - 1; // 1-indexed to 0-indexed
            BigDecimal rev = (BigDecimal) row[1];
            if (monthIdx >= 0 && monthIdx < 12) {
                monthlyRevenue[monthIdx] = rev.doubleValue();
            }
        }
        stats.put("monthlyRevenue", monthlyRevenue);

        // Fetch orders by status breakdown
        Map<String, Long> statusBreakdown = orderRepository.findAll().stream()
                .collect(Collectors.groupingBy(o -> o.getStatus().name(), Collectors.counting()));
        stats.put("ordersByStatus", statusBreakdown);

        // Fetch recent orders
        List<Order> recentOrders = orderRepository.findAll(
                PageRequest.of(0, 5, Sort.by("createdAt").descending())).getContent();
        stats.put("recentOrders", recentOrders);

        // Fetch top products
        List<Product> topProducts = productRepository.findTopSellingProducts(PageRequest.of(0, 5));
        stats.put("topProducts", topProducts);

        // Fetch low stock products
        List<Product> lowStock = productRepository.findLowStockProducts();
        stats.put("lowStockProducts", lowStock);

        log.info("Aggregated admin dashboard stats successfully");
        return stats;
    }
}
