const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    cartID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Cart'
    },
    productID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
    },
    quantity: Number,
    price: Number,
});

const CartItemModel = mongoose.model("Cart Item", CartItemSchema);

module.exports = CartItemModel;