package com.shopsphere.document;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * MongoDB Document – Product review with rating.
 * Stored in MongoDB for flexible schema and fast aggregation.
 * Average rating is synced back to MySQL Product entity via event.
 */
@Document(collection = "reviews")
@CompoundIndexes({
        @CompoundIndex(name = "idx_review_product_user", def = "{'productId': 1, 'userId': 1}", unique = true),
        @CompoundIndex(name = "idx_review_product_date", def = "{'productId': 1, 'createdAt': -1}")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {

    @Id
    private String id;

    @Indexed
    private Long productId;

    @Indexed
    private Long userId;

    private String userFullName;
    private String userProfileImage;

    private Integer rating;         // 1-5 stars
    private String title;
    private String comment;

    private boolean verified;       // true = verified purchaser
    private int helpfulCount;       // upvotes

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
