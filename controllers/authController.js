const User = require("./../models/usersModel")

exports.signup = async (req,res) => {
    const newUser = User.create(req.body);
    res.status(201).json({
        message : "success",
        data:{
            user: newUser
        }
    })
};