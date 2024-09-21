import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    try {
        // Collect Token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if(!token){
            throw new ApiError(401, "Unauthorized Access!!")
        }
    
        // Check Token is Right or not using JWT
        const decodedTokenInfo = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        // Find this user from database using tokens payload
        const user = await User.findById(decodedTokenInfo?._id).select(
            "-password -refreshToken"
        )
        if(!user){
            // TODO : Discuss about Frontend
            throw new ApiError(401, "Invalid Access Token!!")
        }
    
        // Add an object in req 
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token!!")
    }
    

})