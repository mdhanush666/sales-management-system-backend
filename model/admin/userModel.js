const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    address: String,
    phoneNumber: String,
    userName: {
        type: String,
        required: true,
        unique: true,
        set: v => v.toLowerCase().trim()
    },
    password: String,
    profileImage: {
        type: String,
        default: "https://picsum.photos/200/300"
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "salesRep"]
    },
    statusID: {
        type: Number,
        default: 1
    }
});

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;