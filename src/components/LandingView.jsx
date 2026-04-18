import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './LandingView.css';

// Create custom editorial markers for the landing preview
const createPinIcon = (price) => {
  return L.divIcon({
    className: 'custom-editorial-marker landing-marker',
    html: `<div class="marker-dot"><span>&#8377;${price}</span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const PREVIEW_PINS = [
  { id: 1, pos: [17.4312, 78.4068], price: '3,400', title: 'Luxury Villa', desc: 'Jubilee Hills', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=200' },
  { id: 2, pos: [17.4156, 78.4357], price: '5,200', title: 'Premium Apt', desc: 'Banjara Hills', img: 'https://images.unsplash.com/photo-1502672260266-1c1de2d9d06b?auto=format&fit=crop&q=80&w=200' },
  { id: 3, pos: [17.4435, 78.3772], price: '2,850', title: 'Modern Studio', desc: 'HITEC City', img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=200' },
];

function SlowPanMap() {
  const map = useMap();
  useEffect(() => {
    map.scrollWheelZoom.disable();
    let frame;
    const animate = () => {
      map.panBy([0.1, 0.05], { animate: false });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [map]);
  return null;
}

export default function LandingView({ onExplore, onViewAll }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const goExplore = () => onExplore ? onExplore() : navigate('/explore');
  const goDiscover = () => onViewAll ? onViewAll() : navigate('/discover');

  return (
    <div className="editorial-landing">
      <main className="landing-main">
        <section className="hero-section">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="hero-category">Collection 2026</span>
            <h1 className="hero-title">Refined Living. Intelligently Curated.</h1>
            <p className="hero-description">
              A bespoke collection of Hyderabad's most sophisticated apartments, 
              designed for those who appreciate architectural intent.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={goExplore}>Explore Collection</button>
              <button className="btn-secondary" onClick={goDiscover}>View Gallery</button>
            </div>
          </motion.div>
 
          <motion.div 
            className="hero-media"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <div className="media-container glass-panel">
              <div className="media-header">
                <div className="media-indicator">Live View</div>
                <div className="media-location"><Search size={12} /> Jubilee Hills, Hyderabad</div>
              </div>
              <MapContainer center={[17.4330, 78.4060]} zoom={13} zoomControl={false} attributionControl={false} className="landing-map">
                <TileLayer url={isDark 
                  ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                } />
                <SlowPanMap />
                {PREVIEW_PINS.map(pin => (
                  <Marker key={pin.id} position={pin.pos} icon={createPinIcon(pin.price)} />
                ))}
              </MapContainer>
            </div>
          </motion.div>
        </section>

        <section className="feature-spread">
          <div className="spread-item">
            <h2>01</h2>
            <div className="spread-content">
              <h3>Precision Search</h3>
              <p>Filter by architecture, light exposure, and proximity to cultural landmarks.</p>
            </div>
          </div>
          <div className="spread-item">
            <h2>02</h2>
            <div className="spread-content">
              <h3>Verified Spaces</h3>
              <p>Every listing is physically audited for light quality and spatial efficiency.</p>
            </div>
          </div>
          <div className="spread-item">
            <h2>03</h2>
            <div className="spread-content">
              <h3>Direct Access</h3>
              <p>Connect instantly with verified agents and property curators.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="editorial-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="logo-text">Elevé</span>
            <p>&copy; 2026 Architectural Collective</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <label>Explore</label>
              <a href="#" onClick={(e) => { e.preventDefault(); goExplore(); }}>Map View</a>
              <a href="#" onClick={(e) => { e.preventDefault(); goDiscover(); }}>Gallery</a>
            </div>
            <div className="link-group">
              <label>Collective</label>
              <a href="#">About</a>
              <a href="#">Curation</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
