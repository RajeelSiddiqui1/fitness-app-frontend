// src/pages/workout/EditWorkout.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  X,
  Dumbbell,
  Repeat,
  Weight,
  FileText,
  Clock,
  Calendar,
  Bell,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../components/GlassCard';
import { axiosInstance } from '../../lib/axios';

const EditWorkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [enableAlert, setEnableAlert] = useState(false);
  const [formData, setFormData] = useState({
    exrciseName: '',
    sets: '',
    reps: '',
    weight: '',
    notes: '',
    category: 'Strength',
    alertTime: '',
    alertRecurring: 'once'
  });

  const categories = ['Strength', 'Cardio', 'Flexibility'];
  const recurringOptions = [
    { value: 'once', label: 'Once' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' }
  ];

  useEffect(() => {
    fetchWorkout();
  }, [id]);

  const fetchWorkout = async () => {
    try {
      const response = await axiosInstance.get(`/workout/${id}`);
      const workout = response.data.workout;
      
      // Format date for datetime-local input
      const alertTime = workout.alertTime 
        ? new Date(workout.alertTime).toISOString().slice(0, 16)
        : '';
      
      setFormData({
        exrciseName: workout.exrciseName || '',
        sets: workout.sets || '',
        reps: workout.reps || '',
        weight: workout.weight || '',
        notes: workout.notes || '',
        category: workout.category || 'Strength',
        alertTime: alertTime,
        alertRecurring: workout.alertRecurring || 'once'
      });

      // Enable alert toggle if there's an alert time set
      setEnableAlert(!!workout.alertTime);
    } catch (error) {
      console.error('Error fetching workout:', error);
      toast.error('Failed to load workout');
      navigate('/workout');
    } finally {
      setFetchLoading(false);
    }
  };

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
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps),
      weight: parseFloat(formData.weight),
      // Only include alert fields if alert is enabled and time is set
      alertTime: enableAlert && formData.alertTime ? formData.alertTime : null,
      alertRecurring: enableAlert && formData.alertTime ? formData.alertRecurring : 'once'
    };

    try {
      const response = await axiosInstance.put(`/workout/update/workout/${id}`, submitData);
      toast.success(response.data.message);
      navigate('/workout');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update workout');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold gradient-text">Edit Workout</h1>
        </div>

        <GlassCard className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Exercise Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                Exercise Name *
              </label>
              <div className="relative">
                <Dumbbell className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: 'var(--theme-textMuted)' }} />
                <input
                  type="text"
                  name="exrciseName"
                  value={formData.exrciseName}
                  onChange={handleChange}
                  required
                  className="theme-input w-full pl-10 pr-4 py-2.5"
                />
              </div>
            </div>

            {/* Sets, Reps, Weight */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                  Sets *
                </label>
                <input
                  type="number"
                  name="sets"
                  value={formData.sets}
                  onChange={handleChange}
                  required
                  min="1"
                  className="theme-input w-full px-4 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                  Reps *
                </label>
                <input
                  type="number"
                  name="reps"
                  value={formData.reps}
                  onChange={handleChange}
                  required
                  min="1"
                  className="theme-input w-full px-4 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.5"
                  className="theme-input w-full px-4 py-2.5"
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="theme-input w-full px-4 py-2.5"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                Notes
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3" size={18} style={{ color: 'var(--theme-textMuted)' }} />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="theme-input w-full pl-10 pr-4 py-2.5"
                />
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
                  <span>Set a reminder for this workout</span>
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
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Update Workout</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/workout')}
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

export default EditWorkout;