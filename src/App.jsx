import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import CyberNavbar from './components/CyberNavbar';
import ApartmentPreviewCard from './components/ApartmentPreviewCard';
import FiltersPanel from './components/FiltersPanel';
import ApartmentDetailView from './components/ApartmentDetailView';
import SavedApartmentsView from './components/SavedApartmentsView';
import AdminInterface from './components/AdminInterface';
import LandingView from './components/LandingView';
import AllPropertiesView from './components/AllPropertiesView';
import './App.css';

const INITIAL_APARTMENTS = [
  { id: 1, title: "Luxury Villa", location: "Jubilee Hills, Hyderabad", price: 3400, rating: 4.8, beds: 3, baths: 3, area: 2500, description: "Experience luxury living in this stunning villa. High ceilings, premium finishes, and breathtaking city views define this exclusive residence in the prestigious Jubilee Hills neighborhood.", amenities: ['City Skyline View', '24/7 Security', 'In-unit Washer', 'Rooftop Pool'], images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=400"], coords: [17.4312, 78.4068] },
  { id: 2, title: "Premium Apartment", location: "Banjara Hills, Hyderabad", price: 5200, rating: 4.9, beds: 2, baths: 2, area: 1200, description: "A premium high-rise apartment in the heart of Banjara Hills. Stunning views, modern interiors, and top-of-the-line amenities await the discerning resident.", amenities: ['Pool Access', 'Gym', 'Concierge', 'Parking'], images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1502672260266-1c1de2d9d06b?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=400"], coords: [17.4156, 78.4357] },
  { id: 3, title: "Modern Studio", location: "HITEC City, Hyderabad", price: 2850, rating: 4.5, beds: 1, baths: 1, area: 650, description: "A sleek, modern studio in the tech hub of Hyderabad. Perfect for young professionals seeking efficiency and style, with everything within walking distance.", amenities: ['High-Speed WiFi', 'Gym', 'Co-working Space', 'Balcony'], images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1484154218962-a420fd7c04a4?auto=format&fit=crop&q=80&w=400"], coords: [17.4435, 78.3772] },
  { id: 4, title: "Designer Loft", location: "Madhapur, Hyderabad", price: 4100, rating: 4.7, beds: 2, baths: 2, area: 1500, description: "An architect-designed loft with soaring ceilings and industrial-chic finishes in the vibrant Madhapur district. A true creative sanctuary.", amenities: ['Open Plan Layout', 'Private Terrace', 'Smart Home', 'Exposed Brick'], images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=400"], coords: [17.4483, 78.3915] },
  { id: 5, title: "Cozy 1BR", location: "Jubilee Hills, Hyderabad", price: 2500, rating: 4.4, beds: 1, baths: 1, area: 700, description: "A warm and inviting one-bedroom apartment with a private balcony, nestled in the leafy streets of Jubilee Hills. Perfect for those who value calm over clutter.", amenities: ['Balcony', 'Parking', 'Security', 'Garden Access'], images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&q=80&w=400"], coords: [17.4250, 78.4150] },
  { id: 6, title: "Skyline Penthouse", location: "Banjara Hills, Hyderabad", price: 4800, rating: 4.9, beds: 3, baths: 3, area: 2200, description: "The pinnacle of urban luxury. This penthouse commands panoramic views of the entire city skyline with a private pool, butler service, and a fully smart-home interior.", amenities: ['360° Panoramic Views', 'Private Pool', 'Butler Service', 'Smart Home'], images: ["https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1512914890251-259720564e05?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"], coords: [17.4080, 78.4420] },
  { id: 7, title: "Urban Condo", location: "Madhapur, Hyderabad", price: 3100, rating: 4.6, beds: 2, baths: 2, area: 1100, description: "A contemporary condo with seamless access to the metro, shopping centers, and Hyderabad's tech corridor. Modern design meets urban convenience.", amenities: ['Metro Access', 'Gym', 'Pool', '24/7 Security'], images: ["https://images.unsplash.com/photo-1484154218962-a420fd7c04a4?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1542314831-c6a4d14d23e0?auto=format&fit=crop&q=80&w=400"], coords: [17.4380, 78.3850] },
  { id: 8, title: "Minimalist Suite", location: "Kondapur, Hyderabad", price: 2900, rating: 4.5, beds: 1, baths: 1, area: 800, description: "A curated minimalist suite where every detail is intentional. Designed for those who appreciate less, but better. A quiet oasis in the growing Kondapur district.", amenities: ['Designer Interiors', 'High-Speed WiFi', 'Gym', 'Cafe Below'], images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1502672260266-1c1de2d9d06b?auto=format&fit=crop&q=80&w=400"], coords: [17.4520, 78.3700] },
  { id: 9, title: "Tech Hub Apt", location: "Gachibowli, Hyderabad", price: 3600, rating: 4.7, beds: 2, baths: 2, area: 1050, description: "Designed for the modern tech professional. Fiber internet, smart home controls, EV parking, and walking distance to Hyderabad's top IT parks.", amenities: ['Fiber Internet', 'Co-working Space', 'EV Parking', 'Smart Locks'], images: ["https://images.unsplash.com/photo-1512914890251-259720564e05?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1484154218962-a420fd7c04a4?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=400"], coords: [17.4450, 78.3650] },
  { id: 10, title: "Spacious 3BR", location: "Jubilee Hills, Hyderabad", price: 4500, rating: 4.8, beds: 3, baths: 3, area: 1800, description: "An expansive three-bedroom home with a large private garden and study room. The ideal family home in one of Hyderabad's most sought-after neighborhoods.", amenities: ['Large Kitchen', 'Study Room', 'Private Garden', 'Pool'], images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=400"], coords: [17.4350, 78.3950] },
  { id: 11, title: "City View Flat", location: "Somajiguda, Hyderabad", price: 2200, rating: 4.3, beds: 1, baths: 1, area: 620, description: "An affordable city-view flat in the heart of Somajiguda. Great connectivity to business districts, entertainment hubs, and the metro network.", amenities: ['City Views', 'Security', 'Parking', 'Near Metro'], images: ["https://images.unsplash.com/photo-1542314831-c6a4d14d23e0?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=400"], coords: [17.4100, 78.4500] },
  { id: 12, title: "Riverside Apt", location: "Begumpet, Hyderabad", price: 3200, rating: 4.6, beds: 2, baths: 2, area: 1150, description: "Wake up to serene lake views every morning. A beautiful riverside apartment in one of Hyderabad's most historic neighborhoods, steps from the airport express.", amenities: ['Lake Views', 'Balcony', 'Gym', 'Pool'], images: ["https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=400"], coords: [17.4200, 78.4600] },
  { id: 13, title: "Quiet Retreat", location: "Kondapur, Hyderabad", price: 2750, rating: 4.4, beds: 2, baths: 1, area: 950, description: "A peaceful sanctuary away from the urban hustle. Lush green surroundings, a private garden, and a pet-friendly building make this a true retreat.", amenities: ['Private Garden', 'Pet Friendly', 'Parking', 'Quiet Location'], images: ["https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1512914890251-259720564e05?auto=format&fit=crop&q=80&w=400"], coords: [17.4600, 78.3800] },
  { id: 14, title: "Elegant Duplex", location: "Jubilee Hills, Hyderabad", price: 3900, rating: 4.8, beds: 3, baths: 3, area: 1700, description: "A stunning two-storey duplex with soaring double-height ceilings and a private rooftop terrace with panoramic views of Jubilee Hills.", amenities: ['Double-height Ceilings', 'Private Terrace', 'Smart Home', 'Study Room'], images: ["https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1484154218962-a420fd7c04a4?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=400"], coords: [17.4280, 78.4200] },
  { id: 15, title: "Modern Flat", location: "Madhapur, Hyderabad", price: 4400, rating: 4.7, beds: 2, baths: 2, area: 1300, description: "A modern, light-filled flat with premium finishes and an open-plan living area. Located in Madhapur's fastest-growing corridor with excellent connectivity.", amenities: ['Open Plan Layout', 'Gym', 'Concierge', 'EV Charging'], images: ["https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=400"], coords: [17.4400, 78.3900] },
  { id: 16, title: "Luxury Suite", location: "Banjara Hills, Hyderabad", price: 5000, rating: 4.9, beds: 2, baths: 2, area: 1400, description: "An ultra-premium suite with hotel-style amenities including a private spa, residents' lounge, and dedicated concierge service available 24/7.", amenities: ['Spa Access', 'Private Lounge', 'Valet Parking', 'Concierge'], images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"], coords: [17.4150, 78.4450] },
  { id: 17, title: "Campus View", location: "Gachibowli, Hyderabad", price: 3300, rating: 4.6, beds: 2, baths: 2, area: 1000, description: "Adjacent to top universities and corporate campuses. Well-designed apartment with dedicated study rooms and shuttle access to major tech parks.", amenities: ['University Adjacent', 'Study Rooms', 'Gym', 'Shuttle Service'], images: ["https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1512914890251-259720564e05?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1542314831-c6a4d14d23e0?auto=format&fit=crop&q=80&w=400"], coords: [17.4550, 78.3600] },
  { id: 18, title: "Vintage Apt", location: "Banjara Hills, Hyderabad", price: 2600, rating: 4.3, beds: 1, baths: 1, area: 750, description: "A charming vintage apartment in a heritage building with original hardwood floors and soaring ceilings. Rich in character, steps from Hussain Sagar lake.", amenities: ['Heritage Building', 'High Ceilings', 'Hardwood Floors', 'Lake Nearby'], images: ["https://images.unsplash.com/photo-1484154218962-a420fd7c04a4?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=400"], coords: [17.4050, 78.4350] },
  { id: 19, title: "Contemporary Flat", location: "Madhapur, Hyderabad", price: 3500, rating: 4.7, beds: 2, baths: 2, area: 1200, description: "A meticulously designed contemporary flat with clean lines, premium materials, rooftop access with city views, and EV charging in the basement.", amenities: ['Rooftop Access', 'EV Charging', 'Gym', 'Smart Home'], images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1484154218962-a420fd7c04a4?auto=format&fit=crop&q=80&w=400", "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=400"], coords: [17.4320, 78.3800] },
];

const DEFAULT_FILTERS = { minPrice: '', maxPrice: '', rooms: 'Any', amenities: [] };

function App() {
  const defaultPosition = [17.4230, 78.4210];

  // Core state
  const [apartments, setApartments] = useState(INITIAL_APARTMENTS);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [detailApartment, setDetailApartment] = useState(null);
  const [detailOrigin, setDetailOrigin] = useState('map'); // 'map' | 'properties' | 'saved'

  // View state
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'map' | 'properties'
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Feature state
  const [savedIds, setSavedIds] = useState(new Set());
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // --- Handlers ---
  const toggleSaved = (id) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openDetail = (apt, origin = 'map') => {
    setDetailOrigin(origin);
    setDetailApartment(apt);
    setSelectedApartment(null);
  };

  const closeDetail = () => {
    setDetailApartment(null);
    if (detailOrigin === 'properties') setCurrentView('properties');
    else if (detailOrigin === 'saved') setIsSavedOpen(true);
    // 'map' origin: stays on map (default)
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFiltersOpen(false);
  };

  // --- Admin handlers ---
  const handleAddApartment = (apt) => {
    setApartments(prev => [...prev, { ...apt, id: Date.now() }]);
  };
  const handleUpdateApartment = (updated) => {
    setApartments(prev => prev.map(a => a.id === updated.id ? updated : a));
  };
  const handleDeleteApartment = (id) => {
    setApartments(prev => prev.filter(a => a.id !== id));
    setSavedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
  };

  // --- Filter logic ---
  const filteredApartments = apartments.filter(apt => {
    if (filters.minPrice && apt.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && apt.price > Number(filters.maxPrice)) return false;
    if (filters.rooms !== 'Any') {
      if (filters.rooms === '4+') { if (apt.beds < 4) return false; }
      else if (apt.beds !== Number(filters.rooms)) return false;
    }
    return true;
  });

  // --- View rendering ---
  if (detailApartment) {
    return (
      <ApartmentDetailView
        apartment={detailApartment}
        onBack={closeDetail}
        isSaved={savedIds.has(detailApartment.id)}
        onToggleSave={() => toggleSaved(detailApartment.id)}
        originLabel={detailOrigin === 'properties' ? 'All Properties' : detailOrigin === 'saved' ? 'Saved Homes' : 'Map'}
      />
    );
  }

  if (isSavedOpen) {
    return (
      <SavedApartmentsView
        apartments={apartments.filter(a => savedIds.has(a.id))}
        onBack={() => setIsSavedOpen(false)}
        onViewDetails={(apt) => openDetail(apt, 'saved')}
        onToggleSave={toggleSaved}
      />
    );
  }

  if (isAdminOpen) {
    return (
      <AdminInterface
        apartments={apartments}
        onBack={() => setIsAdminOpen(false)}
        onAddApartment={handleAddApartment}
        onUpdateApartment={handleUpdateApartment}
        onDeleteApartment={handleDeleteApartment}
      />
    );
  }

  if (currentView === 'properties') {
    return (
      <>
        <AllPropertiesView
          apartments={filteredApartments}
          onBack={() => setCurrentView('landing')}
          onViewDetails={(apt) => openDetail(apt, 'properties')}
          onOpenFilters={() => setIsFiltersOpen(true)}
          savedIds={savedIds}
          onToggleSave={toggleSaved}
        />
        <FiltersPanel
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          filters={filters}
          apartments={apartments}
          onApply={handleApplyFilters}
          onClear={() => { setFilters(DEFAULT_FILTERS); setIsFiltersOpen(false); }}
        />
      </>
    );
  }

  return (
    <div className="app-layout">
      {currentView !== 'landing' && (
        <CyberNavbar
          onOpenFilters={() => setIsFiltersOpen(true)}
          onOpenSaved={() => setIsSavedOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenHome={() => setCurrentView('landing')}
          onExploreMap={() => setCurrentView('map')}
          currentView={currentView}
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          savedCount={savedIds.size}
        />
      )}

      <FiltersPanel
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        apartments={apartments}
        onApply={handleApplyFilters}
        onClear={() => { setFilters(DEFAULT_FILTERS); setIsFiltersOpen(false); }}
      />

      {selectedApartment && currentView === 'map' && (
        <ApartmentPreviewCard
          apartment={selectedApartment}
          onClose={() => setSelectedApartment(null)}
          onViewDetails={(apt) => openDetail(apt, 'map')}
          isSaved={savedIds.has(selectedApartment.id)}
          onToggleSave={() => toggleSaved(selectedApartment.id)}
        />
      )}

      {currentView === 'landing' ? (
        <LandingView
          onExplore={() => setCurrentView('map')}
          onViewAll={() => setCurrentView('properties')}
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        />
      ) : (
        <div className="map-container">
          <MapContainer center={defaultPosition} zoom={13} scrollWheelZoom={true} zoomControl={false} style={{ width: '100%', height: '100%' }}>
            <ZoomControl position="bottomright" />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredApartments.map(apt => (
              <Marker
                key={apt.id}
                position={apt.coords}
                eventHandlers={{ click: () => setSelectedApartment(apt) }}
              />
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}

export default App;
