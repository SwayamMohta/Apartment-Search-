// src/components/LandingNavbar.jsx
import { Sun, Moon, Compass, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LandingNavbar.css';

export default function LandingNavbar({ onOpenHome, onExploreMap, onOpenLogin }) {
  const { user, logout } = useAuth();

  return (
    <nav className="ai-navbar">
      <div className="ai-navbar-left" onClick={onOpenHome} style={{ cursor: 'pointer' }}>
        <Compass size={20} className="logo-icon" strokeWidth={1.5} />
        <span className="ai-logo-text">Aura</span>
      </div>

      <div className="ai-navbar-right">
        <button className="ai-nav-link" onClick={onExploreMap}>Explore Map</button>
        
        {user ? (
          <button className="ai-nav-btn logout" onClick={logout}>
            <span className="user-name">{user.full_name?.split(' ')[0]}</span>
            <User size={14} />
          </button>
        ) : (
          <button className="ai-nav-btn" onClick={onOpenLogin}>Sign In</button>
        )}
      </div>
    </nav>
  );
}
