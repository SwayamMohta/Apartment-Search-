import { useState } from 'react';
import { ArrowLeft, MapPin, Heart, ExternalLink } from 'lucide-react';
import './SavedApartmentsView.css';

export default function SavedApartmentsView({ apartments, onBack, onViewDetails, onToggleSave }) {
  return (
    <div className="saved-view-container">
      <header className="premium-header">
        <div className="premium-header-left">
          <button className="icon-btn-clean" onClick={onBack}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1>Saved Homes</h1>
        </div>
        <div className="premium-header-right">
          <span className="subtitle">{apartments.length} homes saved</span>
        </div>
      </header>

      {apartments.length === 0 ? (
        <div className="saved-empty">
          <Heart size={48} strokeWidth={1} />
          <h2>No saved homes yet</h2>
          <p>Tap the heart icon on any property to save it here.</p>
          <button className="back-btn" onClick={onBack}>Browse Properties</button>
        </div>
      ) : (
        <div className="saved-grid">
          {apartments.map(apt => (
            <div key={apt.id} className="saved-card glass-panel">
              <div className="saved-image-wrapper">
                <img src={apt.images?.[0] || apt.image} alt={apt.title} />
                <div className="price-badge">₹{apt.price.toLocaleString()}/mo</div>
                <button
                  className="saved-unsave-btn"
                  onClick={() => onToggleSave && onToggleSave(apt.id)}
                  title="Remove from saved"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>
              <div className="saved-info">
                <h3>{apt.title}</h3>
                <p className="location-text"><MapPin size={14} /> {apt.location}</p>
                <div className="saved-specs">
                  <span>{apt.beds} Beds</span> • <span>{apt.baths} Baths</span> • <span>{apt.area} sqft</span>
                </div>
                <button
                  className="view-details-btn"
                  onClick={() => onViewDetails && onViewDetails(apt)}
                >
                  <ExternalLink size={14} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
