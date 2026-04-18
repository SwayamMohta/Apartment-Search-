import { useState } from 'react';
import { Heart, X, Star, Bed, Bath, Maximize } from 'lucide-react';
import './ApartmentPreviewCard.css';

const getImageUrl = (image) => {
  if (!image) return null;
  if (typeof image === 'string') return image;
  return image.url || null;
};

export default function ApartmentPreviewCard({ apartment, onClose, onViewDetails, isSaved, onToggleSave, isEmbedded }) {
  const [imgError, setImgError] = useState(false);
  
  if (!apartment) return null;

  const fallbackImage = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800";
  const coverImage = apartment.images?.find(img => img?.is_cover) || apartment.images?.[0];
  const imageSrc = imgError ? fallbackImage : (getImageUrl(coverImage) || getImageUrl(apartment.image) || fallbackImage);

  // De-duplicate POIs by type
  const uniquePois = [];
  const handledTypes = new Set();
  
  if (apartment.topPois) {
    for (const poi of apartment.topPois) {
      if (!handledTypes.has(poi.type) && uniquePois.length < 3) {
        handledTypes.add(poi.type);
        uniquePois.push(poi);
      }
    }
  }

  const content = (
    <div className={`listing-strip ${isEmbedded ? 'embedded' : ''}`}>
      <div className="strip-image-section">
        <img 
          src={imageSrc} 
          alt={apartment.title} 
          className="strip-image"
          onError={() => setImgError(true)}
        />
        <button
          className={`strip-like-btn ${isSaved ? 'is-saved' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleSave && onToggleSave(apartment.id); }}
          title={isSaved ? 'Remove from saved' : 'Save property'}
        >
          <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        {!isEmbedded && onClose && (
          <button className="strip-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        )}
      </div>

      <div className="strip-info-section">
        <div className="strip-header">
          <div className="title-group">
            <h3 className="strip-title">{apartment.title}</h3>
            <p className="strip-location">{apartment.locality || apartment.location}</p>
          </div>
          <div className="strip-rating">
            <Star size={14} className="star-icon" fill="currentColor" />
            <span>{apartment.rating || "4.5"}</span>
          </div>
        </div>

        <div className="strip-details">
          <div className="detail-pill">
            <Bed size={14} />
            <span>{apartment.beds} Beds</span>
          </div>
          <div className="detail-pill">
            <Bath size={14} />
            <span>{apartment.baths} Baths</span>
          </div>
          <div className="detail-pill">
            <Maximize size={14} />
            <span>{apartment.area || apartment.areaSqft || 0} sqft</span>
          </div>
        </div>

        {uniquePois.length > 0 && (
          <div className="strip-pois">
            {uniquePois.map(poi => (
              <span key={poi.id || poi.type} className="poi-tag">
                {poi.name ? poi.name : poi.type} &bull; {poi.distanceKm}km
              </span>
            ))}
          </div>
        )}

        <div className="strip-footer">
          <div className="strip-price">
            <span className="amount">&#8377;{apartment.price.toLocaleString()}</span>
            <span className="period">/month</span>
          </div>
          <button className="strip-view-btn" onClick={() => onViewDetails && onViewDetails(apartment)}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
  
  if (isEmbedded) {
    return content;
  }

  return (
    <div className="preview-card">
      {content}
    </div>
  );
}
