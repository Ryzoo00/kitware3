import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, ShoppingCart, BarChart3, Settings, LogOut, Menu, X, TrendingUp, TrendingDown, DollarSign, Package, CheckCircle, Clock, Search, Bell, ChevronRight, Filter, Download, Eye, Edit, Trash2, Plus, MoreVertical, Activity, Target, Zap, Mail, AlertCircle, Truck, Printer } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import axios from 'axios';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalSales: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0,
    salesChange: 12.5, ordersChange: 8.2, usersChange: 15.3, productsChange: -2.1,
    avgOrderValue: 0, conversionRate: 3.2, customerRetention: 68,
    bounceRate: 42, sessionDuration: 4.5,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7days');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', message: 'New order #12345 received', time: '2 min ago', read: false },
    { id: 2, type: 'review', message: 'New 5-star review on Product X', time: '15 min ago', read: false },
    { id: 3, type: 'alert', message: 'Low stock alert: Kitchen Set', time: '1 hour ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Enhanced Sales Data with multiple metrics
  const salesData = [
    { name: 'Mon', sales: 4500, orders: 28, visitors: 340, conversion: 8.2 },
    { name: 'Tue', sales: 5200, orders: 32, visitors: 380, conversion: 8.4 },
    { name: 'Wed', sales: 4800, orders: 29, visitors: 360, conversion: 8.1 },
    { name: 'Thu', sales: 6100, orders: 38, visitors: 420, conversion: 9.0 },
    { name: 'Fri', sales: 7500, orders: 46, visitors: 510, conversion: 9.0 },
    { name: 'Sat', sales: 9200, orders: 58, visitors: 680, conversion: 8.5 },
    { name: 'Sun', sales: 8400, orders: 52, visitors: 590, conversion: 8.8 },
  ];

  // Multi-dimensional Data
  const categoryData = [
    { name: 'Kitchen', value: 35, sales: 28500, growth: 15.2, color: '#06b6d4' },
    { name: 'Dining', value: 25, sales: 21200, growth: 8.7, color: '#8b5cf6' },
    { name: 'Decor', value: 20, sales: 16800, growth: 12.3, color: '#ec4899' },
    { name: 'Storage', value: 15, sales: 12400, growth: -3.1, color: '#f59e0b' },
    { name: 'Others', value: 5, sales: 4500, growth: 22.5, color: '#10b981' },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 145, amount: 45200, color: '#10b981' },
    { name: 'Processing', value: 38, amount: 12800, color: '#f59e0b' },
    { name: 'Pending', value: 22, amount: 6900, color: '#3b82f6' },
    { name: 'Cancelled', value: 15, amount: 4800, color: '#ef4444' },
    { name: 'Refunded', value: 8, amount: 2400, color: '#6b7280' },
  ];

  const hourlyData = [
    { hour: '00:00', orders: 12, sales: 1800 },
    { hour: '03:00', orders: 5, sales: 750 },
    { hour: '06:00', orders: 8, sales: 1200 },
    { hour: '09:00', orders: 25, sales: 3750 },
    { hour: '12:00', orders: 42, sales: 6300 },
    { hour: '15:00', orders: 38, sales: 5700 },
    { hour: '18:00', orders: 55, sales: 8250 },
    { hour: '21:00', orders: 35, sales: 5250 },
  ];

  const customerSegments = [
    { subject: 'New', A: 120, B: 85, fullMark: 150 },
    { subject: 'Returning', A: 98, B: 130, fullMark: 150 },
    { subject: 'VIP', A: 86, B: 65, fullMark: 150 },
    { subject: 'Churned', A: 45, B: 35, fullMark: 150 },
    { subject: 'At Risk', A: 65, B: 55, fullMark: 150 },
  ];

  const revenueByChannel = [
    { name: 'Direct', value: 35, color: '#06b6d4' },
    { name: 'Social', value: 25, color: '#8b5cf6' },
    { name: 'Organic', value: 20, color: '#10b981' },
    { name: 'Email', value: 12, color: '#f59e0b' },
    { name: 'Ads', value: 8, color: '#ef4444' },
  ];

  useEffect(() => {
    fetchDashboardData();
    // Simulated notifications
    setNotifications([
      { id: 1, type: 'order', message: 'New order #12345 received', time: '2 min ago', read: false },
      { id: 2, type: 'review', message: 'New 5-star review on Product X', time: '15 min ago', read: false },
      { id: 3, type: 'alert', message: 'Low stock alert: Kitchen Set', time: '1 hour ago', read: true },
    ]);
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [productsRes, usersRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/products`, { headers }),
        axios.get(`${API_URL}/users`, { headers }),
        axios.get(`${API_URL}/orders`, { headers }),
      ]);

      const products = productsRes.data.data?.products || [];
      const users = usersRes.data.data?.users || [];
      const orders = ordersRes.data.data?.orders || [];

      const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;

      setStats(prev => ({
        ...prev,
        totalSales,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
        avgOrderValue: Math.round(avgOrderValue),
      }));

      setRecentOrders(orders.slice(0, 10));

      const productSales = {};
      orders.forEach(order => {
        order.items?.forEach(item => {
          const id = item.product?._id || item.product;
          productSales[id] = (productSales[id] || 0) + item.quantity;
        });
      });

      const topProductsList = products
        .map(p => ({ ...p, sales: productSales[p._id] || 0 }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 8);

      setTopProducts(topProductsList);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { id: 'products', label: 'Products', icon: ShoppingBag, path: '/admin/products' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Add Product', color: 'bg-blue-500', onClick: () => navigate('/admin/products') },
    { icon: ShoppingCart, label: 'View Orders', color: 'bg-green-500', onClick: () => navigate('/admin/orders') },
    { icon: Users, label: 'Manage Users', color: 'bg-purple-500', onClick: () => navigate('/admin/users') },
    { icon: Download, label: 'Export Data', color: 'bg-orange-500', onClick: () => {} },
  ];

  const StatCard = ({ title, value, change, icon: Icon, color, subtext }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {title.includes('Sales') || title.includes('Value') || title.includes('Revenue')
              ? `$${value.toLocaleString()}`
              : title.includes('Rate') || title.includes('Retention')
              ? `${value}%`
              : value.toLocaleString()}
          </h3>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
          <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{Math.abs(change)}%</span>
            <span className="text-gray-400">vs last period</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        className="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden"
      >
        <div className="w-70 h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900 dark:text-white">LuxeLiving</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase mb-2">Quick Actions</p>
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className={`p-1.5 rounded-lg ${action.color}`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-70' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dashboard Overview</h2>
                <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Admin'}!</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 w-64"
                />
              </div>

              <button className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Mail className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Notifications</h4>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                          <p className="text-sm text-gray-900 dark:text-white">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-600 flex-shrink-0">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                  )}
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@luxeliving.com'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Date Filter & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-1.5 shadow-sm border border-gray-200 dark:border-gray-700">
              {['24h', '7days', '30days', '90days', '1year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    dateRange === range
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {range === '24h' ? 'Last 24h' :
                   range === '7days' ? '7 Days' :
                   range === '30days' ? '30 Days' :
                   range === '90days' ? '90 Days' : '1 Year'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md hover:shadow-lg transition-all">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export Report</span>
              </button>
            </div>
          </div>

          {/* Stats Grid - Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Sales"
              value={stats.totalSales}
              change={stats.salesChange}
              icon={DollarSign}
              color="bg-gradient-to-br from-green-500 to-emerald-600"
              subtext="Revenue this period"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              change={stats.ordersChange}
              icon={ShoppingCart}
              color="bg-gradient-to-br from-blue-500 to-indigo-600"
              subtext={`${stats.avgOrderValue} avg. order value`}
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              change={stats.usersChange}
              icon={Users}
              color="bg-gradient-to-br from-purple-500 to-pink-600"
              subtext={`${stats.customerRetention}% retention rate`}
            />
            <StatCard
              title="Products"
              value={stats.totalProducts}
              change={stats.productsChange}
              icon={Package}
              color="bg-gradient-to-br from-orange-500 to-red-600"
              subtext="Active inventory"
            />
          </div>

          {/* Stats Grid - Row 2 (Additional Metrics) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Conversion Rate"
              value={stats.conversionRate}
              change={2.1}
              icon={Target}
              color="bg-gradient-to-br from-teal-500 to-cyan-600"
              subtext="Visitors to customers"
            />
            <StatCard
              title="Avg. Session"
              value={stats.sessionDuration}
              change={0.8}
              icon={Clock}
              color="bg-gradient-to-br from-violet-500 to-purple-600"
              subtext="Minutes per session"
            />
            <StatCard
              title="Bounce Rate"
              value={stats.bounceRate}
              change={-5.2}
              icon={Activity}
              color="bg-gradient-to-br from-rose-500 to-pink-600"
              subtext="Single page visits"
            />
            <StatCard
              title="Active Now"
              value={42}
              change={15.3}
              icon={Zap}
              color="bg-gradient-to-br from-amber-500 to-orange-600"
              subtext="Real-time users"
            />
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Overview Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales & Orders Analytics</h3>
                  <p className="text-sm text-gray-500">Revenue and order trends over time</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="w-3 h-3 rounded-full bg-cyan-500"></span> Sales
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span> Orders
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={350}>
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
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#06b6d4" fillOpacity={1} fill="url(#salesGradient)" strokeWidth={2} name="Sales ($)" />
                  <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#8b5cf6" fillOpacity={1} fill="url(#ordersGradient)" strokeWidth={2} name="Orders" />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Category Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales by Category</h3>
                  <p className="text-sm text-gray-500">Revenue distribution</p>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
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
              <div className="grid grid-cols-1 gap-2 mt-4 max-h-32 overflow-y-auto">
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
          </div>

          {/* Secondary Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hourly Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Hourly Performance</h3>
              <p className="text-sm text-gray-500 mb-6">Orders throughout the day</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Customer Segments Radar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Customer Segments</h3>
              <p className="text-sm text-gray-500 mb-6">User distribution analysis</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={customerSegments}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} />
                  <Radar name="This Month" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                  <Radar name="Last Month" dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Revenue by Channel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Revenue by Channel</h3>
              <p className="text-sm text-gray-500 mb-6">Traffic sources</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={revenueByChannel}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
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
          </div>

          {/* Order Status & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Status Distribution</h3>
                  <p className="text-sm text-gray-500">Current order pipeline</p>
                </div>
                <Link to="/admin/orders" className="text-cyan-600 hover:text-cyan-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {orderStatusData.map((status) => (
                  <div key={status.name} className="flex items-center gap-4">
                    <div className="w-32">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{status.name}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${(status.value / 228) * 100}%`, backgroundColor: status.color }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right w-24">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{status.value}</p>
                      <p className="text-xs text-gray-500">${status.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Selling Products</h3>
                  <p className="text-sm text-gray-500">Best performers this period</p>
                </div>
                <Link to="/admin/products" className="text-cyan-600 hover:text-cyan-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/50'}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">${product.price} • {product.sales} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">${(product.price * product.sales).toLocaleString()}</p>
                      <p className="text-xs text-green-500">+{Math.floor(Math.random() * 20 + 5)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Orders Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                <p className="text-sm text-gray-500">Latest customer orders</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Printer className="w-5 h-5 text-gray-400" />
                </button>
                <Link to="/admin/orders" className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors">
                  View All Orders <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Items</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">#{order._id?.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-600 flex-shrink-0">
                            {order.user?.avatar ? (
                              <img 
                                src={order.user.avatar} 
                                alt={order.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white text-xs font-medium">
                                {order.user?.name?.charAt(0) || 'G'}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{order.user?.name || 'Guest'}</p>
                            <p className="text-xs text-gray-500">{order.user?.email || 'guest@email.com'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{order.items?.length || 0} items</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          order.status === 'pending' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {order.status === 'delivered' ? <CheckCircle className="w-3.5 h-3.5" /> :
                           order.status === 'shipped' ? <Truck className="w-3.5 h-3.5" /> :
                           order.status === 'processing' ? <Clock className="w-3.5 h-3.5" /> :
                           order.status === 'pending' ? <AlertCircle className="w-3.5 h-3.5" /> :
                           <X className="w-3.5 h-3.5" />}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white text-right">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="View">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Edit">
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Footer Info */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
            <p>LuxeLiving Admin Dashboard • Version 2.0 • Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
