import { useState, useEffect } from 'react';
import { Home, Map, Heart, SlidersHorizontal, Settings, Sun, Moon } from 'lucide-react';
import './CyberNavbar.css';

const NAV_ITEMS = [
  { id: 'home',    label: 'Home',    icon: Home },
  { id: 'explore', label: 'Map',     icon: Map },
  { id: 'filters', label: 'Filters', icon: SlidersHorizontal },
  { id: 'saved',   label: 'Saved',   icon: Heart },
  { id: 'admin',   label: 'Admin',   icon: Settings },
];

export default function CyberNavbar({ onOpenFilters, onOpenSaved, onOpenAdmin, onOpenHome, onExploreMap, currentView, theme, onToggleTheme, savedCount = 0 }) {
  const [activeId, setActiveId] = useState('home');

  useEffect(() => {
    if (currentView === 'landing') setActiveId('home');
    else if (currentView === 'map') setActiveId('explore');
  }, [currentView]);

  const handleClick = (id) => {
    if (id === 'home')    { setActiveId('home');    onOpenHome(); }
    if (id === 'explore') { setActiveId('explore'); onExploreMap(); }
    if (id === 'filters') { onOpenFilters(); }   // don't change activeId — stays on current view
    if (id === 'saved')   { onOpenSaved(); }
    if (id === 'admin')   { onOpenAdmin(); }
  };

  return (
    <div className="minimal-navbar-container">
      <nav className="minimal-navbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          const showBadge = item.id === 'saved' && savedCount > 0;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`nav-btn ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon-wrapper">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                {showBadge && <span className="nav-badge">{savedCount}</span>}
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}

        <div className="nav-divider" />

        <button className="nav-btn" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={20} strokeWidth={1.75} /> : <Moon size={20} strokeWidth={1.75} />}
          <span className="nav-label">Theme</span>
        </button>
      </nav>
    </div>
  );
}
