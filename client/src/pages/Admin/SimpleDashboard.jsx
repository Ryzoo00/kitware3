import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings,
  TrendingUp, TrendingDown, DollarSign, ArrowRight, Bell,
  CheckCircle, Clock, AlertCircle, X, Sparkles, Zap, Calendar,
  ChevronRight, Filter, Download, Box, Receipt, UserCheck, Activity
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { type: 'spring', stiffness: 400, damping: 25 }
  }
};

const SimpleDashboard = () => {
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notifications] = useState([
    { id: 1, title: 'New Order', message: 'Order #12345 received', time: '2 min ago', type: 'order' },
    { id: 2, title: 'Low Stock', message: 'Kitchen Set running low', time: '15 min ago', type: 'alert' },
    { id: 3, title: 'New Review', message: '5-star review on Product X', time: '1 hour ago', type: 'review' },
  ]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'shipped':
        return <Zap className="w-3.5 h-3.5" />;
      case 'processing':
        return <Clock className="w-3.5 h-3.5" />;
      case 'pending':
        return <AlertCircle className="w-3.5 h-3.5" />;
      default:
        return <X className="w-3.5 h-3.5" />;
    }
  };

  const StatCard = ({ title, value, subtitle, trend, trendUp, icon: Icon, color }) => (
    <motion.div
      variants={itemVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative overflow-hidden"
    >
      <motion.div
        variants={cardHoverVariants}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group cursor-pointer"
        onClick={() => navigate(`/admin/${title.toLowerCase().replace(' ', '-')}`)}
      >
        {/* Background gradient decoration */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
              <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-').replace('bg-opacity-10', '')}`} />
            </div>
            {trend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend}
              </div>
            )}
          </div>
          
          <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </motion.div>
    </motion.div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, color, to }) => (
    <motion.div
      variants={itemVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <Link to={to}>
        <motion.div
          variants={cardHoverVariants}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 w-full h-1 ${color}`} />
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 mb-4`}>
              <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-').replace('bg-opacity-10', '')}`} />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </motion.div>
      </Link>
    </motion.div>
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view the dashboard');
        setIsLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch all data in parallel with error handling for each
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/orders?limit=10`, { headers }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API_URL}/products`, { headers }).catch(() => ({ data: { data: { products: [] } } })),
        axios.get(`${API_URL}/users`, { headers }).catch(() => ({ data: { data: { users: [] } } })),
      ]);

      const orders = ordersRes.data.data || [];
      const products = productsRes.data.data?.products || [];
      const users = usersRes.data.data?.users || [];

      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || order.totalAmount || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'pending').length;

      setRecentOrders(orders.slice(0, 5));
      setStats({
        totalOrders: orders.length,
        pendingOrders,
        totalRevenue,
        totalProducts: products.length,
        totalUsers: users.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              fetchDashboardData();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Welcome back, Admin</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
              <div className="w-px h-8 bg-gray-200 mx-1" />
              <button className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm shadow-md">
                <span className="text-sm font-bold">A</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Banner */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 text-white shadow-2xl shadow-purple-200"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10 px-8 py-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>Everything is running smoothly</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
                  <p className="text-white/80 text-lg">Track your business metrics and manage your store efficiently.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors text-sm font-medium">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Today
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-white text-purple-600 hover:bg-gray-100 transition-colors text-sm font-medium shadow-lg">
                    <Download className="w-4 h-4 inline mr-2" />
                    Export Report
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtitle="From all orders"
              trend="+12.5%"
              trendUp={true}
              icon={DollarSign}
              color="bg-emerald-500"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              subtitle={`${stats.pendingOrders} pending`}
              trend="+8.2%"
              trendUp={true}
              icon={ShoppingCart}
              color="bg-blue-500"
            />
            <StatCard
              title="Products"
              value={stats.totalProducts}
              subtitle="In catalog"
              trend="-2.1%"
              trendUp={false}
              icon={Package}
              color="bg-amber-500"
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              subtitle="Registered"
              trend="+15.3%"
              trendUp={true}
              icon={Users}
              color="bg-purple-500"
            />
          </div>

          {/* Quick Actions */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <Link to="/admin/dashboard-full" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                View Full Dashboard <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickActionCard
                title="Products"
                description="Manage catalog, add new items"
                icon={Box}
                color="bg-emerald-500"
                to="/admin/products"
              />
              <QuickActionCard
                title="Orders"
                description="View and process orders"
                icon={Receipt}
                color="bg-blue-500"
                to="/admin/orders"
              />
              <QuickActionCard
                title="Users"
                description="Manage customer accounts"
                icon={UserCheck}
                color="bg-purple-500"
                to="/admin/users"
              />
              <QuickActionCard
                title="Analytics"
                description="View sales statistics"
                icon={Activity}
                color="bg-pink-500"
                to="/admin/analytics"
              />
            </div>
          </div>

          {/* Recent Orders & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <ShoppingCart className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                      <p className="text-sm text-gray-500">Latest customer purchases</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Filter className="w-4 h-4 text-gray-500" />
                    </button>
                    <Link
                      to="/admin/orders"
                      className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      View All
                    </Link>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {recentOrders.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No orders yet</p>
                      <p className="text-sm text-gray-400 mt-1">Orders will appear here when customers make purchases</p>
                    </div>
                  ) : (
                    recentOrders.map((order, index) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
                              <div className="w-full h-full flex items-center justify-center text-white font-medium text-sm">
                                {order.contactInfo?.email?.charAt(0).toUpperCase() || order.user?.name?.charAt(0).toUpperCase() || 'G'}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                              <p className="text-sm text-gray-500">
                                {order.contactInfo?.email || order.user?.email || 'Guest'} • {order.orderItems?.length || order.items?.length || 0} items
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${(order.totalPrice || order.totalAmount || 0).toFixed(2)}</p>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            {/* Notifications & Activity */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Notifications */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Bell className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-500">Recent activity</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          notif.type === 'order' ? 'bg-emerald-100 text-emerald-600' :
                          notif.type === 'alert' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {notif.type === 'order' ? <ShoppingCart className="w-4 h-4" /> :
                           notif.type === 'alert' ? <AlertCircle className="w-4 h-4" /> :
                           <CheckCircle className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                          <p className="text-sm text-gray-500">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-3 border-t border-gray-100 text-center">
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Quick Links
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Add New Product', icon: Package, to: '/admin/products' },
                    { label: 'View Reports', icon: BarChart3, to: '/admin/reports' },
                    { label: 'Settings', icon: Settings, to: '/admin/settings' },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors group"
                    >
                      <link.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      <span className="text-sm font-medium">{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center text-sm text-gray-400 pt-8">
            <p>LuxeLiving Admin Dashboard • Version 2.0 • {new Date().toLocaleDateString()}</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
