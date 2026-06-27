import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';
import { createNewUser, findUserByEmail } from '../models/user.model.js';
import type { RegisterBody } from '../interfaces/auth.interface.js';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';



// Register User
export const registerUser = async(req: Request, res: Response) => {
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

// Login User
export const loginUser = async(req: Request, res:Response) => {
    const {username, email,password} = req.body; 
    const identifier = email || username;

    // Find user 
    const result = await pool.query(`
        SELECT * FROM users 
        WHERE  email = $1 OR username = $1`, [identifier])

    const user = result.rows[0];
    
    if(!result){
        return res.status(401).json({
            message:"Unauthorized Access",
        })
    }
    
    if(!user){
        return res.status(401).json({
            message:"Unauthorized Access",
        });
    }

    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if(!isPasswordCorrect){
        return res.status(401).json({
            message:"Invalid Credentials",
        })
    }

    const token = jwt.sign({
        id: user.id,
        role: user.role,
    },process.env.JWT_SECRET!,
    {
        expiresIn:"7d",
    });

    // Assign token
    res.cookie("token", token, {
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    res.status(201).json({
        username: user.username,
        message:"Login Successfull", 
    });
};