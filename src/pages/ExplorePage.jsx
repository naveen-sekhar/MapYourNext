import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid3x3, List, Compass } from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { useDebounce } from '../hooks';

export default function ExplorePage() {
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ hobby: '', category: '', budgetMax: '', safety: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => { api.get('/categories').then(r => setCategories(r.data?.categories || [])).catch(() => {}); }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12 };
        if (debouncedSearch) params.search = debouncedSearch;
        if (filters.hobby) params.hobby = filters.hobby;
        if (filters.category) params.category = filters.category;
        if (filters.budgetMax) params.budgetMax = filters.budgetMax;
        if (filters.safety) params.safety = filters.safety;
        const res = await api.get('/destinations', { params });
        setDestinations(res.data?.destinations || []);
        setPagination(res.data?.pagination || {});
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, [debouncedSearch, filters, page]);

  const hobbies = categories.filter(c => c.type === 'hobby');
  const destCats = categories.filter(c => c.type === 'destination');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="section-title mb-2">Explore Destinations</h1>
      <p className="text-surface-500 mb-8">Discover amazing places across India</p>

      {/* Search + Filters */}
      <div className="card p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
            <input type="text" placeholder="Search destinations..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" id="explore-search" />
          </div>
          <select value={filters.hobby} onChange={e => setFilters({...filters, hobby: e.target.value})} className="input-field !w-auto min-w-[140px]" aria-label="Filter by hobby">
            <option value="">All Hobbies</option>
            {hobbies.map(h => <option key={h._id} value={h._id}>{h.icon} {h.name}</option>)}
          </select>
          <select value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} className="input-field !w-auto min-w-[140px]" aria-label="Filter by category">
            <option value="">All Categories</option>
            {destCats.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
          </select>
          <select value={filters.safety} onChange={e => setFilters({...filters, safety: e.target.value})} className="input-field !w-auto min-w-[120px]" aria-label="Min safety">
            <option value="">Safety</option>
            {[5,6,7,8,9].map(v => <option key={v} value={v}>{v}+ / 10</option>)}
          </select>
          <div className="hidden md:flex gap-1 items-center">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-surface-400'}`} aria-label="Grid view"><Grid3x3 size={18} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-surface-400'}`} aria-label="List view"><List size={18} /></button>
          </div>
        </div>
      </div>

      {loading ? <LoadingSpinner text="Loading destinations..." /> : destinations.length > 0 ? (
        <>
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {destinations.map(d => <DestinationCard key={d._id} destination={d} />)}
          </div>
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}`}>{i + 1}</button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <Compass size={48} className="mx-auto text-surface-300 mb-4" />
          <p className="text-surface-500 text-lg">No destinations match your filters</p>
        </div>
      )}
    </div>
  );
}
