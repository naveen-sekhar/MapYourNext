import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, IndianRupee, Shield, Calendar, Users, Heart, BookOpen, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import api from '../services/api';

export default function DestinationDetailPage() {
  const { slug } = useParams();
  const [dest, setDest] = useState(null);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/destinations/${slug}`);
        setDest(res.data?.destination);
        if (res.data?.destination?._id) {
          const gRes = await api.get('/guides', { params: { destination: res.data.destination._id, limit: 10 } });
          setGuides(gRes.data?.guides || []);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) return <LoadingSpinner text="Loading destination..." />;
  if (!dest) return <div className="text-center py-20"><p className="text-lg text-surface-500">Destination not found</p></div>;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img src={dest.media?.coverImage} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
            <Link to="/" className="hover:text-white">Home</Link> <ChevronRight size={14} />
            <Link to="/explore" className="hover:text-white">Explore</Link> <ChevronRight size={14} />
            <span>{dest.name}</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">{dest.name}</h1>
          <div className="flex items-center gap-4 text-white/90 flex-wrap">
            <span className="flex items-center gap-1"><MapPin size={16} /> {dest.location?.state}, {dest.location?.country}</span>
            <span className="flex items-center gap-1"><Star size={16} className="fill-yellow-400 text-yellow-400" /> {dest.avgRating?.toFixed(1) || 'New'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <IndianRupee className="mx-auto text-primary-500 mb-1" size={24} />
                <p className="text-sm text-surface-500">Budget</p>
                <p className="font-semibold">₹{dest.budgetRange?.min?.toLocaleString()} - ₹{dest.budgetRange?.max?.toLocaleString()}</p>
              </div>
              <div className="card p-4 text-center">
                <Shield className="mx-auto text-green-500 mb-1" size={24} />
                <p className="text-sm text-surface-500">Safety</p>
                <p className="font-semibold">{dest.safetyRating?.overall}/10</p>
              </div>
              <div className="card p-4 text-center">
                <Calendar className="mx-auto text-accent-500 mb-1" size={24} />
                <p className="text-sm text-surface-500">Best Season</p>
                <p className="font-semibold text-sm">{dest.bestSeasons?.slice(0, 2).join(', ')}</p>
              </div>
              <div className="card p-4 text-center">
                <Users className="mx-auto text-primary-500 mb-1" size={24} />
                <p className="text-sm text-surface-500">Solo Women</p>
                <StarRating rating={dest.safetyRating?.soloWomen || 0} size={14} />
              </div>
            </div>

            {/* Hobbies */}
            {dest.hobbies?.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold mb-3">Activities & Hobbies</h2>
                <div className="flex gap-2 flex-wrap">
                  {dest.hobbies.map((h, i) => (
                    <span key={i} className="badge bg-primary-50 text-primary-700 !px-4 !py-2 text-sm">{h.icon} {h.name}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Guides */}
            <div>
              <h2 className="font-display text-xl font-bold mb-4">Travel Guides ({guides.length})</h2>
              {guides.length > 0 ? (
                <div className="space-y-4">
                  {guides.map(g => (
                    <Link key={g._id} to={`/guide/${g.slug}`} className="card p-4 flex gap-4 hover:border-primary-300 transition-colors">
                      <img src={g.coverImage} alt={g.title} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-surface-900 truncate">{g.title}</h3>
                        <p className="text-sm text-surface-500 mt-1">by {g.author?.profile?.name}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm">
                          <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /> {g.avgRating?.toFixed(1) || 'New'}</span>
                          <span className="text-surface-400">{g.viewCount} views</span>
                          {g.isPaid && <span className="badge bg-accent-50 text-accent-700">₹{g.price}</span>}
                        </div>
                      </div>
                      <BookOpen size={20} className="text-surface-300 flex-shrink-0 mt-2" />
                    </Link>
                  ))}
                </div>
              ) : <p className="text-surface-500">No guides yet. Be the first to create one!</p>}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-6 sticky top-20">
              <h3 className="font-display font-bold text-lg mb-4">Plan Your Trip</h3>
              <Link to="/ai-planner" className="btn-primary w-full text-center block mb-3">AI Trip Planner</Link>
              <button className="btn-secondary w-full flex items-center justify-center gap-2"><Heart size={16} /> Add to Wishlist</button>
              <hr className="my-4 border-surface-200" />
              <div className="text-sm text-surface-600 space-y-2">
                <p><strong>Entry Fee:</strong> {dest.entryFee?.amount ? `₹${dest.entryFee.amount}` : 'Free'}</p>
                <p><strong>Accessibility:</strong> {dest.accessibility?.wheelchairFriendly ? '♿ Wheelchair friendly' : 'Limited'}</p>
                <p><strong>Suitable for:</strong> {dest.accessibility?.ageSuitability}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
