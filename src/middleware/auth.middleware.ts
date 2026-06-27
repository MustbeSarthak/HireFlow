import jwt, { type JwtPayload } from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import type { AuthRequest } from "../interfaces/auth.interface.js";

export const authValidator = async(req:AuthRequest, res:Response, next:NextFunction) => {
    /* To verify someone we will check if they have token 
    if they do? Then it suggests that this user is registered
    */
    const token = req.cookies?.token;
    if(!token){
        return res.status(401).json({
            message:"Unauthorized Access",
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET!);

        req.user = decoded as JwtPayload;

        next();
    }catch{
        return res.status(401).json({
            message:"Unauthorized Access",
        });
    };
}