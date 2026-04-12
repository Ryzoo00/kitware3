import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import React from 'react'
import { useThemeStore } from './stores/themeStore'
import { useAuthStore } from './stores/authStore'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import MobileNav from './components/Layout/MobileNav'
import AdminLayout from './components/Layout/AdminLayout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import TestCheckout from './pages/TestCheckout'
import SimpleCheckout from './pages/SimpleCheckout'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOTP from './pages/VerifyOTP'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'
import SpecialProducts from './pages/SpecialProducts'
import SpecialProductDetail from './pages/SpecialProductDetail'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminProducts from './pages/Admin/Products'
import AdminOrders from './pages/Admin/Orders'
import AdminUsers from './pages/Admin/Users'
import AdminAnalytics from './pages/Admin/Analytics'
import AdminReports from './pages/Admin/Reports'
import AdminSpecialProducts from './pages/Admin/SpecialProducts'
import SiteReviews from './pages/Admin/SiteReviews'
import DebugAdmin from './pages/Admin/DebugAdmin'
import SimpleAdminTest from './pages/Admin/SimpleAdminTest'
import EmergencyPage from './pages/Admin/EmergencyPage'
import AdminDiagnostic from './pages/Admin/AdminDiagnostic'
import SimpleDashboard from './pages/Admin/SimpleDashboard'
import StandaloneAdmin from './pages/Admin/StandaloneAdmin'
import BasicAdminHome from './pages/Admin/BasicAdminHome'
import TranslationWarning from './components/Layout/TranslationWarning'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import AdminRoute from './components/Auth/AdminRoute'

function App() {
  const { isDarkMode } = useThemeStore()
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Prevent translation extensions from corrupting SVG icons
  useEffect(() => {
    const preventTranslation = () => {
      document.querySelectorAll('[data-icon], svg, path').forEach(el => {
        el.setAttribute('translate', 'no')
        el.setAttribute('data-nogtm', 'true')
      })
    }
  
    preventTranslation()
      
    // Watch for dynamically added SVGs and PATH changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'd') {
          // Path attribute changed - restore it
          const target = mutation.target
          const currentValue = target.getAttribute('d')
          if (currentValue && currentValue.includes('tc')) {
            console.warn('🛡️ Translation extension detected! Blocking...')
            // Try to restore original path
            target.removeAttribute('d')
            setTimeout(() => target.setAttribute('d', currentValue.replace(/tc[^MmLlHhVvCcSsQqTtAaZz0-9.,\s-]*/g, '')), 0)
          }
        }
      })
      preventTranslation()
    })
      
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['d']
    })
      
    // Add global protection
    document.documentElement.setAttribute('lang', 'en')
    document.documentElement.setAttribute('translate', 'no')
    document.documentElement.setAttribute('data-nogtm', 'true')
      
    return () => observer.disconnect()
  }, [])

  // Error Boundary for debugging
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error caught in boundary:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: 'red' }}>❌ Something went wrong!</h1>
            <p>Error: {this.state.error?.toString()}</p>
            <button 
              onClick={() => window.location.href = '/'}
              style={{ marginTop: '20px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Go Home
            </button>
          </div>
        );
      }

      return this.props.children;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        {/* Emergency Page - NO ADMIN CHECK */}
        <Route path="/admin-emergency" element={<EmergencyPage />} />
        <Route path="/admin-diagnostic" element={<AdminDiagnostic />} />
        <Route path="/admin-standalone" element={<StandaloneAdmin />} />

        {/* Public Routes with Main Layout */}
        <Route path="/" element={
          <>
            <Navbar />
            <main className="pt-16">
              <Home />
            </main>
            <Footer />
            <MobileNav />
          </>
        } />
        <Route path="/products" element={
          <>
            <Navbar />
            <main className="pt-16">
              <Products />
            </main>
            <Footer />
            <MobileNav />
          </>
        } />
        <Route path="/products/:id" element={
          <>
            <Navbar />
            <main className="pt-16">
              <ProductDetail />
            </main>
            <Footer />
            <MobileNav />
          </>
        } />
        <Route path="/special-products" element={
          <>
            <Navbar />
            <main className="pt-16">
              <SpecialProducts />
            </main>
            <Footer />
            <MobileNav />
          </>
        } />
        <Route path="/special-products/:id" element={
          <>
            <Navbar />
            <main className="pt-16">
              <SpecialProductDetail />
            </main>
            <Footer />
            <MobileNav />
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <main className="pt-16">
              <Login />
            </main>
            <Footer />
            <MobileNav />
          </>
        } />
        <Route path="/register" element={
          <>
            <Navbar />
            <main className="pt-16">
              <Register />
            </main>
            <Footer />
            <MobileNav />
          </>
        } />
        <Route path="/verify-otp" element={
          <>
            <Navbar />
            <main className="pt-16">
              <VerifyOTP />
            </main>
            <Footer />
            <MobileNav />
          </>
        } />
        <Route path="/cart" element={
          <>
            <Navbar />
            <main className="pt-16">
              <Cart />
            </main>
            <Footer />
            <MobileNav />
          </>
        } />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={
            <>
              <Navbar />
              <main className="pt-16">
                <Checkout />
              </main>
              <Footer />
              <MobileNav />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Navbar />
              <main className="pt-16">
                <Profile />
              </main>
              <Footer />
              <MobileNav />
            </>
          } />
          <Route path="/orders" element={
            <>
              <Navbar />
              <main className="pt-16">
                <Orders />
              </main>
              <Footer />
              <MobileNav />
            </>
          } />
          <Route path="/wishlist" element={
            <>
              <Navbar />
              <main className="pt-16">
                <Wishlist />
              </main>
              <Footer />
              <MobileNav />
            </>
          } />
        </Route>

        {/* Test Checkout Route */}
        <Route path="/test-checkout" element={<TestCheckout />} />
        <Route path="/simple-checkout" element={<SimpleCheckout />} />

        {/* Admin Routes - DIRECT rendering without wrapper issues */}
        <Route path="/admin" element={
          <>
            {console.log('🔵 Direct /admin route accessed')}
            <SimpleDashboard />
          </>
        } />
        <Route path="/admin/dashboard-full" element={<AdminDashboard />} />
        <Route path="/admin/debug" element={<DebugAdmin />} />
        <Route path="/admin/test" element={<SimpleAdminTest />} />
        
        {/* Admin pages with full layout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/special-products" element={<AdminSpecialProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/site-reviews" element={<SiteReviews />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>
      </Routes>
      <TranslationWarning />
    </div>
  )
}

export default App
