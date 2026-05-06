import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { Filter, Star, MapPin, Coffee, Mountain, Palmtree, ArrowRight } from 'lucide-react';
import L from 'leaflet';

// Create custom icons based on category
const createIcon = (color, iconHtml) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);">${iconHtml}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const CATEGORY_ICONS = {
  Food: { color: '#f59e0b', html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>' },
  Adventure: { color: '#10b981', html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>' },
  Relaxation: { color: '#0ea5e9', html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-4"/><path d="M5.89 9.71c-1.15 1.06-2.15 2.5-2.78 4.29-.63 1.78-.86 3.61-.63 5.09A2 2 0 0 0 4.47 21h15.06a2 2 0 0 0 1.99-1.91c.23-1.48 0-3.31-.63-5.09-.63-1.79-1.63-3.23-2.78-4.29"/></svg>' },
  Culture: { color: '#8b5cf6', html: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>' }
};

const DUMMY_DESTINATIONS = [
  { id: 1, title: 'Bali Beach Resort', slug: 'bali-beach-resort', category: 'Relaxation', lat: -8.409518, lng: 115.188919, rating: 4.8, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=200&h=150', budget: '$$' },
  { id: 2, title: 'Kyoto Temples', slug: 'kyoto-temples', category: 'Culture', lat: 35.011636, lng: 135.768029, rating: 4.9, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=200&h=150', budget: '$$$' },
  { id: 3, title: 'Swiss Alps Hiking', slug: 'swiss-alps', category: 'Adventure', lat: 46.818188, lng: 8.227512, rating: 4.9, image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=200&h=150', budget: '$$$' },
  { id: 4, title: 'Bangkok Street Food', slug: 'bangkok-street', category: 'Food', lat: 13.756331, lng: 100.501762, rating: 4.7, image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=200&h=150', budget: '$' },
  { id: 5, title: 'Santorini Sunset', slug: 'santorini', category: 'Relaxation', lat: 36.393156, lng: 25.461509, rating: 4.8, image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=200&h=150', budget: '$$$' },
];

export default function MapPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [destinations, setDestinations] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await fetch('/api/destinations?limit=50').then(res => res.json());
        // Depending on backend, data might be { destinations: [...] } or just an array
        const dests = data.destinations || data.data || [];
        // Make sure coordinates are valid before mapping
        const validDests = dests.filter(d => d.location && d.location.coordinates);
        
        // Map to our marker format
        const formattedDests = validDests.map(d => ({
          id: d._id,
          title: d.name,
          slug: d.slug,
          category: d.category?.name || 'Relaxation', // fallback if no category
          lat: d.location.coordinates[1],
          lng: d.location.coordinates[0],
          rating: d.averageRating || 4.5,
          image: d.images?.[0]?.url || d.coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=200&h=150',
          budget: d.budgetRange || '$$',
        }));
        
        setDestinations(formattedDests);
        setMarkers(formattedDests);
      } catch (err) {
        console.error('Failed to fetch destinations for map', err);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setMarkers(destinations);
    } else {
      setMarkers(destinations.filter(d => d.category === activeCategory));
    }
  }, [activeCategory, destinations]);

  return (
    <div className="relative h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      
      {/* Sidebar Filters */}
      <div className="w-full md:w-80 bg-white border-r border-surface-200 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-surface-100">
          <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">Interactive Map</h1>
          <p className="text-surface-500 text-sm">Discover your next destination by browsing the globe based on your interests.</p>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <h3 className="font-semibold text-surface-900 flex items-center gap-2 mb-4">
            <Filter size={18} /> Categories
          </h3>
          
          <div className="space-y-2">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors ${activeCategory === 'All' ? 'bg-surface-900 text-white' : 'bg-surface-50 text-surface-700 hover:bg-surface-100'}`}
            >
              All Destinations
            </button>
            {Object.keys(CATEGORY_ICONS).map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full flex justify-between items-center px-4 py-3 rounded-xl font-medium transition-colors ${
                  activeCategory === cat ? 'bg-primary-50 text-primary-700 border border-primary-200' : 'bg-surface-50 text-surface-700 hover:bg-surface-100 border border-transparent'
                }`}
              >
                <span>{cat}</span>
                <div style={{ backgroundColor: CATEGORY_ICONS[cat].color }} className="w-3 h-3 rounded-full" />
              </button>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-surface-900 mb-4">Visible Results ({markers.length})</h3>
            <div className="space-y-4">
              {markers.slice(0, 3).map(dest => (
                <div key={dest.id} className="flex gap-3 items-center group cursor-pointer">
                  <img src={dest.image} alt={dest.title} className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <h4 className="font-bold text-surface-900 text-sm group-hover:text-primary-600 transition-colors">{dest.title}</h4>
                    <p className="text-xs text-surface-500 flex items-center gap-1 mt-1">
                      <Star size={12} className="text-amber-500 fill-amber-500" /> {dest.rating} • {dest.category}
                    </p>
                  </div>
                </div>
              ))}
              {markers.length > 3 && (
                <p className="text-xs text-center text-surface-500 pt-2">+ {markers.length - 3} more on map</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative z-0 h-[50vh] md:h-full">
        <MapContainer 
          center={[20, 0]} 
          zoom={2} 
          className="w-full h-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {markers.map(dest => {
            const iconConfig = CATEGORY_ICONS[dest.category] || { color: '#000', html: '' };
            return (
              <Marker 
                key={dest.id} 
                position={[dest.lat, dest.lng]}
                icon={createIcon(iconConfig.color, iconConfig.html)}
              >
                <Popup className="custom-popup">
                  <div className="w-48 overflow-hidden rounded-xl">
                    <img src={dest.image} alt={dest.title} className="w-full h-24 object-cover" />
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-sm text-surface-900 leading-tight">{dest.title}</h3>
                        <span className="text-xs font-bold bg-surface-100 px-1.5 py-0.5 rounded text-surface-600">{dest.budget}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-medium mb-3">
                        <Star size={12} className="fill-amber-500" /> {dest.rating}
                        <span className="text-surface-400 font-normal ml-1">• {dest.category}</span>
                      </div>
                      <Link 
                        to={`/destination/${dest.slug}`} 
                        className="w-full btn-primary !py-1.5 !text-xs !rounded-lg flex items-center justify-center gap-1"
                      >
                        View Details <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Inject custom CSS for popup to remove default padding */}
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper { padding: 0; overflow: hidden; border-radius: 0.75rem; }
        .custom-popup .leaflet-popup-content { margin: 0; width: auto !important; }
        .leaflet-container { border-radius: 0 !important; }
      `}</style>
    </div>
  );
}
