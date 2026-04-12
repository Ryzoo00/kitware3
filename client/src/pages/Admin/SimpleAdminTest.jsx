import { useAuthStore } from '../../stores/authStore';

const SimpleAdminTest = () => {
  const { isAuthenticated, user } = useAuthStore();

  console.log('=== SIMPLE ADMIN TEST ===');
  console.log('isAuthenticated:', isAuthenticated);
  console.log('user:', user);
  console.log('user.role:', user?.role);
  console.log('========================');

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: 'red' }}>❌ NOT AUTHENTICATED</h1>
        <p>You need to login first!</p>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: 'orange' }}>⚠️ WRONG ROLE</h1>
        <p>Your role is: <strong>{user?.role}</strong></p>
        <p>Expected role: <strong>admin</strong></p>
        <pre style={{ background: '#f5f5f5', padding: '15px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '10px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: 'green', fontSize: '32px' }}>✅ SUCCESS! ADMIN PANEL WORKING!</h1>
        
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ marginBottom: '15px' }}>Your Details:</h3>
          <ul style={{ lineHeight: '2' }}>
            <li><strong>Name:</strong> {user?.name || 'N/A'}</li>
            <li><strong>Email:</strong> {user?.email || 'N/A'}</li>
            <li><strong>Role:</strong> <span style={{ color: 'blue', fontWeight: 'bold' }}>{user?.role}</span></li>
          </ul>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
          <a 
            href="/admin" 
            style={{ 
              padding: '12px 24px', 
              background: '#667eea', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            Go to /admin
          </a>
          <a 
            href="/admin/products" 
            style={{ 
              padding: '12px 24px', 
              background: '#764ba2', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            Go to Products
          </a>
        </div>

        <div style={{ marginTop: '30px', padding: '15px', background: '#f0f8ff', borderRadius: '5px', border: '2px solid #667eea' }}>
          <p style={{ margin: 0, color: '#667eea', fontWeight: 'bold' }}>
            🎉 Congratulations! Your admin authentication is working perfectly!
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
            If you can see this page, it means:<br/>
            ✓ You are authenticated<br/>
            ✓ Your role is 'admin'<br/>
            ✓ React Router is working<br/>
            ✓ Admin routes are accessible
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleAdminTest;
