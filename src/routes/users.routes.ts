import express from 'express';
import {registerUser} from '../controllers/register.controller.js'
const router = express.Router();

// router.get('/users', getAllUser);
// router.post('users', createNewUser);

//Register Routes
router.post('/register', registerUser );


export default router;