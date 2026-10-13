package com.shopsphere.repository;

import com.shopsphere.document.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    Page<Review> findByProductId(Long productId, Pageable pageable);
    List<Review> findByProductId(Long productId);
    Optional<Review> findByProductIdAndUserId(Long productId, Long userId);
    void deleteByProductIdAndUserId(Long productId, Long userId);
    boolean existsByProductIdAndUserId(Long productId, Long userId);
}
