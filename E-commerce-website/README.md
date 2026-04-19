# 🛒 ShopEase — Full-Stack E-Commerce Platform

A modern, full-stack e-commerce web application built with React, Node.js, MongoDB, and integrated with Stripe for secure payments. Deployed on Vercel.

🔗 **Live Demo:** https://codsoft-312e-git-main-saqlain532s-projects.vercel.app/

---

## ✨ Features

### 🛍️ Shopping Experience
- **Home Page** — Hero banner, featured products, and category browsing
- **Product Listings** — Browse all products or filter by category
- **Product Details** — View full product info, images, price, and ratings
- **Search** — Real-time product search with results page
- **Category Navigation** — Browse products by category with visual category cards

### 🛒 Cart & Checkout
- **Persistent Cart** — Cart saved to `localStorage`, survives page refresh
- **Add / Remove Items** — Add products, remove items, clear cart
- **Quantity Control** — Increment/decrement item quantities directly in cart
- **Order Summary** — Live price and total calculation

### 💳 Payments
- **Stripe Integration** — Secure online payments via Stripe Checkout
- **Stripe Webhook** — Auto-confirms orders after successful payment
- **Cash on Delivery** — Alternative COD payment option
- **Payment Status Tracking** — Orders marked as Paid/Pending/Failed

### 👤 Authentication
- **Sign Up / Login** — JWT-based authentication
- **Auth Modal** — Inline modal for login and signup (no page redirect)
- **Persistent Sessions** — Token stored in `localStorage`, auto-rehydrated on reload
- **Protected Routes** — Profile and orders require login

### 📦 Order Management
- **Place Orders** — Checkout with shipping address and payment method
- **Order History** — View all past orders in user profile
- **Order Details Page** — Full breakdown of individual orders (items, address, status, payment)
- **Order Status** — Tracks: Pending → Confirmed → Shipped → Delivered

### 👤 User Profile
- **Profile Page** — View account info and manage saved addresses
- **Address Management** — Add multiple delivery addresses
- **Order History Tab** — All past orders listed with status badges

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **React Router v7** | Client-side routing |
| **Tailwind CSS v4** | Utility-first styling |
| **Axios** | HTTP client for API calls |
| **React Toastify** | Toast notifications |
| **React Icons** | Icon library |
| **Stripe.js** | Frontend Stripe integration |
| **Vite** | Build tool and dev server |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose** | Database and ODM |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Stripe** | Payment processing |
| **CORS** | Cross-origin request handling |
| **dotenv** | Environment variable management |

---

## 📁 Project Structure

```
E-commerce-website/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Mainbanner.jsx
│   │   │   ├── FeaturedProducts.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── AuthModal.jsx
│   │   ├── pages/            # Route-level pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── AllProductsPage.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── SearchResultsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── OrderDetailsPage.jsx
│   │   ├── AppContext.jsx     # Global state management
│   │   └── App.jsx           # Route definitions
│   ├── vercel.json           # Vercel SPA routing config
│   └── vite.config.js
│
└── server/                   # Express backend
    ├── controllers/          # Route handler logic
    ├── models/
    │   ├── User.js           # User schema
    │   └── Order.js          # Order schema
    ├── routes/
    │   ├── userRoutes.js     # Auth & profile routes
    │   └── orderRoutes.js    # Order & payment routes
    ├── middleware/           # Auth middleware
    ├── vercel.json           # Vercel serverless config
    └── index.js              # Express app entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Stripe account

### 1. Clone the repository
```bash
git clone https://github.com/Saqlain532/CODSOFT.git
cd CODSOFT/E-commerce-website
```

### 2. Setup the Server
```bash
cd server
npm install
```

Create a `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
PORT=8080
```

Start the server:
```bash
npm start
```

### 3. Setup the Client
```bash
cd ../client
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
```

Start the dev server:
```bash
npm run dev
```

---

## 🌐 Deployment

### Frontend — Vercel
The frontend is deployed on **Vercel** as a static site.

- **Framework:** Vite (React)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **SPA Routing:** Configured via `vercel.json` to handle React Router

### Backend — Vercel Serverless
The backend API is deployed on **Vercel** as a serverless function.

- **Entry point:** `index.js`
- **Configured via:** `server/vercel.json`
- **CORS:** Restricted to allowed frontend origins

---

## 🔐 API Endpoints

### Auth (`/api/users`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/signup` | Register new user |
| `POST` | `/login` | Login and get JWT token |
| `POST` | `/address` | Add delivery address (protected) |

### Orders (`/api/orders`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Place a new order (protected) |
| `GET` | `/my-orders` | Get logged-in user's orders (protected) |
| `POST` | `/create-checkout-session` | Create Stripe checkout session |

### Webhooks
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/webhook` | Stripe webhook handler |

---

## 🔒 Environment Variables

### Server
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

### Client
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## 📸 Pages Overview

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero banner, categories, featured products |
| All Products | `/products` | Full product catalog |
| Category | `/category/:id` | Products filtered by category |
| Product Detail | `/product/:id` | Single product page |
| Cart | `/cart` | Cart items, quantities, checkout |
| Search | `/search` | Search results |
| Profile | `/profile` | User info, addresses, order history |
| Order Detail | `/order/:id` | Detailed view of a single order |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
