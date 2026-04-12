import { useNavigate } from 'react-router-dom';

const TestCheckout = () => {
  const navigate = useNavigate();
  
  console.log('✅ TestCheckout loaded successfully!');
  
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: 'green', fontSize: '24px', marginBottom: '20px' }}>
        ✅ Checkout Route Works!
      </h1>
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
        If you can see this, the /checkout route is working properly.
      </p>
      <button
        onClick={() => navigate('/cart')}
        style={{
          padding: '12px 24px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        ← Back to Cart
      </button>
      
      <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '10px' }}>Debugging Info:</h3>
        <p style={{ fontSize: '14px' }}>Token: {localStorage.getItem('token') ? '✅ Exists' : '❌ Missing'}</p>
        <p style={{ fontSize: '14px' }}>User Data: {localStorage.getItem('user') ? '✅ Exists' : '❌ Missing'}</p>
        <p style={{ fontSize: '14px' }}>Cart Data: {localStorage.getItem('cart') ? '✅ Exists' : '❌ Missing'}</p>
      </div>
    </div>
  );
};

export default TestCheckout;
