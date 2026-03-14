// src/pages/progress/EditProgress.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  X,
  ChevronLeft,
  Weight,
  Ruler,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../components/GlassCard';
import { axiosInstance } from '../../lib/axios';

const EditProgress = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    bodyMeasurements: {
      chest: '',
      waist: '',
      hips: ''
    },
    weight: '',
    performanceMetrics: {
      runTime: '',
      maxLift: ''
    }
  });

  useEffect(() => {
    fetchProgress();
  }, [id]);

  const fetchProgress = async () => {
  try {
    const response = await axiosInstance.get(`/progress/${id}`);
    
    // Check if response.data.progress exists
    if (!response.data.progress) {
      throw new Error('Progress data not found');
    }
    
    const progress = response.data.progress;
    
    // Ensure nested objects exist with fallbacks
    setFormData({
      bodyMeasurements: {
        chest: progress.bodyMeasurements?.chest?.toString() || '',
        waist: progress.bodyMeasurements?.waist?.toString() || '',
        hips: progress.bodyMeasurements?.hips?.toString() || ''
      },
      weight: progress.weight?.toString() || '',
      performanceMetrics: {
        runTime: progress.performanceMetrics?.runTime?.toString() || '',
        maxLift: progress.performanceMetrics?.maxLift?.toString() || ''
      }
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    toast.error(error.response?.data?.message || 'Failed to load progress');
    navigate('/progress');
  } finally {
    setFetchLoading(false);
  }
};
  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      bodyMeasurements: {
        ...prev.bodyMeasurements,
        [name]: value
      }
    }));
  };

  const handlePerformanceChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      performanceMetrics: {
        ...prev.performanceMetrics,
        [name]: value
      }
    }));
  };

  const handleWeightChange = (e) => {
    setFormData(prev => ({
      ...prev,
      weight: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      bodyMeasurements: {
        chest: parseFloat(formData.bodyMeasurements.chest) || 0,
        waist: parseFloat(formData.bodyMeasurements.waist) || 0,
        hips: parseFloat(formData.bodyMeasurements.hips) || 0
      },
      weight: parseFloat(formData.weight) || 0,
      performanceMetrics: {
        runTime: parseFloat(formData.performanceMetrics.runTime) || 0,
        maxLift: parseFloat(formData.performanceMetrics.maxLift) || 0
      }
    };

    try {
      const response = await axiosInstance.put(`/progress/update/progress/${id}`, submitData);
      toast.success(response.data.message);
      navigate('/progress');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update progress');
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
          <h1 className="text-2xl font-bold gradient-text">Edit Progress Entry</h1>
        </div>

        <GlassCard className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Weight */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2" style={{ color: 'var(--theme-text)' }}>
                <Weight size={20} style={{ color: 'var(--theme-primary)' }} />
                <span>Weight</span>
              </h2>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                  Current Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleWeightChange}
                  required
                  min="0"
                  step="0.1"
                  className="theme-input w-full px-4 py-2.5"
                />
              </div>
            </div>

            {/* Body Measurements */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2" style={{ color: 'var(--theme-text)' }}>
                <Ruler size={20} style={{ color: 'var(--theme-primary)' }} />
                <span>Body Measurements (cm)</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                    Chest
                  </label>
                  <input
                    type="number"
                    name="chest"
                    value={formData.bodyMeasurements.chest}
                    onChange={handleMeasurementChange}
                    min="0"
                    step="0.1"
                    className="theme-input w-full px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                    Waist
                  </label>
                  <input
                    type="number"
                    name="waist"
                    value={formData.bodyMeasurements.waist}
                    onChange={handleMeasurementChange}
                    min="0"
                    step="0.1"
                    className="theme-input w-full px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                    Hips
                  </label>
                  <input
                    type="number"
                    name="hips"
                    value={formData.bodyMeasurements.hips}
                    onChange={handleMeasurementChange}
                    min="0"
                    step="0.1"
                    className="theme-input w-full px-4 py-2.5"
                  />
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2" style={{ color: 'var(--theme-text)' }}>
                <Zap size={20} style={{ color: 'var(--theme-primary)' }} />
                <span>Performance Metrics</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                    Run Time (seconds)
                  </label>
                  <input
                    type="number"
                    name="runTime"
                    value={formData.performanceMetrics.runTime}
                    onChange={handlePerformanceChange}
                    min="0"
                    step="0.1"
                    className="theme-input w-full px-4 py-2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                    Max Lift (kg)
                  </label>
                  <input
                    type="number"
                    name="maxLift"
                    value={formData.performanceMetrics.maxLift}
                    onChange={handlePerformanceChange}
                    min="0"
                    step="0.5"
                    className="theme-input w-full px-4 py-2.5"
                  />
                </div>
              </div>
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
                    <span>Update Progress</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/progress')}
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

export default EditProgress;