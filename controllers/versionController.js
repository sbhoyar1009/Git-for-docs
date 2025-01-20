const Text = require("../models/Text");
const Version = require("../models/Version");
const {createUserLogger,mainLogger} = require("../logger/logger");

const createNewVersion = async (req, res) => {
  const documentID = req.params.documentID;

  try {
    const doc = await Text.findById(documentID);
    if (!doc) {
      mainLogger.warn("Document not found", { documentID });
      return res
        .status(404)
        .json({
          errorCode: "DOCUMENT_NOT_FOUND",
          message: "Document not found",
        });
    }

    const latestVersion = doc.latestVersion;
    const { name, content } = req.body;

    mainLogger.info("Creating a new version", { documentID, latestVersion });

    const newVersion = new Version({
      name,
      content,
      version: latestVersion,
      documentID,
    });

    await newVersion.save();

    await Text.findByIdAndUpdate(documentID, {
      latestVersion: latestVersion + 1,
    });

    // User-specific logging
    const userLogger = createUserLogger(req.user._id);  // Assuming user info is in `req.user`
    userLogger.info("New version created successfully", {
      documentID,
      version: latestVersion + 1,
    });

    res.status(201).json(newVersion);
  } catch (error) {
    mainLogger.error("Error creating a new version", {
      documentID,
      error: error.message,
    });
    res
      .status(500)
      .json({ errorCode: "SERVER_ERROR", message: "Error saving document" });
  }
};

// Fetch all versions of a document
const fetchAllVersionsOfDocument = async (req, res) => {
  const documentID = req.params.documentID;

  try {
    mainLogger.info("Fetching all versions of the document", { documentID });

    const allVersions = await Version.find({ documentID });
    if (!allVersions || allVersions.length === 0) {
      mainLogger.warn("No versions found for document", { documentID });
      return res
        .status(404)
        .json({
          errorCode: "VERSIONS_NOT_FOUND",
          message: "No versions found for the document",
        });
    }

    // User-specific logging
    const userLogger = createUserLogger(req.user._id);  // Assuming user info is in `req.user`
    userLogger.info("Fetched all versions successfully", {
      documentID,
      versionCount: allVersions.length,
    });

    res.status(200).json(allVersions);
  } catch (error) {
    mainLogger.error("Error fetching document versions", {
      documentID,
      error: error.message,
    });
    res
      .status(500)
      .json({
        errorCode: "SERVER_ERROR",
        message: "Error fetching document versions",
      });
  }
};

// Rollback a document to a specific version
const rollbackToVersion = async (req, res) => {
  const { documentId, versionNo } = req.params;

  if (!documentId || !versionNo) {
    mainLogger.warn("Invalid request parameters for rollback", {
      documentId,
      versionNo,
    });
    return res
      .status(400)
      .json({
        errorCode: "VALIDATION_ERROR",
        message: "Invalid request parameters",
      });
  }

  try {
    mainLogger.info("Initiating rollback", { documentId, versionNo });

    const versionToRollback = await Version.findOne({
      documentID: documentId,
      version: versionNo,
    });

    if (!versionToRollback) {
      mainLogger.warn("Version not found for rollback", { documentId, versionNo });
      return res
        .status(404)
        .json({ errorCode: "VERSION_NOT_FOUND", message: "Version not found" });
    }

    const updatedDocument = await Text.findByIdAndUpdate(
      documentId,
      { content: versionToRollback.content },
      { new: true } // Return the updated document
    );

    if (!updatedDocument) {
      mainLogger.warn("Document not found during rollback", { documentId });
      return res
        .status(404)
        .json({
          errorCode: "DOCUMENT_NOT_FOUND",
          message: "Document not found",
        });
    }

    // User-specific logging
    const userLogger = createUserLogger(req.user._id);  // Assuming user info is in `req.user`
    userLogger.info("Document rolled back successfully", { documentId, versionNo });

    res.status(200).json({
      message: "Document successfully rolled back to the selected version",
      updatedDocument,
    });
  } catch (error) {
    mainLogger.error("Error during rollback", {
      documentId,
      versionNo,
      error: error.message,
    });
    res
      .status(500)
      .json({
        errorCode: "SERVER_ERROR",
        message: "An error occurred during the rollback process",
      });
  }
};

module.exports = {
  createNewVersion,
  fetchAllVersionsOfDocument,
  rollbackToVersion,
};
