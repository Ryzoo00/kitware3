import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GiftBoxSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Default fallback data
  const defaultProduct = {
    name: 'Elegant Wooden Handle Stainless Steel Utensil Set',
    images: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&q=80',
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    ],
    discount: 30,
    productId: '67ed61cdf766f473eb7596aa',
    firstOfferDescription: 'Get an exclusive discount on our premium',
    secondOfferDescription: 'kitchen collection. Valid until March 24th only!',
  };

  useEffect(() => {
    fetchFeaturedSpecialProduct();
  }, []);

  const fetchFeaturedSpecialProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/special-products?isFeatured=true&isActive=true`);
      if (response.data.data && response.data.data.length > 0) {
        const product = response.data.data[0];
        setFeaturedProduct({
          name: product.title,
          images: product.images,
          discount: product.discount || 30,
          productId: product._id,
          firstOfferDescription: product.firstOfferDescription,
          secondOfferDescription: product.secondOfferDescription,
          category: product.category,
        });
      }
    } catch (error) {
      console.error('Error fetching featured special product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const promoProduct = featuredProduct || defaultProduct;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % promoProduct.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + promoProduct.images.length) % promoProduct.images.length);
  };

  return (
    <section className="py-10 px-3">
      <div className="max-w-none mx-auto px-0">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Special
          </h2>
          <div className="w-24 h-1 bg-primary-500 mt-2 rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Product Image with Frame */}
            <div className="relative h-full min-h-[250px] sm:min-h-[350px] p-3 bg-white dark:bg-gray-800">
              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={promoProduct.images[currentImageIndex]}
                    alt={promoProduct.name}
                    className="absolute inset-0 w-full h-full object-cover p-0 m-0 scale-110"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {promoProduct.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentImageIndex === index
                        ? 'w-6 bg-white'
                        : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Dark Content */}
            <div className="relative bg-gray-900 dark:bg-black flex flex-col justify-center p-6 sm:p-8 lg:p-12">
              {/* Background overlay with subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50"></div>
              
              <div className="relative z-10">
                <motion.h3
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2"
                >
                  Special Surprise!
                </motion.h3>

                <motion.h4
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-lg sm:text-xl lg:text-2xl font-medium mb-4 sm:mb-6"
                  style={{ fontFamily: "'Dancing Script', cursive", color: '#fbbf24' }}
                >
                  {promoProduct.name}
                </motion.h4>

                {/* Shop Now Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 mb-4 sm:mb-6"
                >
                  <Link
                    to={`/special-products?featured=${promoProduct.productId}`}
                    className="inline-flex items-center gap-2 sm:gap-3 bg-white text-gray-900 px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors"
                  >
                    <span>SHOP NOW</span>
                    <div className="bg-yellow-500 p-1 sm:p-1.5">
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </Link>
                </motion.div>

                {/* Discount Text - First + Discount + Second */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-300 text-xs sm:text-sm lg:text-base"
                >
                  {promoProduct.firstOfferDescription} <span className="font-bold text-yellow-400">{promoProduct.discount}% OFF</span> {promoProduct.secondOfferDescription}
                </motion.p>
              </div>

              {/* More Button - Bottom Right */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-6 sm:mt-0 sm:absolute sm:bottom-6 sm:right-6 flex items-center gap-3"
              >
                <Link
                  to={`/special-products?featured=${promoProduct.productId}`}
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-4 sm:px-6 py-2 sm:py-2.5 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition-colors w-full sm:w-auto justify-center"
                >
                  MORE
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftBoxSection;
