const Text = require("../models/Text");
const Version = require("../models/Version");

const createNewVersion = async (req, res) => {
  const documentID = req.params.documentID;
  console.log(documentID)
  const doc = await Text.findById(documentID);
  const latestVersion = doc.latestVersion;
  try {
    const { name, content } = req.body;
    const newVersion = new Version({
      name: name,
      content: content,
      version: latestVersion + 1,
      documentID: documentID
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

module.exports = {
    createNewVersion
}
