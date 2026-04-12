const EmergencyPage = () => {
  console.log('🚨 EMERGENCY PAGE LOADED!');
  
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'sans-serif',
      background: '#1a1a2e',
      minHeight: '100vh',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: '#16213e',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🔧 ADMIN PANEL DEBUG MODE
        </h1>

        <div style={{ 
          padding: '20px', 
          background: '#0f3460',
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#e94560', marginBottom: '15px' }}>Current Status:</h2>
          <ul style={{ lineHeight: '2.5', fontSize: '16px' }}>
            <li>✓ You reached: <strong>/admin/test</strong></li>
            <li>✓ React is rendering</li>
            <li>✓ No JavaScript errors</li>
            <li>⚠️ But admin panel still not showing</li>
          </ul>
        </div>

        <div style={{ 
          padding: '20px', 
          background: '#0f3460',
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#4ecca3', marginBottom: '15px' }}>Quick Actions:</h2>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
            <a 
              href="/login"
              style={{
                padding: '15px 30px',
                background: '#e94560',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              🔐 Go to Login
            </a>
            
            <a 
              href="/"
              style={{
                padding: '15px 30px',
                background: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              🏠 Home Page
            </a>
            
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '15px 30px',
                background: '#4ecca3',
                color: '#1a1a2e',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>

        <div style={{ 
          padding: '20px', 
          background: '#0f3460',
          borderRadius: '10px'
        }}>
          <h2 style={{ color: '#ffd700', marginBottom: '15px' }}>Next Steps:</h2>
          <ol style={{ lineHeight: '2.2', fontSize: '15px' }}>
            <li><strong>Press F12</strong> - Check browser console for errors</li>
            <li><strong>Check Network tab</strong> - See if any API calls failed</li>
            <li><strong>Clear cache</strong> - Press Ctrl+Shift+Delete</li>
            <li><strong>Try incognito</strong> - Ctrl+Shift+N</li>
            <li><strong>Screenshot console</strong> - Share all red errors</li>
          </ol>
        </div>

        <div style={{ 
          marginTop: '30px',
          padding: '20px', 
          background: 'rgba(233, 69, 96, 0.2)',
          border: '2px solid #e94560',
          borderRadius: '10px'
        }}>
          <p style={{ 
            fontSize: '18px', 
            marginBottom: '15px',
            color: '#e94560',
            fontWeight: 'bold'
          }}>
            ❓ Console mein kya error hai?
          </p>
          <p style={{ fontSize: '14px', opacity: 0.8 }}>
            Browser console (F12) mein jo bhi RED error dikhai de, 
            uska screenshot lein ya copy karke mujhe batayein!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
