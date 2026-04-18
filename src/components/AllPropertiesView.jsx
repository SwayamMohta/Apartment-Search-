import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ApartmentPreviewCard from './ApartmentPreviewCard';
import './AllPropertiesView.css';

export default function AllPropertiesView({ apartments, onBack, onViewDetails, onOpenFilters, savedIds = new Set(), onToggleSave }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const filteredApartments = apartments.filter(apt =>
    apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="all-properties-view"
    >
      <header className="premium-header">
        <div className="premium-header-left">
          <button className="icon-btn-clean back-btn" onClick={handleBack} aria-label="Go back">
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1>Discover</h1>
        </div>
        <div className="premium-header-right">
          <span className="subtitle">{filteredApartments.length} properties curated</span>
        </div>
      </header>

      <div className="properties-container">
        <div className="control-bar">
          <div className="search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                <X size={14} />
              </button>
            )}
          </div>
          <button className="filter-trigger" onClick={onOpenFilters}>
            <SlidersHorizontal size={16} />
            <span>Refine Search</span>
          </button>
        </div>

        <div className="properties-list">
          {filteredApartments.length > 0 ? (
            filteredApartments.map(apt => (
              <ApartmentPreviewCard
                key={apt.id}
                apartment={apt}
                onViewDetails={onViewDetails}
                isEmbedded={true}
                isSaved={savedIds.has(apt.id)}
                onToggleSave={() => onToggleSave && onToggleSave(apt.id)}
              />
            ))
          ) : (
            <div className="no-results">
              <p>No properties found{searchTerm ? ` matching "${searchTerm}"` : ''}.</p>
              {searchTerm && (
                <button className="btn-secondary" onClick={() => setSearchTerm('')}>
                  Reset Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
