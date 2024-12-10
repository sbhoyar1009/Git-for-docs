const mongoose = require('mongoose');
const slugify = require('slugify');  // To generate unique slugs for each document

const textSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Text', default: null }, // Reference to parent document
  createdAt: { type: Date, default: Date.now }
});

// Before saving the document, generate a slug from the title
textSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Text = mongoose.model('Text', textSchema);

module.exports = Text;
