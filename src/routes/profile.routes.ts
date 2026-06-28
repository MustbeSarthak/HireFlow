import  express from 'express';
import { authValidator } from '../middleware/auth.middleware.js';


const router = express.Router();

/* We will be using PATCH method to update profile */
