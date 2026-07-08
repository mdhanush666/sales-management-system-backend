const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        unique: true,
        set: v => v.toLowerCase().trim()
    },
    districtID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'District'
    }
});

const CityModel = mongoose.model("City", CitySchema);

module.exports = CityModel;