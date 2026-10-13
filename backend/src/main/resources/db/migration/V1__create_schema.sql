-- ═══════════════════════════════════════════════════════════════
-- ShopSphere – Initial Database Schema
-- Migration: V1__create_schema.sql
-- Database: MySQL 8.2
-- ═══════════════════════════════════════════════════════════════

SET FOREIGN_KEY_CHECKS = 0;

-- ── Users ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id                              BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name                      VARCHAR(50)  NOT NULL,
    last_name                       VARCHAR(50)  NOT NULL,
    email                           VARCHAR(100) NOT NULL UNIQUE,
    password                        VARCHAR(255) NOT NULL,
    phone                           VARCHAR(15),
    profile_image                   VARCHAR(500),
    date_of_birth                   DATETIME,
    is_enabled                      TINYINT(1)   NOT NULL DEFAULT 0,
    is_locked                       TINYINT(1)   NOT NULL DEFAULT 0,
    email_verified                  TINYINT(1)   NOT NULL DEFAULT 0,
    verification_token              VARCHAR(255),
    verification_token_expiry       DATETIME,
    password_reset_token            VARCHAR(255),
    password_reset_token_expiry     DATETIME,
    refresh_token                   TEXT,
    created_at                      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                      DATETIME     ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email            (email),
    INDEX idx_user_phone            (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── User Roles ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_roles (
    user_id     BIGINT      NOT NULL,
    role        VARCHAR(30) NOT NULL,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Categories ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(500),
    image_url   VARCHAR(500),
    is_active   TINYINT(1)  NOT NULL DEFAULT 1,
    sort_order  INT         NOT NULL DEFAULT 0,
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME    ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Sub Categories ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sub_categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(500),
    image_url   VARCHAR(500),
    is_active   TINYINT(1)  NOT NULL DEFAULT 1,
    sort_order  INT         NOT NULL DEFAULT 0,
    category_id BIGINT      NOT NULL,
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME    ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_subcategory_slug     (slug),
    INDEX idx_subcategory_category (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Products ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id                  BIGINT          AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(200)    NOT NULL,
    slug                VARCHAR(220)    NOT NULL UNIQUE,
    sku                 VARCHAR(50)     NOT NULL UNIQUE,
    description         TEXT,
    short_description   VARCHAR(500),
    price               DECIMAL(12,2)   NOT NULL,
    original_price      DECIMAL(12,2),
    discount_percent    DECIMAL(5,2)    NOT NULL DEFAULT 0.00,
    stock_quantity      INT             NOT NULL DEFAULT 0,
    low_stock_threshold INT             NOT NULL DEFAULT 10,
    category_id         BIGINT          NOT NULL,
    sub_category_id     BIGINT,
    brand               VARCHAR(100),
    color               VARCHAR(50),
    size                VARCHAR(50),
    material            VARCHAR(50),
    thumbnail_url       VARCHAR(500),
    avg_rating          DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
    review_count        INT             NOT NULL DEFAULT 0,
    meta_title          VARCHAR(200),
    meta_description    VARCHAR(500),
    is_active           TINYINT(1)      NOT NULL DEFAULT 1,
    is_featured         TINYINT(1)      NOT NULL DEFAULT 0,
    is_best_seller      TINYINT(1)      NOT NULL DEFAULT 0,
    weight_grams        INT,
    total_sold          BIGINT          NOT NULL DEFAULT 0,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id)     REFERENCES categories(id),
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id),
    INDEX idx_product_slug     (slug),
    INDEX idx_product_sku      (sku),
    INDEX idx_product_brand    (brand),
    INDEX idx_product_category (category_id),
    INDEX idx_product_price    (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Product Images ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_images (
    product_id  BIGINT       NOT NULL,
    image_url   VARCHAR(500) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Addresses ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
    id              BIGINT       AUTO_INCREMENT PRIMARY KEY,
    address_label   VARCHAR(50)  NOT NULL DEFAULT 'Home',
    full_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(15)  NOT NULL,
    address_line1   VARCHAR(200) NOT NULL,
    address_line2   VARCHAR(200),
    city            VARCHAR(100) NOT NULL,
    state           VARCHAR(100) NOT NULL,
    pincode         VARCHAR(10)  NOT NULL,
    country         VARCHAR(100) NOT NULL DEFAULT 'India',
    is_default      TINYINT(1)   NOT NULL DEFAULT 0,
    user_id         BIGINT       NOT NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_address_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Coupons ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
    id                  BIGINT          AUTO_INCREMENT PRIMARY KEY,
    code                VARCHAR(30)     NOT NULL UNIQUE,
    description         VARCHAR(200),
    discount_type       VARCHAR(20)     NOT NULL,
    discount_value      DECIMAL(10,2)   NOT NULL,
    max_discount_amount DECIMAL(10,2),
    min_order_amount    DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    max_usage_count     INT,
    usage_count         INT             NOT NULL DEFAULT 0,
    per_user_limit      INT             NOT NULL DEFAULT 1,
    valid_from          DATETIME,
    valid_until         DATETIME,
    is_active           TINYINT(1)      NOT NULL DEFAULT 1,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_coupon_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Carts ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carts (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT          NOT NULL UNIQUE,
    coupon_id       BIGINT,
    coupon_discount DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Cart Items ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
    id          BIGINT          AUTO_INCREMENT PRIMARY KEY,
    cart_id     BIGINT          NOT NULL,
    product_id  BIGINT          NOT NULL,
    quantity    INT             NOT NULL DEFAULT 1,
    unit_price  DECIMAL(12,2)   NOT NULL,
    UNIQUE KEY uk_cart_product (cart_id, product_id),
    FOREIGN KEY (cart_id)   REFERENCES carts(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Wishlist ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist (
    id          BIGINT   AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT   NOT NULL,
    product_id  BIGINT   NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_wishlist (user_id, product_id),
    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Orders ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id                      BIGINT          AUTO_INCREMENT PRIMARY KEY,
    order_number            VARCHAR(30)     NOT NULL UNIQUE,
    user_id                 BIGINT          NOT NULL,
    status                  VARCHAR(30)     NOT NULL DEFAULT 'PENDING',
    subtotal                DECIMAL(12,2)   NOT NULL,
    discount_amount         DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    coupon_code             VARCHAR(30),
    shipping_charge         DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    tax_amount              DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
    total_amount            DECIMAL(12,2)   NOT NULL,
    shipping_full_name      VARCHAR(100),
    shipping_phone          VARCHAR(15),
    shipping_address_line1  VARCHAR(200),
    shipping_address_line2  VARCHAR(200),
    shipping_city           VARCHAR(100),
    shipping_state          VARCHAR(100),
    shipping_pincode        VARCHAR(10),
    shipping_country        VARCHAR(100),
    tracking_number         VARCHAR(100),
    expected_delivery_date  DATETIME,
    delivered_at            DATETIME,
    cancelled_at            DATETIME,
    cancellation_reason     VARCHAR(500),
    return_reason           VARCHAR(500),
    created_at              DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_order_number (order_number),
    INDEX idx_order_user   (user_id),
    INDEX idx_order_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Order Items ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id               BIGINT          AUTO_INCREMENT PRIMARY KEY,
    order_id         BIGINT          NOT NULL,
    product_id       BIGINT          NOT NULL,
    product_name     VARCHAR(200)    NOT NULL,
    product_image    VARCHAR(500),
    product_sku      VARCHAR(50),
    quantity         INT             NOT NULL,
    unit_price       DECIMAL(12,2)   NOT NULL,
    discount_percent DECIMAL(5,2)    NOT NULL DEFAULT 0.00,
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order_item_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Payments ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
    id                          BIGINT          AUTO_INCREMENT PRIMARY KEY,
    order_id                    BIGINT          NOT NULL UNIQUE,
    payment_method              VARCHAR(30)     NOT NULL,
    status                      VARCHAR(30)     NOT NULL DEFAULT 'PENDING',
    amount                      DECIMAL(12,2)   NOT NULL,
    currency                    VARCHAR(10)     NOT NULL DEFAULT 'INR',
    razorpay_order_id           VARCHAR(100),
    razorpay_payment_id         VARCHAR(100),
    razorpay_signature          VARCHAR(200),
    stripe_payment_intent_id    VARCHAR(100),
    transaction_id              VARCHAR(100),
    failure_reason              VARCHAR(500),
    paid_at                     DATETIME,
    refunded_at                 DATETIME,
    refund_amount               DECIMAL(12,2),
    created_at                  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  DATETIME        ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_payment_razorpay_order   (razorpay_order_id),
    INDEX idx_payment_razorpay_payment (razorpay_payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
