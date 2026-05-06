import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Calendar, Heart, Map, Settings, Edit, Camera, Globe, Star, Compass, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { updateProfile } from '../store/authSlice';

export default function ProfilePage() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  const [activeTab, setActiveTab] = useState('wishlist');
  
  // Modals state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Forms state
  const [profileForm, setProfileForm] = useState({ name: '', location: '', bio: '', avatar: '' });
  const [settingsForm, setSettingsForm] = useState({ travelStyle: 'balanced', budgetMin: 0, budgetMax: 1000 });
  const [saving, setSaving] = useState(false);

  if (!user) return <div className="min-h-screen bg-surface-50 p-10 text-center">Loading profile...</div>;

  const wishlist = user.wishlist || [];
  const visited = user.visited || [];
  const hobbies = user.hobbies || [];

  const openEditProfile = () => {
    setProfileForm({
      name: user.profile?.name || '',
      location: user.profile?.location || '',
      bio: user.profile?.bio || '',
      avatar: user.profile?.avatar || ''
    });
    setIsEditingProfile(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateProfile(profileForm)).unwrap();
      setIsEditingProfile(false);
    } catch (err) {
      alert(err || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const openSettings = () => {
    setSettingsForm({
      travelStyle: user.preferences?.travelStyle || 'balanced',
      budgetMin: user.preferences?.budgetRange?.min || 0,
      budgetMax: user.preferences?.budgetRange?.max || 5000,
    });
    setIsSettingsOpen(true);
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateProfile({
        preferences: {
          travelStyle: settingsForm.travelStyle,
          budgetRange: { min: settingsForm.budgetMin, max: settingsForm.budgetMax }
        }
      })).unwrap();
      setIsSettingsOpen(false);
    } catch (err) {
      alert(err || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const DestinationGrid = ({ items, emptyMessage }) => {
    if (items.length === 0) {
      return (
        <div className="py-20 text-center bg-white rounded-2xl border border-surface-200 border-dashed">
          <Globe size={48} className="mx-auto text-surface-300 mb-4" />
          <h3 className="text-lg font-bold text-surface-900 mb-2">Nothing here yet</h3>
          <p className="text-surface-500 max-w-sm mx-auto">{emptyMessage}</p>
          <Link to="/explore" className="btn-primary mt-6 inline-block">Explore Destinations</Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(dest => (
          <Link key={dest._id} to={`/destination/${dest.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-surface-200 shadow-sm hover:shadow-md transition-all">
            <div className="aspect-[4/3] relative overflow-hidden bg-surface-100">
              {dest.media?.coverImage ? (
                <img src={dest.media.coverImage} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-surface-400"><Globe size={32} /></div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-surface-900 mb-1">{dest.name}</h3>
              <p className="text-xs text-surface-500 flex items-center gap-1"><MapPin size={12} /> View Details</p>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-surface-50 min-h-[calc(100vh-4rem)] pb-20">
      {/* Cover Profile Header */}
      <div className="bg-white border-b border-surface-200">
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary-600 to-accent-600 relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-xl transition-colors">
            <Camera size={20} />
          </button>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-end -mt-16 md:-mt-20 mb-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg bg-surface-200 overflow-hidden flex items-center justify-center text-4xl font-bold text-surface-400 z-10 relative">
                {user.profile?.avatar ? (
                  <img src={user.profile.avatar} alt={user.profile.name} className="w-full h-full object-cover" />
                ) : (
                  user.profile?.name?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <button onClick={openEditProfile} className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <Camera size={24} />
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-3xl font-display font-bold text-surface-900">{user.profile?.name || 'Traveler'}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-surface-600 font-medium">
                {user.profile?.location && (
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> {user.profile.location}</span>
                )}
                <span className="flex items-center gap-1.5"><Calendar size={16} /> Joined {new Date(user.createdAt).getFullYear()}</span>
                <span className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wide">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={openSettings} className="btn-secondary flex items-center gap-2"><Settings size={18} /> Settings</button>
              <button onClick={openEditProfile} className="btn-primary flex items-center gap-2"><Edit size={18} /> Edit Profile</button>
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="text-surface-700 text-lg leading-relaxed">
              {user.profile?.bio || "No bio added yet. Add a bio to let other travelers know what kind of adventures you love!"}
            </p>
          </div>

          {/* Hobbies / Travel Style */}
          {hobbies.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {hobbies.map(hobby => (
                <span key={hobby._id} className="px-3 py-1.5 rounded-xl border border-surface-200 bg-surface-50 text-surface-700 text-sm font-semibold flex items-center gap-1.5">
                  {hobby.icon || <Compass size={14} />} {hobby.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-surface-200 mb-6">
              <button 
                onClick={() => setActiveTab('wishlist')}
                className={`pb-4 text-lg font-bold border-b-2 transition-colors ${activeTab === 'wishlist' ? 'border-primary-600 text-primary-700' : 'border-transparent text-surface-500 hover:text-surface-700'}`}
              >
                My Wishlist ({wishlist.length})
              </button>
              <button 
                onClick={() => setActiveTab('visited')}
                className={`pb-4 text-lg font-bold border-b-2 transition-colors ${activeTab === 'visited' ? 'border-primary-600 text-primary-700' : 'border-transparent text-surface-500 hover:text-surface-700'}`}
              >
                Places I've Visited ({visited.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === 'wishlist' && (
                <DestinationGrid items={wishlist} emptyMessage="You haven't saved any destinations to your wishlist yet. Start exploring to plan your next adventure!" />
              )}
              {activeTab === 'visited' && (
                <DestinationGrid items={visited} emptyMessage="You haven't marked any destinations as visited yet. Update your profile to keep track of your travels!" />
              )}
            </div>
          </div>

          {/* Sidebar / Stats */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6">
              <h3 className="font-bold text-surface-900 mb-4 flex items-center gap-2"><Star className="text-amber-500" /> Travel Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-surface-600">Wishlist Saved</span>
                  <span className="font-bold text-surface-900 text-lg">{wishlist.length}</span>
                </div>
                <div className="h-px bg-surface-100"></div>
                <div className="flex justify-between items-center">
                  <span className="text-surface-600">Places Visited</span>
                  <span className="font-bold text-surface-900 text-lg">{visited.length}</span>
                </div>
                {user.role === 'creator' || user.role === 'verified' ? (
                  <>
                    <div className="h-px bg-surface-100"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-surface-600">Guides Created</span>
                      <span className="font-bold text-surface-900 text-lg">0</span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            {user.role === 'traveler' && (
              <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 bg-gradient-to-br from-primary-50 to-white">
                <h3 className="font-bold text-primary-900 mb-2">Want to share your trips?</h3>
                <p className="text-sm text-surface-600 mb-4">Apply to become a MapYourNext Creator and publish your own custom guides and itineraries.</p>
                <Link to="/apply" className="btn-primary w-full block text-center !py-2">Apply Now</Link>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-surface-900">Edit Profile</h2>
              <button onClick={() => setIsEditingProfile(false)} className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-200 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Name</label>
                <input required type="text" className="input-field" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Avatar URL</label>
                <input type="url" placeholder="https://..." className="input-field" value={profileForm.avatar} onChange={e => setProfileForm({...profileForm, avatar: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Location</label>
                <input type="text" placeholder="e.g. New York, USA" className="input-field" value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Bio</label>
                <textarea rows="3" className="input-field resize-none" value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})}></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditingProfile(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary min-w-[100px]">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-surface-200 flex justify-between items-center bg-surface-50">
              <h2 className="font-bold text-lg text-surface-900">Travel Preferences</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 text-surface-500 hover:text-surface-700 hover:bg-surface-200 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={saveSettings} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Travel Style</label>
                <select className="input-field" value={settingsForm.travelStyle} onChange={e => setSettingsForm({...settingsForm, travelStyle: e.target.value})}>
                  <option value="luxury">Luxury</option>
                  <option value="comfort">Comfort</option>
                  <option value="balanced">Balanced</option>
                  <option value="budget">Budget / Backpacking</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-1">Budget Range (Min/Max $)</label>
                <div className="flex gap-4">
                  <input type="number" min="0" className="input-field w-1/2" value={settingsForm.budgetMin} onChange={e => setSettingsForm({...settingsForm, budgetMin: Number(e.target.value)})} />
                  <input type="number" min="0" className="input-field w-1/2" value={settingsForm.budgetMax} onChange={e => setSettingsForm({...settingsForm, budgetMax: Number(e.target.value)})} />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsSettingsOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary min-w-[100px]">
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
