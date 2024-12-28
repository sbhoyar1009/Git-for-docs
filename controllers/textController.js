const Text = require("../models/Text");
const { diffWords } = require("diff"); // Import the diff library
const { JSDOM } = require("jsdom");


// Controller to get the current text content
const getText = async (req, res) => {
  try {
    const text = await Text.findOne();
    if (!text) {
      return res.status(404).json({ message: "No text found" });
    }
    res.json(text);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch text" });
  }
};

// Controller to get all documents
const getAllTexts = async (req, res) => {
  const userID = req.params.userId;
  try {
    const texts = await Text.find({userId:userID});
    res.json(texts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

// Controller to get a document by its slug
const getTextBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const text = await Text.findOne({ slug });
    if (!text) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(text);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Failed to fetch document" });
  }
};

const saveText = async (req, res) => {
  try {
    const { title, content,userId } = req.body;
    const newText = new Text({
      title,
      content, // content will be the HTML from Quill editor
      userId
    });
    await newText.save();
    res.status(201).json(newText);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving document", error: error.message });
  }
};

const updateTextBySlug = async (req, res) => {
  const { slug } = req.params;
  const { title, content } = req.body;

  try {
    const text = await Text.findOne({ slug });
    if (!text) {
      return res.status(404).json({ message: "Document not found" });
    }

    text.title = title;
    text.content = content;
    await text.save();

    res.status(200).json({ message: "Text updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update text" });
  }
};

// Controller to create a branched document
const branchDocument = async (req, res) => {
  const { slug } = req.params;
  try {
    const parentDoc = await Text.findOne({ slug });
    if (!parentDoc) {
      return res.status(404).json({ message: "Parent document not found" });
    }

    const branchedDoc = new Text({
      title: `${parentDoc.title} (Branched)`,
      content: parentDoc.content,
      parent: parentDoc._id,
    });

    await branchedDoc.save();
    res
      .status(200)
      .json({ message: "Branch created successfully", branchedDoc });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create branch", error: err.message });
  }
};
const splitIntoParagraphs = (text) => {
  return text.split("\n").filter((para) => para.trim() !== "");
};

function parseContent(content) {
  // Using jsdom to simulate DOMParser
  const dom = new JSDOM(content);
  const doc = dom.window.document;
  const paragraphs = Array.from(doc.querySelectorAll("p"));
  return paragraphs.map((p) => p.innerHTML.trim()); // Extract inner HTML of each paragraph
}

// Modified endpoint to return paragraph-level differences
const getDiffBetweenParentAndChild = async (req, res) => {
  const { slug } = req.params;
  try {
    const childDoc = await Text.findOne({ slug }).populate("parent");
    if (!childDoc || !childDoc.parent) {
      return res
        .status(404)
        .json({ message: "Parent or child document not found" });
    }

    const parentDoc = await Text.findById(childDoc.parent);

    const parentParagraphs = parseContent(parentDoc.content);
    const childParagraphs = parseContent(childDoc.content);
    console.log(parentParagraphs);
    // Diff paragraphs
    const diffResult = parentParagraphs
      .map((parentPara, index) => {
        const childPara = childParagraphs[index] || ""; // In case child content has less paragraphs

        if (parentPara !== childPara) {
          return {
            index,
            parent: parentPara,
            child: childPara,
            difference: `Changed from: "${parentPara}" to: "${childPara}"`,
          };
        }
        return null;
      })
      .filter((diff) => diff !== null);

    res.status(200).json({ diffResult });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch differences", error: err.message });
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

const buildHierarchyTree = async (req,res) => {
  console.log("hitted")
  try {
    const tree = await buildTree(); // Start building from the root (parent = null)
    res.json(tree);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch document tree" });
  }
};

const mergeToParent =async (req, res) => {
  const { slug } = req.params;

  try {
    // Fetch the child document
    const childDocument = await Text.findOne({ slug });
    if (!childDocument) {
      return res.status(404).json({ message: "Child document not found." });
    }

    // Ensure it has a parent
    if (!childDocument.parent) {
      return res.status(400).json({ message: "No parent document available to merge into." });
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
    res.status(500).json({ message: "Error merging documents.", error: error.message });
  }
};

const fetchDocumentStatistics = async (req,res) => {

  const docId = req.params.id;
  try {
    const stats = await Text.getDocumentStatistics(docId);
    console.log("Document Statistics:", stats);
    res.json({ message: "Stats fetched", stats });
  } catch (error) {
    console.error("Error fetching statistics:", error.message);
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
  fetchDocumentStatistics
};
