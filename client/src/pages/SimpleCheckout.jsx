import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SimpleCheckout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { cart, getSubtotal } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state for user details
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Enforce 25 word limit on street/address field
    if (name === 'street') {
      const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
      if (wordCount > 25) {
        toast.error('Address must be maximum 25 words');
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Debug logging
  console.log('=== SIMPLE CHECKOUT LOADED ===');
  console.log('User:', user);
  console.log('Cart:', cart);
  console.log('Items:', cart?.items);

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting...');
    navigate('/login', { state: { from: '/checkout' } });
    return null;
  }

  // Check for invalid products (product._id missing means not populated from server)
  const invalidItems = cart.items.filter(item => !item.product?._id);
  if (invalidItems.length > 0) {
    console.log('Invalid cart items detected, clearing cart:', invalidItems);
    localStorage.removeItem('cart');
    toast.error('Cart had invalid products. Cart cleared. Please add products again.');
    navigate('/products');
    return null;
  }

  if (!cart?.items || cart.items.length === 0) {
    console.log('Cart empty, redirecting...');
    toast.error('Your cart is empty!');
    navigate('/products');
    return null;
  }

  const subtotal = getSubtotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?._id && !user?.userId) {
      toast.error('User ID not found. Please login again.');
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');
      
      const orderData = {
        orderItems: cart.items.map(item => {
          console.log('Cart item:', item);
          console.log('ProductType:', item.productType);
          return {
            productId: item.product?._id || item.product,
            name: item.product?.name,
            quantity: item.quantity,
            price: item.price,
            image: item.product?.images?.[0] || '',
            productType: item.productType || 'Product',
          };
        }),
        shippingAddress: {
          street: formData.street || '123 Main Street',
          address: formData.street || '123 Main Street',
          city: formData.city || 'Karachi',
          state: formData.state || 'Sindh',
          zipCode: formData.zipCode || '75500',
          country: formData.country || 'Pakistan',
        },
        contactInfo: {
          email: user?.email || 'customer@example.com',
          phone: formData.phone || '03001234567',
        },
        paymentMethod: 'Cash on Delivery',
      };

      console.log('📦 Placing order:', orderData);

      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Order placed:', response.data);

      toast.success('Order placed successfully!');
      
      // Clear cart and redirect
      localStorage.removeItem('cart');
      navigate('/profile', { state: { tab: 'orders' } });
    } catch (error) {
      console.error('❌ Order error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to place order';
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '30px', color: '#1a202c' }}>
        Simple Checkout
      </h1>

      {/* Customer Info Form */}
      <form id="checkout-form" onSubmit={handleSubmit} style={{ background: '#f7fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#2d3748' }}>
          Your Details
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>
            Full Name * + city
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            placeholder="Enter your full name"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            placeholder="Enter your city"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>
            State / Province *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
            }}
            placeholder="e.g. Khyber Pakhtunkhwa, Sindh, Punjab"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              placeholder="Enter phone"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>
              Zipcode
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              placeholder="Enter zipcode"
            />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: '500' }}>
            Address * (max 25 words)
          </label>
          <textarea
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            required
            rows="3"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
            }}
            placeholder="Enter your complete address + YuorChat"
          />
        </div>
      </form>

      {/* Order Items */}
      <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#2d3748' }}>
          Order Items ({cart.items.length})
        </h2>
        {cart.items.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '10px 0',
            borderBottom: index < cart.items.length - 1 ? '1px solid #e2e8f0' : 'none',
          }}>
            <div>
              <p style={{ fontWeight: 'bold', color: '#2d3748' }}>{item.product.name}</p>
              <p style={{ fontSize: '14px', color: '#718096' }}>Qty: {item.quantity}</p>
            </div>
            <p style={{ fontWeight: 'bold', color: '#2d3748' }}>
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Price Summary */}
      <div style={{ background: '#edf2f7', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#2d3748' }}>
          Price Summary
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#4a5568' }}>
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#4a5568' }}>
          <span>Shipping:</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#4a5568' }}>
          <span>Tax (10%):</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          paddingTop: '10px', 
          borderTop: '2px solid #cbd5e0',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1a202c',
        }}>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        form="checkout-form"
        disabled={isProcessing}
        style={{
          width: '100%',
          padding: '16px',
          background: isProcessing ? '#a0aec0' : '#4299e1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          opacity: isProcessing ? 0.6 : 1,
        }}
      >
        {isProcessing ? 'Processing...' : '🎉 Place Order (COD)'}
      </button>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#718096' }}>
        Payment Method: Cash on Delivery
      </p>
    </div>
  );
};

export default SimpleCheckout;
