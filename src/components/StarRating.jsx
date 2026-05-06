import { Star } from 'lucide-react';

export default function StarRating({ rating, onRate, size = 20, interactive = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          className={`transition-colors ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={star <= rating
              ? 'text-yellow-500 fill-yellow-500'
              : 'text-surface-300'
            }
          />
        </button>
      ))}
    </div>
  );
}
