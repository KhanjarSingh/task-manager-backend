import express from "express"
import { registerUser, loginUser, getUserProfile, updateUserProfile, changeUserPassword } from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()


router.get("/", (req, res) => {
  res.json({ message: "Users API is working", routes: ["POST /", "POST /login", "GET /profile", "PUT /profile"] })
})


router.post("/", registerUser)
router.post("/login", loginUser)
router.get("/profile", protect, getUserProfile)
router.put("/profile", protect, updateUserProfile)
router.post("/change-password", protect, changeUserPassword)


router.use((req, res) => {
  res.status(404).json({ message: `User route ${req.url} not found` })
})

export default router
