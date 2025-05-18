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
  res.json({ message: "API is running" })
})

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "https://prodoc-frontend.vercel.app"], // Add your frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}))

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// API routes
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` })
})

// Error handler middleware
app.use(errorHandler)

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`API URL: http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)
    process.exit(1)
  })