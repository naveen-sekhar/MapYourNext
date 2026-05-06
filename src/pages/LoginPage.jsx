import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../store/authSlice';
import { MapPin, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-800 to-surface-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full filter blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400 rounded-full filter blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-xl">
              <MapPin className="text-white" size={24} />
            </div>
            <span className="font-display font-bold text-2xl">MapYourNext</span>
          </Link>
        </div>
        <div className="relative">
          <h2 className="font-display text-4xl font-bold mb-4">Welcome back, traveler</h2>
          <p className="text-primary-200 text-lg">Sign in to continue planning your next adventure.</p>
        </div>
        <div className="relative text-sm text-primary-300">
          © {new Date().getFullYear()} MapYourNext
        </div>
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-xl">
              <MapPin className="text-white" size={20} />
            </div>
            <span className="font-display font-bold text-xl">MapYourNext</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-surface-900 mb-2">Sign In</h1>
          <p className="text-surface-500 mb-8">Enter your credentials to access your account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-11"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-11 pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 text-base"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
