import  express from 'express';
import { authValidator } from '../middleware/auth.middleware.js';
import { updateProfile } from '../controllers/profile.controller.js';

const router = express.Router();

/* We will be using PATCH method to update profile */
router.patch('/update', authValidator, updateProfile);


export default router;