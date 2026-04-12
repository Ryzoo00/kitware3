import { useAuthStore } from '../../stores/authStore';
import { Navigate } from 'react-router-dom';

const StandaloneAdmin = () => {
  const { isAuthenticated, user } = useAuthStore();

  console.log('=== STANDALONE ADMIN PAGE ===');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('user:', user);
  console.log('user.role:', user?.role);
  console.log('=============================');

  // Check authentication
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }

  // Check admin role
  if (user?.role !== 'admin') {
    console.log('❌ Not an admin, role is:', user?.role);
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1 style={{ color: 'orange' }}>⚠️ Access Denied</h1>
        <p>Your role is: <strong>{user?.role}</strong></p>
        <p>You need admin privileges to access this page.</p>
        <button 
          onClick={() => window.history.back()}
          style={{ marginTop: '20px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Go Back
        </button>
      </div>
    );
  }

  console.log('✅ Admin access granted!');

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '10px', 
        maxWidth: '800px', 
        margin: '0 auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ color: 'green', fontSize: '32px', marginBottom: '20px' }}>
          ✅ ADMIN PANEL - STANDING VERSION
        </h1>
        
        <div style={{ 
          background: '#f0f8ff', 
          padding: '20px', 
          borderRadius: '5px',
          border: '2px solid #667eea',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginTop: 0, color: '#667eea' }}>Your Details:</h3>
          <ul style={{ lineHeight: '2.5' }}>
            <li><strong>Name:</strong> {user?.name || 'N/A'}</li>
            <li><strong>Email:</strong> {user?.email || 'N/A'}</li>
            <li><strong>Role:</strong> <span style={{ color: 'blue', fontWeight: 'bold' }}>{user?.role}</span></li>
            <li><strong>User ID:</strong> {user?._id || 'N/A'}</li>
          </ul>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#764ba2' }}>Quick Links:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <a 
              href="/admin/products"
              style={{ 
                padding: '15px', 
                background: '#10b981', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              📦 Products
            </a>
            <a 
              href="/admin/orders"
              style={{ 
                padding: '15px', 
                background: '#3b82f6', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              🛒 Orders
            </a>
            <a 
              href="/admin/users"
              style={{ 
                padding: '15px', 
                background: '#8b5cf6', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              👥 Users
            </a>
            <a 
              href="/admin/analytics"
              style={{ 
                padding: '15px', 
                background: '#ec4899', 
                color: 'white', 
                textDecoration: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              📊 Analytics
            </a>
          </div>
        </div>

        <div style={{ 
          padding: '20px', 
          background: '#fef3c7', 
          border: '2px solid #f59e0b',
          borderRadius: '5px'
        }}>
          <h3 style={{ marginTop: 0, color: '#92400e' }}>✨ Success!</h3>
          <p style={{ margin: '10px 0', color: '#78350f' }}>
            You can see this page because you're logged in as an <strong>ADMIN</strong>.
          </p>
          <p style={{ margin: '10px 0', color: '#78350f', fontSize: '14px' }}>
            If the main /admin route shows blank screen, try accessing the links above directly.
          </p>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <a 
            href="/"
            style={{ 
              padding: '12px 30px', 
              background: '#6b7280', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              marginRight: '10px'
            }}
          >
            ← Back to Home
          </a>
          <button
            onClick={async () => {
              await import('../../stores/authStore').then(m => m.useAuthStore.getState().logout());
              window.location.href = '/';
            }}
            style={{ 
              padding: '12px 30px', 
              background: '#ef4444', 
              color: 'white', 
              border: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default StandaloneAdmin;
