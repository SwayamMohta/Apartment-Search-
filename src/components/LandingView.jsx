import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import LandingNavbar from './LandingNavbar';
import './LandingView.css';

// Create exact same HTML as previous static design, but now as Leaflet icons
const createPinIcon = (price, title, desc, img) => {
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div class="preview-pin">
        <div class="pulse-dot"></div>
        <div class="pin-label">₹${price}</div>
        <div class="hover-card">
          <img src="${img}" alt="Apt" />
          <div class="hover-card-content">
            <div class="hc-price">₹${price}</div>
            <h4>${title}</h4>
            <p>${desc}</p>
          </div>
        </div>
      </div>
    `,
    iconSize: [0, 0], // Sizing handled by CSS
    iconAnchor: [0, 0]
  });
};

const PREVIEW_PINS = [
  { id: 1, pos: [17.4312, 78.4068], price: '3,400', title: 'Luxury Villa', desc: 'Jubilee Hills', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=200' },
  { id: 2, pos: [17.4156, 78.4357], price: '5,200', title: 'Premium Apt', desc: 'Banjara Hills', img: 'https://images.unsplash.com/photo-1502672260266-1c1de2d9d06b?auto=format&fit=crop&q=80&w=200' },
  { id: 3, pos: [17.4435, 78.3772], price: '2,850', title: 'Modern Studio', desc: 'HITEC City', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=200' },
  { id: 4, pos: [17.4483, 78.3915], price: '4,100', title: 'Designer Loft', desc: 'Madhapur', img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=200' },
  { id: 5, pos: [17.4250, 78.4150], price: '2,500', title: 'Cozy 1BR', desc: 'Jubilee Hills', img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=200' },
  { id: 6, pos: [17.4080, 78.4420], price: '4,800', title: 'Skyline Penthouse', desc: 'Banjara Hills', img: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=200' },
  { id: 7, pos: [17.4380, 78.3850], price: '3,100', title: 'Urban Condo', desc: 'Madhapur', img: 'https://images.unsplash.com/photo-1484154218962-a420fd7c04a4?auto=format&fit=crop&q=80&w=200' },
  { id: 8, pos: [17.4520, 78.3700], price: '2,900', title: 'Minimalist Suite', desc: 'Kondapur', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=200' },
  { id: 9, pos: [17.4450, 78.3650], price: '3,600', title: 'Tech Hub Apt', desc: 'Gachibowli', img: 'https://images.unsplash.com/photo-1512914890251-259720564e05?auto=format&fit=crop&q=80&w=200' },
  { id: 10, pos: [17.4350, 78.3950], price: '4,500', title: 'Spacious 3BR', desc: 'Jubilee Hills', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=200' },
  { id: 11, pos: [17.4100, 78.4500], price: '2,200', title: 'City View Flat', desc: 'Somajiguda', img: 'https://images.unsplash.com/photo-1542314831-c6a4d14d23e0?auto=format&fit=crop&q=80&w=200' },
  { id: 12, pos: [17.4200, 78.4600], price: '3,200', title: 'Riverside Apt', desc: 'Begumpet', img: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=200' },
  { id: 13, pos: [17.4600, 78.3800], price: '2,750', title: 'Quiet Retreat', desc: 'Kondapur', img: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=200' },
  { id: 14, pos: [17.4280, 78.4200], price: '3,900', title: 'Elegant Duplex', desc: 'Jubilee Hills', img: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=200' },
  { id: 15, pos: [17.4400, 78.3900], price: '4,400', title: 'Modern Flat', desc: 'Madhapur', img: 'https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&q=80&w=200' },
  { id: 16, pos: [17.4150, 78.4450], price: '5,000', title: 'Luxury Suite', desc: 'Banjara Hills', img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=200' },
  { id: 17, pos: [17.4550, 78.3600], price: '3,300', title: 'Campus View', desc: 'Gachibowli', img: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=200' },
  { id: 18, pos: [17.4050, 78.4350], price: '2,600', title: 'Vintage Apt', desc: 'Banjara Hills', img: 'https://images.unsplash.com/photo-1484154218962-a420fd7c04a4?auto=format&fit=crop&q=80&w=200' },
  { id: 19, pos: [17.4320, 78.3800], price: '3,500', title: 'Contemporary Flat', desc: 'Madhapur', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=200' },
];

function SlowPanMap() {
  const map = useMap();
  useEffect(() => {
    // Disable scroll zoom for the preview so it doesn't hijack page scroll
    map.scrollWheelZoom.disable();
    
    // Very slow continuous pan to simulate "live" feel
    let frame;
    let offset = 0;
    const animate = () => {
      offset += 0.05;
      map.panBy([0.1, 0.05], { animate: false });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(frame);
  }, [map]);
  return null;
}

export default function LandingView({ onExplore, onViewAll, theme, onToggleTheme }) {
  return (
    <div className="ai-landing">
      {/* 1. Minimal Navbar */}
      <LandingNavbar 
        onOpenHome={() => window.scrollTo(0,0)} 
        onExploreMap={onExplore}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* 2. Hero Section (Main Focus) */}
      <main className="ai-hero-section">
        <div className="ai-hero-container">
          
          {/* Left Text */}
          <motion.div 
            className="ai-hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="ai-hero-headline">
              Find a home that<br/>tells your story.
            </h1>
            <p className="ai-hero-subtext">
              The intelligent approach to discovering premium apartments. Explore visually and without the clutter
            </p>
            
            <div className="ai-hero-actions">
              <button className="ai-btn-primary" onClick={onExplore}>
                Explore Map
              </button>
              <button className="ai-btn-secondary" onClick={onViewAll}>
                View Listings
              </button>
            </div>
          </motion.div>

          {/* Right Product Preview */}
          <motion.div 
            className="ai-hero-preview-wrapper"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ai-hero-preview glass-panel">
              <div className="preview-top-bar">
                <div className="preview-search">
                  <Search size={14} className="preview-icon" />
                  <span>Hyderabad, TS</span>
                </div>
                <div className="preview-pill">Filters</div>
              </div>
              
              <div className="preview-map-area">
                <MapContainer 
                  center={[17.4330, 78.4060]} 
                  zoom={13} 
                  zoomControl={false}
                  attributionControl={false}
                  className="hero-leaflet-map"
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  <SlowPanMap />
                  
                  {PREVIEW_PINS.map(pin => (
                    <Marker 
                      key={pin.id} 
                      position={pin.pos} 
                      icon={createPinIcon(pin.price, pin.title, pin.desc, pin.img)} 
                    />
                  ))}
                </MapContainer>
              </div>
            </div>
            
            {/* Ambient Background Glows */}
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>
          </motion.div>

        </div>
      </main>

      {/* 3. Clean Footer */}
      <motion.footer 
        className="ai-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="ai-footer-content">
          <div className="footer-links-left">
            <span>&copy; 2026 Aura Inc.</span>
          </div>
          <div className="footer-links-right">
            <a href="#">Product</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
