import jwt from "jsonwebtoken";
import { findUserById } from "../utils/firebaseMethods.js";

const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res.status(401).json({ success: false, error: "Unauthorized: No token Provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(401).json({ success: false, error: "Unauthorized: Invalid token" });

    const user = await findUserById(decoded.userId);
    if (!user) 
      return res.status(401).json({ success: false, error: "Unauthorized: User not found" });

    req.user = user;
    next();
    
  } catch (err) {
    res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid token",
      msg: err.message,
    });
  }
};

export default protectedRoute;
