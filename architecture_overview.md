# Apartment Map Project: Technical Architecture Overview

This document provides a breakdown of the core technologies, design principles, and architectural patterns used in the project.

## 1. Core Framework & Build Tool
*   **React (v19)**: The foundational UI library. We use React to build encapsulated, reusable components that manage their own state.
*   **Vite**: The build tool and development server. It provides instantaneous hot-module replacement and highly optimized production builds.
*   **React Router (v7)**: Used for client-side routing, enabling a multi-page feel (Search, Saved, Admin, Details) with clean URLs.

## 2. The Map Engine
*   **Leaflet & React-Leaflet**: The interactive map library. Leaflet is lightweight and open-source, allowing for mobile-friendly interactive maps without the need for API keys.
*   **OpenStreetMap (OSM)**: The map data provider, supplying the street and terrain tiles.

## 3. Styling & "Editorial" Design
*   **Tailwind CSS (v3)**: A utility-first CSS framework used for layout and component styling.
*   **Design Philosophy**: The project follows a **Premium Editorial / Architectural** aesthetic.
    *   **Neutral Palette**: Transitioned from a dark HUD theme to a warm, neutral, and professional palette (using colors like `#F7F6F2`).
    *   **Typography-First**: Emphasis on clean, modern typography (Inter/Outfit) and generous whitespace.
    *   **Refined Interactions**: Subtle micro-animations and smooth transitions using Framer Motion.
*   **Vanilla CSS**: Used for the global design system in `index.css` and for complex component-specific styles (e.g., custom scrollbars, complex layout grids).
*   **Lucide-React**: Provides modern SVG icons used throughout the navigation and UI.
*   **Framer Motion**: Powers smooth animations, including hover effects, page transitions, and the sliding navigation pill.

## 4. Navigation & Routing
The application uses **React Router** for navigation across different views:
*   **Landing View (`/`)**: The professional entry point.
*   **Search/Map View (`/search`)**: The primary interactive interface combining a map with property listings.
*   **Saved Homes (`/saved`)**: A dedicated area for user-shortlisted properties.
*   **Admin Dashboard (`/admin`)**: A restricted interface for managing property data.
*   **Detail View (`/apartment/:id`)**: A full-page deep dive into a specific apartment's features.

## 5. Full-Stack Integration
The project has moved from local-only state to a **Full-Stack Architecture**:
*   **Frontend API Layer**: Uses **Axios** with a centralized client (`src/api/client.js`) that handles JWT authentication, token refresh, and standardized error handling.
*   **Backend**: A modular **Node.js/Express** server.
*   **Database**: **PostgreSQL** (hosted on Supabase) with **PostGIS** for high-performance geospatial queries (e.g., finding apartments within a map's bounding box).
*   **Authentication**: JWT-based auth with access and refresh tokens stored in memory and secure cookies.

## 6. Key Components Summary
*   [App.jsx](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/App.jsx): The root component managing routing and global providers.
*   [UniversalNavbar.jsx](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/components/UniversalNavbar.jsx): The main navigation component with a fluid "hover pill" effect.
*   [FiltersPanel.jsx](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/components/FiltersPanel.jsx): A centered spotlight-style modal for refining search results.
*   [AdminInterface.jsx](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/components/AdminInterface.jsx): A professional dashboard for CRUD operations on property listings.
*   [index.css](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/index.css): The "Design System" root, containing all core color tokens and global variables.
