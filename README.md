# Nexgensis - Product Admin Dashboard

A comprehensive, enterprise-ready **Product Admin Dashboard** built with **Next.js App Router (JavaScript)**, **Tailwind CSS**, and **shadcn/ui** using the **Sky** theme. It provides full inventory management with server-side pagination, debounced searching, category filtering, sorting, responsive views (table & mobile cards), local persistence overlays, full authentication workflows, and light/dark theme support.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, JavaScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Sky theme token palette)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: [Axios](https://axios-http.com/) (with centralized interceptors & error normalization)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) (Light / Dark / System modes)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **API Source**: [DummyJSON](https://dummyjson.com)

---

## 📦 Setup & Installation

### 1. Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm or yarn or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create `.env.local` (or copy from `.env.example`):
```bash
cp .env.example .env.local
```

Default credentials in `.env.example`:
```env
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
NEXT_PUBLIC_DEMO_USERNAME=emilys
NEXT_PUBLIC_DEMO_PASSWORD=emilyspass
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Linting
```bash
# Check code style and rules
npm run lint

# Compile optimized production build
npm run build

# Start production server
npm run start
```

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── (protected)/
│   │   ├── layout.jsx               # Auth guard, LocalProductsProvider, header & theme toggle
│   │   ├── products/
│   │   │   ├── page.jsx             # Server-paginated product catalog with URL state sync
│   │   │   ├── not-found.jsx        # Product 404 page
│   │   │   └── [id]/
│   │   │       └── page.jsx         # Product details with interactive gallery & reviews
│   ├── login/
│   │   └── page.jsx                 # Login with validation, demo prefill, & rapid-click guard
│   ├── globals.css                  # Tailwind and shadcn Sky theme design tokens
│   ├── layout.js                    # Root layout with fonts, theme provider, and toaster
│   ├── not-found.jsx                # Global 404 page
│   └── page.js                      # Root entry redirecting to /products or /login
├── components/
│   ├── ui/                          # shadcn/ui primitives (button, input, card, table, dialog, etc.)
│   ├── states/
│   │   ├── empty-state.jsx          # Illustrated empty state with reset filters action
│   │   ├── error-state.jsx          # Error feedback state with retry button
│   │   └── loading-state.jsx        # Table and grid skeleton loaders
│   ├── category-filter.jsx          # Category filter dropdown
│   ├── delete-confirm-dialog.jsx    # Alert dialog with double-click guard for deletions
│   ├── header.jsx                   # Sticky header with navigation, profile badge, and logout
│   ├── page-size-select.jsx         # Rows per page selector (10, 20, 50)
│   ├── pagination.jsx               # Custom pagination with smart ellipsis & item summaries
│   ├── product-card.jsx             # Mobile responsive card layout
│   ├── product-form.jsx             # Modal dialog for Add & Edit with Zod validation
│   ├── product-gallery.jsx          # Interactive gallery with thumbnail selection
│   ├── product-list.jsx             # Layout coordinator (Table for md+, Cards for mobile)
│   ├── product-reviews.jsx          # Verified customer reviews list with star ratings
│   ├── product-table.jsx            # Desktop table view with badges and action triggers
│   ├── search-input.jsx             # Debounced search input (500ms) with instant clear
│   ├── sort-select.jsx              # Composite sorting dropdown (title, price, rating, stock)
│   ├── theme-provider.jsx           # next-themes wrapper
│   └── theme-toggle.jsx             # Dropdown theme switcher (Light / Dark / System)
├── hooks/
│   ├── use-categories.js            # Custom hook for fetching and caching categories
│   ├── use-debounce.js              # Generic debouncing hook
│   ├── use-product.js               # Custom hook for single product details with 404 handling
│   └── use-products.js              # Products list hook with AbortController & race guards
├── lib/
│   ├── auth.js                      # Token and user session management (Cookies + localStorage)
│   ├── axios.js                     # Central Axios instance with Bearer interceptor & error mapping
│   ├── query-params.js              # URL search parameters parser, sanitizer, and query builder
│   └── utils.js                     # Utility helpers (cn class merging)
├── middleware.js                    # Route protection middleware for protected routes & login
├── services/
│   ├── auth.service.js              # Authentication endpoints (/auth/login, /auth/me)
│   └── products.service.js          # Product catalog endpoints (list, search, category, CRUD)
└── store/
    └── local-products.jsx           # Local overlay store (React Context + localStorage)
```

---

## ✅ Completed Features Checklist

- [x] **Authentication & Route Guarding**
  - [x] Login page with React Hook Form + Zod schema validation
  - [x] Environment variable prefilled demo credentials (`emilys` / `emilyspass`)
  - [x] Inline error handling on 400 "Invalid credentials"
  - [x] Submit button with spinner & double-click protection
  - [x] Access token stored in cookie + localStorage
  - [x] Middleware protecting `/products` and `/products/[id]`, redirecting unauthenticated visitors
  - [x] Header logout button clearing credentials and redirecting to `/login`
- [x] **Product Catalog & Management (`/products`)**
  - [x] Responsive layout: Table on desktop (`md+`), Cards on mobile
  - [x] Server-side pagination with limit + skip
  - [x] Smart page numbers with ellipsis + Previous/Next buttons
  - [x] Page size selection (10, 20, 50 rows)
  - [x] Accurate summary text: "Showing 21–40 of 194" and "Showing 0 of 0" on empty
  - [x] Debounced search (500ms custom `useDebounce` hook)
  - [x] Dynamic category filter options from `/products/categories`
  - [x] Sorting by title, price, rating, and stock with ascending/descending orders
  - [x] URL as Single Source of Truth (`router.replace` with `scroll: false`)
  - [x] Loading skeleton states, empty states, and error retry states
- [x] **Product Details View (`/products/[id]`)**
  - [x] Interactive product image gallery with clickable thumbnail selector
  - [x] Title, brand, SKU, category, stock status badges, pricing with discount calculation
  - [x] Full customer reviews list with star ratings, reviewer initials, and formatted dates
  - [x] Specification highlights (warranty, shipping, return policy, minimum order)
  - [x] "Back to Products" link preserving all list query parameters
  - [x] Custom 404 Product Not Found page
- [x] **Add / Edit / Delete (Local Overlay Store + API Calls)**
  - [x] Unified modal dialog for Add Product and Edit Product
  - [x] Zod validation (title min 3, description min 10, price > 0, stock >= 0, category required, valid URL)
  - [x] Delete confirmation modal (`AlertDialog`)
  - [x] Calls real API endpoints (`POST /products/add`, `PUT /products/{id}`, `DELETE /products/{id}`)
  - [x] Local overlay store in `localStorage`:
    - Newly created items appear at the top of page 1
    - Edited products override API data in list and detail views
    - Deleted products are filtered out and catalog total is adjusted accordingly
  - [x] Sonner toasts for successful operations and errors
- [x] **Robust Edge Case Handling**
  - [x] Strict race condition guards with `AbortController` and latest Request ID verification
  - [x] Mutually exclusive Search and Category filters with UI explanation
  - [x] URL parameter sanitization and automatic page clamping
  - [x] Double-click protection on all mutation buttons
- [x] **Design & Theming**
  - [x] Full Light and Dark mode support via `next-themes`
  - [x] Header theme toggle (Light / Dark / System)
  - [x] Semantic shadcn/ui Sky design tokens with 0 hardcoded colors
