# Apartment Map Project: Technical Architecture Overview

This document provides a breakdown of the core technologies, design principles, and architectural patterns used in the project.

## 1. Core Framework & Build Tool
*   **React (v19)**: The foundational UI library. We use React to build encapsulated, reusable components (like the Navbar, Apartment Cards, Map, etc.) that manage their own state.
*   **Vite**: The build tool and development server. It provides instantaneous hot-module replacement and highly optimized production builds.

## 2. The Map Engine
*   **Leaflet & React-Leaflet**: The interactive map library. Leaflet is lightweight and open-source, allowing for mobile-friendly interactive maps without the need for API keys.
*   **OpenStreetMap (OSM)**: The map data provider, supplying the street and terrain tiles.

## 3. Styling & "Cyber-Minimalist" Design
*   **Tailwind CSS (v3)**: A utility-first CSS framework used for rapid layout and component styling.
*   **Design Philosophy**: The project follows a **Cyber-Minimalist / HUD (Heads-Up Display)** aesthetic.
    *   **Glassmorphism**: Heavy use of backdrop-blur and semi-transparent backgrounds (`.glass-panel`) to create layered depth.
    *   **Dark Mode Priority**: An ultra-dark theme (pure black `#000000` base) designed for high contrast and modern AI-style aesthetics.
    *   **Custom UI Elements**: Implementation of universal HUD-style scrollbars and high-performance micro-animations.
*   **Vanilla CSS**: Used in `index.css` for the global design system (CSS variables for colors, spacing, and typography) and component-specific files for complex overrides and animations.
*   **Lucide-React**: Provides clean, modern SVG icons used throughout the navigation and UI.
*   **Framer Motion**: Powers the smooth, physics-based spring animations, such as the fluid "hover pill" in the navbar and view transitions.

## 4. View Management & Routing
Instead of a traditional URL-based router, the application uses **State-Driven View Switching** within [App.jsx](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/App.jsx). This allows for instant, fluid transitions between logical states:
*   **Landing View**: The high-impact entry point for the application.
*   **Map View**: The primary interactive search interface.
*   **All Properties View**: A grid-based listing of all available apartments.
*   **Saved Homes**: A dedicated area for user-shortlisted properties.
*   **Admin Dashboard**: A restricted interface for property management (Add/Edit/Delete).
*   **Detail View**: A full-page deep dive into a specific apartment's features and images.

## 5. State Management
The project uses a **Centralized State Model** in `App.jsx`:
*   **Apartments State**: The source of truth for all property data, updated via the Admin interface.
*   **Selection State**: Tracks which apartment is currently highlighted on the map or opened in detail view.
*   **Filter State**: Stores user search criteria (price, rooms, etc.) which is applied in real-time to the displayed datasets.
*   **Persistence (Future)**: The current setup is prepared for easy integration with `localStorage` or a backend API.

## 6. Key Components Summary
*   [App.jsx](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/App.jsx): The orchestrator. It holds the master state and handles top-level conditional rendering for views.
*   [CyberNavbar.jsx](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/components/CyberNavbar.jsx): A futuristic, condensing navigation menu that tracks mouse movements for a premium feel.
*   [FiltersPanel.jsx](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/components/FiltersPanel.jsx): A slide-out HUD panel that allows users to refine results with live counting logic.
*   [AdminInterface.jsx](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/components/AdminInterface.jsx): The dashboard for CRUD operations on the apartment database.
*   [ApartmentDetailView.jsx](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/components/ApartmentDetailView.jsx): An immersive content view for individual properties.
*   [index.css](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/index.css): The "Design System" root, containing all core color tokens and global variables.
