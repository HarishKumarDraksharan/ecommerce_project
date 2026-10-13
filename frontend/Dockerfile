# ═══════════════════════════════════════════════════════════════
# ShopSphere Frontend Dockerfile
# Multi-stage build: Node build → Nginx alpine
# ═══════════════════════════════════════════════════════════════

# ── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Build args for env variables
ARG VITE_API_BASE_URL=/api
ARG VITE_RAZORPAY_KEY_ID
ARG VITE_APP_NAME=ShopSphere

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
ENV VITE_APP_NAME=$VITE_APP_NAME

# Install dependencies (cached)
COPY package*.json ./
RUN npm ci --silent

# Build
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────────────────────
FROM nginx:alpine AS runtime

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config for SPA
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
