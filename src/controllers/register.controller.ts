import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';
import { createNewUser, findUserByEmail } from '../models/user.model.js';
import type { RegisterBody } from '../interfaces/auth.interface.js';
import bcrypt from 'bcrypt';



// Register User
async function registerUser(req: Request, res: Response) {
    const body: RegisterBody = req.body;
    try {
        const {
            username,
            email,
            name,
            password,
            city,
            role = 'candidate',
        } = body;

        // Validation
        if (
            !username ||
            !email ||
            !password ||
            !city ||
            !name
        ) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        // Find if User already exists
        const isUserAlreadyExist = await findUserByEmail(email);
        if (isUserAlreadyExist) {
            return res.status(401).json({ message: "User Already exist" })
        }

        const hash = await bcrypt.hash(password, 10) // Password Hashing 


        //Create user
        const user = await createNewUser({
            name,
            username,
            email,
            password: hash,
            role,
            city,
        })


        // Assign token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "7d",
            }
        );

        // Assign to cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Response 
        res.status(201).json({
            message: "User has been successfully created",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
}