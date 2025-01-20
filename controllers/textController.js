const Text = require("../models/Text");
const { diffWords } = require("diff"); // Import the diff library
const { JSDOM } = require("jsdom");
const logger = require("../logger/logger");

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
    logger.info("Fetching parent content for document", { slug });

    const document = await Text.findOne({ slug }).populate("parent");
    if (!document) {
      logger.warn("Document not found", { slug });
      return res
        .status(404)
        .json({ errorCode: "DOC_NOT_FOUND", message: "Document not found" });
    }

    if (!document.parent) {
      logger.warn("Parent document not found", { slug });
      return res
        .status(404)
        .json({
          errorCode: "PARENT_NOT_FOUND",
          message: "Parent document not found",
        });
    }

    logger.info("Parent content fetched successfully", { slug });
    res.status(200).json({ parentContent: document.parent.content });
  } catch (err) {
    logger.error("Error fetching parent content", { error: err.message, slug });
    res
      .status(500)
      .json({
        errorCode: "SERVER_ERROR",
        message: "Error fetching parent content",
        error: err.message,
      });
  }
};

// Build a tree structure of documents
const buildTree = async (parentId = null) => {
  try {
    logger.info("Building tree", { parentId });
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

    logger.info("Tree built successfully", { parentId });
    return tree;
  } catch (error) {
    logger.error("Error building tree", { parentId, error: error.message });
    throw new Error("Error building document tree");
  }
};

// Merge child document content into the parent
const mergeToParent = async (req, res) => {
  const { slug } = req.params;

  try {
    logger.info("Merging document into parent", { slug });

    // Fetch the child document
    const childDocument = await Text.findOne({ slug });
    if (!childDocument) {
      logger.warn("Child document not found", { slug });
      return res
        .status(404)
        .json({
          errorCode: "CHILD_DOC_NOT_FOUND",
          message: "Child document not found.",
        });
    }

    // Ensure it has a parent
    if (!childDocument.parent) {
      logger.warn("No parent document to merge into", { slug });
      return res
        .status(400)
        .json({
          errorCode: "NO_PARENT",
          message: "No parent document available to merge into.",
        });
    }

    // Fetch the parent document
    const parentDocument = await Text.findById(childDocument.parent);
    if (!parentDocument) {
      logger.warn("Parent document not found", {
        parentId: childDocument.parent,
      });
      return res
        .status(404)
        .json({
          errorCode: "PARENT_DOC_NOT_FOUND",
          message: "Parent document not found.",
        });
    }

    // Merge content
    parentDocument.content = `${parentDocument.content}\n${childDocument.content}`;
    await parentDocument.save();

    logger.info("Merged document content successfully", {
      childSlug: slug,
      parentId: parentDocument._id,
    });
    res.json({ message: "Merged successfully.", parentDocument });
  } catch (error) {
    logger.error("Error merging documents", { slug, error: error.message });
    res
      .status(500)
      .json({
        errorCode: "MERGE_ERROR",
        message: "Error merging documents.",
        error: error.message,
      });
  }
};

// Fetch document statistics
const fetchDocumentStatistics = async (req, res) => {
  const docId = req.params.id;

  try {
    logger.info("Fetching document statistics", { docId });
    const stats = await Text.getDocumentStatistics(docId);

    logger.info("Document statistics fetched successfully", { docId, stats });
    res.json({ message: "Stats fetched", stats });
  } catch (error) {
    logger.error("Error fetching document statistics", {
      docId,
      error: error.message,
    });
    res
      .status(500)
      .json({
        errorCode: "STATS_ERROR",
        message: "Error fetching document statistics",
        error: error.message,
      });
  }
};

// Update schema for all documents
const updateSchema = async () => {
  try {
    logger.info("Updating schema for all documents");

    const result = await Text.updateMany(
      {}, // Match all documents
      { $set: { userId: "676b025fdf05a7b124cd09fd" } } // Add or update the userId field
    );

    logger.info("Schema updated successfully", {
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    logger.error("Error updating schema", { error: error.message });
    throw new Error("Error updating schema");
  }
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
