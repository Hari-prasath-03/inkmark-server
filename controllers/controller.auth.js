import { generateOtp, userIdGenerator } from "../utils/index.js";
import { findUserByMail, setUser } from "../utils/firebaseMethods.js";

import { sendOtpMail } from "../utils/mailer.js";
import { setOtp, verifyOtp } from "../utils/otpStore.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, error: "Email is required" });

    const otp = generateOtp(6);
    await sendOtpMail(email, otp);
    setOtp(email, otp);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to send OTP", msg: err.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, otp } = req.body;

    if (!name || !email || !otp)
      return res
        .status(400)
        .json({ success: false, error: "Name and email both are required" });

    const existingUser = await findUserByMail(email);
    if (existingUser)
      return res
        .status(409)
        .json({ success: false, error: "Mail already exists, Try to Login" });

    const isValidOtp = verifyOtp(email, otp);
    if (!isValidOtp)
      return res
        .status(400)
        .json({ success: false, error: "Invalid OTP or OTP expired" });

    const { userId, docId } = userIdGenerator(name);
    await setUser(docId, { userId, name, email });

    generateTokenAndSetCookie(userId, res);
    res.status(201).json({
      success: true,
      data: { userId },
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      msg: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res
        .status(400)
        .json({ success: false, error: "Email and OTP are required" });

    const user = await findUserByMail(email);
    if (!user)
      return res.status(404).json({
        success: false,
        error: "Account not found, First create a account",
      });

    const isValidOtp = verifyOtp(email, otp);
    if (!isValidOtp)
      return res
        .status(400)
        .json({ success: false, error: "Invalid OTP or OTP expired" });

    generateTokenAndSetCookie(user.userId, res);
    res.status(200).json({
      success: true,
      data: { userId: user.userId },
      message: "Login successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      msg: err.message,
    });
  }
};

export const checkAuth = (req, res) => {
  res
    .status(200)
    .json({ success: true, isAuthenticated: true, message: "Authenticated" });
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", { path: "/" });
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      msg: err.message,
    });
  }
};

export const getUser = async (req, res) => {
  generateTokenAndSetCookie(req.user.userId, res);
  res.status(200).json({ success: true, data: req.user });
};
