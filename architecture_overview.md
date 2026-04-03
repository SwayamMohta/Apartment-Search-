# Apartment Map Project: Technical Architecture Overview

Here is a breakdown of the core technologies running your project, what they do, and why they were chosen:

## 1. Core Framework & Build Tool
*   **React (v19)**: The foundational UI library. We use React to build encapsulated, reusable components (like the Navbar, Apartment Cards, Map, etc.) that manage their own state.
*   **Vite**: The build tool and development server. 
    *   *Why we chose it:* Vite is remarkably faster than the older Create-React-App. It provides instantaneous hot-module replacement (when you save a file, the browser updates instantly without a full page reload) and highly optimized production builds.

## 2. The Map Engine
*   **Leaflet & React-Leaflet**: The interactive map library.
    *   *Why we chose it:* Leaflet is the leading open-source library for mobile-friendly interactive maps. It is extremely lightweight and doesn't require API keys or paid subscriptions like Google Maps. `react-leaflet` gives us specialized React components (like `<MapContainer>`, `<TileLayer>`, and `<Marker>`) so we can write our map declaratively within React.
*   **OpenStreetMap (OSM)**: The map data provider.
    *   *Why we chose it:* OSM is the "Wikipedia of Maps." It provides free, highly detailed map tiles that we fetch dynamically to render the streets and terrain on the screen.

## 3. Styling & Aesthetics
*   **Tailwind CSS (v3)**: A utility-first CSS framework.
    *   *Why we chose it:* Tailwind allows us to rapidly style components by applying pre-existing classes directly in the JSX (e.g., `flex items-center p-1.5 rounded-full`). It dramatically speeds up development and maintains a cohesive design system without having to bounce back and forth between CSS files constantly. Note: We recently downgraded from v4 to v3 to ensure it played nicely with our Leaflet map styles!
*   **Vanilla CSS ([App.css](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/App.css), [index.css](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/index.css))**: Used for global variables, custom animations, and highly specific overrides.
    *   *Why we chose it:* While Tailwind handles 90% of styling, pure CSS is still required for complex tasks like defining our absolute Dark/Light Mode color variables and fixing the specific `max-width` bugs that occur when Leaflet images clash with default browser resets.
*   **Lucide-React**: The icon library.
    *   *Why we chose it:* It provides clean, modern, and beautiful SVG icons (like the Search, User, Map, Sun, and Moon icons in the Navbar) that scale perfectly and can be colored dynamically with text classes.

## 4. Animations & Interactivity
*   **Framer Motion**: The animation library.
    *   *Why we chose it:* It is the premier animation library for React. It powers the incredibly smooth, complex physics-based spring animations in the application, such as the glowing hover pill in the Navbar that fluidly snaps between different menu items as you move your mouse. Doing this in pure CSS is incredibly difficult; Framer Motion makes it trivial.

## 5. Summary of Key Files
*   [App.jsx](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/App.jsx): The "control center." It holds the master state of the application (like which apartment is selected, whether the app is in Dark or Light mode, and whether the filters are visible) and orchestrates the other components.
*   [CyberNavbar.jsx](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/components/CyberNavbar.jsx): The futuristic, condensing navigation menu that tracks your mouse movements.
*   [index.css](file:///c:/Users/mohta/Desktop/SE/Project/P2/src/index.css): The root stylesheet that dictates the core color variables for the Light and Dark themes, as well as the global font (`JetBrains Mono` and `Inter`).
