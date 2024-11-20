const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
  text: { type: String, required: true },
  order: { type: Number, required: true }, // Controls the display order of highlights
});

const Highlight = mongoose.model('Highlight', highlightSchema);

module.exports = Highlight;
