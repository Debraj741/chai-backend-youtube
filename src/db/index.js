import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {
        //As mongoose gives returned object after coneect so can store in variable
        const connectionInstances = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB Connected !! DB HOST : ${connectionInstances.connection.host}`);
        

    } catch (error) {
        console.log("MONGODB connection FAILED: ",error);
        process.exit(1)
    }
}

export default connectDB