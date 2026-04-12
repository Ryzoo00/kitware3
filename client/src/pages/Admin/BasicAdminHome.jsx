import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const BasicAdminHome = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  console.log('🔵 BasicAdminHome - Component starting');
  console.log('User object:', user);
  console.log('User role:', user?.role);

  // Error check
  if (!user) {
    console.error('❌ No user found!');
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: 'red' }}>Error: No user data</h1>
        <p>Please login first</p>
        <button 
          onClick={() => navigate('/login')}
          style={{ marginTop: '20px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (user.role !== 'admin') {
    console.error('❌ User is not admin! Role:', user.role);
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: 'orange' }}>Access Denied</h1>
        <p>Your role: {user.role}</p>
        <p>You need admin privileges</p>
        <button 
          onClick={() => navigate('/')}
          style={{ marginTop: '20px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Go Home
        </button>
      </div>
    );
  }

  console.log('✅ Admin check passed, rendering dashboard');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '48px', 
            color: 'white', 
            margin: '0 0 10px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🎯 Admin Dashboard
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: 'rgba(255,255,255,0.9)',
            margin: 0
          }}>
            Welcome back, <strong>{user?.name || 'Admin'}</strong>!
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid white',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          Logout
        </button>
      </div>

      {/* User Info Card */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 40px',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#667eea' }}>📋 Your Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>Name</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{user?.name || 'N/A'}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>Email</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{user?.email || 'N/A'}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>Role</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{user?.role || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Cards */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {/* Products */}
        <Link to="/admin/products" style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          textDecoration: 'none',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          transition: 'transform 0.3s, box-shadow 0.3s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', color: '#10b981' }}>Products</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>Manage your product catalog, add new items, update prices</p>
        </Link>

        {/* Orders */}
        <Link to="/admin/orders" style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          textDecoration: 'none',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          transition: 'transform 0.3s, box-shadow 0.3s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', color: '#3b82f6' }}>Orders</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>View and process customer orders, track shipments</p>
        </Link>

        {/* Users */}
        <Link to="/admin/users" style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          textDecoration: 'none',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          transition: 'transform 0.3s, box-shadow 0.3s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', color: '#8b5cf6' }}>Users</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>Manage customer accounts and permissions</p>
        </Link>

        {/* Analytics */}
        <Link to="/admin/analytics" style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          textDecoration: 'none',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          transition: 'transform 0.3s, box-shadow 0.3s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', color: '#ec4899' }}>Analytics</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>View sales reports and business insights</p>
        </Link>

        {/* Reports */}
        <Link to="/admin/reports" style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          textDecoration: 'none',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          transition: 'transform 0.3s, box-shadow 0.3s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', color: '#f59e0b' }}>Reports</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>Generate detailed business reports</p>
        </Link>

        {/* Settings */}
        <Link to="/admin/settings" style={{
          background: 'white',
          padding: '32px',
          borderRadius: '16px',
          textDecoration: 'none',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          transition: 'transform 0.3s, box-shadow 0.3s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '24px', color: '#6b7280' }}>Settings</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>Configure system settings and preferences</p>
        </Link>
      </div>

      {/* Footer Note */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 0',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '16px'
      }}>
        <p>✅ Admin panel is working perfectly! Click any card above to get started.</p>
      </div>
    </div>
  );
};

export default BasicAdminHome;
