// server.js
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import { errorHandler } from "./middleware/errorMiddleware.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Add a root route for Render health check or browser visit
app.get("/", (req, res) => {
  res.send("API is running");
});

// Dynamically echo the request origin for CORS (for local dev)
app.use(cors({
  origin: (origin, callback) => callback(null, origin),
  credentials: true,
}))

app.use(express.json())

// API routes
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)

// Error handler middleware
app.use(errorHandler)

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err))