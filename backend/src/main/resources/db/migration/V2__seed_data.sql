-- ═══════════════════════════════════════════════════════════════
-- ShopSphere – Seed Data
-- Migration: V2__seed_data.sql
-- Inserts demo admin, categories, subcategories, coupons, and sample products
-- ═══════════════════════════════════════════════════════════════

-- ── Admin User (password: Admin@123) BCrypt hash ──────────────
INSERT IGNORE INTO users (first_name, last_name, email, password, is_enabled, email_verified, created_at)
VALUES (
    'Super', 'Admin',
    'admin@shopsphere.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LDfm5g8Vsa6GnHqSy',
    1, 1, NOW()
);

INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'ROLE_ADMIN' FROM users WHERE email = 'admin@shopsphere.com'
ON DUPLICATE KEY UPDATE role = role;

INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'ROLE_SUPER_ADMIN' FROM users WHERE email = 'admin@shopsphere.com'
ON DUPLICATE KEY UPDATE role = role;

-- ── Demo Customer (password: User@123) ───────────────────────
INSERT IGNORE INTO users (first_name, last_name, email, password, phone, is_enabled, email_verified, created_at)
VALUES (
    'John', 'Doe',
    'john.doe@example.com',
    '$2a$12$8.CuDvD9JUJCOhBFkBL5yOixnj3x/M3MEyP0gVPxNj4VBdBAfpKi2',
    '9876543210',
    1, 1, NOW()
);

INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'ROLE_CUSTOMER' FROM users WHERE email = 'john.doe@example.com'
ON DUPLICATE KEY UPDATE role = role;

-- ── Categories ────────────────────────────────────────────────
INSERT IGNORE INTO categories (name, slug, description, is_active, sort_order) VALUES
('Electronics',       'electronics',        'Phones, Laptops, Gadgets & More',        1, 1),
('Fashion',           'fashion',            'Men, Women & Kids Clothing & Accessories',1, 2),
('Home & Kitchen',    'home-kitchen',       'Furniture, Appliances & Decor',           1, 3),
('Books',             'books',              'Academic, Fiction, Non-Fiction & More',   1, 4),
('Sports & Fitness',  'sports-fitness',     'Equipment, Clothing & Supplements',       1, 5),
('Beauty & Personal', 'beauty-personal',    'Skincare, Makeup & Grooming',             1, 6),
('Toys & Games',      'toys-games',         'Toys, Board Games & Learning Materials',  1, 7),
('Grocery',           'grocery',            'Daily Essentials & Organic Products',     1, 8);

-- ── SubCategories ────────────────────────────────────────────
INSERT IGNORE INTO sub_categories (name, slug, category_id, is_active, sort_order) VALUES
-- Electronics
('Mobile Phones',    'mobile-phones',    1, 1, 1),
('Laptops',          'laptops',          1, 1, 2),
('Headphones',       'headphones',       1, 1, 3),
('Smart Watches',    'smart-watches',    1, 1, 4),
('Cameras',          'cameras',          1, 1, 5),
-- Fashion
('Men Clothing',     'men-clothing',     2, 1, 1),
('Women Clothing',   'women-clothing',   2, 1, 2),
('Footwear',         'footwear',         2, 1, 3),
('Accessories',      'accessories',      2, 1, 4),
-- Home & Kitchen
('Furniture',        'furniture',        3, 1, 1),
('Kitchen Appliances','kitchen-appliances',3,1, 2),
('Home Decor',       'home-decor',       3, 1, 3),
-- Books
('Fiction',          'fiction',          4, 1, 1),
('Technical',        'technical',        4, 1, 2),
('Self Help',        'self-help',        4, 1, 3),
-- Sports
('Gym Equipment',    'gym-equipment',    5, 1, 1),
('Sports Wear',      'sports-wear',      5, 1, 2);

-- ── Coupons ───────────────────────────────────────────────────
INSERT IGNORE INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_usage_count, valid_until, is_active) VALUES
('WELCOME10',  '10% off for new users',             'PERCENTAGE', 10.00, 299.00,  1000, DATE_ADD(NOW(), INTERVAL 1 YEAR), 1),
('FLAT100',    'Flat ₹100 off on orders above ₹599', 'FLAT_AMOUNT', 100.00, 599.00, 500,  DATE_ADD(NOW(), INTERVAL 6 MONTH), 1),
('SAVE20',     '20% off – max ₹500 discount',       'PERCENTAGE', 20.00, 999.00,  200,  DATE_ADD(NOW(), INTERVAL 3 MONTH), 1),
('FREESHIP',   'Free shipping on any order',         'FLAT_AMOUNT', 49.00, 1.00,   NULL, DATE_ADD(NOW(), INTERVAL 1 YEAR), 1),
('DIWALI50',   'Diwali special – ₹50 off',           'FLAT_AMOUNT', 50.00, 399.00, 1000, DATE_ADD(NOW(), INTERVAL 30 DAY), 1);

-- ── Sample Products ───────────────────────────────────────────
INSERT IGNORE INTO products (name, slug, sku, short_description, price, original_price, discount_percent, stock_quantity, category_id, sub_category_id, brand, is_active, is_featured, is_best_seller, avg_rating, review_count) VALUES
('OnePlus Nord CE 4 Lite 5G',  'oneplus-nord-ce-4-lite-5g',  'SKU-PHONE-001', '6.67" display, 50MP camera, 5500mAh battery',  17999.00, 21999.00, 18.18, 50,  1, 1, 'OnePlus', 1, 1, 1, 4.3, 125),
('Samsung Galaxy M34 5G',       'samsung-galaxy-m34-5g',       'SKU-PHONE-002', '6.5" Super AMOLED, 50MP, 6000mAh',             18999.00, 22999.00, 17.39, 30,  1, 1, 'Samsung', 1, 1, 0, 4.2, 98),
('realme Narzo 70 Pro 5G',      'realme-narzo-70-pro-5g',      'SKU-PHONE-003', 'Sony IMX882 sensor, 68W charging',             23999.00, 27999.00, 14.29, 45,  1, 1, 'realme', 1, 0, 1, 4.1, 76),
('Lenovo IdeaPad Slim 3',       'lenovo-ideapad-slim-3',       'SKU-LAPTOP-001','Intel i5 12th Gen, 8GB RAM, 512GB SSD',        45999.00, 52999.00, 13.21, 20,  1, 2, 'Lenovo', 1, 1, 0, 4.4, 54),
('ASUS VivoBook 15',            'asus-vivobook-15',            'SKU-LAPTOP-002','AMD Ryzen 5, 16GB RAM, FHD display',           49999.00, 58999.00, 15.26, 15,  1, 2, 'ASUS',   1, 1, 1, 4.5, 89),
('Sony WH-1000XM5',             'sony-wh-1000xm5',             'SKU-AUDIO-001', 'Industry-leading ANC, 30hr battery',          24999.00, 29990.00, 16.67, 25,  1, 3, 'Sony',   1, 1, 1, 4.7, 342),
('boAt Rockerz 550',            'boat-rockerz-550',            'SKU-AUDIO-002', '20hr battery, 40mm drivers',                   1299.00,  1999.00, 35.02, 100, 1, 3, 'boAt',   1, 0, 1, 4.0, 512),
('The Alchemist',               'the-alchemist',               'SKU-BOOK-001',  'Paulo Coelho bestseller',                       299.00,   399.00, 25.06, 200, 4, 13, 'HarperCollins', 1, 1, 0, 4.8, 1024),
('Atomic Habits',               'atomic-habits',               'SKU-BOOK-002',  'James Clear – Build good habits',               499.00,   699.00, 28.61, 150, 4, 15, 'Penguin', 1, 1, 1, 4.9, 2048),
('Yoga Mat – Anti-Slip 6mm',    'yoga-mat-anti-slip-6mm',      'SKU-SPORT-001', 'Non-slip, eco-friendly TPE material',           799.00,  1199.00, 33.36, 80,  5, 16, 'Strauss', 1, 0, 1, 4.2, 234);
