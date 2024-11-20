const Highlight = require('../model/Highlight');

// Fetch all highlights (sorted by order)
exports.getHighlights = async (req, res) => {
  try {
    const highlights = await Highlight.find().sort('order');
    res.json(highlights);
  } catch (err) {
    res.status(500).send('Error fetching highlights');
  }
};

// Add a new highlight
exports.addHighlight = async (req, res) => {
  try {
    const lastHighlight = await Highlight.findOne().sort('-order');
    const newOrder = lastHighlight ? lastHighlight.order + 1 : 1;

    const newHighlight = new Highlight({
      text: req.body.text,
      order: newOrder,
    });

    await newHighlight.save();
    res.status(201).json(newHighlight);
  } catch (err) {
    res.status(500).send('Error adding highlight');
  }
};

// Edit a highlight
exports.updateHighlight = async (req, res) => {
  try {
    const updatedHighlight = await Highlight.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true }
    );

    if (!updatedHighlight) {
      return res.status(404).send('Highlight not found');
    }

    res.json(updatedHighlight);
  } catch (err) {
    res.status(500).send('Error updating highlight');
  }
};

// Delete a highlight
exports.deleteHighlight = async (req, res) => {
  try {
    const deletedHighlight = await Highlight.findByIdAndDelete(req.params.id);
    if (!deletedHighlight) {
      return res.status(404).send('Highlight not found');
    }

    // Adjust orders of remaining highlights
    await Highlight.updateMany(
      { order: { $gt: deletedHighlight.order } },
      { $inc: { order: -1 } }
    );

    res.sendStatus(204).send('successfylly deleted');
  } catch (err) {
    res.status(500).send('Error deleting highlight');
  }
};

// Reorder highlights
exports.reorderHighlights = async (req, res) => {
  try {
    const { newOrder } = req.body;

    if (!Array.isArray(newOrder)) {
      return res.status(400).send('Invalid data format');
    }

    // Perform bulk updates for reordering
    const bulkOps = newOrder.map(highlight => ({
      updateOne: {
        filter: { _id: highlight._id },
        update: { $set: { order: highlight.order } },
      },
    }));

    await Highlight.bulkWrite(bulkOps);

    res.status(200).json({ message: 'Highlights reordered successfully', newOrder });
  } catch (err) {
    console.error('Error reordering highlights:', err);
    res.status(500).send('Error reordering highlights');
  }
};

