const mongoose = require("mongoose");
const validator = require("validator");
const { validate } = require("./tourModels");
const crypto = require("crypto");
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
    role: {
        type: String,
        Enumerator: ["admin","user","lead-guide","lead"],
        default: "user"
    },
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
    },
    passwordChangedAt : Date , 
    passwordResetToken : String ,
    passwordResetExpires : Date , 
    active : {
        type: Boolean,
        default: true,
        select : false
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = function(candidatPassword , userPassword) {
    return bcrypt.compare(candidatPassword,userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimeAfter){
    if (this.passwordChangedAt){
        const changedPasswordTime = parseInt(this.changedPasswordAfter.getTime() / 1000, 10);
        return JWTTimeAfter < changedPasswordTime ;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex'); 
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10*60*1000 ;
    return resetToken ;
}


const User = mongoose.model('User', userSchema);
module.exports = User;