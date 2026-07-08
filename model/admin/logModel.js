const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    ui: String,
    method: String,
    errorMsg: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LogModel = mongoose.model("Log", LogSchema);

module.exports = LogModel;