import React, { useState, useEffect } from 'react';
import { Search, Shield, UserX, UserCheck, MoreVertical, ShieldAlert } from 'lucide-react';
import api from '../../services/api';
import { useSelector } from 'react-redux';

import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', {
        params: { page: pagination.page, limit: 15, search, role: roleFilter }
      });
      setUsers(res.data.users || []);
      setPagination(res.data.pagination || { page: 1, total: 0, pages: 1 });
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search, roleFilter]);

  const updateUser = async (userId, updateData) => {
    try {
      await api.patch(`/users/${userId}/role`, updateData);
      // Optimistically update
      setUsers(users.map(u => u._id === userId ? { ...u, ...updateData } : u));
      setActionMenuOpen(null);
    } catch (err) {
      console.error('Failed to update user', err);
      alert('Failed to update user.');
    }
  };

  return (
    <div className="flex bg-surface-50 min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">User Management</h1>
            <p className="text-surface-500 mt-1">View and manage platform users and their roles.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-surface-200 bg-surface-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
              <input 
                type="text" 
                placeholder="Search users by name..." 
                className="input-field !py-2 !pl-10 !text-sm"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPagination({...pagination, page: 1}); }}
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <select 
                className="input-field !py-2 !text-sm !w-auto"
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPagination({...pagination, page: 1}); }}
              >
                <option value="">All Roles</option>
                <option value="traveler">Traveler</option>
                <option value="verified">Verified Creator</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 text-surface-500 text-sm font-semibold uppercase tracking-wider border-b border-surface-200">
                  <th className="p-4 pl-6">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-10 text-surface-500">Loading users...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-10 text-surface-500">No users found.</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user._id} className="hover:bg-surface-50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-bold shrink-0">
                            {user.profile?.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-semibold text-surface-900">{user.profile?.name || 'Unnamed User'}</p>
                            <p className="text-xs text-surface-500">ID: {user._id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-surface-600 text-sm">{user.email}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user.role === 'moderator' ? 'bg-amber-100 text-amber-700' :
                          user.role === 'verified' ? 'bg-purple-100 text-purple-700' :
                          'bg-surface-100 text-surface-700'
                        }`}>
                          {user.role === 'admin' && <ShieldAlert size={12} />}
                          {user.role === 'verified' && <Shield size={12} />}
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="p-4 text-surface-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 pr-6 text-right relative">
                        <button 
                          onClick={() => setActionMenuOpen(actionMenuOpen === user._id ? null : user._id)}
                          className="p-2 text-surface-400 hover:text-surface-700 rounded-lg hover:bg-surface-100"
                        >
                          <MoreVertical size={20} />
                        </button>
                        
                        {actionMenuOpen === user._id && (
                          <div className="absolute right-6 top-10 w-48 bg-white border border-surface-200 rounded-xl shadow-xl z-50 py-1 text-left animate-slide-down">
                            {user.status === 'active' ? (
                              <button onClick={() => updateUser(user._id, { status: 'suspended' })} className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <UserX size={16} /> Suspend User
                              </button>
                            ) : (
                              <button onClick={() => updateUser(user._id, { status: 'active' })} className="w-full px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                                <UserCheck size={16} /> Reactivate User
                              </button>
                            )}
                            <div className="h-px bg-surface-100 my-1"></div>
                            {user.role !== 'admin' && (
                              <button onClick={() => updateUser(user._id, { role: 'admin' })} className="w-full px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 flex items-center gap-2">
                                <ShieldAlert size={16} /> Make Admin
                              </button>
                            )}
                            {user.role !== 'verified' && (
                              <button onClick={() => updateUser(user._id, { role: 'verified' })} className="w-full px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 flex items-center gap-2">
                                <Shield size={16} /> Make Verified
                              </button>
                            )}
                            {user.role !== 'traveler' && (
                              <button onClick={() => updateUser(user._id, { role: 'traveler' })} className="w-full px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 flex items-center gap-2">
                                <Shield size={16} /> Make Traveler
                              </button>
                            )}
                          </div>
                        )}
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
