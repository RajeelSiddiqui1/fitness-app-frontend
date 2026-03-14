// src/pages/nutrition/CreateNutrition.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  X,
  Apple,
  Beef,
  Wheat,
  Droplet,
  Flame,
  Scale,
  Clock,
  Calendar,
  Bell,
  ChevronLeft,
  Coffee,
  Cookie
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../components/GlassCard';
import { axiosInstance } from '../../lib/axios';

const CreateNutrition = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [enableAlert, setEnableAlert] = useState(false);
  const [formData, setFormData] = useState({
    mealType: 'Breakfast',
    foodItem: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    alertTime: '',
    alertRecurring: 'once'
  });

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const recurringOptions = [
    { value: 'once', label: 'Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAlertToggle = (e) => {
    setEnableAlert(e.target.checked);
    if (!e.target.checked) {
      setFormData(prev => ({
        ...prev,
        alertTime: '',
        alertRecurring: 'once'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data for submission
    const submitData = {
      ...formData,
      quantity: parseFloat(formData.quantity),
      calories: parseInt(formData.calories),
      protein: parseFloat(formData.protein),
      carbs: parseFloat(formData.carbs),
      fats: parseFloat(formData.fats),
      alertTime: enableAlert && formData.alertTime ? formData.alertTime : null,
      alertRecurring: enableAlert && formData.alertTime ? formData.alertRecurring : 'once'
    };

    try {
      const response = await axiosInstance.post('/nutrition/create/nutrition', submitData);
      toast.success(response.data.message);
      navigate('/nutrition');
    } catch (error) {
      console.error('Create error:', error);
      toast.error(error.response?.data?.message || 'Failed to create nutrition entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--theme-bg)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors"
            style={{ color: 'var(--theme-textSecondary)' }}
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold gradient-text">Add Food Entry</h1>
        </div>

        <GlassCard className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Meal Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                Meal Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {mealTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, mealType: type }))}
                    className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      formData.mealType === type 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    style={{ color: formData.mealType === type ? 'var(--theme-primary)' : 'var(--theme-textSecondary)' }}
                  >
                    {type === 'Breakfast' && <Coffee size={16} />}
                    {type === 'Lunch' && <Beef size={16} />}
                    {type === 'Dinner' && <Beef size={16} />}
                    {type === 'Snack' && <Cookie size={16} />}
                    <span className="text-sm">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Food Item */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                Food Item *
              </label>
              <div className="relative">
                <Apple className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--theme-textMuted)' }} />
                <input
                  type="text"
                  name="foodItem"
                  value={formData.foodItem}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Grilled Chicken, Oatmeal, Apple"
                  className="theme-input w-full pl-10 pr-4 py-2.5"
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                Quantity (grams) *
              </label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--theme-textMuted)' }} />
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  step="1"
                  placeholder="100"
                  className="theme-input w-full pl-10 pr-4 py-2.5"
                />
              </div>
            </div>

            {/* Nutrition Facts */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                  Calories *
                </label>
                <div className="relative">
                  <Flame className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--theme-textMuted)' }} />
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="250"
                    className="theme-input w-full pl-10 pr-4 py-2.5"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                  Protein (g) *
                </label>
                <div className="relative">
                  <Beef className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--theme-textMuted)' }} />
                  <input
                    type="number"
                    name="protein"
                    value={formData.protein}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    placeholder="20"
                    className="theme-input w-full pl-10 pr-4 py-2.5"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                  Carbs (g) *
                </label>
                <div className="relative">
                  <Wheat className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--theme-textMuted)' }} />
                  <input
                    type="number"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    placeholder="30"
                    className="theme-input w-full pl-10 pr-4 py-2.5"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                  Fats (g) *
                </label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--theme-textMuted)' }} />
                  <input
                    type="number"
                    name="fats"
                    value={formData.fats}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    placeholder="10"
                    className="theme-input w-full pl-10 pr-4 py-2.5"
                  />
                </div>
              </div>
            </div>

            {/* Alert Settings */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  id="enableAlert"
                  checked={enableAlert}
                  onChange={handleAlertToggle}
                  className="w-4 h-4 rounded border-gray-600 bg-white/5"
                />
                <label 
                  htmlFor="enableAlert" 
                  className="text-sm font-medium flex items-center space-x-2 cursor-pointer"
                  style={{ color: 'var(--theme-textSecondary)' }}
                >
                  <Bell size={16} />
                  <span>Set a reminder for this meal</span>
                </label>
              </div>

              {enableAlert && (
                <div className="pl-7 space-y-4">
                  {/* Alert Time */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                      Reminder Time *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--theme-textMuted)' }} />
                      <input
                        type="datetime-local"
                        name="alertTime"
                        value={formData.alertTime}
                        onChange={handleChange}
                        required={enableAlert}
                        className="theme-input w-full pl-10 pr-4 py-2.5"
                      />
                    </div>
                  </div>

                  {/* Recurring Option */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                      Repeat
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--theme-textMuted)' }} />
                      <select
                        name="alertRecurring"
                        value={formData.alertRecurring}
                        onChange={handleChange}
                        className="theme-input w-full pl-10 pr-4 py-2.5"
                      >
                        {recurringOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>
                    You'll receive notifications at the specified time
                  </p>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl btn-primary"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Add Food</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/nutrition')}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl"
                style={{ 
                  background: 'rgba(255,255,255,0.1)',
                  color: 'var(--theme-text)'
                }}
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default CreateNutrition;