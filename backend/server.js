import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import roomsRoutes from "./routes/roomsRoute.js";

import roommateRoutes from './routes/roommates.js';
import { 
  updateRoommateProfile, 
  getRoommateProfile, 
  toggleRoommateProfile 
} from './controllers/roommateController.js';
import { authenticateToken } from "./middleware/authMiddleware.js";
dotenv.config();

const app = express();

// CORS setup
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomsRoutes);
app.put('/api/user/roommate-profile', authenticateToken, updateRoommateProfile);
app.get('/api/user/roommate-profile', authenticateToken, getRoommateProfile);
app.patch('/api/user/roommate-profile/active', authenticateToken, toggleRoommateProfile);
app.use('/api/roommates', roommateRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the backend server");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
