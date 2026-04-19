import express from 'express';
import { signup, login, getMe, getAllDevelopers, updateProfile } from '../controllers/authController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/me', protect, getMe);
router.patch('/update-profile', protect, updateProfile);
router.get('/developers', protect, restrictTo('manager'), getAllDevelopers);

export default router;
