const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
    statusID: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        unique: true,
        set: v => v.toLowerCase().trim()
    }
});

const StatusModel = mongoose.model("Status", StatusSchema);

module.exports = StatusModel;