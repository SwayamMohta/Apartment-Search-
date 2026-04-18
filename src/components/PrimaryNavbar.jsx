// src/components/PrimaryNavbar.jsx
import { useState, useEffect } from 'react';
import { Home, Map, Heart, SlidersHorizontal, Settings, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './PrimaryNavbar.css';

export default function PrimaryNavbar({ 
  onOpenFilters, onOpenSaved, onOpenAdmin, onOpenHome, onExploreMap, 
  currentView, savedCount = 0, onOpenLogin 
}) {
  const [activeId, setActiveId] = useState('home');
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    if (currentView === 'landing') setActiveId('home');
    else if (currentView === 'map') setActiveId('explore');
  }, [currentView]);

  const navItems = [
    { id: 'home',    label: 'Home',    icon: Home },
    { id: 'explore', label: 'Explore', icon: Map },
    { id: 'filters', label: 'Filters', icon: SlidersHorizontal },
    { id: 'saved',   label: 'Saved',   icon: Heart },
    isAdmin && { id: 'admin', label: 'Admin', icon: Settings },
  ].filter(Boolean);

  const handleClick = (id) => {
    if (id === 'home')    { setActiveId('home');    onOpenHome(); }
    if (id === 'explore') { setActiveId('explore'); onExploreMap(); }
    if (id === 'filters') { onOpenFilters(); }
    if (id === 'saved')   { onOpenSaved(); }
    if (id === 'admin')   { onOpenAdmin(); }
  };

  return (
    <div className="primary-navbar-container">
      <nav className="primary-navbar">
        <div className="nav-items-group">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            const showBadge = item.id === 'saved' && savedCount > 0;

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`nav-btn ${isActive ? 'is-active' : ''}`}
              >
                <div className="nav-icon-container">
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.75} />
                  {showBadge && <span className="nav-badge">{savedCount}</span>}
                </div>
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="nav-actions-group">
          {user ? (
            <div className="user-profile-actions">
              <span className="user-name-label">{user.full_name?.split(' ')[0]}</span>
              <button className="nav-action-btn" onClick={logout} title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button className="nav-action-btn login-trigger" onClick={onOpenLogin}>
              <User size={18} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
