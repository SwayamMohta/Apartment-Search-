import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, SlidersHorizontal, X } from 'lucide-react';
import ApartmentPreviewCard from './ApartmentPreviewCard';
import './AllPropertiesView.css';

export default function AllPropertiesView({ apartments, onBack, onViewDetails, onOpenFilters, savedIds = new Set(), onToggleSave }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApartments = apartments.filter(apt =>
    apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="all-properties-view"
    >
      <header className="premium-header">
        <div className="premium-header-left">
          <button className="icon-btn-clean" onClick={onBack}>
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1>All Properties</h1>
        </div>
        <div className="premium-header-right">
          <span className="subtitle">{filteredApartments.length} properties available</span>
        </div>
      </header>

      <div className="properties-controls">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')} title="Clear search">
              <X size={16} />
            </button>
          )}
        </div>
        <button className="filter-btn" onClick={onOpenFilters}>
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </button>
      </div>

      <div className="properties-grid">
        {filteredApartments.length > 0 ? (
          filteredApartments.map(apt => (
            <div key={apt.id} className="property-card-wrapper">
              <ApartmentPreviewCard
                apartment={apt}
                onViewDetails={onViewDetails}
                isEmbedded={true}
                isSaved={savedIds.has(apt.id)}
                onToggleSave={() => onToggleSave && onToggleSave(apt.id)}
              />
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No properties found{searchTerm ? ` matching "${searchTerm}"` : ''}.</p>
            {searchTerm && (
              <button className="clear-search-btn-lg" onClick={() => setSearchTerm('')}>
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
