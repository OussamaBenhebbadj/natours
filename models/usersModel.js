const mongoose = require("mongoose");
const validator = require("validator");
const { validate } = require("./tourModels");
const bcrypt = require("bcryptjs");

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
        required: true,
        validate: {
            validator: function(el){
                return el === this.password ; //return true if passwordConfirm = password
            },
            message:"Different to the password"
        }
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;