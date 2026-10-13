package com.shopsphere.controller;

import com.shopsphere.document.Review;
import com.shopsphere.dto.response.ApiResponse;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Product review and rating management")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get reviews for a product with pagination")
    public ResponseEntity<ApiResponse<Page<Review>>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewsByProductId(productId, pageable)));
    }

    @PostMapping
    @Operation(summary = "Post a new product review")
    public ResponseEntity<ApiResponse<Review>> addReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> body) {
        Long userId = getUserId(userDetails);
        Long productId = Long.valueOf(body.get("productId").toString());
        int rating = Integer.parseInt(body.get("rating").toString());
        String title = (String) body.get("title");
        String comment = (String) body.get("comment");

        Review review = reviewService.createReview(userId, productId, rating, title, comment);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review posted successfully", review));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an existing product review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String id) {
        Long userId = getUserId(userDetails);
        reviewService.deleteReview(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully"));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow().getId();
    }
}
