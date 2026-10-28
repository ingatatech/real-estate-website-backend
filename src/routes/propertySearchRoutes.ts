import { Router } from 'express';
import {
  createPropertySearch,
  deletePropertySearch,
  getPropertySearchById,
  getPropertySearches,
  replacePropertySearch,
  updatePropertySearch,
  triggerSavedSearchAlertsHandler,
} from '../controllers/propertySearchController.js';

import { requireAuth } from '../middleware/auth.js';
import { searchRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Apply authentication middleware to all property search routes
router.use(requireAuth);

router.get('/', searchRateLimiter, getPropertySearches);
router.post('/', createPropertySearch);
router.post('/trigger-alerts', triggerSavedSearchAlertsHandler);
router.get('/:id', getPropertySearchById);
router.put('/:id', replacePropertySearch);
router.patch('/:id', updatePropertySearch);
router.delete('/:id', deletePropertySearch);

export default router;
