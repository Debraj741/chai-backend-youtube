import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

// Register Routes
router.route("/register").post(registerUser)



export default router