const Text = require("../models/Text");
const { diffWords } = require("diff"); // Import the diff library
const { JSDOM } = require("jsdom");
const logger = require("../logger/logger")

// Controller to get the current text content
const getText = async (req, res) => {
  try {
    const text = await Text.findOne();
    if (!text) {
      logger.warn("Document not found", {
        userId: req.userId,
        timestamp: new Date(),
      });
      return res.status(404).json({ message: "No text found" });
    }
    logger.info("Text fetched successfully", {
      message: "Text fetched",
      textId: text._id,
      userId: req.userId,
      timestamp: new Date(),
    });
    res.json(text);
  } catch (err) {
    logger.error("Failed to fetch text", {
      error: err.message,
      userId: req.userId,
      timestamp: new Date(),
    });
    res.status(500).json({ message: "Failed to fetch text" });
  }
};

// Controller to get all documents
const getAllTexts = async (req, res) => {
  const userID = req.params.userId;
  try {
    const texts = await Text.find({ userId: userID });
    logger.info("All texts fetched successfully", {
      userId: userID,
      totalCount: texts.length,
      timestamp: new Date(),
    });
    res.json(texts);
  } catch (err) {
    logger.error("Failed to fetch documents", {
      error: err.message,
      userId: userID,
      timestamp: new Date(),
    });
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

// Controller to get a document by its slug
const getTextBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const text = await Text.findOne({ slug });
    if (!text) {
      logger.warn("Document not found for slug", {
        message: "Document not found",
        slug,
        timestamp: new Date(),
      });
      return res.status(404).json({ message: "Document not found" });
    }
    logger.info("Document fetched successfully by slug", {
      message: "Document fetched",
      slug,
      textId: text._id,
      timestamp: new Date(),
    });
    res.json(text);
  } catch (err) {
    logger.error("Failed to fetch document by slug", {
      error: err.message,
      slug,
      timestamp: new Date(),
    });
    res.status(500).json({ message: "Failed to fetch document" });
  }
};

// Save text content
const saveText = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const newText = new Text({
      title,
      content,
      userId,
    });
    await newText.save();
    logger.info("New text saved successfully", {
      message: "Document saved",
      textId: newText._id,
      userId: newText.userId,
      timestamp: new Date(),
    });
    res.status(201).json(newText);
  } catch (error) {
    logger.error("Error saving document", {
      error: error.message,
      userId: req.body.userId,
      timestamp: new Date(),
    });
    res
      .status(500)
      .json({ message: "Error saving document", error: error.message });
  }
};

// Update text by slug
const updateTextBySlug = async (req, res) => {
  const { slug } = req.params;
  const { title, content } = req.body;

  try {
    const text = await Text.findOne({ slug });
    if (!text) {
      logger.warn("Document not found for update", {
        message: "Document not found",
        slug,
        timestamp: new Date(),
      });
      return res.status(404).json({ message: "Document not found" });
    }

    text.title = title;
    text.content = content;
    await text.save();
    logger.info("Text updated successfully", {
      message: "Document updated",
      textId: text._id,
      slug,
      timestamp: new Date(),
    });
    res.status(200).json({ message: "Text updated successfully" });
  } catch (err) {
    logger.error("Failed to update text", {
      error: err.message,
      slug,
      timestamp: new Date(),
    });
    res.status(500).json({ message: "Failed to update text" });
  }
};

// Branch a document
const branchDocument = async (req, res) => {
  const { slug } = req.params;
  try {
    const parentDoc = await Text.findOne({ slug });
    if (!parentDoc) {
      logger.warn("Parent document not found for branching", {
        message: "Parent document not found",
        slug,
        timestamp: new Date(),
      });
      return res.status(404).json({ message: "Parent document not found" });
    }

    const branchedDoc = new Text({
      title: `${parentDoc.title} (Branched)`,
      content: parentDoc.content,
      parent: parentDoc._id,
    });

    await branchedDoc.save();
    logger.info("Branch created successfully", {
      parentDocId: parentDoc._id,
      branchedDocId: branchedDoc._id,
      slug,
      timestamp: new Date(),
    });
    res
      .status(200)
      .json({ message: "Branch created successfully", branchedDoc });
  } catch (err) {
    logger.error("Failed to create branch", {
      error: err.message,
      slug,
      timestamp: new Date(),
    });
    res
      .status(500)
      .json({ message: "Failed to create branch", error: err.message });
  }
};

// Fetch differences between parent and child documents
const getDiffBetweenParentAndChild = async (req, res) => {
  const { slug } = req.params;
  try {
    const childDoc = await Text.findOne({ slug }).populate("parent");
    if (!childDoc || !childDoc.parent) {
      logger.warn("Parent or child document not found", {
        message: "Parent or child document not found",
        slug,
        timestamp: new Date(),
      });
      return res
        .status(404)
        .json({ message: "Parent or child document not found" });
    }

    const parentDoc = await Text.findById(childDoc.parent);
    const parentContent = parentDoc.content;
    const childContent = childDoc.content;

    logger.info("Differences fetched successfully", {
      parentDocId: parentDoc._id,
      childDocId: childDoc._id,
      slug,
      timestamp: new Date(),
    });

    res.status(200).json({ parentContent, childContent });
  } catch (err) {
    logger.error("Failed to fetch differences", {
      error: err.message,
      slug,
      timestamp: new Date(),
    });
    res
      .status(500)
      .json({ message: "Failed to fetch differences", error: err.message });
  }
};

// Build document hierarchy tree
const buildHierarchyTree = async (req, res) => {
  try {
    const tree = await buildTree(); // Start from root (null)
    logger.info("Document tree built successfully", {
      timestamp: new Date(),
    });
    res.json(tree);
  } catch (error) {
    logger.error("Failed to fetch document tree", {
      error: error.message,
      timestamp: new Date(),
    });
    res.status(500).json({ message: "Failed to fetch document tree" });
  }
};

// Fetch the parent content for a document
const getParentContent = async (req, res) => {
  const { slug } = req.params;
  try {
    const document = await Text.findOne({ slug }).populate("parent"); // Populate parent
    if (!document || !document.parent) {
      return res.status(404).json({ message: "Parent document not found" });
    }

    res.status(200).json({ parentContent: document.parent.content });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching parent content", error: err.message });
  }
};

const buildTree = async (parentId = null) => {
  const documents = await Text.find({ parent: parentId }).lean();
  const tree = [];

  for (const doc of documents) {
    const children = await buildTree(doc._id); // Recursively fetch children
    tree.push({
      id: doc._id,
      name: doc.title,
      slug: doc.slug,
      children,
    });
  }

  return tree;
};

const mergeToParent = async (req, res) => {
  const { slug } = req.params;

  try {
    // Fetch the child document
    const childDocument = await Text.findOne({ slug });
    if (!childDocument) {
      return res.status(404).json({ message: "Child document not found." });
    }

    // Ensure it has a parent
    if (!childDocument.parent) {
      return res
        .status(400)
        .json({ message: "No parent document available to merge into." });
    }

    // Fetch the parent document
    const parentDocument = await Text.findById(childDocument.parent);
    if (!parentDocument) {
      return res.status(404).json({ message: "Parent document not found." });
    }

    // Merge the content (for now, we'll simply append the child content to the parent)
    // You can use a diff algorithm or other logic to merge intelligently
    parentDocument.content = childDocument.content;
    await parentDocument.save();

    res.json({ message: "Merged successfully.", parentDocument });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error merging documents.", error: error.message });
  }
};

const fetchDocumentStatistics = async (req, res) => {
  console.log("Called");
  const docId = req.params.id;
  try {
    const stats = await Text.getDocumentStatistics(docId);
    console.log("Document Statistics:", stats);
    res.json({ message: "Stats fetched", stats });
  } catch (error) {
    console.error("Error fetching statistics:", error.message);
  }
};

const updateSchema = async () => {
  const result = await Text.updateMany(
    {}, // Match all documents
    { $set: { userId: "676b025fdf05a7b124cd09fd" } } // Add or update the userId field
  );

  console.log(`${result.modifiedCount} documents were updated.`);
};

module.exports = {
  getText,
  saveText,
  getAllTexts,
  getTextBySlug,
  updateTextBySlug,
  branchDocument,
  getParentContent,
  getDiffBetweenParentAndChild,
  buildHierarchyTree,
  mergeToParent,
  fetchDocumentStatistics,
  updateSchema,
};
