import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Image, MapPin, Calendar, DollarSign, Plus, Trash2, CheckCircle, ArrowRight, ArrowLeft, GripVertical } from 'lucide-react';

const DUMMY_DESTINATIONS = ['Bali, Indonesia', 'Kyoto, Japan', 'Swiss Alps', 'Bangkok, Thailand', 'Santorini, Greece'];

export default function CreatorGuideFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    budget: '',
    coverImage: null,
    itinerary: [
      { day: 1, title: '', activities: [{ time: '', description: '', type: 'attraction' }] }
    ]
  });

  const addDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', activities: [{ time: '', description: '', type: 'attraction' }] }]
    }));
  };

  const removeDay = (index) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index).map((day, i) => ({ ...day, day: i + 1 }))
    }));
  };

  const addActivity = (dayIndex) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].activities.push({ time: '', description: '', type: 'attraction' });
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const updateActivity = (dayIndex, actIndex, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].activities[actIndex][field] = value;
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const removeActivity = (dayIndex, actIndex) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].activities.splice(actIndex, 1);
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const updateDayTitle = (dayIndex, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].title = value;
    setFormData({ ...formData, itinerary: newItinerary });
  };

  return (
    <div className="bg-surface-50 min-h-[calc(100vh-4rem)] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-surface-200 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-surface-900">{isEditing ? 'Edit Guide' : 'Create New Guide'}</h1>
            <p className="text-sm text-surface-500">Step {step} of 2</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary !py-2">Save Draft</button>
            <button className="btn-primary !py-2 flex items-center gap-2">
              <CheckCircle size={16} /> Publish
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        {step === 1 ? (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-200">
              <h2 className="text-2xl font-bold text-surface-900 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-2">Guide Title</label>
                  <input 
                    type="text" 
                    className="input-field !text-lg !font-medium" 
                    placeholder="e.g. 7 Days in Tropical Paradise"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">Destination</label>
                    <select 
                      className="input-field"
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    >
                      <option value="">Select a destination</option>
                      {DUMMY_DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 mb-2">Estimated Budget Range</label>
                    <select 
                      className="input-field"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    >
                      <option value="">Select budget</option>
                      <option value="$">Budget ($)</option>
                      <option value="$$">Moderate ($$)</option>
                      <option value="$$$">Luxury ($$$)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-2">Cover Image</label>
                  <div className="border-2 border-dashed border-surface-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-surface-50 transition-colors cursor-pointer">
                    <div className="bg-surface-100 p-4 rounded-full mb-4">
                      <Image className="text-surface-500" size={32} />
                    </div>
                    <p className="font-semibold text-surface-700">Click to upload or drag and drop</p>
                    <p className="text-sm text-surface-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.destination}
                className="btn-primary flex items-center gap-2 px-8 py-3 !text-lg"
              >
                Next: Build Itinerary <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
                <Calendar className="text-primary-600" /> Day-by-Day Itinerary
              </h2>
            </div>

            {formData.itinerary.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                <div className="bg-surface-50 border-b border-surface-200 p-4 px-6 flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-display font-bold text-lg text-primary-700 bg-primary-100 px-3 py-1 rounded-lg">Day {day.day}</span>
                    <input 
                      type="text" 
                      placeholder="e.g. Arrival & Beach Time" 
                      className="bg-transparent border-none focus:outline-none focus:ring-0 font-medium text-surface-900 flex-1 placeholder-surface-400"
                      value={day.title}
                      onChange={(e) => updateDayTitle(dayIndex, e.target.value)}
                    />
                  </div>
                  {formData.itinerary.length > 1 && (
                    <button onClick={() => removeDay(dayIndex)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                
                <div className="p-6 space-y-4">
                  {day.activities.map((act, actIndex) => (
                    <div key={actIndex} className="flex gap-4 items-start group">
                      <div className="mt-3 cursor-grab active:cursor-grabbing text-surface-300 hover:text-surface-500">
                        <GripVertical size={20} />
                      </div>
                      <div className="w-24">
                        <input 
                          type="time" 
                          className="input-field !p-2 !text-sm"
                          value={act.time}
                          onChange={(e) => updateActivity(dayIndex, actIndex, 'time', e.target.value)}
                        />
                      </div>
                      <div className="flex-1 flex gap-2">
                        <select 
                          className="input-field !p-2 !text-sm w-32 shrink-0"
                          value={act.type}
                          onChange={(e) => updateActivity(dayIndex, actIndex, 'type', e.target.value)}
                        >
                          <option value="attraction">Attraction</option>
                          <option value="food">Food</option>
                          <option value="travel">Travel</option>
                          <option value="hotel">Hotel</option>
                        </select>
                        <input 
                          type="text" 
                          className="input-field !p-2 !text-sm flex-1"
                          placeholder="Activity description..."
                          value={act.description}
                          onChange={(e) => updateActivity(dayIndex, actIndex, 'description', e.target.value)}
                        />
                        <button 
                          onClick={() => removeActivity(dayIndex, actIndex)}
                          className="text-surface-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => addActivity(dayIndex)}
                    className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg transition-colors ml-8"
                  >
                    <Plus size={16} /> Add Activity
                  </button>
                </div>
              </div>
            ))}

            <button 
              onClick={addDay}
              className="w-full border-2 border-dashed border-surface-300 bg-white hover:bg-surface-50 text-surface-600 font-bold py-6 rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={20} /> Add Another Day
            </button>

            <div className="flex justify-between pt-4">
              <button 
                onClick={() => setStep(1)}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Back to Basics
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
