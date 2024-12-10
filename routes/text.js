const express = require("express");
const {
  getText,
  saveText,
  getAllTexts,
  getTextBySlug,
  updateTextBySlug,
  branchDocument,
  getDiffBetweenParentAndChild,
  getParentContent
} = require("../controllers/textController");

const router = express.Router();

// Route to get all documents
router.get("/", getAllTexts);

// Route to get a specific document by its slug
router.get("/:slug", getTextBySlug);

// Route to update a specific document by its slug
router.put("/:slug", updateTextBySlug);

// Route to save a new document
router.post("/", saveText);

// Route to branch a document
router.post("/:slug/branch", branchDocument);

// Add this route to your backend routes
router.get("/:slug/differences", getDiffBetweenParentAndChild);

router.get("/documents/:slug/parent-content", getParentContent);

module.exports = router;
