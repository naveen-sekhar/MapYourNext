import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Compass, Sparkles, TrendingUp, Shield, Users, ArrowRight } from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import api from '../services/api';
import { useDebounce } from '../hooks';

export default function HomePage() {
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHobby, setActiveHobby] = useState(null);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {};
        if (debouncedSearch) params.search = debouncedSearch;
        if (activeHobby) params.hobby = activeHobby;

        const [destRes, catRes] = await Promise.all([
          api.get('/destinations', { params: { ...params, limit: 6 } }),
          api.get('/categories'),
        ]);
        setDestinations(destRes.data?.destinations || []);
        setCategories(catRes.data?.categories || []);
      } catch (err) {
        console.error('Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearch, activeHobby]);

  const hobbies = categories.filter((c) => c.type === 'hobby');
  const stats = [
    { icon: <MapPin size={24} />, value: '500+', label: 'Destinations' },
    { icon: <Users size={24} />, value: '50K+', label: 'Travelers' },
    { icon: <Shield size={24} />, value: '100%', label: 'Verified Guides' },
    { icon: <TrendingUp size={24} />, value: '4.8★', label: 'Avg Rating' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-surface-900 text-white">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full filter blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent-400 rounded-full filter blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6">
              <Sparkles size={16} className="text-yellow-400" />
              <span>AI-Powered Travel Planning</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
              Discover Your Next
              <br />
              <span className="bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent">
                Adventure
              </span>
            </h1>

            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl leading-relaxed">
              Community-driven travel discovery meets intelligent planning.
              Explore destinations by your hobbies, get AI-powered itineraries, and connect with fellow travelers.
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                <input
                  type="text"
                  placeholder="Search destinations, hobbies, experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-surface-900 placeholder-surface-400 shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary-400 text-base"
                  id="hero-search"
                />
              </div>
              <Link
                to="/explore"
                className="bg-accent-500 hover:bg-accent-600 text-white px-6 py-4 rounded-2xl font-semibold shadow-2xl transition-all hover:shadow-3xl flex items-center gap-2 whitespace-nowrap"
              >
                <Compass size={20} />
                <span className="hidden sm:inline">Explore</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-surface-200 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 mb-2">
                {stat.icon}
              </div>
              <p className="font-display text-2xl font-bold text-surface-900">{stat.value}</p>
              <p className="text-sm text-surface-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hobby Filter Chips */}
      {hobbies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="section-title mb-6">Explore by Hobby</h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setActiveHobby(null)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all text-sm ${
                !activeHobby
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              All
            </button>
            {hobbies.map((h) => (
              <button
                key={h._id}
                onClick={() => setActiveHobby(h._id === activeHobby ? null : h._id)}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all text-sm flex items-center gap-2 ${
                  activeHobby === h._id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                <span>{h.icon}</span>
                {h.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="section-title">Featured Destinations</h2>
          <Link to="/explore" className="flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700 transition-colors">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse-soft">
                <div className="h-52 bg-surface-200 rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-surface-200 rounded w-2/3" />
                  <div className="h-4 bg-surface-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : destinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <DestinationCard key={d._id} destination={d} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Compass size={48} className="mx-auto text-surface-300 mb-4" />
            <p className="text-surface-500 text-lg">No destinations found. Try a different search!</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-accent-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Get AI-powered personalized itineraries, connect with travel communities, and discover hidden gems.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/ai-planner" className="bg-white text-primary-700 px-8 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
              Try AI Planner
            </Link>
            <Link to="/register" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all">
              Join Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
