import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logout } from '../store/authSlice';
import { toggleMobileMenu } from '../store/uiSlice';
import { useClickOutside } from '../hooks';
import { MapPin, Menu, X, Bell, User, LogOut, ChevronDown, Search, Compass } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { mobileMenuOpen } = useSelector((s) => s.ui);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useClickOutside(() => setProfileOpen(false));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navLinks = [
    { to: '/explore', label: 'Explore', icon: <Compass size={16} /> },
    { to: '/communities', label: 'Communities' },
    { to: '/ai-planner', label: 'AI Planner', accent: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-surface-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
              <MapPin className="text-white" size={20} />
            </div>
            <span className="font-display font-bold text-xl text-surface-900">
              Map<span className="gradient-text">YourNext</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  link.accent
                    ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <Link
              to="/explore"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-100 text-surface-500 hover:bg-surface-200 transition-colors text-sm"
            >
              <Search size={16} />
              <span>Search destinations…</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors" aria-label="Notifications">
                  <Bell size={20} className="text-surface-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full" />
                </Link>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-sm font-bold">
                      {user?.profile?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown size={14} className={`text-surface-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-surface-200 py-2 animate-slide-down">
                      <div className="px-4 py-2 border-b border-surface-100">
                        <p className="font-medium text-sm text-surface-900">{user?.profile?.name}</p>
                        <p className="text-xs text-surface-500">{user?.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">
                        <User size={16} /> Profile
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-surface-700 hover:bg-surface-50">
                        <MapPin size={16} /> Wishlist
                      </Link>
                      {user?.role === 'creator' && (
                        <Link to="/creator/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50">
                          <Compass size={16} /> Creator Dashboard
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-accent-600 hover:bg-accent-50">
                          <User size={16} /> Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-surface-100" />
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm !py-2 !px-4">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm !py-2 !px-4">Get Started</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="md:hidden p-2 rounded-lg hover:bg-surface-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-surface-200 animate-slide-down">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => dispatch(toggleMobileMenu())}
                className="block py-3 px-2 text-surface-700 hover:text-primary-600 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
