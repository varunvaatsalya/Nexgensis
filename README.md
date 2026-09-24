<div align="center">

# Nexgensis - Product Admin Dashboard

A responsive, high-performance product admin dashboard built on the [DummyJSON](https://dummyjson.com) API with **Next.js**, **Tailwind CSS v4**, **shadcn/ui** and **Axios**.

[**Live Demo**](https://nexgensis-varun.vercel.app/) · [**Repository**](https://github.com/varunvaatsalya/Nexgensis)

`Demo login → emilys / emilyspass`

</div>

---

## 🌟 Highlights

- **Authentication & Security**: Cookie & `localStorage` token management, middleware route protection, rapid-click protection, and clean logout flow.
- **Server-Side Pagination & Controls**: `limit` + `skip` pagination, custom page size (10 / 20 / 50), smart ellipsis, and accurate item range counters (`Showing 21–40 of 194 products`).
- **Stateful URL Sync**: Debounced search (500 ms), dynamic category combobox, and composite sorting (title, price, rating, stock) stored in URL as the Single Source of Truth.
- **Responsive Layouts**: Dense table on desktop (`md+`), responsive cards on mobile, and sleek mobile action popovers.
- **Product Details & Media**: Full product specifications, interactive gallery, verified reviews, and query-preserving back navigation.
- **Simulated CRUD & Local Overlay**: Real API calls (`POST`, `PUT`, `DELETE`) with a persistent `localStorage` overlay store for optimistic UI additions, edits, and deletions.
- **Indian Rupee (₹) Currency**: Formatted pricing across list, card, detail, and modal forms.
- **Proportional Star Ratings**: Dynamically filled single star based on percentage score.
- **Custom Illustrations**: Vector illustrations for Empty state, 404 Not Found, and Detail Loading states.
- **Zero Heavy Query Libraries**: Hand-crafted data fetching with custom hooks, `AbortController` cancellation, and race-condition guards.

---

## 🛠️ Tech Stack

| Area | Choice |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, JavaScript) |
| **Styling** | Tailwind CSS v4 + shadcn/ui (Sky Theme Tokens) |
| **HTTP Client** | Axios (centralized instance with Bearer interceptors & error mapping) |
| **Forms & Validation** | React Hook Form + Zod |
| **Theming** | next-themes (Light / Dark / System modes) |
| **Notifications** | React Toastify (compact mobile-responsive toasts) |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

**Requirements:** Node.js 18.18+ or 20+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Start local development server
npm run dev          # http://localhost:3000

# 4. Check linting and build
npm run lint
npm run build
npm run start
```

### Environment Variables

| Variable | Purpose | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE_URL` | API base endpoint | `https://dummyjson.com` |
| `NEXT_PUBLIC_DEMO_USERNAME` | Prefills demo login form | `emilys` |
| `NEXT_PUBLIC_DEMO_PASSWORD` | Prefills demo login form | `emilyspass` |

---

## 📁 Project Structure

```text
public/
└── illustrations/              # Vector graphics (empty-product, 404-Error, load-product)
src/
├── app/
│   ├── login/                  # Login authentication page
│   ├── (protected)/            # Auth-guarded layout & header
│   │   └── products/           # Catalog list, [id] details & not-found
│   ├── globals.css             # Tailwind v4 theme tokens & custom toast styles
│   ├── layout.js               # Google Nunito font, ThemeProvider, ToastContainer
│   └── not-found.jsx           # Illustrated global 404 page
├── components/
│   ├── ui/                     # shadcn/ui primitives (Button, Dialog, Table, Dropdown, etc.)
│   ├── states/                 # Illustrated empty-state, error-state, loading skeletons
│   ├── product-list / table / card / form / gallery / reviews / rating-stars
│   ├── pagination, search-input, category-filter, sort-select, page-size-select
│   └── header, user-menu, theme-toggle, theme-provider, delete-confirm-dialog
├── hooks/                      # use-products, use-product, use-categories, use-debounce
├── lib/                        # axios.js, auth.js, query-params.js, utils.js
├── services/                   # auth.service.js, products.service.js (centralized API calls)
├── store/local-products.jsx    # React Context + localStorage overlay store
└── middleware.js               # Route guard for protected routes
```

> **Architecture Rule**: All API calls live strictly in `services/`, never inside UI components.

---

## 🎯 Design Decisions & Edge Cases Handled

### 1. URL as Single Source of Truth
`page`, `limit`, `q`, `category`, `sortBy`, and `order` parameters are stored directly in the URL search params. Updates use `router.replace({ scroll: false })` to avoid polluting the browser history while preserving shareable state across reloads.

### 2. Stale Search Results & Race Conditions
Every API request is bound to an `AbortController` and an incremental request ID. If a user quickly changes queries, in-flight requests are aborted and stale responses are safely discarded.

### 3. Mutual Exclusivity: Search vs. Category
DummyJSON does not support simultaneous server-side search and category filtering. To keep server-side pagination counts accurate, typing a search query automatically clears the category filter, and selecting a category clears the search query.

### 4. Local Overlay Store for Mutations
Because DummyJSON is a read-only mock API, mutations (`POST`, `PUT`, `DELETE`) are called against the real endpoints and the response is captured in a local overlay store (React Context + `localStorage`):
- Newly added products appear instantly at the top of page 1 with a `Local Added` badge.
- Edited products override API data by ID across list and detail pages.
- Deleted items are filtered out and the total item count is dynamically adjusted.

### 5. Sanitization & Dynamic Page Clamping
`lib/query-params.js` sanitizes all query parameters: negative or invalid pages default to `1`, out-of-bound pages clamp to `totalPages`, invalid page sizes default to `10`, and unrecognized sort fields are ignored.

### 6. Double-Click & Rapid Submit Guard
Login, Save, and Delete actions are guarded with submission state flags and disabled buttons to prevent duplicate network dispatches.

---

## 🛠️ Problem Faced & Solution

- **Image Resize Re-fetching**: During DevTools responsive resizing, Next.js default `next/image` proxying triggered repeated re-compression requests. Fixed by configuring `unoptimized: true` for pre-compressed DummyJSON CDN thumbnails.
- **Search Debounce Flicker on Reset**: When clicking "Reset Filters", pending debounce timers caused stale queries to re-populate. Fixed by ensuring debounce timers cancel immediately upon external prop updates.

---

## 🤖 Where AI Helped

- Scaffolding modular project structure, custom hooks, and Tailwind v4 token system (Antigravity).
- Architectural reviews, edge case debugging, and documentation cleanup (Claude).

All implementation details, styling decisions, and business logic have been verified and understood end-to-end.

---

## 👨‍💻 Author

**Varun** · [GitHub](https://github.com/varunvaatsalya)
