# 🛒 ShopSphere – Full Stack E-Commerce Platform

<div align="center">

![ShopSphere Banner](https://via.placeholder.com/1200x400/f97316/ffffff?text=ShopSphere+–+Shop+the+Future)

[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://openjdk.org/projects/jdk/21/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.3-purple?logo=vite)](https://vitejs.dev)
[![MySQL](https://img.shields.io/badge/MySQL-8.2-blue?logo=mysql)](https://mysql.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)](https://mongodb.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**Production-ready Full Stack E-Commerce Platform | Group Capstone Project**

[Live Demo](#deployment) • [API Docs](#api-documentation) • [Setup Guide](#-quick-start) • [Architecture](#-architecture)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Quick Start](#-quick-start)
- [Docker Deployment](#-docker-deployment)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Team Members](#-team-members)
- [Screenshots](#-screenshots)

---

## 🎯 Project Overview

**ShopSphere** is a comprehensive, production-ready full-stack e-commerce platform built as a university capstone project. It demonstrates industry-standard software engineering practices, clean architecture, secure authentication, real payment gateway integration, and cloud deployment capabilities.

### Academic Goals Demonstrated
- ✅ Clean Architecture (Service → Repository → Entity pattern)
- ✅ Secure RESTful API design with JWT & RBAC
- ✅ Relational (MySQL) + Document (MongoDB) database design
- ✅ Real payment gateway integration (Razorpay)
- ✅ DevOps pipeline with Docker, GitHub Actions CI/CD
- ✅ Modern reactive frontend with state management
- ✅ Analytics dashboard with Chart.js visualizations

---

## ✨ Features

### Customer Features
| Feature | Status |
|---------|--------|
| 🔐 JWT Authentication (Register / Login / Refresh) | ✅ Complete |
| 📧 Email Verification & Password Reset | ✅ Complete |
| 🛍️ Product Browsing with Filters & Search | ✅ Complete |
| 🛒 Shopping Cart with Coupon Codes | ✅ Complete |
| ❤️ Wishlist Management | ✅ Complete |
| ⚖️ Product Comparison | ✅ Complete |
| 📦 Checkout with Address Selection | ✅ Complete |
| 💳 Razorpay Payment Integration (Success/Failure Handling) | ✅ Complete |
| 📋 Order History & Tracking | ✅ Complete |
| ↩️ Returns & Cancellation | ✅ Complete |
| ⭐ Product Reviews & Ratings | ✅ Complete |
| 📞 Contact, FAQ, & Policy Pages | ✅ Complete |
| 🌙 Dark / Light Mode | ✅ Complete |
| 📱 Fully Responsive Design | ✅ Complete |

### Admin Features
| Feature | Status |
|---------|--------|
| 📊 Analytics Dashboard (Charts) | ✅ Complete |
| 📦 Product CRUD + Image Upload | ✅ Complete |
| 🏷️ Category & Subcategory Management | ✅ Complete |
| 📋 Order Management & Status Updates | ✅ Complete |
| 👥 User Management | ✅ Complete |
| 🎟️ Coupon/Discount Management | ✅ Complete |
| ⚠️ Low Stock Alerts | ✅ Complete |
| 📈 Revenue & Sales Reports | ✅ Complete |

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 21 LTS | Core language |
| Spring Boot | 3.3.x | Application framework |
| Spring Security | 6.x | Authentication & Authorization |
| Spring Data JPA | 3.x | ORM & database access |
| Hibernate | 6.x | JPA implementation |
| JJWT | 0.12.x | JWT token generation/validation |
| Razorpay Java SDK | 1.4.x | Payment processing |
| Flyway | 10.x | Database migrations |
| Thymeleaf | 3.x | Email templates |
| Lombok | 1.18.x | Boilerplate reduction |
| SpringDoc OpenAPI | 2.x | Swagger UI |
| Maven | 3.9.x | Build tool |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.x | UI framework |
| Vite | 5.3.x | Build tool & dev server |
| Tailwind CSS | 3.4.x | Utility-first CSS |
| React Router | 6.26.x | Client-side routing |
| Axios | 1.7.x | HTTP client with interceptors |
| React Hook Form | 7.52.x | Form management |
| Yup | 1.4.x | Form validation |
| TanStack Query | 5.x | Server state management |
| Framer Motion | 11.x | Animations |
| Chart.js | 4.4.x | Analytics charts |
| React Hot Toast | 2.4.x | Notifications |
| Lucide React | 0.427.x | Icon library |

### Database
| Database | Version | Usage |
|---------|---------|-------|
| MySQL | 8.2 | Transactional data (Users, Orders, Products, Payments) |
| MongoDB | 7.0 | Reviews, Browsing History, Search Analytics |
| Redis | 7.x | Session caching, Rate limiting |

### DevOps & Deployment
| Tool | Purpose |
|------|---------|
| Docker & Docker Compose | Containerization |
| Nginx | Reverse proxy, load balancing |
| GitHub Actions | CI/CD pipeline |
| AWS EC2 | Cloud hosting |
| AWS RDS | Managed MySQL |
| AWS S3 / Cloudinary | File/image storage |

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                        │
│   React 18 + Vite + Tailwind CSS + TanStack Query          │
│   PWA | Dark Mode | Responsive | Lazy Loading              │
└────────────────────────────┬───────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼───────────────────────────────┐
│                      NGINX GATEWAY                          │
│   Reverse Proxy | Rate Limiting | Gzip | Security Headers   │
└─────────────┬───────────────────────┬──────────────────────┘
              │                       │
┌─────────────▼──────────┐  ┌────────▼──────────────────────┐
│   SPRING BOOT BACKEND  │  │       STATIC FRONTEND          │
│   Port: 8080            │  │       Port: 5173 (dev)         │
│                         │  │                                │
│  ┌──────────────────┐  │  └────────────────────────────────┘
│  │  REST Controllers│  │
│  └────────┬─────────┘  │
│  ┌────────▼─────────┐  │
│  │  Service Layer   │  │
│  └────────┬─────────┘  │
│  ┌────────▼─────────┐  │
│  │  Repository Layer│  │
│  └────────┬─────────┘  │
└───────────┼────────────┘
            │
    ┌───────┴────────┐
    │                │
┌───▼───┐        ┌───▼───┐
│ MySQL │        │ MongoDB│
│ 3306  │        │ 27017  │
└───────┘        └───────┘
```

### Design Patterns Used
- **Repository Pattern** – Data access abstraction
- **Service Layer** – Business logic encapsulation
- **DTO Pattern** – Data transfer between layers
- **Builder Pattern** – Object construction (Lombok)
- **Observer Pattern** – Event-driven email notifications
- **Strategy Pattern** – Coupon discount calculation
- **Chain of Responsibility** – Spring Security filter chain

---

## 🗄️ Database Schema

### MySQL (Relational – Transactional Data)

```
users ──────────────── user_roles
  │
  ├──── carts ─────── cart_items ──── products ──── product_images
  │                                       │
  ├──── orders ───── order_items          ├──── categories
  │         │                             └──── sub_categories
  │         └──── payments
  │
  ├──── addresses
  └──── wishlist

coupons ──── carts (many)
```

### MongoDB (Document – Analytics & Reviews)

```javascript
// Reviews Collection
{
  _id: ObjectId,
  productId: Long,    // Reference to MySQL Product
  userId: Long,       // Reference to MySQL User
  rating: Number,     // 1-5
  title: String,
  content: String,
  images: [String],
  verified: Boolean,
  helpful: Number,
  createdAt: Date
}

// Browsing History
{
  _id: ObjectId,
  userId: Long,
  productId: Long,
  viewedAt: Date,
  sessionId: String
}

// Search Analytics
{
  _id: ObjectId,
  userId: Long,
  query: String,
  resultCount: Number,
  searchedAt: Date
}
```

---

## 📡 API Documentation

### Base URL: `http://localhost:8080/api`
### Swagger UI: `http://localhost:8080/swagger-ui.html`

### Authentication Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register new customer |
| POST | `/auth/login` | Public | Login & get tokens |
| POST | `/auth/refresh-token` | Public | Refresh access token |
| GET  | `/auth/verify-email` | Public | Verify email token |
| POST | `/auth/forgot-password` | Public | Request password reset |
| POST | `/auth/reset-password` | Public | Reset with token |
| POST | `/auth/logout` | Customer | Logout |

### Product Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET  | `/products` | Public | Get all products (paginated) |
| GET  | `/products/{id}` | Public | Get product by ID |
| GET  | `/products/slug/{slug}` | Public | Get by URL slug |
| GET  | `/products/search?q=` | Public | Full-text search |
| GET  | `/products/featured` | Public | Featured products |
| GET  | `/products/best-sellers` | Public | Best-selling products |
| POST | `/products` | Admin | Create product |
| PUT  | `/products/{id}` | Admin | Update product |
| DELETE | `/products/{id}` | Admin | Soft delete |
| PATCH | `/products/{id}/stock` | Admin | Update stock |

### Cart Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET  | `/cart` | Customer | Get user's cart |
| GET  | `/cart/summary` | Customer | Price summary |
| POST | `/cart/items` | Customer | Add item |
| PUT  | `/cart/items/{id}` | Customer | Update quantity |
| DELETE | `/cart/items/{id}` | Customer | Remove item |
| DELETE | `/cart` | Customer | Clear cart |
| POST | `/cart/coupon` | Customer | Apply coupon |
| DELETE | `/cart/coupon` | Customer | Remove coupon |

### Order Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | Customer | Place order |
| GET  | `/orders` | Customer | Order history |
| GET  | `/orders/{id}` | Customer | Order details |
| GET  | `/orders/number/{num}` | Public | Track order |
| POST | `/orders/{id}/cancel` | Customer | Cancel order |
| POST | `/orders/{id}/return` | Customer | Return request |

### Payment Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/payments/razorpay/create-order/{orderId}` | Customer | Create Razorpay order |
| POST | `/payments/razorpay/verify` | Customer | Verify payment signature |

---

## 🚀 Quick Start

### Prerequisites
- Java 21 JDK (`java --version`)
- Node.js 20+ (`node --version`)
- Maven 3.9+ (`mvn --version`)
- MySQL 8.2
- MongoDB 7.0
- Docker & Docker Compose (for containerized setup)

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/yourteam/shopsphere.git
cd shopsphere

# 2. Copy and configure environment
cp .env.example .env
# Edit .env with your Razorpay keys and other configs

# 3. Start all services
docker compose up -d

# 4. Access the application
# Frontend: http://localhost:80
# Backend:  http://localhost:8080/api/health
# Swagger:  http://localhost:8080/swagger-ui.html
```

### Option 2: Manual Setup

```bash
# ── Database Setup ────────────────────────────────────────────
# Start MySQL and create database
mysql -u root -p -e "CREATE DATABASE shopsphere_db;"

# Start MongoDB
mongod --port 27017

# ── Backend Setup ─────────────────────────────────────────────
cd backend

# Configure application-dev.yml with your DB credentials
cp src/main/resources/application.yml src/main/resources/application-local.yml
# Edit the local config

# Build and run
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Backend starts at: http://localhost:8080

# ── Frontend Setup ────────────────────────────────────────────
cd ../frontend
npm install
npm run dev

# Frontend starts at: http://localhost:5173
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | `john.doe@example.com` | `User@123` |
| Admin | `admin@shopsphere.com` | `Admin@123` |

---

## 🐳 Docker Deployment

```bash
# Production deployment
docker compose -f docker-compose.yml up -d

# Development with hot-reload
docker compose -f docker-compose.dev.yml up

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop all services
docker compose down

# Full reset (remove volumes)
docker compose down -v
```

### Services
| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| nginx | shopsphere-nginx | 80, 443 | Reverse proxy |
| frontend | shopsphere-frontend | 5173 | React app |
| backend | shopsphere-backend | 8080 | Spring Boot API |
| mysql | shopsphere-mysql | 3306 | MySQL database |
| mongodb | shopsphere-mongodb | 27017 | MongoDB |
| redis | shopsphere-redis | 6379 | Cache |

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=shopsphere_db
MYSQL_USER=shopsphere
MYSQL_PASSWORD=your_password

# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_mongo_password

# JWT
JWT_SECRET=your-256-bit-hex-secret-minimum-32-characters
JWT_EXPIRATION_MS=900000      # 15 minutes
JWT_REFRESH_EXPIRATION_MS=604800000  # 7 days

# Razorpay (get from dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=your_app_password

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8080
```

---

## 📁 Project Structure

```
shopsphere/
├── .github/
│   └── workflows/ci-cd.yml          # GitHub Actions CI/CD
├── backend/
│   ├── src/main/java/com/shopsphere/
│   │   ├── ShopSphereApplication.java
│   │   ├── controller/              # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── ProductController.java
│   │   │   ├── CartController.java
│   │   │   ├── OrderController.java
│   │   │   └── PaymentController.java
│   │   ├── service/                 # Business Logic
│   │   │   ├── AuthService.java
│   │   │   ├── ProductService.java
│   │   │   ├── CartService.java
│   │   │   ├── OrderService.java
│   │   │   ├── PaymentService.java
│   │   │   ├── EmailService.java
│   │   │   └── FileStorageService.java
│   │   ├── entity/                  # JPA Entities (MySQL)
│   │   ├── document/                # MongoDB Documents
│   │   ├── repository/              # Data Repositories
│   │   ├── security/                # JWT + Spring Security
│   │   ├── exception/               # Global Error Handling
│   │   ├── dto/                     # Request/Response DTOs
│   │   └── enums/                   # Enums
│   └── src/main/resources/
│       ├── application.yml          # Base config
│       ├── application-dev.yml      # Dev config
│       ├── application-prod.yml     # Prod config
│       └── db/migration/            # Flyway SQL migrations
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/              # Navbar, Footer, Layouts
│   │   │   ├── product/             # ProductCard, Skeleton
│   │   │   ├── auth/                # PrivateRoute, AdminRoute
│   │   │   ├── ui/                  # RatingStars, Pagination
│   │   │   └── review/              # ReviewSection
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── ProductListingPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── auth/                # Login, Register
│   │   │   └── admin/               # AdminDashboard, Products, Orders
│   │   ├── context/                 # Auth, Cart, Theme contexts
│   │   ├── services/                # Axios API client
│   │   └── hooks/                   # Custom React hooks
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── Dockerfile
├── nginx/
│   └── nginx.conf                   # Production Nginx config
├── docker-compose.yml               # Production compose
├── docker-compose.dev.yml           # Development compose
├── .env.example                     # Environment template
└── README.md
```

---

## 👥 Team Members

| Name | Role | Contributions |
|------|------|---------------|
| Member 1 | Backend Lead | Spring Boot API, Security, Payment |
| Member 2 | Frontend Lead | React UI, State Management |
| Member 3 | Database Architect | MySQL/MongoDB Schema, Queries |
| Member 4 | DevOps Engineer | Docker, CI/CD, Deployment |
| Member 5 | Full Stack | Cart, Orders, Reviews |

---

## 🧪 Testing

```bash
# Backend Tests
cd backend
./mvnw test                           # Run all tests
./mvnw test -Dtest=AuthServiceTest    # Run specific test

# Frontend Tests
cd frontend
npm test                              # Run all tests
npm run test:ui                       # Open test UI
npm run test:coverage                 # Coverage report
```

---

## 📸 Screenshots

> Screenshots to be added after first deployment.

| Page | Screenshot |
|------|-----------|
| Landing Page | _Coming soon_ |
| Product Listing | _Coming soon_ |
| Product Detail | _Coming soon_ |
| Shopping Cart | _Coming soon_ |
| Checkout | _Coming soon_ |
| Admin Dashboard | _Coming soon_ |

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using **Java 21** • **Spring Boot 3** • **React 18** • **Tailwind CSS**

**ShopSphere – Shop the Future**

</div>
