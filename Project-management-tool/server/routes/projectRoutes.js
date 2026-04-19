import express from 'express';
import { createProject, getProjects, getProjectStats, getAllProjectStats } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// protect all project routes
router.use(protect);

router.get('/', getProjects);
router.post('/', createProject);
router.get('/all-stats', getAllProjectStats);
router.get('/:id/stats', getProjectStats);

export default router;
