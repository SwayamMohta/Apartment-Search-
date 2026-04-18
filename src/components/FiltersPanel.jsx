import { useState, useMemo } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  // Local draft state only pushed to parent on Apply.
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="filters-overlay" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div 
            className="filters-panel spotlight-panel glass-panel"
            initial={{ opacity: 0, x: '-50%', y: '-48%' }}
            animate={{ opacity: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, x: '-50%', y: '-48%' }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <header className="premium-header">
              <div className="premium-header-left">
                <SlidersHorizontal size={18} />
                <h1>Refine Search</h1>
              </div>
              <button className="icon-btn-clean" onClick={onClose}>
                <X size={18} />
              </button>
            </header>

            <div className="filters-content">
              <section className="filter-section">
                <div className="section-head">
                  <h3>Price Range</h3>
                  <p>Monthly budget in INR</p>
                </div>
                
                <div className="price-grid">
                  <div className="input-field">
                    <label>Minimum</label>
                    <div className="input-with-icon">
                      <span>&#8377;</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={draft.minPrice}
                        onChange={(e) => setDraft(prev => ({ ...prev, minPrice: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="input-field">
                    <label>Maximum</label>
                    <div className="input-with-icon">
                      <span>&#8377;</span>
                      <input
                        type="number"
                        placeholder="Any"
                        value={draft.maxPrice}
                        onChange={(e) => setDraft(prev => ({ ...prev, maxPrice: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="filter-section">
                <div className="section-head">
                  <h3>Bedrooms</h3>
                  <p>Preferred unit configuration</p>
                </div>
                
                <div className="pill-control">
                  {['Any', '1', '2', '3', '4+'].map(r => (
                    <button
                      key={r}
                      className={`pill-item ${draft.rooms === r ? 'is-active' : ''}`}
                      onClick={() => setDraft(prev => ({ ...prev, rooms: r }))}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </section>

              <section className="filter-section">
                <div className="section-head">
                  <h3>Amenities</h3>
                  <p>Essential property features</p>
                </div>
                
                <div className="amenities-grid">
                  {['Parking', 'Gym', 'Pool', 'Pet Friendly', 'Balcony', 'Smart Home'].map(a => (
                    <label key={a} className={`amenity-tag ${draft.amenities.includes(a) ? 'is-checked' : ''}`}>
                      <input
                        type="checkbox"
                        className="hidden-input"
                        checked={draft.amenities.includes(a)}
                        onChange={() => toggleAmenity(a)}
                      />
                      <span>{a}</span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <div className="filters-footer">
              <button className="btn-secondary" onClick={() => { setDraft(DEFAULT_FILTERS); onClear && onClear(); }}>
                Reset
              </button>
              <button className="btn-primary flex-1" onClick={() => onApply && onApply(draft)}>
                Show {liveCount} {liveCount === 1 ? 'Property' : 'Properties'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
