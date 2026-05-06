import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, User, Compass, Globe, Calendar } from 'lucide-react';
import api from '../services/api';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(q);
  
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [users, setUsers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const executeSearch = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const [destRes, userRes] = await Promise.allSettled([
        api.get('/destinations', { params: { search: query, limit: 12 } }),
        api.get('/users/search', { params: { q: query, limit: 10 } })
      ]);

      if (destRes.status === 'fulfilled') {
        setDestinations(destRes.value.destinations || []);
      }
      if (userRes.status === 'fulfilled') {
        setUsers(userRes.value.users || []);
      }
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      executeSearch(q);
    }
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  const UserCard = ({ user }) => (
    <Link to={`/user/${user._id}`} className="bg-white rounded-2xl p-4 border border-surface-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
      <div className="w-16 h-16 rounded-full bg-surface-200 overflow-hidden shrink-0 flex items-center justify-center text-xl font-bold text-surface-500">
        {user.profile?.avatar ? (
          <img src={user.profile.avatar} alt={user.profile.name} className="w-full h-full object-cover" />
        ) : (
          user.profile?.name?.[0]?.toUpperCase() || 'U'
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-surface-900 truncate group-hover:text-primary-600 transition-colors">{user.profile?.name}</h3>
        <p className="text-sm text-surface-500 truncate flex items-center gap-1 mt-0.5">
          <span className="capitalize">{user.role}</span>
        </p>
        {user.profile?.location && (
          <p className="text-xs text-surface-400 mt-1 flex items-center gap-1"><MapPin size={12} /> {user.profile.location}</p>
        )}
      </div>
    </Link>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-50 pb-20">
      <div className="bg-white border-b border-surface-200 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-surface-900 mb-6">Explore the Community</h1>
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Search for destinations or people..." 
              className="w-full bg-surface-50 border border-surface-200 text-surface-900 rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400" size={24} />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary !py-2 px-6">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!hasSearched ? (
          <div className="text-center py-20">
            <Compass size={64} className="mx-auto text-surface-200 mb-4" />
            <p className="text-surface-500 text-lg">Enter a search term to find destinations and fellow travelers.</p>
          </div>
        ) : loading ? (
          <div className="py-20"><LoadingSpinner text="Searching..." /></div>
        ) : (
          <div>
            <div className="flex gap-4 border-b border-surface-200 mb-8 overflow-x-auto">
              <button onClick={() => setActiveTab('all')} className={`pb-4 text-sm md:text-base font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'all' ? 'border-primary-600 text-primary-700' : 'border-transparent text-surface-500 hover:text-surface-700'}`}>
                All Results
              </button>
              <button onClick={() => setActiveTab('destinations')} className={`pb-4 text-sm md:text-base font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'destinations' ? 'border-primary-600 text-primary-700' : 'border-transparent text-surface-500 hover:text-surface-700'}`}>
                <MapPin size={16} /> Destinations ({destinations.length})
              </button>
              <button onClick={() => setActiveTab('users')} className={`pb-4 text-sm md:text-base font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'users' ? 'border-primary-600 text-primary-700' : 'border-transparent text-surface-500 hover:text-surface-700'}`}>
                <User size={16} /> People ({users.length})
              </button>
            </div>

            {destinations.length === 0 && users.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-surface-200 shadow-sm">
                <Globe size={48} className="mx-auto text-surface-300 mb-4" />
                <h3 className="text-xl font-bold text-surface-900 mb-2">No results found for "{q}"</h3>
                <p className="text-surface-500">Try adjusting your search or browse our popular categories.</p>
                <Link to="/explore" className="btn-secondary mt-6 inline-block">Browse Destinations</Link>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'users') && users.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-surface-900 mb-6 flex items-center gap-2">People <span className="bg-primary-100 text-primary-700 text-sm py-1 px-2.5 rounded-lg">{users.length}</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {users.map(u => <UserCard key={u._id} user={u} />)}
                </div>
              </div>
            )}

            {(activeTab === 'all' || activeTab === 'destinations') && destinations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-surface-900 mb-6 flex items-center gap-2">Destinations <span className="bg-primary-100 text-primary-700 text-sm py-1 px-2.5 rounded-lg">{destinations.length}</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {destinations.map(d => <DestinationCard key={d._id} destination={d} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
