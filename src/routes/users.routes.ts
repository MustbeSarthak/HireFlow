import express from 'express';
import {loginUser, registerUser} from '../controllers/register.controller.js'
import { authValidator } from '../middleware/auth.middleware.js';

const router = express.Router();

// router.get('/users', getAllUser);
// router.post('users', createNewUser);

//Register Routes
router.post('/register', registerUser );

// Login Routes
router.get('/login', authValidator, loginUser);

export default router;