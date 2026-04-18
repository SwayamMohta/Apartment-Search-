// src/App.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import UniversalNavbar from './components/UniversalNavbar';
import ApartmentPreviewCard from './components/ApartmentPreviewCard';
import FiltersPanel from './components/FiltersPanel';
import ApartmentDetailView from './components/ApartmentDetailView';
import SavedApartmentsView from './components/SavedApartmentsView';
import AdminInterface from './components/AdminInterface';
import LandingView from './components/LandingView';
import AllPropertiesView from './components/AllPropertiesView';
import LoginView from './components/LoginView';
import SavedUnauthorizedView from './components/SavedUnauthorizedView';
import { useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import * as aptApi from './api/apartments';
import * as savedApi from './api/saved';
import L from 'leaflet';
import './App.css';

const DEFAULT_FILTERS = { minPrice: '', maxPrice: '', rooms: 'Any', amenities: [] };

const formatPrice = (price) => {
  if (!price) return '-';
  if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹ ${(price / 100000).toFixed(1)} L`;
  if (price >= 1000) return `₹ ${(price / 1000).toFixed(0)}k`;
  return `₹ ${price}`;
};

function AppContent() {
  const defaultPosition = [17.4230, 78.4210];
  const { user, isAdmin } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Core state
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [detailApartment, setDetailApartment] = useState(null);
  const [detailOrigin, setDetailOrigin] = useState('map');

  // Modal / Overlay state
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Feature state
  const [savedIds, setSavedIds] = useState(new Set());
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Fetch data on mount and when user changes (to update isSaved flags)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await aptApi.getApartments();
        setApartments(result.data);

        // If logged in, fetch saved IDs
        if (user) {
          const savedRows = await savedApi.getSaved();
          setSavedIds(new Set(savedRows.map(s => s.id)));
        } else {
          setSavedIds(new Set());
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const toggleSaved = async (id) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    try {
      const alreadySaved = savedIds.has(id);
      if (alreadySaved) {
        await savedApi.unsaveApartment(id);
        setSavedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
      } else {
        await savedApi.saveApartment(id);
        setSavedIds(prev => { const next = new Set(prev); next.add(id); return next; });
      }
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  const handleApplyFilters = async (newFilters) => {
    setFilters(newFilters);
    setIsFiltersOpen(false);
    
    // Fetch filtered data from backend
    try {
      const params = {
        minPrice: newFilters.minPrice || undefined,
        maxPrice: newFilters.maxPrice || undefined,
        beds:     newFilters.rooms === 'Any' ? undefined : (newFilters.rooms === '4+' ? undefined : newFilters.rooms),
        amenities: newFilters.amenities.length > 0 ? newFilters.amenities.join(',') : undefined
      };
      const result = await aptApi.getApartments(params);
      setApartments(result.data);
    } catch (err) {
      console.error('Filter fetch failed', err);
    }
  };

  // --- Admin handlers ---
  const handleAddApartment = async (apt) => {
    try {
      const newApt = await aptApi.createApartment(apt);
      setApartments(prev => [...prev, newApt]);
    } catch (err) { console.error(err); }
  };
  const handleUpdateApartment = async (updated) => {
    try {
      const result = await aptApi.updateApartment(updated.id, updated);
      setApartments(prev => prev.map(a => a.id === updated.id ? result : a));
    } catch (err) { console.error(err); }
  };
  const handleDeleteApartment = async (id) => {
    try {
      await aptApi.deleteApartment(id);
      setApartments(prev => prev.filter(a => a.id !== id));
      setSavedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
    } catch (err) { console.error(err); }
  };

  const createCustomMarker = (price) => {
    return L.divIcon({
      className: 'custom-editorial-marker pill-marker-outer',
      html: `<div class="editorial-price-pill">${formatPrice(price)}</div>`,
      iconSize: [68, 34],
      iconAnchor: [34, 34]
    });
  };

  // --- View rendering ---
  return (
    <div className="app-layout">
      <UniversalNavbar
        onOpenFilters={() => setIsFiltersOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        savedCount={savedIds.size}
      />

      <main className="app-main-content">
        <Routes>
          <Route path="/" element={
            <LandingView 
              onExplore={() => navigate('/explore')} 
              onViewAll={() => navigate('/discover')}
              onOpenLogin={() => setIsLoginOpen(true)} 
            />
          } />
          
          <Route path="/explore" element={
            <div className="map-container">
              {loading && <div className="map-loading">Refining spatial index...</div>}
              <MapContainer center={defaultPosition} zoom={13} scrollWheelZoom={true} zoomControl={false} style={{ width: '100%', height: '100%' }}>
                <ZoomControl position="bottomright" />
                <TileLayer
                  attribution='&copy; CARTO'
                  url={isDark 
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  }
                />
                {apartments.map(apt => (
                  <Marker
                    key={apt.id}
                    position={[apt.coords.lat, apt.coords.lng]}
                    icon={createCustomMarker(apt.price)}
                    eventHandlers={{ click: () => setSelectedApartment(apt) }}
                  />
                ))}
              </MapContainer>

              {selectedApartment && (
                <ApartmentPreviewCard
                  apartment={selectedApartment}
                  onClose={() => setSelectedApartment(null)}
                  onViewDetails={(apt) => {
                    setDetailApartment(apt);
                    setDetailOrigin('map');
                    setSelectedApartment(null);
                  }}
                  isSaved={savedIds.has(selectedApartment.id)}
                  onToggleSave={() => toggleSaved(selectedApartment.id)}
                />
              )}
            </div>
          } />

          <Route path="/discover" element={
            <AllPropertiesView
              apartments={apartments}
              onBack={() => navigate('/')}
              onViewDetails={(apt) => {
                setDetailApartment(apt);
                setDetailOrigin('properties');
              }}
              onOpenFilters={() => setIsFiltersOpen(true)}
              savedIds={savedIds}
              onToggleSave={toggleSaved}
            />
          } />

          <Route path="/saved" element={
            user ? (
              <SavedApartmentsView
                apartments={apartments.filter(a => savedIds.has(a.id))}
                onBack={() => navigate('/')}
                onViewDetails={(apt) => {
                  setDetailApartment(apt);
                  setDetailOrigin('saved');
                }}
                onToggleSave={toggleSaved}
              />
            ) : <SavedUnauthorizedView onOpenLogin={() => setIsLoginOpen(true)} />
          } />

          <Route path="/admin" element={
            isAdmin ? (
              <AdminInterface
                apartments={apartments}
                onBack={() => navigate('/')}
                onAddApartment={handleAddApartment}
                onUpdateApartment={handleUpdateApartment}
                onDeleteApartment={handleDeleteApartment}
              />
            ) : <Navigate to="/" />
          } />
        </Routes>

        {detailApartment && (
          <div className="detail-overlay">
            <ApartmentDetailView
              apartment={detailApartment}
              onBack={() => setDetailApartment(null)}
              isSaved={savedIds.has(detailApartment.id)}
              onToggleSave={() => toggleSaved(detailApartment.id)}
              originLabel={detailOrigin === 'properties' ? 'All Properties' : detailOrigin === 'saved' ? 'Saved Homes' : 'Map'}
            />
          </div>
        )}
      </main>

      <FiltersPanel
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        apartments={apartments}
        onApply={handleApplyFilters}
        onClear={async () => {
          setFilters(DEFAULT_FILTERS);
          setIsFiltersOpen(false);
          const res = await aptApi.getApartments();
          setApartments(res.data);
        }}
      />

      <LoginView isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
