import jwt from "jsonwebtoken"
import User from "../models/userModel.js"


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body


    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }


    const user = await User.create({
      name,
      email,
      password,
    })

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body


    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      })
    } else {
      res.status(401).json({ message: "Invalid email or password" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateUserProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      user.name = name;
    }

    if (password) {

      user.password = password;
      await user.save();
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "Password updated successfully"
      });
    }


    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: "Profile updated successfully"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const { currentPassword, newPassword } = req.body
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" })
    }
    user.password = newPassword
    await user.save()
    res.json({ message: "Password updated successfully" })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
