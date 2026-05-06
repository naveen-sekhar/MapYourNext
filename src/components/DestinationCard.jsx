import { Link } from 'react-router-dom';
import { MapPin, Star, IndianRupee, Heart } from 'lucide-react';

export default function DestinationCard({ destination, onWishlist }) {
  const d = destination;
  return (
    <Link to={`/destination/${d.slug}`} className="card group overflow-hidden animate-fade-in">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={d.media?.coverImage || 'https://placehold.co/800x600?text=Destination'}
          alt={d.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Wishlist button */}
        {onWishlist && (
          <button
            onClick={(e) => { e.preventDefault(); onWishlist(d._id); }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm transition-all group/heart"
            aria-label="Add to wishlist"
          >
            <Heart size={16} className="text-accent-500 group-hover/heart:fill-accent-500 transition-colors" />
          </button>
        )}

        {/* Safety badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`badge ${
            d.safetyRating?.riskLevel === 'low' ? 'bg-green-100 text-green-700' :
            d.safetyRating?.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {d.safetyRating?.riskLevel === 'low' ? '🛡️ Safe' :
             d.safetyRating?.riskLevel === 'medium' ? '⚠️ Moderate' : '🔴 High Risk'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-lg text-surface-900 group-hover:text-primary-600 transition-colors">
          {d.name}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-surface-500 mt-1">
          <MapPin size={14} />
          <span>{d.location?.state}, {d.location?.country}</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{d.avgRating?.toFixed(1) || 'New'}</span>
          </div>
          <div className="flex items-center gap-0.5 text-sm text-surface-600">
            <IndianRupee size={14} />
            <span>{d.budgetRange?.min?.toLocaleString()} - {d.budgetRange?.max?.toLocaleString()}</span>
          </div>
        </div>

        {/* Hobbies */}
        {d.hobbies?.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {d.hobbies.slice(0, 3).map((h, i) => (
              <span key={i} className="badge bg-primary-50 text-primary-700">
                {h.icon || ''} {h.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
