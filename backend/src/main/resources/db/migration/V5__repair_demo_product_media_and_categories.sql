INSERT INTO sub_categories (name, slug, category_id, is_active, sort_order)
SELECT 'Skincare & Grooming', 'beauty-skincare-grooming', c.id, 1, 1
FROM categories c
WHERE c.slug = 'beauty-personal'
  AND NOT EXISTS (
      SELECT 1
      FROM sub_categories sc
      WHERE sc.slug = 'beauty-skincare-grooming'
  );

UPDATE products p
JOIN categories c ON c.slug = 'beauty-personal'
JOIN sub_categories sc
  ON sc.slug = 'beauty-skincare-grooming'
 AND sc.category_id = c.id
SET p.category_id = c.id,
    p.sub_category_id = sc.id
WHERE p.sku IN ('SKU-027', 'SKU-028', 'SKU-029', 'SKU-030');

UPDATE products p
SET p.thumbnail_url = CASE p.slug
    WHEN 'samsung-galaxy-s25' THEN 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80'
    WHEN 'atomic-habits' THEN 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80'
    WHEN 'rich-dad-poor-dad' THEN 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80'
END
WHERE p.slug IN ('samsung-galaxy-s25', 'atomic-habits', 'rich-dad-poor-dad')
  AND (p.thumbnail_url IS NULL OR TRIM(p.thumbnail_url) = '')
  AND NOT EXISTS (
      SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
  );

INSERT INTO product_images (product_id, image_url)
SELECT p.id, p.thumbnail_url
FROM products p
WHERE p.slug IN ('samsung-galaxy-s25', 'atomic-habits', 'rich-dad-poor-dad')
  AND (
      (p.slug = 'samsung-galaxy-s25'
          AND p.thumbnail_url = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80')
      OR (p.slug = 'atomic-habits'
          AND p.thumbnail_url = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80')
      OR (p.slug = 'rich-dad-poor-dad'
          AND p.thumbnail_url = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80')
  )
  AND NOT EXISTS (
      SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
  );
