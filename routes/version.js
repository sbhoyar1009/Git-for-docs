const express = require("express");
const { createNewVersion, fetchAllVersionsOfDocument } = require("../controllers/versionController");
const router = express.Router();

router.post("/:documentID",createNewVersion)
router.get("/:documentID",fetchAllVersionsOfDocument)


module.exports = router;
