import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Users, MapPin, BookOpen, CheckCircle } from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();

  const links = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <TrendingUp size={20} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { to: "/admin/destinations", label: "Destinations", icon: <MapPin size={20} /> },
    { to: "/admin/categories", label: "Categories", icon: <BookOpen size={20} /> },
    { to: "/admin/applications", label: "Applications", icon: <CheckCircle size={20} />, badge: 42 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-surface-200 p-6 hidden md:block shrink-0">
      <h2 className="text-sm font-bold text-surface-400 uppercase tracking-wider mb-6">Admin Portal</h2>
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.to);
          return (
            <Link 
              key={link.to} 
              to={link.to} 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-surface-600 hover:bg-surface-100'
              }`}
            >
              {link.icon} {link.label}
              {link.badge && (
                <span className="ml-auto bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-xs font-bold">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
