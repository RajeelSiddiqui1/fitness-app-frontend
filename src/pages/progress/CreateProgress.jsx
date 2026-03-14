// src/pages/progress/CreateProgress.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save,
  X,
  ChevronLeft,
  Weight,
  Ruler,
  Activity,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../components/GlassCard';
import { axiosInstance } from '../../lib/axios';

const CreateProgress = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

    // Prepare data for submission
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
      const response = await axiosInstance.post('/progress/create/progress', submitData);
      toast.success(response.data.message);
      navigate('/progress');
    } catch (error) {
      console.error('Create error:', error);
      toast.error(error.response?.data?.message || 'Failed to save progress');
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
          <h1 className="text-2xl font-bold gradient-text">Record Progress</h1>
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
                  placeholder="75.5"
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
                    placeholder="100"
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
                    placeholder="80"
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
                    placeholder="95"
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
                    placeholder="180"
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
                    placeholder="100"
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Progress</span>
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

export default CreateProgress;