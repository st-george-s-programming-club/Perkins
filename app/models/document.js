var mongoose = require("mongoose");

var documentSchema = mongoose.Schema({
    id: String,
    userSubmitted: String,
    title: String,
    reviewedAmount: Number,
    level: String,
    doc: {
        original: String,
        edited: String
    }
});

module.exports = mongoose.model('Document', documentSchema);