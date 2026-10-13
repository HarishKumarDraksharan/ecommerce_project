package com.shopsphere.document;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * MongoDB Document – Tracks recent search queries per user.
 * Used to power search suggestions / autocomplete.
 * Anonymous users are tracked by session ID (userId = null).
 */
@Document(collection = "search_history")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SearchHistory {

    @Id
    private String id;

    @Indexed
    private Long userId;         // null for guest/anonymous

    @Indexed
    private String sessionId;    // browser session for guests

    @Builder.Default
    private List<SearchEntry> searches = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @lombok.Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SearchEntry {
        private String query;
        private int resultCount;
        private LocalDateTime searchedAt;
    }
}
