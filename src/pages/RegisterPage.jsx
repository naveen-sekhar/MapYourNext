import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../store/authSlice';
import { MapPin, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [localErr, setLocalErr] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalErr('');
    dispatch(clearError());
    if (form.password !== form.confirmPassword) return setLocalErr('Passwords do not match');
    if (form.password.length < 6) return setLocalErr('Password must be at least 6 characters');
    const r = await dispatch(register({ name: form.name, email: form.email, password: form.password }));
    if (register.fulfilled.match(r)) navigate('/');
  };

  const err = localErr || error;

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-600 via-accent-700 to-primary-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-accent-300 rounded-full filter blur-3xl animate-pulse-soft" />
        </div>
        <Link to="/" className="relative flex items-center gap-2">
          <div className="bg-white/20 p-2 rounded-xl"><MapPin className="text-white" size={24} /></div>
          <span className="font-display font-bold text-2xl">MapYourNext</span>
        </Link>
        <div className="relative">
          <h2 className="font-display text-4xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-accent-100 text-lg">Join thousands of travelers discovering India.</p>
        </div>
        <p className="relative text-sm text-accent-200">© {new Date().getFullYear()} MapYourNext</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <h1 className="font-display text-3xl font-bold text-surface-900 mb-2">Create Account</h1>
          <p className="text-surface-500 mb-8">Fill in your details to get started</p>

          {err && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{err}</div>}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-surface-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                <input id="name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field pl-11" placeholder="John Doe" />
              </div>
            </div>
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-surface-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                <input id="reg-email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field pl-11" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label htmlFor="reg-pw" className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                <input id="reg-pw" type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input-field pl-11 pr-11" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400" aria-label="Toggle password">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirm-pw" className="block text-sm font-medium text-surface-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                <input id="confirm-pw" type="password" required value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} className="input-field pl-11" placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 text-base">
              {loading ? 'Creating…' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-surface-500 mt-6">
            Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
