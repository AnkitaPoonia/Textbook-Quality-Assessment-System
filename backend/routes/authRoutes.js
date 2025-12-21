import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { me } from "../controllers/authController.js";

const router = express.Router();
router.get("/me", protect, me);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protect, logout);
export default router;
