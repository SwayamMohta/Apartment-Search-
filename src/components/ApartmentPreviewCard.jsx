import { Heart, X, Star, Bed, Bath, Maximize } from 'lucide-react';
import './ApartmentPreviewCard.css';

export default function ApartmentPreviewCard({ apartment, onClose, onViewDetails, isSaved, onToggleSave, isEmbedded }) {
  if (!apartment) return null;

  return (
    <div className="preview-card">
      <div className="card-image-wrapper">
        <img src={apartment.images?.[0] || apartment.image} alt={apartment.title} className="card-image" />
        <button
          className={`icon-btn-abs like-btn ${isSaved ? 'liked' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleSave && onToggleSave(apartment.id); }}
          title={isSaved ? 'Remove from saved' : 'Save property'}
        >
          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        {!isEmbedded && onClose && (
          <button className="icon-btn-abs close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        )}
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{apartment.title}</h3>
          <div className="rating">
            <Star size={14} className="star-icon" fill="currentColor" />
            <span>{apartment.rating}</span>
          </div>
        </div>

        <p className="card-location">{apartment.location}</p>

        <div className="card-specs">
          <div className="spec-item">
            <Bed size={16} />
            <span>{apartment.beds} Beds</span>
          </div>
          <div className="spec-item">
            <Bath size={16} />
            <span>{apartment.baths} Baths</span>
          </div>
          <div className="spec-item">
            <Maximize size={16} />
            <span>{apartment.area} sqft</span>
          </div>
        </div>

        <div className="card-footer">
          <div className="price-container">
            <span className="price">₹{apartment.price.toLocaleString()}</span>
            <span className="price-period">/mo</span>
          </div>
          <button className="view-btn" onClick={() => onViewDetails && onViewDetails(apartment)}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
