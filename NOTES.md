# Architecture & Engineering Notes

This document highlights the key engineering decisions, edge-case mitigation strategies, and architectural patterns implemented across the Nexgensis Product Admin Dashboard.

---

### (a) Key Design Choices

1. **URL as the Single Source of Truth**:
   - Every filter, search term (`q`), category, sort configuration (`sortBy`, `order`), and pagination parameter (`page`, `limit`) resides directly in the URL search parameters.
   - Synchronizing with `router.replace(..., { scroll: false })` ensures that bookmarking, page refreshing, and link sharing reliably reproduce the exact view state without cluttering browser history.

2. **Custom `useDebounce` Hook**:
   - Rather than relying on heavyweight external state libraries, a lightweight `useDebounce` hook buffers rapid input keystrokes by 500ms before dispatching updates to the URL and fetching data.

3. **Two-Tier Race Condition Protection (`AbortController` + Request IDs)**:
   - In-flight requests are immediately canceled using `AbortController.abort()` upon parameter changes.
   - To guard against edge cases where older canceled responses might settle after newer ones, an incrementing `latestRequestIdRef` ensures only responses matching the most recent request update component state.
   - Built-in support for the `delay` query parameter (e.g., `?delay=2000`) allows quick testing of asynchronous race conditions.

4. **Local Overlay Store (`LocalProductsProvider`)**:
   - Since DummyJSON is a read-only mock API that does not persist server mutations, a React Context overlay persisted in `localStorage` intercepts and merges changes (added items, edited fields, deleted IDs).

---

### (b) Search vs. Category Conflict & Decision

**Decision**: Search (`q`) and Category filter are **mutually exclusive**.
- Typing in the search input automatically clears the active category filter.
- Selecting a category clears the active search keyword.
- A descriptive hint banner in the control bar informs the user: *"Search and category filters operate independently for accurate server pagination."*

**Why this decision was made**:
The DummyJSON API does not support combined searching within a specific category on the server (e.g., `/products/search` does not accept a `category` parameter, and `/products/category/{slug}` does not accept `q`). Performing client-side filtering on a single paginated chunk would produce incorrect total counts, broken pagination pages, and missing items that exist on subsequent server pages. Maintaining mutual exclusivity preserves true server-side pagination and accurate catalog totals.

---

### (c) How Add / Edit / Delete Are Simulated & Why

DummyJSON's mutation endpoints (`POST /products/add`, `PUT /products/{id}`, `DELETE /products/{id}`) simulate successful HTTP responses but do not modify the remote backend database.
- **Workflow**:
  1. The application first executes the real Axios network call to the DummyJSON endpoint.
  2. Upon receiving a successful response, the changes are applied to the `LocalProductsProvider` overlay and persisted in `localStorage`.
  3. **Added Products**: Assigned a local identifier, pinned to the top of page 1 when active filters allow, and increment the adjusted total count.
  4. **Edited Products**: Overlay modified properties over matching product IDs in both list and detail views.
  5. **Deleted Products**: Added to a local exclusion list, filtered out of queries, and decrement the total product count.
- **Why**: This provides a fully functional, realistic CRUD admin experience that persists across page refreshes and browser sessions while still exercising real HTTP API calls.

---

### (d) Real Problem Faced & How It Was Resolved

**Issue: React 19 / Next.js 16 Strict Effect Linting & Cascading Renders**:
- When upgrading to Next.js 16 with React 19, the strict ESLint rule `react-hooks/set-state-in-effect` flagged synchronous `setState` calls (such as `setIsLoading(true)` or `setUser(...)`) inside `useEffect` bodies during initialization or async triggers.
- **Solution**:
  1. Converted localStorage reads and auth verification checks in `LocalProductsProvider`, `ProtectedLayout`, and `Header` to use **lazy state initializers** (`useState(() => getAuthUser())`), eliminating `useEffect` state syncing on mount.
  2. Refactored data fetching effects in `useCategories`, `useProducts`, and `useProduct` to use the standard React 19 async promise pattern where state updates only occur inside asynchronous `.then()` / `.catch()` callbacks.
  3. Replaced effect-based image selection in `ProductGallery` with pure index derivation during render.

---

### (e) Where AI Helped

1. **Edge-Case Architecture**: Designing the local overlay merging algorithm (`applyOverlayToList`) to accurately compute adjusted totals and splice newly created items without distorting server pagination boundaries.
2. **Component Generation**: Rapidly assembling accessible, responsive shadcn/ui components with full light/dark theme token fidelity.
3. **Zod Validation & Double-Click Guards**: Crafting strict form schemas and implementing ref-based submission locks to prevent duplicate network calls.
