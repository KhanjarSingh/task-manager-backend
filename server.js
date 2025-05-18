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




app.get("/", (req, res) => {
  res.json({ message: "API is running" })
})


app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://prodoc-frontend.vercel.app",
    "http://localhost:3000",
    "https://task-manager-frontend-mdxa.onrender.com",
    "https://task-manager-seven-tau.vercel.app"
  ], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})


app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)


app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` })
})


app.use(errorHandler)


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