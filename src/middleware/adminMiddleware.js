const jwt = require("jsonwebtoken");
const User = require("../models/users");
const redisClient = require('../config/redis');

const adminMiddleware=async (req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token)
            throw new Error("Token is not present");

        const payload=jwt.verify(token,process.env.JWT_KEY);

        const {_id}=payload;

        if(!_id){
            throw new Error("Invalid token");
        }

        const result=await User.findById(_id);
        //check admin
        if(payload.role !== 'admin') 
            throw new Error("Invalid token");

        if(!result){
            throw new Error("User not found");
        }

        //Redis ke bocklist mein presnt to nahi hai

        const IsBlocked=await redisClient.exists(`token:${token}`);

        if(IsBlocked)
            throw new Error("Invalid token");

        req.result=result;
        next();   

    }
    catch(err){
        res.status(401).send("Error: "+err.message);
    }
}
module.exports=adminMiddleware;