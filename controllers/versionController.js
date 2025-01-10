const Text = require("../models/Text");
const Version = require("../models/Version");

const createNewVersion = async (req, res) => {
  const documentID = req.params.documentID;
  const doc = await Text.findById(documentID);
  const latestVersion = doc.latestVersion;
  try {
    const { name, content } = req.body;
    const newVersion = new Version({
      name: name,
      content: content,
      version: latestVersion,
      documentID: documentID,
    });
    await newVersion.save();
    const updateVersion = await Text.findByIdAndUpdate(documentID, {
      latestVersion: latestVersion + 1,
    });
    res.status(201).json(newVersion);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving document", error: error.message });
  }
};

const fetchAllVersionsOfDocument = async (req, res) => {
  const documentID = req.params.documentID;
  try {
    const allVersions = await Version.find({ documentID: documentID });
    res.send(allVersions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving document", error: error.message });
  }
};

const rollbackToVersion = async (req, res) => {
  try {
    const { documentId, versionNo } = req.params;

    // Validate input
    if (!documentId || !versionNo) {
      return res.status(400).json({ error: "Invalid request parameters" });
    }

    // Find the version to rollback to
    const newParent = await Version.findOne({
      documentID: documentId,
      version: versionNo,
    });

    if (!newParent) {
      return res.status(404).json({ error: "Version not found" });
    }

    // Update the document with the content of the selected version
    const updatedDocument = await Text.findByIdAndUpdate(
      documentId,
      { content: newParent.content },
      { new: true } // Return the updated document
    );

    if (!updatedDocument) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Send success response
    res.status(200).json({
      message: "Document successfully rolled back to the selected version",
    });
  } catch (error) {
    console.error("Error during rollback:", error);
    res
      .status(500)
      .json({ error: "An error occurred during the rollback process" });
  }
};

module.exports = {
  createNewVersion,
  fetchAllVersionsOfDocument,
  rollbackToVersion,
};
