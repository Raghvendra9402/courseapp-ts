import {Request,Response, NextFunction} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const userAuth = (req : Request ,res : Response ,next :NextFunction ) =>  {
    const token = req.headers["token"];
    if (!process.env.USER_JWT_SECRET) {
        throw new Error("user jwt secret not provided");
    }
    const decodedData = jwt.verify(token as string,process.env.USER_JWT_SECRET) as JwtPayload;
    if(!decodedData){
        res.send({message : "Authorization Failed"})
        return;
    }
    req.id = decodedData.id;
    next();
}

export default userAuth;