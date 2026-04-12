import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ArrowLeft,
  Trophy,
  Gift,
  Sparkles,
  X,
  MessageSquare
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SpecialProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { addToWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: 0,
    details: '',
  });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchProduct();
    if (id) fetchProductReviews();
  }, [id]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/special-products/${id}`);
      setProduct(response.data.data);
      // Check if user has already joined
      const token = localStorage.getItem('token');
      if (token && response.data.data.participants) {
        const userId = JSON.parse(atob(token.split('.')[1]))?.userId;
        const joined = response.data.data.participants.some(
          p => p.user?._id === userId || p.user === userId
        );
        setHasJoined(joined);
      }
    } catch (error) {
      console.error('Failed to fetch special product:', error);
      toast.error('Product not found');
      navigate('/special-products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first to participate');
      navigate('/login');
      return;
    }

    setIsJoining(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/special-products/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success('Successfully joined! Good luck!');
      setHasJoined(true);
      fetchProduct(); // Refresh to update participant count
    } catch (error) {
      if (error.response?.data?.message === 'You have already joined this special product') {
        toast.info('You have already joined this product');
        setHasJoined(true);
      } else {
        toast.error(error.response?.data?.message || 'Failed to join');
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
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

  const handleAddToWishlist = async () => {
    if (!product) return;
    
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

  const nextImage = () => {
    setSelectedImage((prev) =>
      prev + 1 >= (product?.images?.length || 1) ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? (product?.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const fetchProductReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/reviews?product=${id}`);
      if (response.data.success) {
        setProductReviews(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        name: reviewForm.name,
        rating: reviewForm.rating,
        comment: reviewForm.details,
        product: id,
      };
      const response = await axios.post(`${API_URL}/reviews`, reviewData);
      if (response.data.success) {
        toast.success('Review submitted successfully!');
        setShowReviewModal(false);
        setReviewForm({ name: '', rating: 0, details: '' });
        fetchProductReviews();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading special offer...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountedPrice = ((product.firstPrize?.match(/\d+/) || [0])[0] * (1 - product.discount/100)).toFixed(2);
  const originalPrice = product.firstPrize?.match(/\d+/)?.[0] || '0.00';

  return (
    <div className="section-padding py-6 pt-20">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-primary-600">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate('/special-products')} className="hover:text-primary-600">
            Special Products
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
              <motion.div
                className="flex h-full"
                animate={{ x: -selectedImage * 100 + '%' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {product.images?.map((image, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 h-full cursor-zoom-in"
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                  >
                    <motion.img
                      src={image || '/placeholder-product.jpg'}
                      alt={`${product.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      style={
                        isZoomed && selectedImage === index
                          ? {
                              transform: 'scale(2)',
                              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                            }
                          : {}
                      }
                    />
                  </div>
                ))}
              </motion.div>

              {/* Navigation Arrows */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                -{product.discount}%
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary-600'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              {/* Category */}
              <p className="text-sm text-primary-600 font-medium mb-2">
                {product.category}
              </p>
              
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>

              {/* Special Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Special Offer</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(productReviews.reduce((sum, r) => sum + r.rating, 0) / (productReviews.length || 1))
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {productReviews.length > 0
                    ? `${(productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)} (${productReviews.length} reviews)`
                    : '0.0 (0 reviews)'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${discountedPrice}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ${originalPrice}
                </span>
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                  Save ${(originalPrice - discountedPrice)?.toFixed(2)}
                </span>
              </div>

              {/* Description - Full Text */}
              <p className="text-gray-600 text-sm mb-4">
                {product.productDescription || `${product.firstOfferDescription} ${product.discount}% OFF ${product.secondOfferDescription}`}
              </p>

            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-wrap gap-4 mb-8">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart - Golden/Orange style */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 min-w-[200px] bg-amber-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </motion.button>

              {/* Add Review Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowReviewModal(true)}
                className="flex-1 min-w-[200px] bg-yellow-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Add Review
              </motion.button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToWishlist}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </motion.button>

              {/* Share */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-200">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-6 h-6 text-amber-600" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="w-6 h-6 text-amber-600" />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="w-6 h-6 text-amber-600" />
                <span className="text-sm text-gray-600">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Product Description Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Description
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.productDescription || `${product.firstOfferDescription} ${product.discount}% OFF ${product.secondOfferDescription}. Discover timeless craftsmanship with this elegant product, designed for both comfort and sophistication. Featuring premium quality materials and expert craftsmanship, it offers durability and style in equal measure. Perfect for everyday use with exceptional value.`}
          </p>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Customer Reviews ({productReviews.length})
          </h2>
          {productReviews.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="space-y-6">
              {productReviews.map((review) => (
                <div key={review._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                        {(review.user?.name || review.name || 'A').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {review.user?.name || review.name}
                        </h4>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Write a Review
                  </h3>
                  <p className="text-sm text-primary-600 font-medium mt-1">
                    {product?.title}
                  </p>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product Info Display */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-semibold">Product:</span> {product?.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {product?.category} • {product?.discount}% OFF
                </p>
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rating for: <span className="text-primary-600">{product?.title}</span>
                  </label>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: i + 1 })}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            i < (hoverRating || reviewForm.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Review for: <span className="text-primary-600">{product?.title}</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={reviewForm.details}
                    onChange={(e) => setReviewForm({ ...reviewForm, details: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    placeholder={`Share your experience with ${product?.title}...`}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={reviewForm.rating === 0}
                  className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review for {product?.title}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialProductDetail;
