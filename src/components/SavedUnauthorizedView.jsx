import { Heart, User } from 'lucide-react';
import './SavedApartmentsView.css'; // Reusing some base styles if possible, but we'll add specific ones

export default function SavedUnauthorizedView({ onOpenLogin }) {
  return (
    <div className="saved-unauthorized-view">
      <div className="unauth-content glass-panel">
        <div className="unauth-icon-wrapper">
          <Heart size={48} strokeWidth={1} className="heart-icon-bg" />
          <User size={24} className="user-icon-overlay" />
        </div>
        
        <h1>Your collection awaits</h1>
        <p>Sign in to curate your private selection of Hyderabad's most sophisticated spaces and track your preferences across devices.</p>
        
        <button className="btn-primary" onClick={onOpenLogin}>
          Authenticate to View
        </button>
      </div>
    </div>
  );
}
