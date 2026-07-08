const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    cartCode: {
        type: String,
        required: true,
        unique: true,
        set: v => v.toUpperCase().trim()
    },
    totalAmount: Number,
    remark: String,
    customerID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Customer'
    },
    salesRepID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    statusID: Number
});

const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;