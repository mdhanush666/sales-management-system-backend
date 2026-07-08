const mongoose = require('mongoose');

const UserPermissionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    assignedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    permissions: {
        type: Map,
        of: new mongoose.Schema({
            Create: Boolean,
            Read: Boolean,
            Update: Boolean,
            Delete: Boolean,
        }),
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const UserPermissionModel = mongoose.model("User Permission", UserPermissionSchema);

module.exports = UserPermissionModel;