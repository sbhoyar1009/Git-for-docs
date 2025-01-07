
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const { generateToken } = require("../utils/jwt");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Username already exists" });
    } else {
      res.status(500).json({ message: "Error registering user" });
    }
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = generateToken(user._id);
    res.json({ token: token, ...user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

const updateProfile = async (req, res) => {
  const { userId, fullName, phone, address, website } = req.body;
  console.log(phone);
  try {
    // Find the user by ID and update their information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, phone, address, website },
      { new: true } // Return the updated user object
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const findUserById = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  res.status(200).json(user)
};

module.exports = {
  registerUser,
  login,
  updateProfile,
  findUserById
};
