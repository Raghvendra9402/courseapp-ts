import {Request,Response, NextFunction, Router } from "express";
import bcrypt from "bcrypt";
import UserModel from "../db";
import jwt, { JwtPayload } from "jsonwebtoken";
const userRouter = Router();

userRouter.post("/signup", async (req,res) => {
    const {email,username,password} = req.body;
    const user = await UserModel.findOne({username});
    if(user){
         res.send({message : "User Already Exists"});
         return;
    }
    const hashedPassword = await bcrypt.hash(password,10);
    await UserModel.create({
        email,
        username,
        password : hashedPassword
    })
    res.send({message : "User Created Successfully"})
});

userRouter.post("/signin", async (req,res) => {
    const {username , password} = req.body;
    const user = await UserModel.findOne({username});
    if(!user || !password || !user.password){
        res.send({message : "Invalid Username or Password"})
        return;
    }
    const validPassword = await bcrypt.compare(password,user.password);
    if(!validPassword){
        res.send({message : "Invalid Credentials"})
        return;
    }
    if (!process.env.USER_JWT_SECRET) {
        throw new Error("user jwt secret not provided");
    }
    const token = jwt.sign({id : user._id},process.env.USER_JWT_SECRET);
    res.json({
        message : "Sign In Successfully",
        "id" : user._id,
        "token" : token
    })
});

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
userRouter.get("/me",userAuth,(req,res) => {
    const userId = req.id;
    res.send(`hello user ${userId} `)
})

export default userRouter;