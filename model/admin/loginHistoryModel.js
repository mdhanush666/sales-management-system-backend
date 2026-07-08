const mongoose = require('mongoose');

const LoginHistorySchema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    geoLocation: {
        lat: Number,
        lon: Number,
    },
    loginDate: {
        type: Date,
        default: Date.now
    }
});

const LoginHistoryModel = mongoose.model("Login History", LoginHistorySchema);

module.exports = LoginHistoryModel;