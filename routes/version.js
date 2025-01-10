const express = require("express");
const { createNewVersion, fetchAllVersionsOfDocument, rollbackToVersion } = require("../controllers/versionController");
const router = express.Router();

router.post("/:documentID",createNewVersion)
router.get("/:documentID",fetchAllVersionsOfDocument)
router.put("/rollback/:documentId/:versionNo",rollbackToVersion)


module.exports = router;
