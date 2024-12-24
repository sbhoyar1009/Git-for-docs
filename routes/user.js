const express = require("express");
const { login, registerUser } = require("../controllers/userController");
const router = express.Router();

router.post("/register",registerUser)
router.post("/login", login)



module.exports = router;
