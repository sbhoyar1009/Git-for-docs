const mongoose = require("mongoose");
const slugify = require("slugify"); // To generate unique slugs for each document

const versionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  documentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Text",
    required: true,
  }, 
  createdAt: { type: Date, default: Date.now },
  version : {type : Number}
});


const Version = mongoose.model('Version', versionSchema);

module.exports = Version;