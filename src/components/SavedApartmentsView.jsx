import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Heart, ExternalLink } from 'lucide-react';
import ApartmentPreviewCard from './ApartmentPreviewCard';
import './SavedApartmentsView.css';

export default function SavedApartmentsView({ apartments, onBack, onViewDetails, onToggleSave }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="saved-view"
    >
      <header className="premium-header">
        <div className="premium-header-left">
          <button className="icon-btn-clean back-btn" onClick={onBack} aria-label="Go back">
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1>Saved Collection</h1>
        </div>
        <div className="premium-header-right">
          <span className="subtitle">{apartments.length} homes in your collection</span>
        </div>
      </header>

      <div className="saved-container">
        {apartments.length === 0 ? (
          <div className="saved-empty-editorial">
            <Heart size={48} strokeWidth={0.5} className="empty-icon" />
            <h2>Your collection is empty</h2>
            <p>Curate your ideal living spaces by saving them to this private collection.</p>
            <button className="btn-primary" onClick={onBack}>Explore Gallery</button>
          </div>
        ) : (
          <div className="saved-list">
            {apartments.map(apt => (
              <ApartmentPreviewCard
                key={apt.id}
                apartment={apt}
                onViewDetails={onViewDetails}
                isEmbedded={true}
                isSaved={true}
                onToggleSave={() => onToggleSave && onToggleSave(apt.id)}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
