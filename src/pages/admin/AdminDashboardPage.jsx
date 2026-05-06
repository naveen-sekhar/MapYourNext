import React, { useState, useEffect } from 'react';
import { Users, MapPin, BookOpen, CheckCircle, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import api from '../../services/api';

import AdminSidebar from '../../components/admin/AdminSidebar';

const revenueData = [
  { name: 'Jan', users: 4000, guides: 2400 },
  { name: 'Feb', users: 5000, guides: 1398 },
  { name: 'Mar', users: 6000, guides: 9800 },
  { name: 'Apr', users: 8000, guides: 3908 },
  { name: 'May', users: 9500, guides: 4800 },
  { name: 'Jun', users: 11000, guides: 3800 },
  { name: 'Jul', users: 12450, guides: 4300 },
];

const AdminDashboardPage = () => {
  const [statsData, setStatsData] = useState({
    users: 0,
    destinations: 0,
    guides: 0,
    applications: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, destRes, guidesRes, appsRes] = await Promise.allSettled([
          api.get('/users?limit=1'),
          api.get('/destinations?limit=1'),
          api.get('/guides?limit=1'),
          api.get('/applications?status=pending&limit=1').catch(() => ({ pagination: { total: 0 } }))
        ]);

        setStatsData({
          users: usersRes.status === 'fulfilled' && usersRes.value.pagination ? usersRes.value.pagination.total : 0,
          destinations: destRes.status === 'fulfilled' && destRes.value.pagination ? destRes.value.pagination.total : 0,
          guides: guidesRes.status === 'fulfilled' && guidesRes.value.pagination ? guidesRes.value.pagination.total : 0,
          applications: appsRes.status === 'fulfilled' && appsRes.value.pagination ? appsRes.value.pagination.total : 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Users', value: statsData.users.toLocaleString(), change: '+14.5%', positive: true, icon: <Users size={24} className="text-blue-500" /> },
    { label: 'Active Destinations', value: statsData.destinations.toLocaleString(), change: '+5.2%', positive: true, icon: <MapPin size={24} className="text-emerald-500" /> },
    { label: 'Published Guides', value: statsData.guides.toLocaleString(), change: '+22.4%', positive: true, icon: <BookOpen size={24} className="text-purple-500" /> },
    { label: 'Pending Applications', value: statsData.applications.toLocaleString(), change: '-12.5%', positive: false, icon: <Clock size={24} className="text-amber-500" /> },
  ];
  return (
    <div className="flex bg-surface-50 min-h-screen">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-surface-900">Dashboard Overview</h1>
              <p className="text-surface-500 mt-1">Welcome back, Admin. Here is what is happening today.</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-surface-200 text-surface-700 rounded-xl font-medium hover:bg-surface-50 transition-colors shadow-sm">Export Report</button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-surface-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-surface-50 rounded-xl">
                    {stat.icon}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${stat.positive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                    {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-surface-500 text-sm font-medium mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-display font-bold text-surface-900">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-bold text-surface-900 mb-6">User & Guide Growth</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorGuides" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                    <Area type="monotone" dataKey="guides" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorGuides)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
              <h3 className="text-lg font-bold text-surface-900 mb-6">Recent Activity</h3>
              <div className="space-y-6">
                {[
                  { user: 'Sarah Jenkins', action: 'submitted a creator application', time: '2 hours ago', icon: <CheckCircle className="text-amber-500" size={18} /> },
                  { user: 'Mike Ross', action: 'published a new guide to Bali', time: '4 hours ago', icon: <BookOpen className="text-purple-500" size={18} /> },
                  { user: 'System', action: 'completed daily backup', time: '12 hours ago', icon: <TrendingUp className="text-blue-500" size={18} /> },
                  { user: 'Emma Watson', action: 'reported a comment', time: '1 day ago', icon: <Users className="text-red-500" size={18} /> },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <p className="text-sm text-surface-900"><span className="font-medium">{item.user}</span> {item.action}</p>
                      <p className="text-xs text-surface-500 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
