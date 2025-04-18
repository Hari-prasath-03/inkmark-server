import express from "express";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import cors from "cors";

import mdRoutes from "./routes/route.md.js";
import authRoutes from "./routes/route.auth.js";

configDotenv();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://inkmark.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ data: "Welcome to InkMark Server!" });
});

app.use("/api/files", mdRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
