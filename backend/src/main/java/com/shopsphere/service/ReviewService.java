package com.shopsphere.service;

import com.shopsphere.document.Review;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.ReviewRepository;
import com.shopsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Page<Review> getReviewsByProductId(Long productId, Pageable pageable) {
        return reviewRepository.findByProductId(productId, pageable);
    }

    @Transactional
    public Review createReview(Long userId, Long productId, int rating, String title, String comment) {
        if (rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        // Check if product exists
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product", productId);
        }

        // Check if user already reviewed this product
        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new BadRequestException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .productId(productId)
                .userId(userId)
                .userFullName(user.getFullName())
                .userProfileImage(user.getProfileImage())
                .rating(rating)
                .title(title)
                .comment(comment)
                .verified(true) // Simulating verified checkout for now
                .helpfulCount(0)
                .createdAt(LocalDateTime.now())
                .build();

        Review saved = reviewRepository.save(review);
        log.info("New review created for product {} by user {}", productId, userId);

        // Update product statistics
        updateProductStats(productId);

        return saved;
    }

    @Transactional
    public void deleteReview(Long userId, String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        if (!review.getUserId().equals(userId)) {
            throw new BadRequestException("You are not authorized to delete this review");
        }

        reviewRepository.delete(review);
        log.info("Deleted review {} for product {}", reviewId, review.getProductId());

        // Update product statistics
        updateProductStats(review.getProductId());
    }

    private void updateProductStats(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        int count = reviews.size();
        BigDecimal avg = BigDecimal.ZERO;

        if (count > 0) {
            int sum = reviews.stream().mapToInt(Review::getRating).sum();
            avg = BigDecimal.valueOf(sum).divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
        }

        productRepository.updateRatingStats(productId, avg, count);
        log.info("Updated product {} statistics: avg rating = {}, reviews count = {}", productId, avg, count);
    }
}
