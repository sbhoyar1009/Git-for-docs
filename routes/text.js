const express = require("express");
const {
  getText,
  saveText,
  getAllTexts,
  getTextBySlug,
  updateTextBySlug,
  branchDocument,
  getDiffBetweenParentAndChild,
  getParentContent,
  buildHierarchyTree,
  mergeToParent,
  fetchDocumentStatistics,
  updateSchema
} = require("../controllers/textController");

const router = express.Router();
// router.post("/update/schema",updateSchema);
// Route to get all documents

router.get("/:userId", getAllTexts);
router.get("/document/tree",buildHierarchyTree)
// Route to get a specific document by its slug

router.get("/statistics/:id",fetchDocumentStatistics)
router.get("/:userId/:slug", getTextBySlug);

// Route to update a specific document by its slug
router.put("/:slug", updateTextBySlug);

// Route to save a new document
router.post("/", saveText);

// Route to branch a document
router.post("/:slug/branch", branchDocument);
router.post("/merge/:slug",mergeToParent)
// Add this route to your backend routes
router.get("/:slug/differences", getDiffBetweenParentAndChild);

router.get("/documents/:slug/parent-content", getParentContent);



module.exports = router;
