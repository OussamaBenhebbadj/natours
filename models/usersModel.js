const mongoose = require("mongoose");
const validator = require("validator");
const { validate } = require("./tourModels");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail , 'Please provide a validate email']
    },
    photo: String ,
    password : {
        type: String,
        required: true,
        minlength : 8
    },
    passwordConfirm : {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;