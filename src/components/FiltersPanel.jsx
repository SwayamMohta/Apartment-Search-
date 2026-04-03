import { useState, useMemo } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';
import './FiltersPanel.css';

const DEFAULT_FILTERS = { minPrice: '', maxPrice: '', rooms: 'Any', amenities: [] };

export default function FiltersPanel({ 
  isOpen, 
  onClose, 
  filters = DEFAULT_FILTERS, 
  apartments = [], 
  onApply, 
  onClear 
}) {
  // Local draft state — only pushed to parent on Apply
  const [draft, setDraft] = useState(filters);

  // Calculate live results based on draft state
  const liveCount = useMemo(() => {
    return apartments.filter(apt => {
      // Price
      if (draft.minPrice && apt.price < Number(draft.minPrice)) return false;
      if (draft.maxPrice && apt.price > Number(draft.maxPrice)) return false;
      // Rooms
      if (draft.rooms !== 'Any') {
        if (draft.rooms === '4+') {
          if (apt.beds < 4) return false;
        } else if (apt.beds !== Number(draft.rooms)) return false;
      }
      // Amenities
      if (draft.amenities.length > 0) {
        if (!draft.amenities.every(a => apt.amenities.includes(a))) return false;
      }
      return true;
    }).length;
  }, [draft, apartments]);

  const toggleAmenity = (amenity) => {
    setDraft(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="filters-overlay-premium" onClick={onClose} />
      <div className="filters-panel-premium glass-panel-ultra">
        
        {/* Header Section */}
        <div className="premium-header">
          <div className="premium-header-left">
            <SlidersHorizontal size={18} className="accent-icon" />
            <h1>Filters</h1>
          </div>
          <button className="icon-btn-clean" onClick={onClose} aria-label="Close filters">
            <X size={20} />
          </button>
        </div>

        <div className="filters-scroll-area">
          
          {/* Price Range Section */}
          <div className="section-premium">
            <div className="section-title-group">
              <span className="label-technical">01. Cost Parameters</span>
              <h3 className="section-heading">Price Range</h3>
              <p className="section-description">Monthly budget in Indian Rupees (₹)</p>
            </div>
            
            <div className="price-inputs-grid">
              <div className="premium-input-box">
                <span className="input-icon">₹</span>
                <div className="input-stack">
                  <label htmlFor="min-price">Minimum</label>
                  <input
                    id="min-price"
                    type="number"
                    placeholder="E.g. 2000"
                    value={draft.minPrice}
                    onChange={(e) => setDraft(prev => ({ ...prev, minPrice: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="price-connector-line">
                <div className="line"></div>
                <span>TO</span>
                <div className="line"></div>
              </div>
              
              <div className="premium-input-box">
                <span className="input-icon">₹</span>
                <div className="input-stack">
                  <label htmlFor="max-price">Maximum</label>
                  <input
                    id="max-price"
                    type="number"
                    placeholder="E.g. 8000"
                    value={draft.maxPrice}
                    onChange={(e) => setDraft(prev => ({ ...prev, maxPrice: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="section-divider" />

          {/* Bedrooms Section */}
          <div className="section-premium">
            <div className="section-title-group">
              <span className="label-technical">02. Spatial Config</span>
              <h3 className="section-heading">Bedrooms</h3>
              <p className="section-description">Preferred unit configuration</p>
            </div>
            
            <div className="segmented-control">
              {['Any', '1', '2', '3', '4+'].map(r => (
                <button
                  key={r}
                  className={`segment-item ${draft.rooms === r ? 'active' : ''}`}
                  onClick={() => setDraft(prev => ({ ...prev, rooms: r }))}
                >
                  <span className="segment-text">{r}</span>
                  {draft.rooms === r && <div className="active-glow" />}
                </button>
              ))}
            </div>
          </div>

          <div className="section-divider" />

          {/* Amenities Section */}
          <div className="section-premium">
            <div className="section-title-group">
              <span className="label-technical">03. Lifestyle Features</span>
              <h3 className="section-heading">Amenities</h3>
              <p className="section-description">Must-have features for your new home</p>
            </div>
            
            <div className="amenities-card-grid">
              {['Parking', 'Gym', 'Pool', 'Pet Friendly', 'Balcony', 'Smart Home'].map(a => (
                <label key={a} className={`amenity-card ${draft.amenities.includes(a) ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    className="hidden-check"
                    checked={draft.amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  <div className="card-content">
                    <div className="custom-check-box">
                      {draft.amenities.includes(a) && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="amenity-label">{a}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          {/* Extra bottom padding for scroll area */}
          <div style={{ height: '24px' }} />
        </div>

        {/* Sticky Footer */}
        <div className="filters-footer-premium">
          <button className="btn-secondary-premium" onClick={() => { setDraft(DEFAULT_FILTERS); onClear && onClear(); }}>
            Reset All
          </button>
          <button className="btn-primary-premium" onClick={() => onApply && onApply(draft)}>
            Show {liveCount} {liveCount === 1 ? 'Property' : 'Properties'}
          </button>
        </div>
      </div>
    </>
  );
}
