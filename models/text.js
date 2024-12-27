const mongoose = require('mongoose');
const slugify = require('slugify');  // To generate unique slugs for each document

const textSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Text', default: null }, // Reference to parent document
  createdAt: { type: Date, default: Date.now },
  latestVersion : {type: Number, default : 1}
});

// Before saving the document, generate a slug from the title
textSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

textSchema.methods.getStatistics = async function () {
  const wordCount = this.content.split(/\s+/).filter((word) => word).length;
  const characterCount = this.content.length;

  // Count child documents
  const childCount = await Text.countDocuments({ parent: this._id });

  return {
    title: this.title,
    wordCount,
    characterCount,
    childCount,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Static method to fetch a document and generate its statistics
textSchema.statics.getDocumentStatistics = async function (id) {
  const document = await this.findById(id);
  if (!document) throw new Error("Document not found");
  return await document.getStatistics();
};


const Text = mongoose.model('Text', textSchema);

module.exports = Text;
