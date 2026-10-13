
package com.shopsphere.document;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * MongoDB Document – Tracks which products a user has viewed recently.
 * One document per user; productIds is a bounded list (max 50).
 */
@Document(collection = "browsing_history")
@CompoundIndex(name = "idx_browsing_user", def = "{'userId': 1}", unique = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BrowsingHistory {

    @Id
    private String id;

    private Long userId;

    @Builder.Default
    private List<BrowsedProduct> recentlyViewed = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @lombok.Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BrowsedProduct {
        private Long productId;
        private String productName;
        private String thumbnailUrl;
        private LocalDateTime viewedAt;
    }
}
