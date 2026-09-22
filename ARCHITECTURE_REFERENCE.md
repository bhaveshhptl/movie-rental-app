# Rental Movie App — Architecture Reference

> This document reflects the repository as inspected on 22 September 2026. `node_modules` was intentionally excluded.

## System at a glance

This is a two-process full-stack movie-rental application:

```text
React + Vite frontend (normally :5173)
  ↓ Axios /api requests with JWT bearer token
Express API (normally :5000)
  ↓ Axios client
JSON Server datastore (normally :5001, backend/data/db.json)
```

The frontend owns UI, routing, and browser state. The Express backend owns validation, authentication, authorization, and business rules. JSON Server provides the persisted development data store.

## Repository root

| Path | Responsibility |
| --- | --- |
| `frontend/` | React browser client. |
| `backend/` | Express API, domain logic, and JSON Server configuration. |
| `frontend.zip` | Archived frontend copy; not part of the running source tree. |

## Frontend (`frontend/`)

### Tooling and entry files

| File | Responsibility |
| --- | --- |
| `package.json` | Scripts/dependencies: Vite build/dev, ESLint, Jest. React 19, React Router, Redux Toolkit, Axios, and Bootstrap are the principal runtime libraries. |
| `vite.config.js` | Vite development/build configuration. |
| `babel.config.cjs`, `jest.config.cjs` | Babel and Jest configuration. |
| `eslint.config.js` | Lint rules. |
| `index.html` | Browser document and React mount point. |
| `src/main.jsx` | Application bootstrap: mounts React, Redux `Provider`, and `BrowserRouter`; configures Axios authentication callbacks; imports Bootstrap and app styles. |
| `src/App.jsx` | Route table and startup authentication restoration. Routes are `/login`, `/register`, `/home`, `/cart`, `/profile`, and protected `/admin`; `/` redirects to login. |
| `src/App.css`, `src/index.css`, `src/styles/app.css` | Application styling (the active global stylesheet is imported from `main.jsx`). |

### State and HTTP

| Path | Responsibility |
| --- | --- |
| `src/app/store.js` | Registers the five Redux slices: `auth`, `movies`, `cart`, `rental`, and `admin`. |
| `src/services/api.js` | Shared Axios instance targeting `http://localhost:5000/api`. Adds access tokens, performs one shared refresh request after 401 responses, retries the original request, and clears auth on failure. |
| `src/features/auth/authAPI.js` | Auth endpoint calls: register, login, current-user lookup, token refresh, logout. |
| `src/features/auth/authSlice.js` | Auth state and thunks. Keeps access token only in Redux memory; persists only the refresh token in `localStorage`; restores a session on app start. |
| `src/features/movies/movieAPI.js` / `movieSlice.js` | Fetches filtered/paginated movies and stores movie results plus pagination state. |
| `src/features/cart/cartAPI.js` / `cartSlice.js` | Fetches, adds, changes, removes, and clears cart entries; stores items and calculated total. |
| `src/features/rental/rentalAPI.js` / `rentalSlice.js` | Checks out the cart and fetches the current user’s rental history. |
| `src/features/admin/adminAPI.js` / `adminSlice.js` | Admin data/actions: users, rentals, overdue rentals, daily transactions, penalties, role changes, and marking returns. |

### Pages, routes, and reusable UI

| Path | Responsibility |
| --- | --- |
| `src/pages/Login.jsx` | Login screen. |
| `src/pages/Register.jsx` | Registration screen. |
| `src/pages/Home.jsx` | Movie discovery: initial fetch, search, genre filtering, pagination, carousel, and grid. |
| `src/pages/Cart.jsx` | Cart editing and checkout; sends a successful checkout to profile. |
| `src/pages/Profile.jsx` | User details and rental-history display, including client-side overdue indication. |
| `src/pages/AdminDashboard.jsx` | Admin workspace that loads and coordinates all management widgets. |
| `src/routes/AdminRoute.jsx` | Route guard: waits for auth initialization, sends unauthenticated users to login, and permits only `admin`/`super_admin` users. |
| `src/components/AppNavBar.jsx` | Shared application navigation. |
| `src/components/MovieCard.jsx` | Single movie presentation/action card. |
| `src/components/MovieCarousel.jsx` | Featured movie carousel. |
| `src/components/MovieFilters.jsx` | Search and genre controls. |
| `src/components/MovieGrid.jsx` | Movie-card collection and loading/error display. |
| `src/components/MoviePagination.jsx` | Pagination controls. |
| `src/components/admin/AdminStatsCards.jsx` | Dashboard summary metrics. |
| `src/components/admin/AdminUsersTable.jsx` | User list with role-management actions. |
| `src/components/admin/AdminRentalsTable.jsx` | Complete rental list and return actions. |
| `src/components/admin/AdminOverdueRentals.jsx` | Overdue-rental list, penalties, and return actions. |
| `src/components/admin/AdminDailyTransactions.jsx` | Date-selected transaction view. |
| `src/components/admin/helpers.js` | Shared admin presentation helpers (including today’s date). |

### Assets and test support

| Path | Responsibility |
| --- | --- |
| `public/favicon.svg`, `public/icons.svg` | Public static browser assets. |
| `src/assets/hero.png`, `react.svg`, `vite.svg` | Source-managed visual assets. |
| `src/tests/setupTests.js`, `styleMock.js` | Jest test setup and CSS mocking. |
| `src/tests/helpers/fixtures.js`, `renderWithProviders.jsx` | Reusable test data and Redux-aware rendering. |
| `src/tests/components/**`, `src/tests/pages/**` | Unit/component tests matching the production component and page structure. |

## Backend (`backend/`)

### Running and configuration

| File | Responsibility |
| --- | --- |
| `package.json` | `npm run dev` runs Express with Nodemon and JSON Server concurrently; `start` runs only Express; `seed` runs `seedDB.js`. |
| `.env` | Runtime environment values (ports, client URL, JSON Server URL, JWT secrets/expirations). Do not commit or copy secret values into documentation. |
| `seedDB.js` | Seeds development JSON data. |
| `data/db.json` | JSON Server persistence: `users`, `sessions`, `movies`, `carts`, and `rentals` collections. |
| `src/config/env.js` | Loads and exposes environment configuration. |
| `src/config/jsonServer.js` | Axios client used by the API to call JSON Server. |
| `src/server.js` | Starts the Express listener. |
| `src/app.js` | Configures CORS and JSON parsing, mounts API routers, provides `/api/health`, and contains the global error handler. |

### HTTP API surface

All routes below are rooted at `/api`.

| Router file | Endpoints and access |
| --- | --- |
| `routes/auth.routes.js` | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` (authenticated), `POST /auth/logout`, `POST /auth/refresh-token`. Registration/login input is validated. |
| `routes/movie.routes.js` | Authenticated `GET /movies` with `search`, `genre`, `page`, and `limit`; authenticated `GET /movies/:id`. |
| `routes/cart.routes.js` | Authenticated cart operations: `GET /cart`, `POST /cart`, `PATCH /cart/:movieId`, `DELETE /cart/:movieId`, `DELETE /cart`. |
| `routes/rental.routes.js` | Authenticated `POST /rentals/checkout` and `GET /rentals/history`; `POST /rentals/:rentalId/return` is admin/super-admin only. |
| `routes/admin.routes.js` | Admin/super-admin management endpoints: users, all/overdue rentals, daily transactions, penalties, and rental returns. Role promotion/demotion additionally requires `super_admin`. |

### Backend layers

The API follows this request path:

```text
route → validation/auth middleware → controller → service → jsonServerClient → db.json
```

| Directory | Responsibility |
| --- | --- |
| `src/routes/` | Declares endpoint URLs, HTTP methods, validation chains, and access requirements. |
| `src/middleware/authenticate.js` | Verifies an access JWT, fetches the matching user from the datastore, and sets `req.user`. |
| `src/middleware/authorize.js` | Role-based access control for supplied roles. |
| `src/middleware/validateRequest.js` | Converts `express-validator` failures to a 400 error passed to the global handler. |
| `src/controllers/` | Thin HTTP adapters: each file receives the request, delegates to its service, and shapes/sends a response. Each domain’s `index.js` re-exports that domain’s controllers. |
| `src/service/` | Domain business/data layer. Each domain `index.js` aggregates its service exports. |
| `src/utils/jwt.js` | Generates/verifies access and refresh JWTs. |
| `src/utils/password.js` | Hashes and compares passwords with bcrypt. |
| `src/utils/rentCalculator.js` | Computes cart line totals, cart total, and item due dates. |

### Domain file responsibilities

| Domain | Controller/service files |
| --- | --- |
| Auth | `register`, `login`, `logout`, `refreshToken`, and `getCurrentUser`; matching service files implement registration, credential login, logout/session invalidation, token rotation, and user lookup. |
| Movies | `getMovie` contains both list/detail reads; `createMovie`, `updateMovie`, and `deleteMovie` exist as controller/service pairs for movie administration, though the currently mounted public movie router exposes reads only. |
| Cart | `getCart`, `addToCart`, `updateCartItem`, `removeFromCart`, `clearCart`, with matching services. They maintain a user-specific cart and use rental-price calculations. |
| Rentals | `checkout`, `getRentalHistory`, and `returnRental`, with matching services. Checkout converts the cart into a rental; history retrieves a user’s rentals; return finalizes one. |
| Admin | `viewAllUsers`, `viewAllRentals`, `viewOverdueRentals`, `viewDailyTransactions`, `imposePenalty`, `markRentalReturned`, `makeAdmin`, and `removeAdmin`, each with matching service implementation. |

## Key behavior to remember

- Authentication uses short-lived access tokens in Redux and refresh tokens in browser `localStorage`.
- Axios attaches the access token automatically and coordinates concurrent 401 refreshes through one shared refresh promise.
- The frontend’s admin API calls rely on the shared Axios interceptor for authorization headers.
- The backend does not connect to a traditional database directly; it calls JSON Server over HTTP, so both backend dev processes are needed for full functionality.
- A user must be authenticated even to list movies. Admin pages are guarded in both the frontend route and backend router.

