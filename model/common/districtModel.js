const mongoose = require('mongoose');

const DistrictSchema = new mongoose.Schema({
    districtID: {
        type: Number,
        unique: true
    },
    district: {
        type: String,
        required: true,
        unique: true
    },
    provinceID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Province'
    }
});

const DistrictModel = mongoose.model("District", DistrictSchema);

module.exports = DistrictModel;