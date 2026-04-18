import { useState, useEffect } from 'react';
import { Home, Building2, Heart, SlidersHorizontal, Settings, User, LogOut, ChevronDown, LayoutGrid, Sun, Moon } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './UniversalNavbar.css';

export default function UniversalNavbar({ 
  onOpenFilters, onOpenLogin, savedCount
}) {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const isLandingPage = location.pathname === '/';

  // Close user menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => setIsUserMenuOpen(false);
    if (isUserMenuOpen) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  const navItems = isLandingPage ? [] : [
    { id: 'landing', label: 'Home',     icon: Home,              to: '/' },
    { id: 'map',     label: 'Explore',  icon: Building2,         to: '/explore' },
    { id: 'gallery', label: 'Discover', icon: LayoutGrid,        to: '/discover' },
    { id: 'saved',   label: 'Saved',    icon: Heart,             to: '/saved' },
  ];

  return (
    <nav className="universal-navbar">
      {/* Desktop & Tablet Top Nav */}
      <div className="nav-desktop-container">
        <div className="nav-left" onClick={() => navigate('/')}>
          <span className="brand-text">Elevé</span>
        </div>

        <div className="nav-center">
          {navItems.map(item => (
            <NavLink 
              key={item.id} 
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.id === 'saved' && savedCount > 0 && (
                <span className="count-badge">{savedCount}</span>
              )}
            </NavLink>
          ))}
          {!isLandingPage && (
            <button className="nav-link" onClick={onOpenFilters}>
              <SlidersHorizontal size={18} />
              <span>Filters</span>
            </button>
          )}
        </div>

        <div className="nav-right">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="user-menu-wrapper" onClick={(e) => e.stopPropagation()}>
              <button 
                className={`user-profile-trigger ${isUserMenuOpen ? 'is-active' : ''}`}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="avatar-placeholder">
                  {user.full_name?.charAt(0) || 'U'}
                </div>
                <span className="user-firstname">{user.full_name?.split(' ')[0]}</span>
                <ChevronDown size={14} className={`chevron ${isUserMenuOpen ? 'rotated' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown-menu glass-panel">
                  <div className="user-info-header">
                    <p className="user-fullname">{user.full_name}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  {isAdmin && (
                    <button className="dropdown-item" onClick={() => { navigate('/admin'); setIsUserMenuOpen(false); }}>
                      <Settings size={16} />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                  
                  <button className="dropdown-item logout" onClick={logout}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="login-btn" onClick={onOpenLogin}>
              <User size={18} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Nav (Phones Only) */}
      <div className="nav-mobile-bottom">
        {navItems.map(item => (
          <NavLink 
            key={item.id} 
            to={item.to}
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'is-active' : ''}`}
          >
            <item.icon size={20} />
            <span className="mobile-label">{item.label}</span>
            {item.id === 'saved' && savedCount > 0 && (
              <span className="mobile-count-badge">{savedCount}</span>
            )}
          </NavLink>
        ))}
        {!isLandingPage && (
          <button className="mobile-nav-item" onClick={onOpenFilters}>
            <SlidersHorizontal size={20} />
            <span className="mobile-label">Filters</span>
          </button>
        )}

        <button className="mobile-nav-item" onClick={toggleTheme}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          <span className="mobile-label">Theme</span>
        </button>

        {user ? (
           <button 
            className="mobile-nav-item"
            onClick={logout}
           >
             <LogOut size={20} />
             <span className="mobile-label">Logout</span>
           </button>
        ) : (
          <button className="mobile-nav-item" onClick={onOpenLogin}>
            <User size={20} />
            <span className="mobile-label">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}
