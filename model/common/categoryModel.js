const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    categoryCode: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        unique: true,
        set: v => v.toLowerCase().trim()
    },
    statusID: {
        type: Number
    }
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;