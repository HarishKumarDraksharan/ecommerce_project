package com.shopsphere.dto.response;

import com.shopsphere.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ProductMediaResponse {
    private final Long id;
    private final String slug;
    private final String thumbnailUrl;
    private final List<String> images;

    public static ProductMediaResponse from(Product product) {
        List<String> images = product.getImages() == null
                ? List.of()
                : List.copyOf(product.getImages());
        return new ProductMediaResponse(
                product.getId(),
                product.getSlug(),
                product.getThumbnailUrl(),
                images);
    }
}
