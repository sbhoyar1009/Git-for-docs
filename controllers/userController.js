const User = require("../models/User");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const registerUser = async (req, res) => {
  const { username, password } = req.body;
    console.log(username,password)
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword)
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      res.status(400).json({ message: "Username already exists" });
    } else {
      res.status(500).json({ message: "Error registering user" });
    }
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
    console.log(username,password)
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    console.log(isMatch)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error logging in" });
  }
};

module.exports = {
    registerUser,
    login
}