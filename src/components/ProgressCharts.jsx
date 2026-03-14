// src/components/ProgressCharts.js
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Area, AreaChart, Legend,
  ComposedChart, Bar
} from 'recharts';
import { 
  TrendingDown, TrendingUp, Activity, Ruler, 
  Zap, Calendar, Filter, Loader
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from './GlassCard';
import { axiosInstance } from '../lib/axios';

const CustomTooltip = ({ active, payload, label, unit = 'kg' }) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="glass-card p-3"
        style={{ 
          border: '1px solid var(--theme-cardBorder)',
          boxShadow: 'var(--theme-shadow)'
        }}
      >
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>
          {new Date(label).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-medium" style={{ color: 'var(--theme-text)' }}>
              {entry.value} {unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ChartControls = ({ timeRange, setTimeRange, chartType, setChartType, metric, setMetric }) => {
  const timeRanges = [
    { value: '7', label: '7D' },
    { value: '30', label: '30D' },
    { value: '90', label: '3M' },
    { value: '180', label: '6M' },
    { value: '365', label: '1Y' },
    { value: 'all', label: 'All' }
  ];

  const chartTypes = [
    { value: 'area', label: 'Area', icon: '📈' },
    { value: 'line', label: 'Line', icon: '📊' },
    { value: 'bar', label: 'Bar', icon: '📋' }
  ];

  const metrics = [
    { value: 'weight', label: 'Weight', icon: '⚖️' },
    { value: 'chest', label: 'Chest', icon: '📏' },
    { value: 'waist', label: 'Waist', icon: '📐' },
    { value: 'hips', label: 'Hips', icon: '📏' },
    { value: 'runTime', label: 'Run Time', icon: '🏃' },
    { value: 'maxLift', label: 'Max Lift', icon: '🏋️' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 overflow-x-auto pb-2">
      {/* Metric Selector - scrollable on mobile */}
      <div className="flex items-center gap-1 p-1 rounded-lg shrink-0" style={{ background: 'var(--theme-bgLight)' }}>
        {metrics.map(m => (
          <button
            key={m.value}
            onClick={() => setMetric(m.value)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 whitespace-nowrap ${
              metric === m.value 
                ? 'bg-primary text-white' 
                : 'hover:bg-white/10'
            }`}
            style={{ 
              color: metric === m.value ? 'white' : 'var(--theme-textSecondary)'
            }}
          >
            <span className="hidden sm:inline">{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-1 p-1 rounded-lg shrink-0" style={{ background: 'var(--theme-bgLight)' }}>
        {timeRanges.map(range => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              timeRange === range.value 
                ? 'bg-primary text-white' 
                : 'hover:bg-white/10'
            }`}
            style={{ 
              color: timeRange === range.value ? 'white' : 'var(--theme-textSecondary)'
            }}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Chart Type Selector */}
      <div className="flex items-center gap-1 p-1 rounded-lg shrink-0" style={{ background: 'var(--theme-bgLight)' }}>
        {chartTypes.map(type => (
          <button
            key={type.value}
            onClick={() => setChartType(type.value)}
            className={`px-2 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 whitespace-nowrap ${
              chartType === type.value 
                ? 'bg-primary text-white' 
                : 'hover:bg-white/10'
            }`}
            style={{ 
              color: chartType === type.value ? 'white' : 'var(--theme-textSecondary)'
            }}
          >
            <span className="hidden sm:inline">{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ProgressCharts = () => {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [measurementUnit, setMeasurementUnit] = useState('kg');
  const [timeRange, setTimeRange] = useState('30');
  const [chartType, setChartType] = useState('area');
  const [metric, setMetric] = useState('weight');
  const [stats, setStats] = useState({
    start: 0,
    current: 0,
    change: 0,
    changePercent: 0,
    average: 0,
    min: 0,
    max: 0
  });

  useEffect(() => {
    fetchProgressData();
  }, []);

  useEffect(() => {
    filterDataByTimeRange();
  }, [progressData, timeRange]);

  useEffect(() => {
    calculateStats();
  }, [filteredData, metric]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/progress');
      
      // Your API returns { measurementUnit, workouts: converted }
      const data = response.data.workouts || [];
      setMeasurementUnit(response.data.measurementUnit || 'kg');
      
      // Sort by date (oldest first for charts)
      const sortedData = data.sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      );
      
      setProgressData(sortedData);
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const filterDataByTimeRange = () => {
    if (timeRange === 'all') {
      setFilteredData(progressData);
      return;
    }

    const daysAgo = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    const filtered = progressData.filter(item => 
      new Date(item.createdAt) >= cutoffDate
    );
    
    setFilteredData(filtered);
  };

  const calculateStats = () => {
    if (filteredData.length === 0) {
      setStats({
        start: 0,
        current: 0,
        change: 0,
        changePercent: 0,
        average: 0,
        min: 0,
        max: 0
      });
      return;
    }

    let values = [];
    
    if (metric === 'weight') {
      values = filteredData.map(d => d.weight || 0);
    } else if (['chest', 'waist', 'hips'].includes(metric)) {
      values = filteredData.map(d => d.bodyMeasurements?.[metric] || 0);
    } else if (metric === 'runTime' || metric === 'maxLift') {
      values = filteredData.map(d => d.performanceMetrics?.[metric] || 0);
    }

    // Filter out zeros if needed (optional)
    values = values.filter(v => v > 0);

    if (values.length === 0) {
      setStats({
        start: 0,
        current: 0,
        change: 0,
        changePercent: 0,
        average: 0,
        min: 0,
        max: 0
      });
      return;
    }

    const start = values[0];
    const current = values[values.length - 1];
    const change = current - start;
    const changePercent = start !== 0 ? ((change / start) * 100).toFixed(1) : 0;
    const average = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    const min = Math.min(...values);
    const max = Math.max(...values);

    setStats({
      start,
      current,
      change,
      changePercent,
      average,
      min,
      max
    });
  };

  const getChartData = () => {
    return filteredData.map(item => {
      let value = 0;
      
      if (metric === 'weight') {
        value = item.weight || 0;
      } else if (metric === 'chest') {
        value = item.bodyMeasurements?.chest || 0;
      } else if (metric === 'waist') {
        value = item.bodyMeasurements?.waist || 0;
      } else if (metric === 'hips') {
        value = item.bodyMeasurements?.hips || 0;
      } else if (metric === 'runTime') {
        value = item.performanceMetrics?.runTime || 0;
      } else if (metric === 'maxLift') {
        value = item.performanceMetrics?.maxLift || 0;
      }

      return {
        date: item.createdAt,
        value: value,
        formattedDate: new Date(item.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      };
    }).filter(item => item.value > 0); // Only show entries with data
  };

  const getMetricLabel = () => {
    switch(metric) {
      case 'weight': return `Weight (${measurementUnit})`;
      case 'chest': return 'Chest (cm)';
      case 'waist': return 'Waist (cm)';
      case 'hips': return 'Hips (cm)';
      case 'runTime': return 'Run Time (seconds)';
      case 'maxLift': return `Max Lift (${measurementUnit})`;
      default: return 'Value';
    }
  };

  const getMetricIcon = () => {
    switch(metric) {
      case 'weight': return <Activity size={20} />;
      case 'chest':
      case 'waist':
      case 'hips': return <Ruler size={20} />;
      case 'runTime':
      case 'maxLift': return <Zap size={20} />;
      default: return <TrendingUp size={20} />;
    }
  };

  const getTrendIcon = () => {
    if (stats.change > 0) {
      return <TrendingUp size={16} style={{ color: 'var(--theme-error)' }} />;
    } else if (stats.change < 0) {
      return <TrendingDown size={16} style={{ color: 'var(--theme-success)' }} />;
    }
    return null;
  };

  const renderChart = () => {
    const chartData = getChartData();
    const unit = metric.includes('weight') || metric === 'maxLift' ? measurementUnit : 
                metric.includes('chest') || metric.includes('waist') || metric.includes('hips') ? 'cm' : 
                metric === 'runTime' ? 's' : '';

    if (chartData.length === 0) {
      return (
        <div className="h-48 md:h-64 flex items-center justify-center">
          <p style={{ color: 'var(--theme-textMuted)' }}>No data available for this metric</p>
        </div>
      );
    }

    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 }
    };

    const renderLineOrArea = () => {
      switch(chartType) {
        case 'area':
          return (
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-divider)" vertical={false} />
              <XAxis 
                dataKey="formattedDate" 
                stroke="var(--theme-textMuted)"
                tick={{ fill: 'var(--theme-textMuted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--theme-divider)' }}
              />
              <YAxis 
                stroke="var(--theme-textMuted)"
                tick={{ fill: 'var(--theme-textMuted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--theme-divider)' }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#colorGradient)"
                dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#6366f1' }}
                name={getMetricLabel()}
              />
            </AreaChart>
          );
        
        case 'line':
          return (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-divider)" vertical={false} />
              <XAxis 
                dataKey="formattedDate" 
                stroke="var(--theme-textMuted)"
                tick={{ fill: 'var(--theme-textMuted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--theme-divider)' }}
              />
              <YAxis 
                stroke="var(--theme-textMuted)"
                tick={{ fill: 'var(--theme-textMuted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--theme-divider)' }}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: '#6366f1', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#6366f1' }}
                name={getMetricLabel()}
              />
            </LineChart>
          );
        
        case 'bar':
          return (
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-divider)" vertical={false} />
              <XAxis 
                dataKey="formattedDate" 
                stroke="var(--theme-textMuted)"
                tick={{ fill: 'var(--theme-textMuted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--theme-divider)' }}
              />
              <YAxis 
                stroke="var(--theme-textMuted)"
                tick={{ fill: 'var(--theme-textMuted)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--theme-divider)' }}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} name={getMetricLabel()} />
            </ComposedChart>
          );
        
        default:
          return null;
      }
    };

    return (
      <ResponsiveContainer width="100%" height="100%">
        {renderLineOrArea()}
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <GlassCard className="col-span-1 lg:col-span-2">
        <div className="h-48 md:h-80 flex items-center justify-center">
          <Loader className="animate-spin" size={32} style={{ color: 'var(--theme-primary)' }} />
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="col-span-1 lg:col-span-2 p-4 md:p-6 bounceIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: 'var(--theme-primaryLight)' }}>
            {getMetricIcon()}
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
              {metric === 'weight' ? 'Weight Progress' :
               metric === 'chest' ? 'Chest Measurement' :
               metric === 'waist' ? 'Waist Measurement' :
               metric === 'hips' ? 'Hips Measurement' :
               metric === 'runTime' ? 'Run Time Progress' :
               metric === 'maxLift' ? 'Max Lift Progress' : 'Progress'}
            </h3>
            <p className="text-xs md:text-sm" style={{ color: 'var(--theme-textMuted)' }}>
              {filteredData.length} entries • Last updated: {filteredData.length > 0 
                ? new Date(filteredData[filteredData.length - 1]?.createdAt).toLocaleDateString()
                : 'No data'}
            </p>
          </div>
        </div>

        {stats.change !== 0 && (
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ 
              background: stats.change > 0 
                ? 'var(--theme-errorLight, rgba(239, 68, 68, 0.15))' 
                : 'var(--theme-successLight, rgba(16, 185, 129, 0.15))'
            }}
          >
            {getTrendIcon()}
            <span className="text-xs md:text-sm font-medium" style={{ 
              color: stats.change > 0 ? 'var(--theme-error)' : 'var(--theme-success)' 
            }}>
              {stats.change > 0 ? '+' : ''}{stats.change} {measurementUnit} ({stats.changePercent}%)
            </span>
          </div>
        )}
      </div>

      <ChartControls 
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        chartType={chartType}
        setChartType={setChartType}
        metric={metric}
        setMetric={setMetric}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="p-2 rounded-lg" style={{ background: 'var(--theme-bgLight)' }}>
          <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Average</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>{stats.average}</p>
        </div>
        <div className="p-2 rounded-lg" style={{ background: 'var(--theme-bgLight)' }}>
          <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Min</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>{stats.min}</p>
        </div>
        <div className="p-2 rounded-lg" style={{ background: 'var(--theme-bgLight)' }}>
          <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Max</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>{stats.max}</p>
        </div>
        <div className="p-2 rounded-lg" style={{ background: 'var(--theme-bgLight)' }}>
          <p className="text-xs" style={{ color: 'var(--theme-textMuted)' }}>Current</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>{stats.current}</p>
        </div>
      </div>
      
      <div className="h-48 md:h-80">
        {renderChart()}
      </div>
    </GlassCard>
  );
};

export default ProgressCharts;