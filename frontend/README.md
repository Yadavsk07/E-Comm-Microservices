# ShopVibe — Production-Quality Frontend for Spring Boot Microservices

A modern, high-performance, 2026-style e-commerce frontend built with React, Vite, Tailwind CSS, Framer Motion, and Axios, designed specifically to interface with a Spring Boot microservices backend via Spring Cloud Gateway.

---

## Architecture Overview

```
                                    ┌───────────────────────┐
                                    │     ShopVibe Client    │
                                    │    (React 19 + Vite)  │
                                    └───────────┬───────────┘
                                                │
                                    HTTP / REST │ Bearer JWT
                                                ▼
                                    ┌───────────────────────┐
                                    │   API Gateway (:8080) │
                                    └───────────┬───────────┘
               ┌────────────────┬───────────────┼───────────────┬────────────────┐
               ▼                ▼               ▼               ▼                ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │ Auth Service │ │ProductService│ │ Cart Service │ │ Order Service│ │PaymentService│
        │   (:8081)    │ │   (:8082)    │ │   (:8083)    │ │   (:8084)    │ │   (:8085)    │
        └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

The frontend directs all API communication through the **API Gateway** (`http://localhost:8080`), ensuring microservice decoupling and centralized routing.

---

## Key Features & Highlights

- **Modern 2026 UI Design**: Clean typography (Plus Jakarta Sans & Space Grotesk), spacious layouts, subtle micro-interactions, responsive grids, and zero cluttered gimmicks.
- **Light & Dark Mode**: Persistent theme toggle in the navigation bar using Tailwind CSS and CSS variables.
- **Zero Mock Data for Production APIs**: Uses authoritative backend endpoints for authentication, products, cart, orders, and payment verification.
- **Microservices Inventory Synchronization**: Real-time stock decrement, cart clearing on order placement, and live status tracking.
- **Razorpay Payment Integration**: Integrated with `payment-service` and Razorpay Checkout SDK. Signatures are verified strictly on the backend.
- **Comprehensive State Architecture**: Context API-driven authentication, reactive cart synchronization, and dynamic toast notifications.
- **Performance Optimized**: Route-level code splitting with `React.lazy` and `Suspense`, debounced search, and skeleton loading screens.

---

## Discovered Backend API Contract

### 1. Authentication & Users (`auth-service` via `/api/auth/**` & `/api/users/**`)
- `POST /api/auth/register` — Creates user account with address (`RegisterRequest` DTO)
- `POST /api/auth/login` — Returns JWT token, message, and `UserResponse`
- `GET /api/users/{id}` — Returns profile details for user ID (requires Bearer JWT)

### 2. Products (`product-service` via `/api/products/**`)
- `GET /api/products` — Retrieves all active products
- `GET /api/products/{id}` — Retrieves product details by ID
- `GET /api/products/search?keyword={keyword}` — Server-side product search
- `GET /api/products/category/{category}` — Filters products by category

### 3. Cart (`cart-service` via `/api/cart/**`)
- `GET /api/cart` — Fetches current user's cart (user ID extracted from JWT)
- `POST /api/cart` — Adds item to user cart (`{ productId, quantity }`)
- `DELETE /api/cart/{productId}` — Removes item by product ID
- `DELETE /api/cart` — Clears entire cart for authenticated user

### 4. Orders (`order-service` via `/api/orders/**`)
- `POST /api/orders` — Creates order from user's current cart items, decreases stock in product service, and clears cart
- `GET /api/orders` — Retrieves order history for authenticated user
- `GET /api/orders/{orderId}` — Retrieves detailed order breakdown by ID

### 5. Payments (`payment-service` via `/api/payments/**`)
- `POST /api/payments/create-order` — Creates Razorpay payment order (`{ orderId }`)
- `POST /api/payments/verify` — Verifies Razorpay HMAC SHA256 signature and updates order status to `CONFIRMED`

---

## Environment Variables

Create `.env` in the `frontend` root:

```env
# Gateway API URL (defaults to http://localhost:8080)
VITE_API_BASE_URL=http://localhost:8080

# Razorpay Key ID
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## How to Run

### Prerequisites
- Node.js 18+ or 20+
- Backend microservices running (or running via API Gateway at `http://localhost:8080`)

### Installation & Development
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server (runs on port 5173 with Vite proxy)
npm run dev
```

### Production Build & Linting
```bash
# Run ESLint
npm run lint

# Compile for production
npm run build

# Preview production build locally
npm run preview
```

---

## Account Authentication
- You can register a new customer account directly through `/register` (includes shipping address fields), or sign in with your configured admin credentials.
