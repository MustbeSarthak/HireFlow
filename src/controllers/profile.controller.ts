import type{Request,Response} from 'express';

/* 
Work Flow to update any profile will be 
    Register --> authValidator --> req.user.id --> Data Recieve --> Profile exist? - yes? UPDATE 
    no? Respond will be error 
 */

export const updateProfile = async(req:Request, res:Response)=>{
    const { phone, bio, links, profilePic} = req.body;
}