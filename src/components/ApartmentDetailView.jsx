// src/components/ApartmentDetailView.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share, Heart, MapPin, Wifi, ShieldCheck, Car, Waves, Leaf, Zap, Eye, Dumbbell, Building, GraduationCap, School, Map as MapIcon, Coffee, Star, X } from 'lucide-react';
import { getNearbyPois } from '../api/apartments';
import './ApartmentDetailView.css';

const AMENITY_ICONS = {
  'wifi': Wifi, 'internet': Wifi, 'fiber': Wifi,
  'security': ShieldCheck, '24/7': ShieldCheck,
  'parking': Car, 'valet': Car, 'ev': Car,
  'pool': Waves, 'spa': Waves,
  'garden': Leaf, 'pet': Leaf, 'quiet': Leaf, 'lake': Leaf,
  'smart': Zap, 'ev charging': Zap, 'rooftop': Zap,
  'view': Eye, 'skyline': Eye, 'city view': Eye, 'panoramic': Eye,
  'gym': Dumbbell,
  'default': Building,
};

const POI_ICONS = {
  'university': GraduationCap,
  'college': GraduationCap,
  'school': School,
  'cafe': Coffee,
  'restaurant': Coffee,
  'default': MapIcon
};

function getIcon(name, map) {
  const lower = name.toLowerCase();
  for (const [key, Icon] of Object.entries(map)) {
    if (lower.includes(key)) return Icon;
  }
  return map.default;
}

export default function ApartmentDetailView({ apartment, onBack, isSaved, onToggleSave, originLabel = 'Map' }) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactMode, setContactMode] = useState('enquiry'); // 'enquiry' or 'tour'
  const [pois, setPois] = useState([]);
  const [loadingPois, setLoadingPois] = useState(true);

  useEffect(() => {
    const fetchPois = async () => {
      try {
        const result = await getNearbyPois(apartment.id);
        setPois(result);
      } catch (err) {
        console.error('Failed to fetch POIs', err);
      } finally {
        setLoadingPois(false);
      }
    };
    fetchPois();
  }, [apartment.id]);

  if (!apartment) return null;

  const images = apartment.images?.map(img => typeof img === 'string' ? img : img.url) || [];
  
  // Ensure we always have at least 3 images for the asymmetrical gallery
  const galleryImages = [...images];
  const placeholders = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"
  ];
  
  while (galleryImages.length < 3) {
    galleryImages.push(placeholders[galleryImages.length % placeholders.length]);
  }

  const mainImage = galleryImages[0];

  const handleContact = (e) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setShowContactModal(false);
      setContactSent(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="editorial-detail-view"
    >
      <header className="premium-header">
        <div className="premium-header-left">
          <button className="icon-btn-clean" onClick={onBack}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <div className="breadcrumb-nav">
            <span className="breadcrumb-item">Gallery</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item">{originLabel}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-active">{apartment.title}</span>
          </div>
        </div>
        <div className="premium-header-right">
          <div className="detail-actions">
            <button className="icon-btn-clean" onClick={() => navigator.share?.({ title: apartment.title, url: window.location.href }).catch(() => {})}>
              <Share size={18} />
            </button>
            <button
              className={`icon-btn-clean ${isSaved ? 'is-saved' : ''}`}
              onClick={onToggleSave}
            >
              <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </header>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="asymmetrical-gallery">
            <div className="gallery-primary">
              <img src={mainImage} alt="Main facade" />
            </div>
            <div className="gallery-secondary">
              {galleryImages.slice(1, 3).map((img, i) => (
                <div key={i} className="gallery-item">
                  <img src={img} alt={`Interior detail ${i + 1}`} />
                </div>
              ))}
            </div>
          </section>

          <section className="profile-header-section">
            <div className="profile-meta">
              <div className="rating-tag">
                <Star size={14} fill="currentColor" />
                <span>{apartment.rating || "4.8"} Curator Choice</span>
              </div>
              <h1 className="profile-title">{apartment.title}</h1>
              <div className="profile-location">
                <MapPin size={16} />
                <span>{apartment.location}</span>
              </div>
            </div>
            
            <div className="profile-quick-specs">
              <div className="spec-block">
                <label>Size</label>
                <span>{apartment.area?.toLocaleString()} SQFT</span>
              </div>
              <div className="spec-block">
                <label>Rooms</label>
                <span>{apartment.beds} Bedrooms</span>
              </div>
              <div className="spec-block">
                <label>Baths</label>
                <span>{apartment.baths} Full Baths</span>
              </div>
            </div>
          </section>

          <div className="profile-grid">
            <div className="grid-main-content">
              <section className="editorial-section">
                <h2>The Space</h2>
                <p className="editorial-description">
                  {apartment.description || 'A thoughtfully designed residence in one of Hyderabad\'s most coveted districts, offering a harmonious blend of architectural precision and lifestyle convenience.'}
                </p>
              </section>

              {apartment.amenities?.length > 0 && (
                <section className="editorial-section">
                  <h2>Curated Amenities</h2>
                  <div className="amenities-list">
                    {apartment.amenities.map(amenity => {
                      const Icon = getIcon(amenity, AMENITY_ICONS);
                      return (
                        <div key={amenity} className="amenity-item">
                          <Icon size={18} strokeWidth={1.5} />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="editorial-section">
                <h2>Neighborhood Context</h2>
                {loadingPois ? (
                  <div className="neighborhood-loading">Analyzing surroundings...</div>
                ) : pois.length > 0 ? (
                  <div className="neighborhood-grid">
                    {Object.entries({
                      'Health':     pois.filter(p => ['hospital', 'clinic', 'pharmacy', 'doctors'].includes(p.type) && p.name),
                      'Education':  pois.filter(p => ['college', 'school', 'university'].includes(p.type) && p.name),
                      'Transit':    pois.filter(p => ['train_station', 'bus_station', 'transit', 'subway_entrance', 'railway'].includes(p.type) && p.name),
                      'Dining':     pois.filter(p => ['cafe', 'restaurant', 'fast_food', 'food_court'].includes(p.type) && p.name),
                      'Landmarks':  pois.filter(p => ['temple', 'mosque', 'church', 'place_of_worship', 'park', 'library'].includes(p.type) && p.name),
                    }).filter(([_, items]) => items.length > 0).map(([category, items]) => {
                      const uniqueItems = Array.from(new Map(items.map(p => [p.name || p.type, p])).values()).slice(0, 3);
                      return (
                        <div key={category} className="neighborhood-group">
                          <h3>{category}</h3>
                          <div className="poi-stack">
                            {uniqueItems.map(poi => (
                              <div key={poi.id || poi.type} className="poi-row">
                                <span className="poi-label">{poi.name || poi.type}</span>
                                <span className="poi-distance">{poi.distanceKm}km</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="no-neighborhood-data">No major landmarks identified within the immediate radius.</p>
                )}
              </section>
            </div>

            <aside className="profile-sidebar">
              <div className="sidebar-booking glass-panel">
                <div className="booking-header">
                  <span className="price-label">Monthly Residence</span>
                  <div className="price-value">
                    &#8377;{apartment.price.toLocaleString()}
                    <span className="price-unit">/mo</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="btn-primary w-full" onClick={() => { setContactMode('enquiry'); setShowContactModal(true); }}>
                    Enquire Now
                  </button>
                  <button className="btn-secondary w-full" onClick={() => { setContactMode('tour'); setShowContactModal(true); }}>
                    Request Private Tour
                  </button>
                </div>
                <div className="booking-trust">
                  <ShieldCheck size={14} />
                  <span>Verified Architectural Asset</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

    <AnimatePresence>
      {showContactModal && (
        <div className="contact-modal-overlay">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="editorial-modal glass-panel"
          >
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-category">Engagement</span>
                <h2>{contactMode === 'tour' ? 'Request Private Tour' : 'Enquire Now'}</h2>
              </div>
              <button className="icon-btn-clean" onClick={() => setShowContactModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {contactSent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="success-feedback"
                >
                  <div className="success-icon">
                    <ShieldCheck size={48} />
                  </div>
                  <h3>Request Received</h3>
                  <p>Our curator will contact you within 24 hours to finalize the details.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleContact} className="editorial-form">
                  <div className="form-row-grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Jane Cooper"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="jane@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                  {contactMode === 'tour' && (
                    <div className="form-group">
                      <label>Preferred Date</label>
                      <input type="date" required className="date-input" />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Inquiry Details</label>
                    <textarea 
                      placeholder={contactMode === 'tour' ? "Mention any specific requirements for the tour..." : "Ask us anything about the property..."}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    {contactMode === 'tour' ? 'Schedule Tour' : 'Send Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </motion.div>
  );
}
