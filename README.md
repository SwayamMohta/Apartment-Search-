# Elevé — Curated Living, Defined.

![Elevé Hero Banner](file:///C:/Users/mohta/.gemini/antigravity/brain/e9331a88-d6c1-4420-9b8a-e871b8a4b843/eleve_hero_banner_1777898374479.png)

Elevé is a high-end, full-stack residential discovery platform designed for the modern urban explorer. It merges sophisticated editorial design with powerful geographic search capabilities, allowing users to find their next home through an interactive, data-rich experience.

---

## ✨ Key Features

- **🗺️ Intelligent Map Discovery**: Custom Leaflet-based interactive map with real-time price markers and theme-aware tile switching.
- **🔍 Advanced Filtering**: A refined spotlight-style filter system for price, bedroom count, and premium amenities.
- **🏢 Deep Property Insights**: Detailed views featuring high-resolution galleries, amenity lists, and localized **Points of Interest (POIs)**.
- **🔐 Seamless Authentication**: Robust JWT-based security with silent token refreshing and role-based access control.
- **❤️ Personal Collections**: Curate your favorite listings with persistent, user-specific saved collections.
- **🛠️ Executive Admin Dashboard**: Comprehensive management interface for property listings, user roles, and asset uploads.
- **🌓 Dynamic Theming**: A meticulously crafted design system supporting both premium Light and deep Dark modes.

---

## 🛠️ Technical Excellence

### Frontend Architecture
| Technology | Role |
| :--- | :--- |
| **React 19** | Core UI logic and state management |
| **Vite 7** | Ultra-fast build pipeline and development environment |
| **React Leaflet** | Geospatial visualization and interactive mapping |
| **Framer Motion** | Fluid, micro-interaction driven animations |
| **Tailwind CSS** | Utility-first styling for a custom design system |
| **Lucide React** | Consistent, professional iconography |

### Backend Infrastructure
| Technology | Role |
| :--- | :--- |
| **Node.js & Express** | Scalable REST API and business logic |
| **PostgreSQL (Supabase)** | High-performance, scalable data storage |
| **JWT & Bcrypt** | Secure authentication and password hashing |
| **Zod** | Type-safe schema validation for all requests |
| **Winston & Morgan** | Enterprise-grade logging and monitoring |
| **Multer** | Secure file and image processing |

---

## 🏗️ System Architecture

Elevé follows a clean, modular architecture designed for maintainability and performance:

1.  **Presentation Layer (Frontend)**: A component-based React application utilizing Context API for global state (Auth, Theme) and custom hooks for API interaction.
2.  **Logic Layer (Service/Controller)**: The backend is structured using the **Controller-Service-Repository** pattern, ensuring strict separation of concerns between HTTP handling, business logic, and data access.
3.  **Data Layer (Repository)**: Optimized SQL queries with specialized logic for **Geographic Bounding Box** and **Radius Search**, integrated with a custom Points of Interest database.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn**

### 1. Initialize the Backend
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
Configure your environment variables:
```bash
cp .env.example .env
```
Run migrations and seed the initial dataset:
```bash
npm run migrate
npm run seed
```
Launch the development server:
```bash
npm run dev
```

### 2. Initialize the Frontend
From the project root, install dependencies and start the Vite server:
```bash
npm install
npm run dev
```
The platform will be accessible at `http://localhost:5173`.

---

## 🔑 Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string (Supabase) |
| `PORT` | No | `3001` | Backend server port |
| `NODE_ENV` | No | `development` | Runtime environment |
| `FRONTEND_URL` | Yes | — | Allowed CORS origin |
| `JWT_ACCESS_SECRET` | Yes | — | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Yes | — | Secret for signing refresh tokens |

---

## 📖 API Documentation

All API endpoints are versioned under `/api/v1`.

### Authentication
- `POST /auth/register` — Create a new identity.
- `POST /auth/login` — Secure session initialization.
- `POST /auth/refresh` — Seamless token renewal.
- `POST /auth/logout` — Secure session termination.

### Property Management
- `GET /apartments` — Discovery feed with advanced filtering.
- `GET /apartments/:id` — Full property dossier + nearby POIs.
- `POST /apartments` — [Admin] Listing creation.
- `PUT /apartments/:id` — [Admin] Listing refinement.
- `DELETE /apartments/:id` — [Admin] Listing removal.

### User Interaction
- `GET /users/me/saved` — Retrieve personal collection.
- `POST /users/me/saved/:id` — Curate a property.
- `DELETE /users/me/saved/:id` — Remove from collection.

---

## 📁 Repository Structure

```text
├── src/                        # React Frontend (Vite)
│   ├── components/             # Modular UI components
│   ├── context/                # Auth & Theme state management
│   ├── api/                    # Axios-based service modules
│   └── App.jsx                 # Routing and Map Orchestration
├── backend/
│   ├── src/
│   │   ├── modules/            # Domain-driven feature modules (Auth, Apartments, etc.)
│   │   ├── middleware/         # Security, Auth & Validation guards
│   │   └── config/             # DB and Environment configuration
│   └── PostgreSQL (Supabase)   # Primary application database
└── pois.db                     # Geospatial Points of Interest database (Local Reference)
```

---

## 🗺️ Geospatial Intelligence

Elevé doesn't just show listings; it understands the neighborhood. The backend utilizes a optimized **Haversine-based calculation** and **Bounding Box filtering** to:
1.  Instantly update the map view as you pan/zoom.
2.  Calculate the exact distance to schools, hospitals, and parks within a 2km radius.
3.  Rank properties based on their "Proximity Score" to essential services.

---

*Elevé — Redefining the search for home.*
