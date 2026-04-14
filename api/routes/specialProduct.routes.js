import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';
import {
  getSpecialProducts,
  getSpecialProduct,
  createSpecialProduct,
  updateSpecialProduct,
  deleteSpecialProduct,
  joinSpecialProduct,
  selectWinners,
  uploadBanner,
  getBanner
} from '../controllers/specialProduct.controller.js';

const router = express.Router();

// Public routes
router.get('/', getSpecialProducts);
router.get('/:id', getSpecialProduct);

// Protected routes - Admin only
router.post('/', 
  protect, 
  adminOnly, 
  upload.array('images', 10), 
  createSpecialProduct
);

router.put('/:id', 
  protect, 
  adminOnly, 
  upload.array('images', 10), 
  updateSpecialProduct
);

router.delete('/:id', 
  protect, 
  adminOnly, 
  deleteSpecialProduct
);

router.post('/:id/join', protect, joinSpecialProduct);
router.post('/:id/winners', protect, adminOnly, selectWinners);

// Banner routes
router.get('/banner', getBanner);
router.post('/banner/upload', protect, adminOnly, upload.single('banner'), uploadBanner);

export default router;
