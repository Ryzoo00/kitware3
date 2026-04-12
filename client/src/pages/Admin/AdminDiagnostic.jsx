import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Navigate } from 'react-router-dom';

const AdminDiagnostic = () => {
  const { isAuthenticated, user, isLoading, checkAuth } = useAuthStore();
  const [checkCount, setCheckCount] = useState(0);

  useEffect(() => {
    console.log('🔍 ADMIN DIAGNOSTIC - Initial Check');
    checkAuth();
    setCheckCount(1);
    
    // Log auth state every second for 5 seconds
    const interval = setInterval(() => {
      setCheckCount(prev => {
        const newCount = prev + 1;
        console.log(`🔍 ADMIN DIAGNOSTIC - Check #${newCount}:`, {
          isAuthenticated: useAuthStore.getState().isAuthenticated,
          user: useAuthStore.getState().user,
          role: useAuthStore.getState().user?.role
        });
        return newCount;
      });
      
      if (checkCount >= 5) clearInterval(interval);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  console.log('🔍 ADMIN DIAGNOSTIC - Current State:', {
    isLoading,
    isAuthenticated,
    user,
    userRole: user?.role,
    isAdmin: user?.role === 'admin',
    userEmail: user?.email,
    userName: user?.name
  });

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading authentication...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ 
        padding: '40px', 
        fontFamily: 'sans-serif',
        background: '#fee',
        minHeight: '100vh'
      }}>
        <h1 style={{ color: 'red' }}>❌ NOT AUTHENTICATED</h1>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          You need to login first before accessing the admin panel!
        </p>
        <a 
          href="/login"
          style={{
            padding: '12px 24px',
            background: '#e94560',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            display: 'inline-block'
          }}
        >
          Go to Login Page
        </a>
      </div>
    );
  }

  // Wrong role
  if (user?.role !== 'admin') {
    return (
      <div style={{ 
        padding: '40px', 
        fontFamily: 'sans-serif',
        background: '#fff3cd',
        minHeight: '100vh'
      }}>
        <h1 style={{ color: '#856404' }}>⚠️ WRONG USER ROLE</h1>
        
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px',
          marginTop: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>Your Current User Details:</h3>
          <ul style={{ lineHeight: '2.5' }}>
            <li><strong>Name:</strong> {user?.name || 'N/A'}</li>
            <li><strong>Email:</strong> {user?.email || 'N/A'}</li>
            <li><strong>Role:</strong> <span style={{ color: 'red', fontWeight: 'bold', fontSize: '20px' }}>{user?.role}</span></li>
            <li><strong>Expected Role:</strong> <span style={{ color: 'green', fontWeight: 'bold', fontSize: '20px' }}>admin</span></li>
          </ul>
          
          <div style={{ marginTop: '30px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ marginTop: 0 }}>Possible Issues:</h4>
            <ol>
              <li>You logged in with a regular user account instead of admin</li>
              <li>The admin user's role was changed to 'user' in database</li>
              <li>There are multiple admin users and you're using wrong credentials</li>
            </ol>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h4>Admin Login Credentials:</h4>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '15px',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              Email: admin@luxeliving.com<br/>
              Password: admin123
            </pre>
          </div>
          
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <a 
              href="/login"
              style={{
                padding: '12px 24px',
                background: '#e94560',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              Logout & Login as Admin
            </a>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SUCCESS - Admin access granted
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
        borderRadius: '20px',
        maxWidth: '700px',
        margin: '0 auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ 
          color: 'green', 
          fontSize: '36px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          ✅ ADMIN ACCESS GRANTED!
        </h1>
        
        <div style={{ 
          background: '#d4edda', 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginTop: 0, color: '#155724' }}>Authentication Successful!</h3>
          <p style={{ marginBottom: 0 }}>
            ✓ You are authenticated<br/>
            ✓ Your role is '<strong>admin</strong>'<br/>
            ✓ You have access to admin panel
          </p>
        </div>
        
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginTop: 0 }}>Your Profile:</h3>
          <ul style={{ lineHeight: '2.2' }}>
            <li><strong>Name:</strong> {user?.name || 'N/A'}</li>
            <li><strong>Email:</strong> {user?.email || 'N/A'}</li>
            <li><strong>Role:</strong> <span style={{ color: 'blue', fontWeight: 'bold' }}>{user?.role}</span></li>
          </ul>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h3>Click below to access your admin dashboard:</h3>
          <a 
            href="/admin"
            style={{
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '18px',
              display: 'inline-block',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
          >
            🎯 GO TO ADMIN DASHBOARD
          </a>
        </div>
        
        <div style={{ 
          marginTop: '30px',
          padding: '15px', 
          background: '#fff3cd',
          borderRadius: '8px',
          border: '2px solid #ffc107'
        }}>
          <p style={{ margin: 0, color: '#856404' }}>
            <strong>🎉 Congratulations!</strong> If you can see this page, it means your 
            admin authentication is working perfectly! The issue might be with the 
            AdminLayout or Dashboard component rendering.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDiagnostic;
