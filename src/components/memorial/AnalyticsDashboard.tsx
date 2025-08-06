import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Eye, Camera, QrCode, Smartphone, Calendar, TrendingUp, Download } from 'lucide-react';
import { apiClient, AnalyticsData } from '@/lib/api';

interface AnalyticsDashboardProps {
  memorialId: string;
  memorialName: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  memorialId,
  memorialName
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [memorialId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMemorialAnalytics(memorialId);
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    if (!analytics) return;
    
    const csvData = [
      ['View Type', 'Count'],
      ...analytics.view_stats.map(stat => [stat.view_type, stat.count.toString()])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `memorial-analytics-${memorialId}.csv`;
    a.click();
    
    URL.revokeObjectURL(url);
  };

  const getViewTypeIcon = (viewType: string) => {
    switch (viewType) {
      case 'card': return <Eye className="w-4 h-4" />;
      case 'ar': return <Camera className="w-4 h-4" />;
      case 'hologram': return <Smartphone className="w-4 h-4" />;
      case 'qr_scan': return <QrCode className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getViewTypeColor = (viewType: string) => {
    switch (viewType) {
      case 'card': return '#8884d8';
      case 'ar': return '#82ca9d';
      case 'hologram': return '#ffc658';
      case 'qr_scan': return '#ff7300';
      default: return '#8884d8';
    }
  };

  const formatViewType = (viewType: string) => {
    switch (viewType) {
      case 'card': return 'Card Views';
      case 'ar': return 'AR Views';
      case 'hologram': return 'Hologram Views';
      case 'qr_scan': return 'QR Scans';
      default: return viewType;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <Card className="p-8 text-center">
          <div className="text-destructive mb-4">Analytics Error</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={loadAnalytics}>Retry</Button>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Memorial Analytics</h1>
          <p className="text-muted-foreground">{memorialName}</p>
        </div>
        <Button onClick={exportData} variant="outline" className="border-primary">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{analytics.total_views}</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </div>
        </Card>

        {analytics.view_stats.slice(0, 3).map((stat, index) => (
          <Card key={stat.view_type} className="p-6">
            <div className="flex items-center gap-3">
              {getViewTypeIcon(stat.view_type)}
              <div>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-sm text-muted-foreground">
                  {formatViewType(stat.view_type)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Views by Type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.view_stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="view_type" 
                  tickFormatter={formatViewType}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={formatViewType}
                  formatter={(value) => [value, 'Views']}
                />
                <Bar 
                  dataKey="count" 
                  fill="#hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">View Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.view_stats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ view_type, percent }) => 
                    `${formatViewType(view_type)} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.view_stats.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getViewTypeColor(entry.view_type)} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Views']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {analytics.recent_views.length > 0 ? (
            analytics.recent_views.map((view, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getViewTypeIcon(view.view_type)}
                  <div>
                    <p className="font-medium">{formatViewType(view.view_type)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(view.viewed_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {view.user_agent.includes('Mobile') ? 'Mobile' : 'Desktop'}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No recent activity
            </p>
          )}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 bg-gradient-memorial border-primary/20">
        <h3 className="text-lg font-semibold text-primary mb-4">Insights</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-2">Most Popular Feature:</p>
            <p className="text-muted-foreground">
              {analytics.view_stats.length > 0 
                ? formatViewType(analytics.view_stats[0].view_type)
                : 'No data yet'
              }
            </p>
          </div>
          <div>
            <p className="font-medium mb-2">Engagement Rate:</p>
            <p className="text-muted-foreground">
              {analytics.total_views > 0 
                ? `${Math.round((analytics.view_stats.filter(s => s.view_type !== 'card').reduce((acc, s) => acc + s.count, 0) / analytics.total_views) * 100)}% interactive`
                : 'No data yet'
              }
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};