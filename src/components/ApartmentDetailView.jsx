import { useState } from 'react';
import { ArrowLeft, Share, Heart, MapPin, Wifi, ShieldCheck, Car, Waves, Leaf, Zap, Eye, Dumbbell, Building } from 'lucide-react';
import './ApartmentDetailView.css';

// Map common amenity keywords to icons
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

function getAmenityIcon(amenity) {
  const lower = amenity.toLowerCase();
  for (const [key, Icon] of Object.entries(AMENITY_ICONS)) {
    if (lower.includes(key)) return Icon;
  }
  return AMENITY_ICONS.default;
}

export default function ApartmentDetailView({ apartment, onBack, isSaved, onToggleSave, originLabel = 'Map' }) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  if (!apartment) return null;

  const images = apartment.images || [apartment.image, apartment.image, apartment.image];

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
    <div className="detail-view-container">
      <header className="premium-header">
        <div className="premium-header-left">
          <button className="icon-btn-clean" onClick={onBack}>
            <ArrowLeft size={18} />
            <span>Back to {originLabel}</span>
          </button>
          <h1>Property Details</h1>
        </div>
        <div className="premium-header-right">
          <div className="nav-actions">
            <button className="icon-btn-clean" title="Share" onClick={() => navigator.share?.({ title: apartment.title, url: window.location.href }).catch(() => {})}>
              <Share size={18} />
            </button>
            <button
              className={`icon-btn-clean ${isSaved ? 'saved-active' : ''}`}
              title={isSaved ? 'Remove from saved' : 'Save property'}
              onClick={onToggleSave}
            >
              <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </header>

      <div className="detail-content">
        <div className="image-gallery">
          <img src={images[0]} alt="Main view" className="main-image" />
          <div className="side-images">
            <img src={images[1]} alt="Interior view" />
            <img src={images[2]} alt="Additional view" />
          </div>
        </div>

        <div className="detail-body">
          <div className="main-info">
            <h1 className="title">{apartment.title}</h1>
            <div className="location-row">
              <MapPin size={16} />
              <span>{apartment.location}</span>
            </div>
            <div className="key-specs">
              <div className="spec"><strong>{apartment.beds}</strong> Beds</div>
              <div className="spec divider"></div>
              <div className="spec"><strong>{apartment.baths}</strong> Baths</div>
              <div className="spec divider"></div>
              <div className="spec"><strong>{apartment.area.toLocaleString()}</strong> sqft</div>
            </div>

            <section className="description-section">
              <h2>About this place</h2>
              <p>{apartment.description || 'A premium apartment in a sought-after location. Enquire for more details.'}</p>
            </section>

            {apartment.amenities?.length > 0 && (
              <section className="amenities-section">
                <h2>What this place offers</h2>
                <div className="amenities-grid-large">
                  {apartment.amenities.map(amenity => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div key={amenity} className="amenity">
                        <Icon size={18} strokeWidth={1.5} />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <div className="booking-sidebar">
            <div className="booking-card glass-panel">
              <div className="price-header">
                <h2>₹{apartment.price.toLocaleString()}<span>/month</span></h2>
              </div>
              <button className="btn-primary w-full" onClick={() => setShowContactModal(true)}>
                Contact Agent
              </button>
              <button className="btn-secondary w-full mt-sm" onClick={() => setShowContactModal(true)}>
                Schedule Tour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="contact-modal glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Get in Touch</h2>
              <button className="icon-btn-clean" onClick={() => setShowContactModal(false)}>✕</button>
            </div>
            {contactSent ? (
              <div className="contact-success">
                <div className="success-icon">✓</div>
                <h3>Message Sent!</h3>
                <p>An agent will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="contact-form">
                <p className="modal-property-name">{apartment.title} — {apartment.location}</p>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your name"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    required
                    value={contactForm.email}
                    onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="I'm interested in this property..."
                    value={contactForm.message}
                    onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                  />
                </div>
                <button type="submit" className="btn-primary w-full">Send Message</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
