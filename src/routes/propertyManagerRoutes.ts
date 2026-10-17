import { Router } from 'express';
import {
  createAdminProperty,
  deleteAdminProperty,
  getAdminProperties,
  getAdminProperty,
  updateAdminProperty,
} from '../controllers/adminPropertyController.js';
import { uploadPropertyMedia, uploadDevelopmentMedia } from '../controllers/propertyMediaController.js';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { getAssignableAgents } from '../controllers/agentController.js';
import {
  assignPropertyManager,
  requireOwnedManagerProperty,
} from '../middleware/propertyManagerOwnership.js';
import {
  getAllDevelopments,
  getDevelopmentById,
  createDevelopment,
  updateDevelopment,
  deleteDevelopment,
} from '../controllers/developmentController.js';
import {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature,
} from '../controllers/propertyFeatureController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

// Apply authentication + property_manager role check to ALL property manager routes
router.use(requireAuth, authorize('property_manager', 'admin'));

// Specific routes must come before parameterized routes
router.get('/agents', getAssignableAgents);
router.post('/media', upload.single('file'), uploadPropertyMedia);

// Developments - must come before property routes to avoid conflicts
router.get('/developments', getAllDevelopments);
router.get('/developments/:id', getDevelopmentById);
router.post('/developments', createDevelopment);
router.patch('/developments/:id', updateDevelopment);
router.delete('/developments/:id', deleteDevelopment);
router.post('/developments/media', upload.single('file'), uploadDevelopmentMedia);

// Property Features - must come before property routes to avoid conflicts
router.get('/property-features', getAllFeatures);
router.get('/property-features/:id', getFeatureById);
router.post('/property-features', createFeature);
router.patch('/property-features/:id', updateFeature);
router.delete('/property-features/:id', deleteFeature);

// Property managers can only access properties assigned to their account.
router.get('/', getAdminProperties);
router.get('/:id', requireOwnedManagerProperty, getAdminProperty);
router.post('/', assignPropertyManager, createAdminProperty);
router.patch('/:id', requireOwnedManagerProperty, assignPropertyManager, updateAdminProperty);
router.delete('/:id', requireOwnedManagerProperty, deleteAdminProperty);

export default router;
