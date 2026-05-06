import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Compass, Camera, Coffee, Map, Palmtree, Mountain, Building, Ship, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { updateProfile } from '../store/authSlice';
import api from '../services/api';

const DEFAULT_ICONS = {
  photography: <Camera size={20} />,
  foodie: <Coffee size={20} />,
  adventure: <Mountain size={20} />,
  culture: <Building size={20} />,
  relaxation: <Palmtree size={20} />,
  roadtrips: <Map size={20} />,
  cruises: <Ship size={20} />,
};

const BUDGET_RANGES = [
  { id: '$', label: 'Budget ($)', desc: 'Backpacking, hostels, street food', range: { min: 0, max: 50 } },
  { id: '$$', label: 'Moderate ($$)', desc: '3-star hotels, casual dining, planned tours', range: { min: 50, max: 150 } },
  { id: '$$$', label: 'Luxury ($$$)', desc: '5-star resorts, fine dining, private guides', range: { min: 150, max: 100000 } },
];

const AGE_GROUPS = ['18-24', '25-34', '35-44', '45-54', '55+'];

const TRAVEL_STYLES = [
  { id: 'solo', label: 'Solo Traveler' },
  { id: 'couple', label: 'Couples / Romantic' },
  { id: 'family', label: 'Family with Kids' },
  { id: 'group', label: 'Friends / Group' },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hobbiesList, setHobbiesList] = useState([]);

  const [preferences, setPreferences] = useState({
    hobbies: [],
    budget: '',
    ageGroup: '',
    travelStyle: ''
  });

  useEffect(() => {
    // Fetch actual categories from backend
    api.get('/categories').then(data => {
      // Depending on backend, might be data.categories
      const cats = data.categories || data.data || [];
      const hobbyCats = cats.filter(c => c.type === 'hobby' || true); // fallback if no type
      setHobbiesList(hobbyCats);
    }).catch(err => console.error('Failed to fetch hobbies', err));
  }, []);

  const toggleHobby = (id) => {
    setPreferences(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(id) 
        ? prev.hobbies.filter(h => h !== id)
        : [...prev.hobbies, id]
    }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const selectedBudget = BUDGET_RANGES.find(b => b.id === preferences.budget);
      const payload = {
        hobbies: preferences.hobbies,
        preferences: {
          budgetRange: selectedBudget ? selectedBudget.range : { min: 0, max: 100000 },
          ageGroup: preferences.ageGroup,
          travelStyle: preferences.travelStyle,
        }
      };
      await dispatch(updateProfile(payload)).unwrap();
      navigate('/explore');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step >= i ? 'bg-primary-600 text-white shadow-md' : 'bg-surface-200 text-surface-500'
                }`}>
                  {step > i ? <CheckCircle size={16} /> : i}
                </div>
                {i !== 4 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                    step > i ? 'bg-primary-600' : 'bg-surface-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <h2 className="text-3xl font-display font-bold text-surface-900">
              {step === 1 && "What are your travel hobbies?"}
              {step === 2 && "What's your typical budget?"}
              {step === 3 && "How do you usually travel?"}
              {step === 4 && "Almost there!"}
            </h2>
            <p className="text-surface-500 mt-2">
              {step === 1 && "Select the activities that excite you the most."}
              {step === 2 && "This helps us recommend destinations that fit your wallet."}
              {step === 3 && "We'll tailor recommendations based on your travel style."}
              {step === 4 && "Just one last detail to personalize your experience."}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-surface-100 p-8 md:p-12 mb-8 min-h-[400px] flex flex-col">
          
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {hobbiesList.length > 0 ? hobbiesList.map(hobby => {
                const isSelected = preferences.hobbies.includes(hobby._id);
                // Try to map icon, fallback to Compass
                const icon = DEFAULT_ICONS[hobby.slug] || <Compass size={20} />;
                return (
                  <button
                    key={hobby._id}
                    onClick={() => toggleHobby(hobby._id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-50 text-primary-900 shadow-md transform scale-[1.02]' 
                        : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50 text-surface-700'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-primary-100 text-primary-600' : 'bg-surface-100 text-surface-500'}`}>
                      {icon}
                    </div>
                    <span className="font-semibold">{hobby.name}</span>
                  </button>
                )
              }) : (
                <div className="col-span-2 text-center text-surface-500 flex flex-col justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
                  Loading hobbies...
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4 flex-1 justify-center">
              {BUDGET_RANGES.map(range => (
                <button
                  key={range.id}
                  onClick={() => setPreferences({ ...preferences, budget: range.id })}
                  className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all text-left ${
                    preferences.budget === range.id
                      ? 'border-accent-500 bg-accent-50 text-accent-900 shadow-md transform scale-[1.02]'
                      : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50 text-surface-700'
                  }`}
                >
                  <span className="text-xl font-bold mb-1">{range.label}</span>
                  <span className="text-surface-500 text-sm">{range.desc}</span>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 content-center">
              {TRAVEL_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setPreferences({ ...preferences, travelStyle: style.id })}
                  className={`p-6 rounded-2xl border-2 transition-all font-bold text-lg ${
                    preferences.travelStyle === style.id
                      ? 'border-primary-500 bg-primary-50 text-primary-900 shadow-md transform scale-[1.02]'
                      : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50 text-surface-700'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-6 flex-1 justify-center max-w-md mx-auto w-full">
              <label className="text-left font-semibold text-surface-900 text-lg">Which age group do you belong to?</label>
              <div className="grid grid-cols-2 gap-3">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => setPreferences({ ...preferences, ageGroup: age })}
                    className={`py-3 px-4 rounded-xl border-2 transition-all font-semibold ${
                      preferences.ageGroup === age
                        ? 'border-accent-500 bg-accent-50 text-accent-900'
                        : 'border-surface-200 hover:bg-surface-50 text-surface-700'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center px-4">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className={`flex items-center gap-2 font-medium px-4 py-2 rounded-xl transition-colors ${
              step === 1 ? 'opacity-0 pointer-events-none' : 'text-surface-600 hover:bg-surface-200'
            }`}
          >
            <ArrowLeft size={20} /> Back
          </button>
          
          {step < 4 ? (
            <button
              onClick={() => setStep(s => Math.min(4, s + 1))}
              disabled={
                (step === 1 && preferences.hobbies.length === 0) ||
                (step === 2 && !preferences.budget) ||
                (step === 3 && !preferences.travelStyle)
              }
              className="btn-primary flex items-center gap-2 px-8 py-3 !rounded-full !text-lg shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:shadow-none"
            >
              Continue <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!preferences.ageGroup || loading}
              className="btn-accent flex items-center gap-2 px-8 py-3 !rounded-full !text-lg shadow-lg shadow-accent-500/30 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? 'Saving...' : 'Finish Setup'} <CheckCircle size={20} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
