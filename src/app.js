import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

//Use Cors with options 
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

//Json data Handle
app.use(express.json({limit:"16kb"}))

//Url Data Handle
app.use(express.urlencoded({extended:true, limit:"16kb"}))

//Configure for Public Data
app.use(express.static("public"))

//Set Cookie Parser to access or Set cookie in user cookies
app.use(cookieParser())

// Routes Import
import userRouter from "./routes/user.routes.js"

// Routes Declaration - As I segregate controllers so middleware [.use()] need , here direct [.get()..etc] not work.. Best Practice is given below..

app.use("/api/v1/users", userRouter)

// https://localhost:8000/api/v1/users/register  =>Url create like this.

export {app}