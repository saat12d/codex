const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullName: String,
    email: String,
    repOfShelter: String,
    contact: String,
    isPetCenter: Boolean
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);