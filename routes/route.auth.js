import { Router } from "express";
import {
  registerUser,
  sendOtp,
  login,
  getUser,
  logout,
  checkAuth,
} from "../controllers/controller.auth.js";
import protectedRoute from "../middleware/protected.js";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/register", registerUser);
router.post("/login", login);

router.get("/check-auth", protectedRoute, checkAuth);

router.post("/logout", protectedRoute, logout);
router.get("/get-me", protectedRoute, getUser);

export default router;
