const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderCode: {
        type: String,
        required: true,
        unique: true
    },
    cartID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Cart'
    },
    customerID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Customer"
    },
    salesRepID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    statusID: Number
});

const OrderModel = mongoose.model("Order", OrderSchema);

module.exports = OrderModel;