import React, { useState, useEffect } from 'react';
import { Search, MapPin, Plus, Edit, Trash2, Globe, Star } from 'lucide-react';
import api from '../../services/api';

import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/destinations', {
        params: { page: pagination.page, limit: 10, search }
      });
      setDestinations(res.data.destinations || res.data.data || []);
      setPagination(res.data.pagination || { page: 1, total: 0, pages: 1 });
    } catch (err) {
      console.error('Failed to fetch destinations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [pagination.page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      await api.delete(`/destinations/${id}`);
      setDestinations(destinations.filter(d => d._id !== id));
    } catch (err) {
      console.error('Failed to delete', err);
      alert('Failed to delete destination.');
    }
  };

  return (
    <div className="flex bg-surface-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">Destinations</h1>
            <p className="text-surface-500 mt-1">Manage global destinations and hotspots.</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Destination
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-surface-200 bg-surface-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
              <input 
                type="text" 
                placeholder="Search destinations..." 
                className="input-field !py-2 !pl-10 !text-sm"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPagination({...pagination, page: 1}); }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 text-surface-500 text-sm font-semibold uppercase tracking-wider border-b border-surface-200">
                  <th className="p-4 pl-6">Destination</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Safety</th>
                  <th className="p-4">Guides</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-10 text-surface-500">Loading destinations...</td></tr>
                ) : destinations.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-10 text-surface-500">No destinations found.</td></tr>
                ) : (
                  destinations.map(dest => (
                    <tr key={dest._id} className="hover:bg-surface-50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          {dest.media?.coverImage || dest.media?.gallery?.[0] ? (
                            <img src={dest.media?.coverImage || dest.media?.gallery[0]} alt={dest.name} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-surface-200 flex items-center justify-center text-surface-400">
                              <Globe size={20} />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-surface-900">{dest.name}</p>
                            <p className="text-xs text-surface-500 flex items-center gap-1 mt-0.5">
                              <MapPin size={12} /> {dest.location?.country || 'Global'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold">
                          {dest.categories?.[0]?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-surface-700">
                        {dest.budgetRange ? `$${dest.budgetRange.min} - $${dest.budgetRange.max}` : '$$'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 font-semibold text-surface-700">
                          <Star size={14} className="text-amber-500 fill-amber-500" /> {dest.safetyRating?.overall || 'N/A'}
                        </div>
                      </td>
                      <td className="p-4 text-surface-600 font-medium">
                        {dest.guidesCount || 0}
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(dest._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-4 border-t border-surface-200 flex justify-between items-center bg-surface-50 text-sm">
              <span className="text-surface-500">Showing page {pagination.page} of {pagination.pages}</span>
              <div className="flex gap-2">
                <button 
                  disabled={pagination.page === 1}
                  onClick={() => setPagination({...pagination, page: pagination.page - 1})}
                  className="px-3 py-1.5 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination({...pagination, page: pagination.page + 1})}
                  className="px-3 py-1.5 bg-white border border-surface-200 rounded-lg hover:bg-surface-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
