const express = require("express");
const { login, registerUser, updateProfile, findUserById } = require("../controllers/userController");
const router = express.Router();

router.post("/register",registerUser)
router.post("/login", login)
router.put("/profile",updateProfile)
router.get("/:userId",findUserById)

module.exports = router;
