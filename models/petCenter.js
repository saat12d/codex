const mongoose = require('mongoose');

const petCenterSchema = new mongoose.Schema({
    name: String,
    location: String,
    desc: String,
    contact: String,
    email: String,
    image: String,
    pets: [{
        animal: String,
        breed: String,
        age: Number,
        ageUnit: String,
        medicalInfo: String,
        images: [{ url: String, public_id: String }]
    }],
})

module.exports = mongoose.model('Center', petCenterSchema);