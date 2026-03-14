// src/pages/nutrition/NutritionDetail.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Apple,
  Beef,
  Wheat,
  Droplet,
  Flame,
  Scale,
  Clock,
  Calendar,
  Globe,
  Lock,
  CheckCircle,
  Circle,
  XCircle,
  Edit2,
  Trash2,
  FileText,
  AlertCircle,
  ChevronDown,
  Coffee,
  Cookie,
  Download,
  X,
  File,
  Table
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../../components/GlassCard';
import { axiosInstance } from '../../lib/axios';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { exportNutritionToPdf, exportNutritionToWord, exportNutritionToCsv } from '../../lib/exportPdf';

const NutritionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const statusOptions = ['Pending', 'Completed', 'Missed'];

  useEffect(() => {
    fetchNutritionDetail();
  }, [id]);

  const fetchNutritionDetail = async () => {
    try {
      const response = await axiosInstance.get(`/nutrition/${id}`);
      setNutrition(response.data.nutrition);
    } catch (error) {
      console.error('Error fetching nutrition:', error);
      toast.error('Failed to load nutrition details');
      navigate('/nutrition');
    } finally {
      setLoading(false);
    }
  };

  const getMealIcon = () => {
    switch (nutrition?.mealType) {
      case 'Breakfast':
        return <Coffee size={24} style={{ color: 'var(--theme-primary)' }} />;
      case 'Lunch':
        return <Beef size={24} style={{ color: 'var(--theme-primary)' }} />;
      case 'Dinner':
        return <Beef size={24} style={{ color: 'var(--theme-primary)' }} />;
      default:
        return <Apple size={24} style={{ color: 'var(--theme-primary)' }} />;
    }
  };

  const getMealColor = () => {
    switch (nutrition?.mealType) {
      case 'Breakfast':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Lunch':
        return 'bg-orange-500/20 text-orange-400';
      case 'Dinner':
        return 'bg-purple-500/20 text-purple-400';
      case 'Snack':
        return 'bg-pink-500/20 text-pink-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status = nutrition?.status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={20} style={{ color: 'var(--theme-success)' }} />;
      case 'Missed':
        return <XCircle size={20} style={{ color: 'var(--theme-error)' }} />;
      default:
        return <Circle size={20} style={{ color: 'var(--theme-warning)' }} />;
    }
  };

  const getStatusColor = (status = nutrition?.status) => {
    switch (status) {
      case 'Completed':
        return 'var(--theme-success)';
      case 'Missed':
        return 'var(--theme-error)';
      default:
        return 'var(--theme-warning)';
    }
  };

  const getStatusBgColor = (status = nutrition?.status) => {
    switch (status) {
      case 'Completed':
        return 'rgba(34, 197, 94, 0.1)';
      case 'Missed':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return 'rgba(234, 179, 8, 0.1)';
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (updatingStatus || newStatus === nutrition.status) {
      setShowStatusDropdown(false);
      return;
    }
    
    try {
      setUpdatingStatus(true);
      
      if (newStatus === 'Missed') {
        toast.error('Missed status can only be set automatically');
        setShowStatusDropdown(false);
        return;
      }
      
      const response = await axiosInstance.patch(`/nutrition/status-update/nutrition/${id}`);
      toast.success(response.data.message);
      await fetchNutritionDetail();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
      setShowStatusDropdown(false);
    }
  };

  const handleToggleShared = async () => {
    if (toggling) return;
    
    try {
      setToggling(true);
      const response = await axiosInstance.patch(`/nutrition/toggle/nutrition/${id}`);
      toast.success(response.data.message);
      await fetchNutritionDetail();
    } catch (error) {
      console.error('Toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to update sharing');
    } finally {
      setToggling(false);
    }
  };

  const handleExportPdf = () => {
    if (nutrition && user) {
      exportNutritionToPdf(nutrition, user.userName);
      toast.success('PDF exported successfully!');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this nutrition entry?')) {
      try {
        await axiosInstance.delete(`/nutrition/delete/nutrition/${id}`);
        toast.success('Nutrition entry deleted successfully');
        navigate('/nutrition');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete nutrition entry');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRecurring = (recurring) => {
    switch (recurring) {
      case 'daily':
        return 'Repeats daily';
      case 'weekly':
        return 'Repeats weekly';
      default:
        return 'One-time reminder';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!nutrition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--theme-error)' }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--theme-text)' }}>Nutrition entry not found</h2>
          <button
            onClick={() => navigate('/nutrition')}
            className="px-6 py-2 rounded-xl btn-primary mt-4"
          >
            Back to Nutrition
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--theme-bg)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-up">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
              style={{ color: 'var(--theme-textSecondary)' }}
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold gradient-text">Nutrition Details</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleShared}
              disabled={toggling}
              className={`p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110 ${toggling ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={`Make ${nutrition.shared === 'Public' ? 'Private' : 'Public'}`}
            >
              {nutrition.shared === 'Public' ? (
                <Globe size={20} style={{ color: 'var(--theme-primary)' }} />
              ) : (
                <Lock size={20} style={{ color: 'var(--theme-textMuted)' }} />
              )}
            </button>
            <button
              onClick={() => navigate(`/nutrition/edit/${id}`)}
              className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
              title="Edit Entry"
            >
              <Edit2 size={20} style={{ color: 'var(--theme-textSecondary)' }} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
              title="Delete Entry"
            >
              <Trash2 size={20} style={{ color: 'var(--theme-error)' }} />
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
              title="Export"
              style={{ color: 'var(--theme-success)' }}
            >
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }} 
              onClick={() => setShowExportModal(false)} 
            />
            <div 
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50" 
              style={{ background: 'var(--theme-bg)', borderRadius: '16px', border: '1px solid var(--theme-border)' }}
            >
              <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--theme-border)', background: 'var(--theme-bgLight)' }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>Export Nutrition Details</h3>
                <button onClick={() => setShowExportModal(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
                  <X size={20} style={{ color: 'var(--theme-textMuted)' }} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-sm mb-4" style={{ color: 'var(--theme-textMuted)' }}>Choose a format to export your nutrition details:</p>
                <button 
                  onClick={() => { 
                    exportNutritionToPdf(nutrition, user?.userName || 'User'); 
                    toast.success('PDF exported successfully!'); 
                    setShowExportModal(false); 
                  }} 
                  className="w-full p-4 rounded-xl flex items-center gap-4" 
                  style={{ background: 'var(--theme-bgLight)', border: '1px solid var(--theme-border)' }}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#EF4444' }}>
                    <File size={24} color="white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold" style={{ color: 'var(--theme-text)' }}>PDF Document</div>
                    <div className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Download as PDF file</div>
                  </div>
                </button>
                <button 
                  onClick={() => { 
                    exportNutritionToWord(nutrition, user?.userName || 'User'); 
                    toast.success('Word document exported successfully!'); 
                    setShowExportModal(false); 
                  }} 
                  className="w-full p-4 rounded-xl flex items-center gap-4" 
                  style={{ background: 'var(--theme-bgLight)', border: '1px solid var(--theme-border)' }}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#4F46E5' }}>
                    <FileText size={24} color="white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold" style={{ color: 'var(--theme-text)' }}>Word Document</div>
                    <div className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Download as DOC file</div>
                  </div>
                </button>
                <button 
                  onClick={() => { 
                    exportNutritionToCsv(nutrition, user?.userName || 'User'); 
                    toast.success('CSV exported successfully!'); 
                    setShowExportModal(false); 
                  }} 
                  className="w-full p-4 rounded-xl flex items-center gap-4" 
                  style={{ background: 'var(--theme-bgLight)', border: '1px solid var(--theme-border)' }}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#10B981' }}>
                    <Table size={24} color="white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold" style={{ color: 'var(--theme-text)' }}>CSV File</div>
                    <div className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Download as CSV file</div>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 bounceIn">
              {/* Title & Status Dropdown */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getMealIcon()}
                  <div>
                    <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--theme-text)' }}>
                      {nutrition.foodItem}
                    </h2>
                    <span className={`px-3 py-1 text-sm rounded-full ${getMealColor()}`}>
                      {nutrition.mealType}
                    </span>
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    disabled={updatingStatus}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                      updatingStatus ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'
                    }`}
                    style={{ background: getStatusBgColor() }}
                  >
                    {getStatusIcon()}
                    <span style={{ color: getStatusColor() }}>
                      {updatingStatus ? 'Updating...' : nutrition.status}
                    </span>
                    <ChevronDown size={16} style={{ color: getStatusColor() }} />
                  </button>

                  {/* Dropdown Menu */}
                  {showStatusDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowStatusDropdown(false)}
                      />
                      <div 
                        className="absolute right-0 mt-1 w-40 rounded-lg overflow-hidden z-20"
                        style={{ 
                          background: 'var(--theme-bg)',
                          border: '1px solid var(--theme-border)',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className={`w-full flex items-center space-x-2 px-3 py-2 text-sm transition-colors ${
                              status === nutrition.status 
                                ? 'bg-white/10 cursor-default' 
                                : 'hover:bg-white/5'
                            }`}
                            disabled={status === nutrition.status}
                          >
                            {status === 'Completed' && <CheckCircle size={16} style={{ color: 'var(--theme-success)' }} />}
                            {status === 'Missed' && <XCircle size={16} style={{ color: 'var(--theme-error)' }} />}
                            {status === 'Pending' && <Circle size={16} style={{ color: 'var(--theme-warning)' }} />}
                            <span style={{ 
                              color: status === nutrition.status 
                                ? 'var(--theme-textSecondary)' 
                                : status === 'Completed' ? 'var(--theme-success)' :
                                  status === 'Missed' ? 'var(--theme-error)' : 'var(--theme-warning)'
                            }}>
                              {status}
                            </span>
                            {status === nutrition.status && (
                              <span className="ml-auto text-xs" style={{ color: 'var(--theme-textMuted)' }}>✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Nutrition Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Flame size={24} className="mx-auto mb-2" style={{ color: 'var(--theme-primary)' }} />
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Calories</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>{nutrition.calories}</p>
                </div>
                <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Beef size={24} className="mx-auto mb-2" style={{ color: 'var(--theme-primary)' }} />
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Protein</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>{nutrition.protein}g</p>
                </div>
                <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Wheat size={24} className="mx-auto mb-2" style={{ color: 'var(--theme-primary)' }} />
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Carbs</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>{nutrition.carbs}g</p>
                </div>
                <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Droplet size={24} className="mx-auto mb-2" style={{ color: 'var(--theme-primary)' }} />
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>Fats</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>{nutrition.fats}g</p>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                  Quantity
                </h3>
                <div className="flex items-center space-x-2 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Scale size={18} style={{ color: 'var(--theme-primary)' }} />
                  <span style={{ color: 'var(--theme-text)' }}>{nutrition.quantity} grams</span>
                </div>
              </div>

              {/* Created/Updated Info */}
              <div className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>
                <p>Created: {formatDate(nutrition.createdAt)}</p>
                {nutrition.updatedAt !== nutrition.createdAt && (
                  <p>Last updated: {formatDate(nutrition.updatedAt)}</p>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Column - Additional Info */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 bounceIn">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--theme-text)' }}>
                Additional Information
              </h3>

              {/* Alert Info */}
              {nutrition.alertTime ? (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                    Reminder
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} style={{ color: 'var(--theme-primary)' }} />
                      <span className="text-sm" style={{ color: 'var(--theme-text)' }}>
                        {new Date(nutrition.alertTime).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} style={{ color: 'var(--theme-primary)' }} />
                      <span className="text-sm" style={{ color: 'var(--theme-text)' }}>
                        {formatRecurring(nutrition.alertRecurring)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                    Reminder
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--theme-textMuted)' }}>
                    No reminder set
                  </p>
                </div>
              )}

              {/* Privacy Info */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                  Privacy
                </h4>
                <div className="flex items-center space-x-2">
                  {nutrition.shared === 'Public' ? (
                    <>
                      <Globe size={16} style={{ color: 'var(--theme-primary)' }} />
                      <span className="text-sm" style={{ color: 'var(--theme-text)' }}>
                        Public - Visible to followers
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} style={{ color: 'var(--theme-textMuted)' }} />
                      <span className="text-sm" style={{ color: 'var(--theme-text)' }}>
                        Private - Only visible to you
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Entry ID */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--theme-textSecondary)' }}>
                  Entry ID
                </h4>
                <p className="text-xs font-mono" style={{ color: 'var(--theme-textMuted)' }}>
                  {nutrition._id}
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionDetail;