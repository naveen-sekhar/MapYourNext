import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Compass } from 'lucide-react';
import api from '../../services/api';

import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      console.error('Failed to delete', err);
      alert('Failed to delete category.');
    }
  };

  const destinationCategories = categories.filter(c => c.type === 'destination');
  const hobbyCategories = categories.filter(c => c.type === 'hobby');

  const CategoryTable = ({ title, data, type }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden mb-8">
      <div className="p-4 border-b border-surface-200 bg-surface-50 flex justify-between items-center">
        <h3 className="font-bold text-surface-900 flex items-center gap-2">
          {type === 'destination' ? <Compass size={18} className="text-primary-600" /> : <Tag size={18} className="text-accent-500" />}
          {title} ({data.length})
        </h3>
        <button className="btn-secondary !py-1.5 !text-sm flex items-center gap-2">
          <Plus size={16} /> Add New
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-surface-500 text-xs font-semibold uppercase tracking-wider border-b border-surface-100">
              <th className="p-4 pl-6">Icon</th>
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Description</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {data.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-surface-500">No categories found.</td></tr>
            ) : (
              data.map(cat => (
                <tr key={cat._id} className="hover:bg-surface-50 transition-colors">
                  <td className="p-4 pl-6 text-2xl">{cat.icon || '📌'}</td>
                  <td className="p-4 font-bold text-surface-900">{cat.name}</td>
                  <td className="p-4 text-surface-500 text-sm">{cat.slug}</td>
                  <td className="p-4 text-surface-600 text-sm max-w-xs truncate">{cat.description || 'No description'}</td>
                  <td className="p-4 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex bg-surface-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">Categories</h1>
            <p className="text-surface-500 mt-1">Manage destination types and hobby categories.</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-surface-500">Loading categories...</div>
        ) : (
          <>
            <CategoryTable title="Destination Categories" data={destinationCategories} type="destination" />
            <CategoryTable title="Hobby Categories" data={hobbyCategories} type="hobby" />
          </>
        )}
      </main>
    </div>
  );
}
