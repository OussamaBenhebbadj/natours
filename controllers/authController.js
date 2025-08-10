const User = require("./../models/usersModel")
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sendEmail = require("./../utils/email");
const crypto = require("crypto");

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm : req.body.passwordConfirm
    });

    const token = jwt.sign({id: newUser._id }, process.env.JWT_SECRET , {expiresIn: "90d"});

    res.status(201).json({
      status: "success",
      token,
      data: {
        newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};

exports.login = async (req,res) => {

  const {email , password} = req.body;
  if(!email || !password){
    res.status(400).json({
      status: "fail",
      message: "Please enter your email & password"
    });
  }else{
    const user = await User.findOne({email});
    if (!user || !(await user.correctPassword(password,user.password))){
      res.status(400).json({
      status: "fail",
      message: "Incorrect email or password"
    });
    }else{
      const token = jwt.sign({id: user._id }, process.env.JWT_SECRET , {expiresIn: "90d"})
      res.status(201).json({
      status: "success",
      token,
    });
    }
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting the token and check if it is there 
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access!',
      });
    }

    // 2) Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if the user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user no longer exists!',
      });
    }

    // 4) Check if the user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: 'fail',
        message: 'User recently changed password! Please log in again.',
      });
    }

    req.user = freshUser; // tu peux attacher l'utilisateur à la requête
    next();
  } catch (err) {
    console.error('JWT Protect Error:', err.message);
    return res.status(401).json({
      status: 'fail',
      message:
        err.name === 'TokenExpiredError'
          ? 'Token expired! Please log in again.'
          : 'Invalid token. Please log in again.',
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req,res,next) => {
    if(!roles.includes(req.user.role)){
      return res.status(403).json({
      status: 'fail',
      message: 'You do not have permission to perform this action !'
    });
    }
    next();
  }
};

exports.forgotPassword = async (req,res,next) => {
  // 1) Get user based on email 
  const user = await User.findOne({email : req.body.email});
  if (!user) {
    return res.status(403).json({
      status: 'fail',
      message: 'No user exists with this email !'
    });
  };
  // 2) Generate the random reset token 
  const resetToken = user.createPasswordResetToken() ;
  await user.save({validateBeforeSave: false});

  // 3) send the token to the user's email using nodemailer
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password ? Submit a patch request with your new password to : ${resetURL}`;
  try{
    await sendEmail({
    email: user.email,
    subject: 'Your reset token is valid for 10 min',
    message
  });
    res.status(200).json({
      status : 'success',
      message: 'Token send to your email'
    });
  }catch(err){
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: false});
    return res.status(500).json({
      status: 'fail',
      message: 'Error while sending the email, please try later'
    });
  };
  

};

exports.resetPassword = async (req,res,next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
  
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Log the user in, send JWT
    const token = jwt.sign({id: user._id }, process.env.JWT_SECRET , {expiresIn: "90d"});
    res.status(201).json({
      status: "success",
      token
    });
  
    
};
