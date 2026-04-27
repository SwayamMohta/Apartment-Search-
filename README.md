# Elevé
### Apartment Search & Residential Discovery Platform

Elevé is a full-stack apartment search application built for geographic property discovery. It combines an interactive map interface with a curated listings view, user authentication, saved collections, and an admin dashboard — all presented through a premium editorial design system.

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 7 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing |
| React Leaflet + Leaflet | 5 / 1.9 | Interactive map |
| Framer Motion | 12 | Animations & transitions |
| Axios | 1.15 | HTTP client |
| Lucide React | 0.577 | Icon library |
| Tailwind CSS | 3.4 | Utility CSS (dev) |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | ≥ 18 | Runtime |
| Express | 4.21 | HTTP server & routing |
| better-sqlite3 | 12 | Primary SQLite database |
| JWT (jsonwebtoken) | 9 | Access & refresh token auth |
| bcrypt | 5 | Password hashing |
| Zod | 3 | Request schema validation |
| Helmet | 8 | Security headers |
| express-rate-limit | 7 | Global rate limiting |
| Morgan + Winston | — | HTTP & application logging |
| Multer | 1.4 | Image/file uploads |
| CORS | 2.8 | Cross-origin resource sharing |

---

## Project Structure

```
P2/
├── src/                        # Frontend (React + Vite)
│   ├── api/                    # Axios API call modules
│   ├── components/             # React components
│   │   ├── AdminInterface      # Admin CRUD dashboard
│   │   ├── AllPropertiesView   # Grid/list browse view
│   │   ├── ApartmentDetailView # Full-page property detail
│   │   ├── ApartmentPreviewCard# Map popup preview card
│   │   ├── FiltersPanel        # Filter modal (price, rooms, amenities)
│   │   ├── LandingView         # Homepage / hero section
│   │   ├── LoginView           # Auth modal (login/register)
│   │   ├── PrimaryNavbar       # Top navigation bar
│   │   ├── SavedApartmentsView # Saved properties list
│   │   ├── SavedUnauthorizedView # Prompt to login for saved
│   │   └── UniversalNavbar     # Theme-aware nav wrapper
│   ├── context/
│   │   ├── AuthContext.jsx     # User authentication state
│   │   └── ThemeContext.jsx    # Light / dark theme state
│   ├── App.jsx                 # Root app, routing, map logic
│   └── main.jsx                # React entry point
│
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app factory
│   │   ├── config/             # Environment validation (envalid)
│   │   ├── db/                 # Migrations, seed, SQLite setup
│   │   │   ├── migrate.js      # Schema migration runner
│   │   │   ├── seed.js         # Sample data seeder
│   │   │   └── migrations/     # SQL migration files
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js        # JWT verification
│   │   │   ├── role.middleware.js        # Admin role guard
│   │   │   ├── validate.middleware.js   # Zod schema validation
│   │   │   ├── rateLimit.middleware.js  # Global rate limiter
│   │   │   └── errorHandler.middleware.js
│   │   ├── modules/
│   │   │   ├── auth/           # Register, login, refresh, logout
│   │   │   ├── apartments/     # CRUD for listings + filtering
│   │   │   ├── saved/          # Save / unsave apartments per user
│   │   │   └── admin/          # Admin-only management routes
│   │   └── utils/              # Logger (Winston) and helpers
│   ├── uploads/                # Uploaded apartment images
│   ├── app.sqlite              # SQLite database file
│   ├── server.js               # HTTP server binding
│   └── .env.example            # Environment variable template
│
├── pois.db                     # SQLite DB for Points of Interest data
├── index.html                  # Vite HTML entry
├── vite.config.js
└── package.json
```

---

## API Routes

All backend routes are prefixed with `/api/v1`.

### Auth — `/api/v1/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a new user account |
| POST | `/login` | Public | Login and receive JWT cookies |
| POST | `/refresh` | Public | Refresh access token via cookie |
| POST | `/logout` | Public | Clear auth cookies |

### Apartments — `/api/v1/apartments`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Public | List all apartments (supports filters) |
| GET | `/:id` | Public | Get single apartment detail + POIs |
| POST | `/` | Admin | Create a new apartment listing |
| PUT | `/:id` | Admin | Update an apartment listing |
| DELETE | `/:id` | Admin | Delete an apartment listing |

**Query params for `GET /`:** `minPrice`, `maxPrice`, `beds`, `amenities` (comma-separated)

### Saved — `/api/v1/users`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/me/saved` | User | Get all saved apartments for current user |
| POST | `/me/saved/:id` | User | Save an apartment |
| DELETE | `/me/saved/:id` | User | Unsave an apartment |

### Admin — `/api/v1/admin`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users` | Admin | List all registered users |

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server health status + timestamp |

---

## Core Features

- **Interactive Map** — Browse apartments on a Leaflet map with custom price-pill markers. Light/dark map tiles switch with the theme.
- **Property Discovery** — Grid-based `/discover` view of all listings with filter and sort support.
- **Apartment Detail** — Full detail overlay with images, amenities, price, BHK info, and nearby Points of Interest.
- **Filters** — Spotlight-style modal for filtering by price range, number of rooms, and amenities.
- **Authentication** — JWT-based login/register with httpOnly refresh token cookies. Access tokens refresh silently.
- **Saved Apartments** — Authenticated users can save/unsave properties with persistent state.
- **Admin Dashboard** — Role-protected interface for adding, editing, and deleting listings with image upload.
- **Theme System** — Light and dark editorial modes managed via React Context.

---

## Local Setup

### Prerequisites
- **Node.js** ≥ 18
- **npm**

---

### 1. Backend

```bash
cd backend
npm install
```

Copy the example env file and fill in values:
```bash
cp .env.example .env
```

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Run database migrations and optionally seed sample data:
```bash
npm run migrate
npm run seed     # optional — loads sample apartment listings
```

Start the backend dev server:
```bash
npm run dev      # uses nodemon, restarts on changes
```

Backend runs at: `http://localhost:3001`

---

### 2. Frontend

From the project root (`P2/`):
```bash
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 3. Running Both Together

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3001` | Backend server port |
| `NODE_ENV` | No | `development` | Runtime environment |
| `FRONTEND_URL` | Yes | — | Allowed CORS origin |
| `JWT_ACCESS_SECRET` | Yes | — | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Yes | — | Secret for signing refresh tokens |

> The backend uses **SQLite** (`app.sqlite`) by default — no external database setup needed.

---

## Default Admin Access

After seeding, an admin account is created. Check `backend/src/db/seed.js` for credentials, or register a user and manually set `role = 'admin'` in the SQLite database.

---

*Elevé — Curated Living, Defined.*
