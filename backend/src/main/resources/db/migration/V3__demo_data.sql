-- Migration: V3__demo_data.sql
-- Inserts demo data for B.Tech project presentation

-- Insert Users
INSERT IGNORE INTO users (first_name, last_name, email, password, phone, is_enabled, email_verified, created_at)
VALUES
    ('Alex', 'Johnson', 'alex@example.com', '$2a$12$8.CuDvD9JUJCOhBFkBL5yOixnj3x/M3MEyP0gVPxNj4VBdBAfpKi2', '9876543211', 1, 1, NOW()),
    ('David', 'Smith', 'david@example.com', '$2a$12$8.CuDvD9JUJCOhBFkBL5yOixnj3x/M3MEyP0gVPxNj4VBdBAfpKi2', '9876543212', 1, 1, NOW());

INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'ROLE_CUSTOMER' FROM users WHERE email IN ('alex@example.com', 'david@example.com')
ON DUPLICATE KEY UPDATE role = role;

-- Insert 30 Products
INSERT IGNORE INTO products (name, slug, sku, short_description, price, original_price, discount_percent, stock_quantity, category_id, sub_category_id, brand, is_active, is_featured, is_best_seller, avg_rating, review_count) VALUES
('iPhone 16 Pro', 'iphone-16-pro', 'SKU-001', 'Latest Apple flagship', 119999.00, 129999.00, 7.69, 25, 1, 1, 'Apple', 1, 1, 1, 4.8, 245),
('Samsung Galaxy S25', 'samsung-galaxy-s25', 'SKU-002', 'Next-gen AI smartphone', 94999.00, 104999.00, 9.52, 40, 1, 1, 'Samsung', 1, 1, 0, 4.7, 189),
('OnePlus 13', 'oneplus-13', 'SKU-003', 'Hasselblad cameras', 69999.00, 79999.00, 12.50, 50, 1, 1, 'OnePlus', 1, 0, 1, 4.6, 120),
('ASUS Gaming Laptop', 'asus-gaming-laptop', 'SKU-004', 'RTX 4070, 240Hz OLED', 149999.00, 169999.00, 11.76, 15, 1, 2, 'ASUS', 1, 1, 0, 4.9, 78),
('Sony Wireless Headphones', 'sony-wireless-headphones', 'SKU-005', 'Industry leading noise cancellation', 29999.00, 34999.00, 14.28, 60, 1, 3, 'Sony', 1, 1, 1, 4.8, 432),
('Apple Watch Series 10', 'apple-watch', 'SKU-006', 'Advanced health tracking', 41999.00, 44999.00, 6.66, 35, 1, 4, 'Apple', 1, 0, 1, 4.7, 310),
('Bose Bluetooth Speaker', 'bluetooth-speaker', 'SKU-007', 'Portable 360-degree sound', 15999.00, 19999.00, 20.00, 80, 1, 3, 'Bose', 1, 0, 0, 4.6, 154),

('Men''s Classic Hoodie', 'mens-hoodie', 'SKU-008', 'Comfortable cotton fleece', 2999.00, 3999.00, 25.00, 120, 2, 6, 'Nike', 1, 1, 1, 4.5, 88),
('Premium Cotton T-Shirt', 'premium-tshirt', 'SKU-009', '100% organic cotton', 1499.00, 1999.00, 25.01, 200, 2, 6, 'Zara', 1, 0, 1, 4.4, 56),
('Running Sneakers', 'sneakers', 'SKU-010', 'Lightweight and responsive', 4999.00, 6999.00, 28.57, 45, 2, 8, 'Adidas', 1, 1, 0, 4.6, 112),
('Fashion Smart Watch', 'fashion-smart-watch', 'SKU-011', 'Classic style meets modern tech', 9999.00, 14999.00, 33.33, 30, 2, 9, 'Fossil', 1, 0, 0, 4.3, 45),
('Women''s Embroidered Kurti', 'womens-kurti', 'SKU-012', 'Elegant ethnic wear', 1999.00, 2999.00, 33.34, 65, 2, 7, 'Biba', 1, 1, 1, 4.7, 89),
('Vintage Denim Jacket', 'denim-jacket', 'SKU-013', 'Classic rugged denim', 3499.00, 4999.00, 30.00, 40, 2, 6, 'Levi''s', 1, 0, 0, 4.8, 67),

('Smart Coffee Maker', 'coffee-maker', 'SKU-014', 'Brew with app control', 4599.00, 5999.00, 23.33, 25, 3, 11, 'Philips', 1, 1, 0, 4.6, 134),
('LED Table Lamp', 'led-table-lamp', 'SKU-015', 'Eye-care reading lamp', 999.00, 1499.00, 33.35, 150, 3, 12, 'Syska', 1, 0, 1, 4.4, 56),
('Smart LED Bulb 9W', 'smart-led-bulb', 'SKU-016', '16 Million Colors', 599.00, 999.00, 40.04, 300, 3, 12, 'Wipro', 1, 0, 1, 4.5, 420),
('Ergonomic Study Table', 'study-table', 'SKU-017', 'Solid wood minimalist desk', 4999.00, 6999.00, 28.57, 20, 3, 10, 'Wakefit', 1, 1, 0, 4.7, 92),
('HEPA Air Purifier', 'air-purifier', 'SKU-018', 'Removes 99.97% allergens', 9999.00, 12999.00, 23.07, 35, 3, 11, 'Xiaomi', 1, 0, 1, 4.8, 215),

('Clean Code', 'clean-code', 'SKU-019', 'A Handbook of Agile Software Craftsmanship', 999.00, 1499.00, 33.35, 80, 4, 14, 'Prentice Hall', 1, 1, 1, 4.9, 560),
('Atomic Habits', 'atomic-habits', 'SKU-020', 'Tiny Changes, Remarkable Results', 499.00, 799.00, 37.54, 150, 4, 15, 'Penguin', 1, 1, 1, 4.9, 1200),
('The Pragmatic Programmer', 'pragmatic-programmer', 'SKU-021', 'Your journey to mastery', 1299.00, 1899.00, 31.59, 40, 4, 14, 'Addison-Wesley', 1, 0, 0, 4.8, 340),
('Rich Dad Poor Dad', 'rich-dad-poor-dad', 'SKU-022', 'What the rich teach their kids', 399.00, 599.00, 33.38, 200, 4, 15, 'Plata', 1, 0, 1, 4.7, 890),

('English Willow Cricket Bat', 'cricket-bat', 'SKU-023', 'Professional grade bat', 12999.00, 15999.00, 18.75, 15, 5, 16, 'SS', 1, 1, 0, 4.8, 54),
('Pro Match Football', 'football', 'SKU-024', 'FIFA Quality certified', 899.00, 1299.00, 30.79, 60, 5, 16, 'Nivia', 1, 0, 1, 4.5, 145),
('Premium Gym Gloves', 'gym-gloves', 'SKU-025', 'Wrist support and padding', 499.00, 799.00, 37.54, 100, 5, 16, 'Nivia', 1, 0, 1, 4.4, 230),
('Anti-Slip Yoga Mat', 'yoga-mat', 'SKU-026', '6mm extra thick TPE', 799.00, 1499.00, 46.69, 80, 5, 16, 'Boldfit', 1, 1, 1, 4.7, 340),

('Vitamin C Face Wash', 'face-wash', 'SKU-027', 'Skin illumination', 299.00, 399.00, 25.06, 150, 6, 16, 'Mamaearth', 1, 1, 1, 4.5, 450),
('Luxury Men Perfume', 'perfume', 'SKU-028', 'Long lasting EDP', 899.00, 1499.00, 40.02, 60, 6, 16, 'Bella Vita', 1, 0, 0, 4.6, 210),
('Advanced Skin Care Kit', 'skin-care-kit', 'SKU-029', 'Complete 3-step routine', 1499.00, 2499.00, 40.01, 40, 6, 16, 'L''Oreal', 1, 1, 1, 4.8, 156),
('Matte Liquid Lipstick', 'matte-lipstick', 'SKU-030', '16HR SuperStay', 499.00, 699.00, 28.61, 90, 6, 16, 'Maybelline', 1, 0, 1, 4.4, 320);

-- Insert Sample Orders
INSERT IGNORE INTO orders (
    order_number,
    user_id,
    total_amount,
    subtotal,
    tax_amount,
    shipping_charge,
    status,
    created_at
)
SELECT
    order_data.order_number,
    users.id,
    order_data.total_amount,
    order_data.subtotal,
    order_data.tax_amount,
    order_data.shipping_charge,
    order_data.status,
    order_data.created_at
FROM (
    SELECT
        'ORD-2026-0002' AS order_number,
        'john.doe@example.com' AS email,
        119999.00 AS total_amount,
        119999.00 AS subtotal,
        21599.82 AS tax_amount,
        0.00 AS shipping_charge,
        'DELIVERED' AS status,
        DATE_SUB(NOW(), INTERVAL 5 DAY) AS created_at

    UNION ALL

    SELECT
        'ORD-2026-0003',
        'alex@example.com',
        149999.00,
        149999.00,
        26999.82,
        0.00,
        'SHIPPED',
        DATE_SUB(NOW(), INTERVAL 2 DAY)

    UNION ALL

    SELECT
        'ORD-2026-0004',
        'david@example.com',
        2999.00,
        2999.00,
        539.82,
        49.00,
        'PENDING',
        NOW()
) AS order_data
JOIN users ON users.email = order_data.email;