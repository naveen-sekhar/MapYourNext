import { Link } from 'react-router-dom';
import { MapPin, Instagram, Twitter, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-xl">
                <MapPin className="text-white" size={18} />
              </div>
              <span className="font-display font-bold text-lg text-white">MapYourNext</span>
            </div>
            <p className="text-sm text-surface-400 leading-relaxed">
              Community-driven travel discovery & intelligent planning for Indian travelers.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore" className="hover:text-primary-400 transition-colors">Destinations</Link></li>
              <li><Link to="/communities" className="hover:text-primary-400 transition-colors">Communities</Link></li>
              <li><Link to="/ai-planner" className="hover:text-primary-400 transition-colors">AI Trip Planner</Link></li>
              <li><Link to="/explore?type=hobby" className="hover:text-primary-400 transition-colors">By Hobby</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-3 mb-4">
              <a href="#" className="p-2 rounded-lg bg-surface-800 hover:bg-surface-700 transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-surface-800 hover:bg-surface-700 transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-lg bg-surface-800 hover:bg-surface-700 transition-colors" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
            <p className="text-sm text-surface-400">support@mapyournext.in</p>
          </div>
        </div>

        <div className="border-t border-surface-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-surface-500">
            © {new Date().getFullYear()} MapYourNext. All rights reserved.
          </p>
          <p className="text-sm text-surface-500 flex items-center gap-1">
            Made with <Heart size={14} className="text-accent-500 fill-accent-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
