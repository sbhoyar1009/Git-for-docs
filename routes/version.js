const express = require("express");
const { createNewVersion } = require("../controllers/versionController");
const router = express.Router();

router.post("/:documentID",createNewVersion)



module.exports = router;
