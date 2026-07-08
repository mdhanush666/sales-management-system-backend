const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    customerCode: {
        type: String,
        unique: true,
        required: true
    },
    shopName: {
        type: String,
        required: true,
    },
    address: String,
    contactNo: {
        type: String,
        unique: true
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },
    cityID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'City'
    },
    salesRepID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    statusID: {
        type: Number,
        required: true
    },
});

const CustomerModel = mongoose.model("Customer", CustomerSchema);

module.exports = CustomerModel;