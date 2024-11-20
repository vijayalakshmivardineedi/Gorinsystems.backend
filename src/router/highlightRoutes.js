const express = require('express');
const {
  getHighlights,
  addHighlight,
  updateHighlight,
  deleteHighlight,
  reorderHighlights,
} = require('../controller/highlightController');

const router = express.Router();

// Routes for highlights
router.get('/get', getHighlights); // Fetch all highlights
router.post('/create', addHighlight);
router.put('/put/:id', updateHighlight); // Update an existing highlight
router.delete('/delete/:id', deleteHighlight); // Delete a highlight
router.put('/reorder', reorderHighlights); // Reorder highlights

module.exports = router;
