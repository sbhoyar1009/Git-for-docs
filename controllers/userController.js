const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const { generateToken } = require("../utils/jwt");
const User = require("../models/User");
const logger = require("../logger/logger");

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    logger.warn("Validation failed: All fields are required");
    return res
      .status(400)
      .json({
        errorCode: "VALIDATION_ERROR",
        message: "All fields are required",
      });
  }

  try {
    logger.info("Registering new user", { username });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    logger.info("User registered successfully", { username });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error("Error registering user", { username, error: error.message });

    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          errorCode: "DUPLICATE_USERNAME",
          message: "Username already exists",
        });
    }
    res
      .status(500)
      .json({ errorCode: "SERVER_ERROR", message: "Error registering user" });
  }
};

// User login
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    logger.warn("Validation failed: All fields are required");
    return res
      .status(400)
      .json({
        errorCode: "VALIDATION_ERROR",
        message: "All fields are required",
      });
  }

  try {
    logger.info("Attempting user login", { username });

    const user = await User.findOne({ username });
    if (!user) {
      logger.warn("Invalid username or password", { username });
      return res
        .status(400)
        .json({
          errorCode: "INVALID_CREDENTIALS",
          message: "Invalid username or password",
        });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      logger.warn("Invalid username or password", { username });
      return res
        .status(400)
        .json({
          errorCode: "INVALID_CREDENTIALS",
          message: "Invalid username or password",
        });
    }

    const token = generateToken(user._id);
    logger.info("User logged in successfully", { username });
    res.status(200).json({ token, user });
  } catch (error) {
    logger.error("Error logging in user", { username, error: error.message });
    res
      .status(500)
      .json({ errorCode: "SERVER_ERROR", message: "Error logging in" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  const { userId, fullName, phone, address, website } = req.body;

  if (!userId) {
    logger.warn("Validation failed: User ID is required");
    return res
      .status(400)
      .json({ errorCode: "VALIDATION_ERROR", message: "User ID is required" });
  }

  try {
    logger.info("Updating user profile", { userId });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, phone, address, website },
      { new: true } // Return the updated user object
    );

    if (!updatedUser) {
      logger.warn("User not found", { userId });
      return res
        .status(404)
        .json({ errorCode: "USER_NOT_FOUND", message: "User not found" });
    }

    logger.info("User profile updated successfully", { userId });
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error("Error updating user profile", {
      userId,
      error: error.message,
    });
    res
      .status(500)
      .json({ errorCode: "SERVER_ERROR", message: "Error updating profile" });
  }
};

// Find user by ID
const findUserById = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    logger.warn("Validation failed: User ID is required");
    return res
      .status(400)
      .json({ errorCode: "VALIDATION_ERROR", message: "User ID is required" });
  }

  try {
    logger.info("Fetching user by ID", { userId });

    const user = await User.findById(userId);
    if (!user) {
      logger.warn("User not found", { userId });
      return res
        .status(404)
        .json({ errorCode: "USER_NOT_FOUND", message: "User not found" });
    }

    logger.info("User fetched successfully", { userId });
    res.status(200).json(user);
  } catch (error) {
    logger.error("Error fetching user by ID", { userId, error: error.message });
    res
      .status(500)
      .json({ errorCode: "SERVER_ERROR", message: "Error fetching user" });
  }
};

module.exports = {
  registerUser,
  login,
  updateProfile,
  findUserById,
};
