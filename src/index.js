// require('dotenv').config({path : './env'})
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";


dotenv.config({path : './.env'})


connectDB()
.then(()=>{

    app.on("error", (error)=>{
        console.log("Express Can not Communicate : ", error);
        throw error;
    })

    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is Running at Port ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MongoDB Connection Failed !!! ",err);
    
})








/*
//Approach 1 - Connecting through Database code present in Index file

import express from "express";
const app = express();

(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log(`ERROR: `, error);
            throw error;
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`App is Listning on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR : ", error);
        throw error 
    }
})()
*/