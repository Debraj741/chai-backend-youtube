// require('dotenv').config({path : './env'})
import dotenv from "dotenv";

import connectDB from "./db/index.js";


dotenv.config({path : './env'})


connectDB()









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