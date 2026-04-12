import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  TrendingUp,
  Edit2,
  Trash2,
  Search,
  X,
  Image,
  Star,
  Upload,
  ChevronLeft,
  ChevronRight,
  Gift,
  Trophy,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MIN_IMAGES = 4;

const splitDescription = (desc) => {
  if (!desc) return ['', ''];
  const mid = Math.ceil(desc.length / 2);
  // Try to find a space near the middle
  let splitIndex = desc.indexOf(' ', mid);
  if (splitIndex === -1) splitIndex = desc.lastIndexOf(' ', mid);
  if (splitIndex === -1) splitIndex = mid;
  return [desc.slice(0, splitIndex).trim(), desc.slice(splitIndex).trim()];
};

const AdminSpecialProducts = () => {
  const [specialProducts, setSpecialProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState('');
  const [bannerDimensions, setBannerDimensions] = useState(null);
  const [isBannerValid, setIsBannerValid] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    firstOfferDescription: '',
    secondOfferDescription: '',
    productDescription: '',
    firstPrize: '',
    secondPrize: '',
    category: '',
    discount: 30,
    isActive: true,
    isFeatured: false,
  });

  const categories = ['Kitchen', 'Dining', 'Accessories', 'Storage', 'Essentials', 'Electronics', 'Fashion', 'Home Decor', 'Gifts', 'Special Offers'];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchSpecialProducts();
  }, [currentPage, debouncedSearch]);

  const fetchSpecialProducts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '1000');

      const response = await axios.get(`${API_URL}/special-products?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let allProducts = response.data.data || [];
      
      // Client-side filtering with partial matching
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        allProducts = allProducts.filter(product => {
          const titleMatch = product.title?.toLowerCase().includes(searchLower);
          const categoryMatch = product.category?.toLowerCase().includes(searchLower);
          const prizeMatch = product.firstPrize?.toLowerCase().includes(searchLower) || 
                            product.secondPrize?.toLowerCase().includes(searchLower);
          return titleMatch || categoryMatch || prizeMatch;
        });
        
        // Sort by relevance
        allProducts.sort((a, b) => {
          const titleA = a.title?.toLowerCase() || '';
          const titleB = b.title?.toLowerCase() || '';
          const searchLower = debouncedSearch.toLowerCase();
          
          const aStartsWith = titleA.startsWith(searchLower);
          const bStartsWith = titleB.startsWith(searchLower);
          
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          
          const aIndex = titleA.indexOf(searchLower);
          const bIndex = titleB.indexOf(searchLower);
          
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }
          
          return 0;
        });
      }
      
      // Manual pagination
      const itemsPerPage = 10;
      const totalItems = allProducts.length;
      const totalPagesCalc = Math.ceil(totalItems / itemsPerPage) || 1;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedProducts = allProducts.slice(startIndex, startIndex + itemsPerPage);
      
      setSpecialProducts(paginatedProducts);
      setTotalPages(totalPagesCalc);
    } catch (error) {
      console.error('Error fetching special products:', error);
      toast.error('Failed to fetch special products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setSelectedImages(prev => [...prev, ...files]);
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      firstOfferDescription: '',
      secondOfferDescription: '',
      productDescription: '',
      firstPrize: '',
      secondPrize: '',
      category: '',
      discount: 30,
      isActive: true,
      isFeatured: false,
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      firstOfferDescription: product.firstOfferDescription || '',
      secondOfferDescription: product.secondOfferDescription || '',
      productDescription: product.productDescription || '',
      firstPrize: product.firstPrize,
      secondPrize: product.secondPrize,
      category: product.category,
      discount: product.discount || 30,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });
    setSelectedImages([]);
    setImagePreviewUrls(product.images || []);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate minimum 4 images
    const totalImages = selectedImages.length + imagePreviewUrls.length;
    if (totalImages < MIN_IMAGES) {
      toast.error(`Please upload at least ${MIN_IMAGES} images`);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formDataObj = new FormData();
      
      formDataObj.append('title', formData.title);
      formDataObj.append('firstOfferDescription', formData.firstOfferDescription);
      formDataObj.append('secondOfferDescription', formData.secondOfferDescription);
      formDataObj.append('productDescription', formData.productDescription);
      formDataObj.append('firstPrize', formData.firstPrize);
      formDataObj.append('secondPrize', formData.secondPrize);
      formDataObj.append('category', formData.category);
      formDataObj.append('discount', formData.discount);
      formDataObj.append('isActive', formData.isActive);
      formDataObj.append('isFeatured', formData.isFeatured);
      
      // Append new images
      selectedImages.forEach((file) => {
        formDataObj.append('images', file);
      });

      if (editingProduct) {
        await axios.put(`${API_URL}/special-products/${editingProduct._id}`, formDataObj, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        toast.success('Special product updated successfully');
      } else {
        await axios.post(`${API_URL}/special-products`, formDataObj, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
        toast.success('Special product created successfully');
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchSpecialProducts();
    } catch (error) {
      console.error('Error saving special product:', error);
      toast.error(error.response?.data?.message || 'Failed to save special product');
    }
  };

  const handleSetAsTrend = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/special-products/${id}`, 
        { isFeatured: true },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Special product set as trend');
      fetchSpecialProducts();
    } catch (error) {
      toast.error('Failed to set as trend');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this special product?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/special-products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Special product deleted successfully');
      fetchSpecialProducts();
    } catch (error) {
      toast.error('Failed to delete special product');
    }
  };

  const handleBannerImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setBannerPreviewUrl(previewUrl);
    setBannerImage(file);

    // Check image dimensions
    const img = new Image();
    img.onload = () => {
      setBannerDimensions({ width: img.width, height: img.height });
      // Validate dimensions: 427 width x 1908 height
      const isValid = img.width === 427 && img.height === 1908;
      setIsBannerValid(isValid);
      if (!isValid) {
        toast.error(`Image must be exactly 427 x 1908 pixels. Current: ${img.width} x ${img.height}`);
      } else {
        toast.success('Image dimensions are correct!');
      }
    };
    img.src = previewUrl;
  };

  const resetBannerForm = () => {
    setBannerImage(null);
    setBannerPreviewUrl('');
    setBannerDimensions(null);
    setIsBannerValid(false);
  };

  const handleBannerSave = async () => {
    if (!isBannerValid) {
      toast.error('Please upload an image with exact dimensions: 427 x 1908 pixels');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('banner', bannerImage);

      await axios.post(`${API_URL}/special-products/banner/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      
      toast.success('Banner uploaded successfully! (427 x 1908)');
      resetBannerForm();
      setShowBannerModal(false);
    } catch (error) {
      toast.error('Failed to upload banner');
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Special Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage special products with prizes and rewards
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowBannerModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Special Banner
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Special Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search special products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 h-11 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {debouncedSearch && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isLoading ? (
              'Searching...'
            ) : (
              <>
                Found <span className="font-semibold text-purple-600 dark:text-purple-400">{specialProducts.length}</span> product{specialProducts.length !== 1 ? 's' : ''} 
                matching "<span className="font-medium dark:text-gray-300">{debouncedSearch}</span>"
              </>
            )}
          </span>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Prizes
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4">
                      <div className="animate-pulse h-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    </td>
                  </tr>
                ))
              ) : specialProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    {debouncedSearch ? (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">No products found matching "{debouncedSearch}"</p>
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium text-sm"
                        >
                          Clear search
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No special products found</p>
                    )}
                  </td>
                </tr>
              ) : (
                specialProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden aspect-square flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover aspect-square"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center ${product.images?.[0] ? 'hidden' : 'flex'}`}>
                            <Image className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {product.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium text-gray-900 dark:text-white">1st:</span>
                          <span className="text-gray-600 dark:text-gray-300">{product.firstPrize}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Gift className="w-4 h-4 text-purple-500" />
                          <span className="font-medium text-gray-900 dark:text-white">2nd:</span>
                          <span className="text-gray-600 dark:text-gray-300">{product.secondPrize}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          product.isActive
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                        }`}
                      >
                        {product.isActive ? (
                          <>
                            <Star className="w-3 h-3" /> Active
                          </>
                        ) : (
                          'Inactive'
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSetAsTrend(product._id)}
                          disabled={product.isFeatured}
                          className={`p-2 rounded-lg transition-colors ${
                            product.isFeatured
                              ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 cursor-default'
                              : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                          }`}
                          title={product.isFeatured ? 'Currently trending' : 'Set as trend'}
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {product.isFeatured && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Trending</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingProduct ? 'Edit Special Product' : 'Create Special Product'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="e.g., 30"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This will be shown in yellow in the middle of the description</p>
              </div>

              {/* Offer Descriptions - First and Second */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First OfferDescription *
                  </label>
                  <textarea
                    value={formData.firstOfferDescription}
                    onChange={(e) => setFormData({ ...formData, firstOfferDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g., Get an exclusive discount on our premium"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This will appear before the discount percentage.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Second OfferDescription *
                  </label>
                  <textarea
                    value={formData.secondOfferDescription}
                    onChange={(e) => setFormData({ ...formData, secondOfferDescription: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g., kitchen collection. Valid until March 24th only!"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This will appear after the discount percentage.
                  </p>
                </div>
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Description
                </label>
                <textarea
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="e.g., This premium kitchen utensil set features elegant wooden handles and high-quality stainless steel construction. Perfect for everyday cooking and special occasions."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Detailed product description shown on the special products page (optional).
                </p>
              </div>

              {/* Prizes */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      First Prize *
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.firstPrize}
                    onChange={(e) => setFormData({ ...formData, firstPrize: e.target.value })}
                    placeholder="e.g., iPhone 15 Pro"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-purple-500" />
                      Second Prize *
                    </div>
                  </label>
                  <input
                    type="text"
                    value={formData.secondPrize}
                    onChange={(e) => setFormData({ ...formData, secondPrize: e.target.value })}
                    placeholder="e.g., $500 Gift Card"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
                </label>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <div className="flex items-center justify-between">
                    <span>Product Images *</span>
                    <span className={`text-xs ${(selectedImages.length + imagePreviewUrls.length) < MIN_IMAGES ? 'text-red-500' : 'text-green-500'}`}>
                      {selectedImages.length + imagePreviewUrls.length} / min {MIN_IMAGES} images
                    </span>
                  </div>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 group">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>
                {(selectedImages.length + imagePreviewUrls.length) < MIN_IMAGES && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                    Please upload at least {MIN_IMAGES} images
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={(selectedImages.length + imagePreviewUrls.length) < MIN_IMAGES}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Special Banner</h2>
              <button
                onClick={() => {
                  resetBannerForm();
                  setShowBannerModal(false);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Banner Upload Area */}
              {!bannerPreviewUrl ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-colors">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Upload Banner Image
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Image must be exactly <span className="font-semibold text-purple-600 dark:text-purple-400">427 x 1908 pixels</span>
                  </p>
                  <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all">
                    <Plus className="w-5 h-5" />
                    Select Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerImageSelect}
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Banner Preview */}
                  <div className="relative rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600">
                    <img 
                      src={bannerPreviewUrl} 
                      alt="Banner Preview" 
                      className="w-full h-auto max-h-[400px] object-contain bg-gray-100 dark:bg-gray-900"
                    />
                    <button
                      onClick={resetBannerForm}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Image Info */}
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Dimensions: {bannerDimensions?.width || '-'} x {bannerDimensions?.height || '-'} pixels
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Required: 427 x 1908 pixels
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                      isBannerValid 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                    }`}>
                      {isBannerValid ? '✓ Valid Size' : '✗ Invalid Size'}
                    </div>
                  </div>
                  
                  {!isBannerValid && bannerDimensions && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-400">
                        <strong>Error:</strong> Image dimensions ({bannerDimensions.width} x {bannerDimensions.height}) do not match required size (427 x 1908). Please upload an image with exact dimensions.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={() => {
                  resetBannerForm();
                  setShowBannerModal(false);
                }}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBannerSave}
                disabled={!isBannerValid}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBannerValid ? 'Upload Banner' : 'Invalid Image'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminSpecialProducts;
