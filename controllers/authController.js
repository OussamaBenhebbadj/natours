const User = require("./../models/usersModel")
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
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
