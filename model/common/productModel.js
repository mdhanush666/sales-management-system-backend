const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    modelNo: {
        type: String,
        required: true,
        unique: true,
        set: v => v.toUpperCase().trim()
    },
    price: Number,
    productImage: {
        type: String,
        default: "https://picsum.photos/200/300"
    },
    categoryID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category'
    },
    statusID: {
        type: Number,
        default: 1
    }
});

const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;