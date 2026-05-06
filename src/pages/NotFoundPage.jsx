import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-50 mb-6">
          <MapPin size={40} className="text-primary-400" />
        </div>
        <h1 className="font-display text-6xl font-bold text-surface-900 mb-2">404</h1>
        <p className="text-xl text-surface-500 mb-8">This destination doesn't exist on our map… yet.</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
