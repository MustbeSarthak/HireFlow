import type {Request} from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface RegisterBody{
    username:string;
    email:string;
    password:string;
    name:string;
    city:string;
    role?:"candidate" | "recruiter";
}


export interface AuthRequest extends Request{
    user?: string | JwtPayload;
}