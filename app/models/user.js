var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    google: {
        id: String,
        token: String,
        user: String,
        email: String,
    },
    credits: Number,
    documentsReviewed: Number
});

module.exports = mongoose.model('User', userSchema);