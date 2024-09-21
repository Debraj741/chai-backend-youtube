import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async(userid)=>{
    try {
        const user = await User.findById(userid);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;

        // Save Refresh token to Database
        await user.save({validateBeforeSave : false})
        
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating Refresh and Access Token !!")
    }
}


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
    // console.log("Name : ", fullName);
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

    const existedUser = await User.findOne({
        $or : [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409, "User Already Exist!!")
    }
    // console.log(req.files);
    
    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
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

const loginUser =  asyncHandler(async (req,res)=>{
    // req body -> data
    // username or email based login
    // find the user 
    // password check
    // access & refresh token generate 
    // send cookie (generated access & refrsh token send to user)

    const {email, username, password} = req.body;
    if(!email || !username){
        throw new ApiError(400, "Username or Email is Required !!")
    }

    const user = await User.findOne({
        $or : [{username},{email}]
    })
    if(!user){
        throw new ApiError(404, "User Does Not Exist !!")
    }

    const isPasswordvalid = await user.isPasswordCorrect(password);
    if(!isPasswordvalid){
        throw new ApiError(401, "Please Enter a Valid Password !!")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    // Save logged in User
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // Secure cookie Option
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, accessToken, refreshToken
            },
            "User Logged In Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    // Before Come to this Route , Middleware add req.user object

    // Update the refresh token as undefined 
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    // Clear Cookies & return
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(
        200,
        {},
        "User Logged Out SuccessFully!!"
    ))
}) 


export {registerUser, loginUser, logoutUser}