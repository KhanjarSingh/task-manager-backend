// server.js
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import { errorHandler } from "./middleware/errorMiddleware.js"

dotenv.config()

const app = express() // Here it Initializes the Express app
const PORT = process.env.PORT || //defaults the port to 3000




app.get("/", (req, res) => {
  res.json({ message: "API is running" })
}) // here it checks if backend is running smoothly


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
})) // the cors library helps the frontend to access or make a seamless comunication with backend


app.use(express.json()) // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })) //Parses URL-encoded form data (like from HTML forms)


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next() // moves on to next middleware after one is done
}) //Logs each incoming request’s method and path


app.use("/api/users", userRoutes) //handles all the routes like register or login
app.use("/api/tasks", taskRoutes) //handles all the routes related to tasks like id of task and task


app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` })
}) //if u give any other route than the given above it registers and error


app.use(errorHandler) //A centralized error handler middleware you defined to catch and respond to errors consistently


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
  }) // it connects mongodb takign the URI from the env file so that data can be accessed or can be saved 