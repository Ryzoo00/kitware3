import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Heart
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SpecialProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { addToWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const [specialProducts, setSpecialProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [joinedProducts, setJoinedProducts] = useState([]);
  const [productImageIndices, setProductImageIndices] = useState({});
  const [bannerUrl, setBannerUrl] = useState(null);
  const [productReviews, setProductReviews] = useState({});

  useEffect(() => {
    fetchSpecialProducts();
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const response = await axios.get(`${API_URL}/special-products/banner`);
      if (response.data.success) {
        setBannerUrl(response.data.data.bannerUrl);
      }
    } catch (error) {
      // No banner found, keep default gradient
      console.log('No banner found, using default');
    }
  };

  const fetchSpecialProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/special-products?isActive=true`);
      const products = response.data.data;
      setSpecialProducts(products);
      // Fetch reviews for each product
      products.forEach(product => {
        fetchProductReviews(product._id);
      });
    } catch (error) {
      console.error('Error fetching special products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductReviews = async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/reviews?product=${productId}`);
      if (response.data.success) {
        setProductReviews(prev => ({
          ...prev,
          [productId]: response.data.data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const getAverageRating = (productId) => {
    const reviews = productReviews[productId] || [];
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  };

  const getReviewCount = (productId) => {
    return (productReviews[productId] || []).length;
  };

  const handleJoin = async (productId, e) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first to participate');
      return;
    }
    
    setIsJoining(productId);
    try {
      await axios.post(`${API_URL}/special-products/${productId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success('Successfully joined! Good luck!');
      setJoinedProducts(prev => [...prev, productId]);
      
      // Refresh products to update participant count
      fetchSpecialProducts();
    } catch (error) {
      if (error.response?.data?.message === 'You have already joined this special product') {
        toast.info('You have already joined this product');
      } else {
        toast.error(error.response?.data?.message || 'Failed to join');
      }
    } finally {
      setIsJoining(null);
    }
  };

  const hasJoined = (productId) => joinedProducts.includes(productId);

  const getImageIndex = (productId) => productImageIndices[productId] || 0;

  const setImageIndex = (productId, index) => {
    setProductImageIndices(prev => ({
      ...prev,
      [productId]: index
    }));
  };

  const nextImage = (productId, totalImages) => {
    const currentIndex = getImageIndex(productId);
    setImageIndex(productId, (currentIndex + 1) % totalImages);
  };

  const prevImage = (productId, totalImages) => {
    const currentIndex = getImageIndex(productId);
    setImageIndex(productId, (currentIndex - 1 + totalImages) % totalImages);
  };

  const handleAddToCart = async (product, e) => {
    if (e) e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    
    const result = await addToCart(product._id, 1, null, null, 'SpecialProduct');
    if (result.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(result.error || 'Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (product, e) => {
    if (e) e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    
    const result = await addToWishlist(product._id, 'SpecialProduct');
    if (result.success) {
      toast.success('Added to wishlist!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading special offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section with Banner */}
      {bannerUrl ? (
        <div 
          className="relative w-full overflow-hidden"
          style={{ height: '427px' }}
        >
          <img 
            src={bannerUrl} 
            alt="Special Products Banner" 
            className="w-full h-full object-cover"
          />
          {/* Overlay with gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-rose-500/80 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Exclusive Offers</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Special Products & Prizes</h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Participate in our exclusive product events and win amazing prizes!
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Exclusive Offers</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Special Products & Prizes</h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Participate in our exclusive product events and win amazing prizes!
              </p>
            </motion.div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {specialProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Special Products Available</h2>
            <p className="text-gray-600">Check back soon for exciting new offers and prizes!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specialProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
              >
                {/* Product Image */}
                <div 
                  className="relative h-48 sm:h-56 bg-gray-100 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/special-products/${product._id}`)}
                >
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[getImageIndex(product._id)]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <Sparkles className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Image Navigation Arrows - Left Side */}
                  {product.images?.length > 1 && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage(product._id, product.images.length);
                        }}
                        className="p-1.5 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage(product._id, product.images.length);
                        }}
                        className="p-1.5 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-bold">
                      -{product.discount}%
                    </span>
                  </div>
                  
                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <div className="absolute top-3 right-3 z-20">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-yellow-500 text-white text-sm font-bold">
                        Featured
                      </span>
                    </div>
                  )}
                  
                  {/* Image Indicators */}
                  {product.images?.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                      {product.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageIndex(product._id, idx);
                          }}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            getImageIndex(product._id) === idx ? 'bg-white w-3' : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Action Buttons - Heart & Cart */}
                  <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                    <button 
                      onClick={(e) => handleAddToWishlist(product, e)}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-md hover:bg-gray-50 transition-all"
                    >
                      <Heart className="w-5 h-5 text-gray-700" />
                    </button>
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-md hover:bg-gray-50 transition-all"
                    >
                      <ShoppingCart className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 pt-3">
                  {/* Category */}
                  <p className="text-xs text-primary-600 font-medium mb-1">
                    {product.category}
                  </p>
                  
                  {/* Title */}
                  <h3 
                    className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors"
                    onClick={() => navigate(`/special-products/${product._id}`)}
                  >
                    {product.title}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(getAverageRating(product._id))
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 fill-current'
                          }`} 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {getReviewCount(product._id) > 0 
                        ? `(${getAverageRating(product._id).toFixed(1)} • ${getReviewCount(product._id)})`
                        : '(0.0 • 0)'}
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400 line-through">
                      ${product.firstPrize?.match(/\d+/)?.[0] || '0.00'}
                    </span>
                    <span className="text-lg font-bold text-yellow-600">
                      ${((product.firstPrize?.match(/\d+/) || [0])[0] * (1 - product.discount/100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialProducts;
