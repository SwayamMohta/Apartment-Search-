import { Sun, Moon, Compass } from 'lucide-react';
import './LandingNavbar.css';

export default function LandingNavbar({ onOpenHome, onExploreMap, theme, onToggleTheme }) {
  return (
    <nav className="ai-navbar">
      <div className="ai-navbar-left" onClick={onOpenHome}>
        <Compass size={20} className="logo-icon" strokeWidth={1.5} />
        <span className="ai-logo-text">Aura</span>
      </div>

      <div className="ai-navbar-right">
        <button className="ai-nav-link" onClick={onExploreMap}>Explore Map</button>
        <button className="ai-nav-link theme-toggle" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
        </button>
        <button className="ai-nav-btn">Sign In</button>
      </div>
    </nav>
  );
}
