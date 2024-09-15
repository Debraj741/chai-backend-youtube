import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{
    // Get User Details from Frontend (Here POSTMAN use)
    // All Possible Validation - (1.Not empty)
    // Check if User already exist : username , email
    // Check for Imager , Avater (required)[check for multer]
    // Upload them to cloudinary, avater check[for cloudinary]
    // Create user object - Add entry in DB
    // Remove password & refresh token from response (As response send in frontend as it created, though password is encrypted still remove password and refresh token from response)
    // Check for User Creation
    // Return response

    const {username, email, fullName, password} = req.body
    console.log("Name : ", fullName);
/*   
    if(fullName === ""){
        throw new ApiError(400,"Full Name is Required")
    }
    if(email === ""){
        throw new ApiError(400,"Email is Required")
    }
    if(username === ""){
        throw new ApiError(400,"UserName is Required")
    }
    if(password === ""){
        throw new ApiError(400,"Password is Required")
    }
*/
    if(
        [fullName,email,password,username].some(field => 
        {field?.trim() === ""})
    ){
        throw new ApiError(400, "All Fields are MAndatory !!")
    }

    const existedUser = User.findOne({
        $or : [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409, "User Already Exist!!")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avater File is Must Required!")
    }

    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)
    if(!avatar)throw new ApiError(400, "Avater File is Must Required!")

    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        username : username.toLowerCase(),
        email : email.toLowerCase(),
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something Went Wrong While Registering the USer!!")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully!")
    )
})

export {registerUser}