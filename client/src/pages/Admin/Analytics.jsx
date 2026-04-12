import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target,
  Download, RefreshCw, ArrowUpRight, ArrowDownRight,
  Activity, BarChart2, PieChart as PieChartIcon,
  Radar as RadarIcon, Funnel as FunnelIcon,
  Globe, Clock, Smartphone, Map, Heart, Receipt
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, FunnelChart, Funnel, LabelList, Brush } from 'recharts';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [chartType, setChartType] = useState('composed');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 124500,
    totalOrders: 1842,
    totalUsers: 5420,
    conversionRate: 3.24,
    avgOrderValue: 67.50,
    customerRetention: 68.5,
  });

  // Sample data for demonstration
  const salesData = [
    { name: 'Mon', sales: 4500, orders: 28, visitors: 340, conversion: 8.2, prevSales: 3800 },
    { name: 'Tue', sales: 5200, orders: 32, visitors: 380, conversion: 8.4, prevSales: 4100 },
    { name: 'Wed', sales: 4800, orders: 29, visitors: 360, conversion: 8.1, prevSales: 3900 },
    { name: 'Thu', sales: 6100, orders: 38, visitors: 420, conversion: 9.0, prevSales: 5100 },
    { name: 'Fri', sales: 7500, orders: 46, visitors: 510, conversion: 9.0, prevSales: 6200 },
    { name: 'Sat', sales: 9200, orders: 58, visitors: 680, conversion: 8.5, prevSales: 7800 },
    { name: 'Sun', sales: 8400, orders: 52, visitors: 590, conversion: 8.8, prevSales: 7100 },
  ];

  const monthlyData = [
    { name: 'Jan', revenue: 45000, orders: 280, profit: 12000 },
    { name: 'Feb', revenue: 52000, orders: 320, profit: 14500 },
    { name: 'Mar', revenue: 48000, orders: 290, profit: 13000 },
    { name: 'Apr', revenue: 61000, orders: 380, profit: 18000 },
    { name: 'May', revenue: 75000, orders: 460, profit: 22000 },
    { name: 'Jun', revenue: 92000, orders: 580, profit: 28000 },
  ];

  const categoryData = [
    { name: 'Kitchen', value: 35, sales: 28500, growth: 15.2, color: '#06b6d4' },
    { name: 'Dining', value: 25, sales: 21200, growth: 8.7, color: '#8b5cf6' },
    { name: 'Decor', value: 20, sales: 16800, growth: 12.3, color: '#ec4899' },
    { name: 'Storage', value: 15, sales: 12400, growth: -3.1, color: '#f59e0b' },
    { name: 'Others', value: 5, sales: 4500, growth: 22.5, color: '#10b981' },
  ];

  const customerSegments = [
    { subject: 'New', A: 120, B: 85, fullMark: 150 },
    { subject: 'Returning', A: 98, B: 130, fullMark: 150 },
    { subject: 'VIP', A: 86, B: 65, fullMark: 150 },
    { subject: 'Churned', A: 45, B: 35, fullMark: 150 },
    { subject: 'At Risk', A: 65, B: 55, fullMark: 150 },
    { subject: 'Inactive', A: 35, B: 25, fullMark: 150 },
  ];

  const revenueByChannel = [
    { name: 'Direct', value: 35, color: '#06b6d4' },
    { name: 'Social Media', value: 25, color: '#8b5cf6' },
    { name: 'Organic Search', value: 20, color: '#10b981' },
    { name: 'Email Marketing', value: 12, color: '#f59e0b' },
    { name: 'Paid Ads', value: 8, color: '#ef4444' },
  ];

  const hourlyTraffic = [
    { hour: '00:00', visitors: 120, pageViews: 350, bounceRate: 45 },
    { hour: '03:00', visitors: 80, pageViews: 220, bounceRate: 52 },
    { hour: '06:00', visitors: 150, pageViews: 420, bounceRate: 48 },
    { hour: '09:00', visitors: 420, pageViews: 1250, bounceRate: 38 },
    { hour: '12:00', visitors: 680, pageViews: 2100, bounceRate: 35 },
    { hour: '15:00', visitors: 590, pageViews: 1850, bounceRate: 36 },
    { hour: '18:00', visitors: 750, pageViews: 2400, bounceRate: 34 },
    { hour: '21:00', visitors: 520, pageViews: 1600, bounceRate: 40 },
  ];

  const deviceData = [
    { name: 'Desktop', users: 45, sessions: 52, color: '#06b6d4' },
    { name: 'Mobile', users: 38, sessions: 35, color: '#8b5cf6' },
    { name: 'Tablet', users: 12, sessions: 10, color: '#ec4899' },
    { name: 'Other', users: 5, sessions: 3, color: '#f59e0b' },
  ];

  const geographicData = [
    { country: 'USA', users: 2450, revenue: 45200, conversion: 3.8 },
    { country: 'UK', users: 1200, revenue: 28500, conversion: 4.2 },
    { country: 'Canada', users: 850, revenue: 19200, conversion: 3.5 },
    { country: 'Germany', users: 680, revenue: 16800, conversion: 4.0 },
    { country: 'France', users: 520, revenue: 12400, conversion: 3.2 },
    { country: 'Australia', users: 420, revenue: 9800, conversion: 3.6 },
    { country: 'Japan', users: 380, revenue: 8500, conversion: 2.8 },
    { country: 'Brazil', users: 320, revenue: 6200, conversion: 2.5 },
  ];

  const funnelData = [
    { name: 'Visitors', value: 10000, fill: '#06b6d4' },
    { name: 'Product Views', value: 6500, fill: '#3b82f6' },
    { name: 'Add to Cart', value: 3200, fill: '#8b5cf6' },
    { name: 'Checkout', value: 1800, fill: '#ec4899' },
    { name: 'Purchase', value: 1200, fill: '#10b981' },
  ];

  const topProducts = [
    { name: 'Premium Kitchen Set', sales: 245, revenue: 24500, growth: 15.2 },
    { name: 'Dining Table Pro', sales: 189, revenue: 37800, growth: 8.7 },
    { name: 'Smart Storage Unit', sales: 167, revenue: 16700, growth: 12.3 },
    { name: 'Decor Lamp Deluxe', sales: 145, revenue: 7250, growth: -3.1 },
    { name: 'Chef Knife Set', sales: 134, revenue: 6700, growth: 22.5 },
  ];

  const kpiCards = [
    { title: 'Total Revenue', value: '$124,500', change: '+12.5%', icon: DollarSign, color: 'from-green-500 to-emerald-600', positive: true },
    { title: 'Total Orders', value: '1,842', change: '+8.2%', icon: ShoppingCart, color: 'from-blue-500 to-indigo-600', positive: true },
    { title: 'Active Users', value: '5,420', change: '+15.3%', icon: Users, color: 'from-purple-500 to-pink-600', positive: true },
    { title: 'Conversion Rate', value: '3.24%', change: '-0.4%', icon: Target, color: 'from-orange-500 to-red-600', positive: false },
    { title: 'Avg Order Value', value: '$67.50', change: '+5.1%', icon: Receipt, color: 'from-teal-500 to-cyan-600', positive: true },
    { title: 'Retention Rate', value: '68.5%', change: '+2.3%', icon: Heart, color: 'from-rose-500 to-pink-600', positive: true },
  ];

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const exportData = () => {
    alert('Exporting analytics data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            {['24h', '7days', '30days', '90days', '1year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {range === '24h' ? '24h' : range === '7days' ? '7D' : range === '30days' ? '30D' : range === '90days' ? '90D' : '1Y'}
              </button>
            ))}
          </div>
          <button
            onClick={refreshData}
            className={`p-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${kpi.color}`}>
                <kpi.icon className="w-4 h-4 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${kpi.positive ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{kpi.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{kpi.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales & Revenue Analysis</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your sales performance over time</p>
          </div>
          <div className="flex items-center gap-2">
            {[
              { id: 'composed', icon: Activity, label: 'Composed' },
              { id: 'area', icon: Activity, label: 'Area' },
              { id: 'bar', icon: BarChart2, label: 'Bar' },
              { id: 'line', icon: Activity, label: 'Line' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setChartType(type.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  chartType === type.id
                    ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis yAxisId="left" stroke="#9ca3af" />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#06b6d4" fillOpacity={1} fill="url(#salesGradient)" strokeWidth={2} name="Sales ($)" />
            <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#8b5cf6" fillOpacity={1} fill="url(#ordersGradient)" strokeWidth={2} name="Orders" />
            <Line yAxisId="left" type="monotone" dataKey="prevSales" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Previous Period" />
            <Brush dataKey="name" height={30} stroke="#06b6d4" />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales by Category</h3>
              <p className="text-sm text-gray-500">Revenue distribution across categories</p>
            </div>
            <PieChartIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{cat.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">${cat.sales.toLocaleString()}</p>
                  <p className={`text-xs ${cat.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {cat.growth >= 0 ? '+' : ''}{cat.growth}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Customer Segments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Segments</h3>
              <p className="text-sm text-gray-500">User distribution analysis</p>
            </div>
            <RadarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={customerSegments}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} />
              <Radar name="Current Period" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
              <Radar name="Previous Period" dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue by Channel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue by Channel</h3>
              <p className="text-sm text-gray-500">Traffic sources breakdown</p>
            </div>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueByChannel}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {revenueByChannel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Performance</h3>
              <p className="text-sm text-gray-500">Revenue vs Profit</p>
            </div>
            <BarChart2 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hourly Traffic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hourly Traffic</h3>
              <p className="text-sm text-gray-500">Visitors throughout the day</p>
            </div>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={hourlyTraffic}>
              <defs>
                <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area type="monotone" dataKey="visitors" stroke="#06b6d4" fill="url(#visitorsGradient)" strokeWidth={2} />
              <Line type="monotone" dataKey="pageViews" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Device Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Device Usage</h3>
              <p className="text-sm text-gray-500">Traffic by device type</p>
            </div>
            <Smartphone className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="users"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {deviceData.map((device) => (
              <div key={device.name} className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{device.name}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white ml-auto">{device.users}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Funnel Chart & Geographic Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Conversion Funnel</h3>
              <p className="text-sm text-gray-500">User journey from visit to purchase</p>
            </div>
            <FunnelIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <FunnelChart>
              <Tooltip />
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive
              >
                <LabelList position="inside" fill="#fff" stroke="none" dataKey="name" />
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Geographic Distribution</h3>
              <p className="text-sm text-gray-500">Users and revenue by country</p>
            </div>
            <Map className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {geographicData.map((country, index) => (
              <div key={country.country} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{country.country}</p>
                  <p className="text-xs text-gray-500">{country.users.toLocaleString()} users</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">${country.revenue.toLocaleString()}</p>
                  <p className="text-xs text-green-500">{country.conversion}% conv.</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Products</h3>
            <p className="text-sm text-gray-500">Best sellers by revenue and growth</p>
          </div>
          <Link to="/admin/products" className="text-cyan-600 hover:text-cyan-700 text-sm font-medium">
            View All Products →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Sales</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Growth</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topProducts.map((product) => (
                <tr key={product.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{product.sales} units</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">${product.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-sm ${product.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {product.growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(product.growth)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-24 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { value: Math.random() * 50 + 50 },
                          { value: Math.random() * 50 + 50 },
                          { value: Math.random() * 50 + 50 },
                          { value: Math.random() * 50 + 50 },
                          { value: Math.random() * 50 + 50 },
                        ]}>
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke={product.growth >= 0 ? '#10b981' : '#ef4444'} 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
