const User = require("./../models/usersModel")

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const getAllusers = async (req,res) => {
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
        users
        }
    });
};

const updateMe = async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return res.status(404).json({
    status: 'fail',
    message:"This route is not for password updates."
  }); 
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
};

const deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
};

const createUser = (req,res) => {
    res.status(500).json({
        status : "err",
        message : "This route is not yet implemented"
    });
};

const getOneUser = (req,res) => {
    res.status(500).json({
        status : "err",
        message : "This route is not yet implemented"
    });
};

const updateUser = (req,res) => {
    res.status(500).json({
        status : "err",
        message : "This route is not yet implemented"
    });
};

const deleteUser = (req,res) => {
    res.status(500).json({
        status : "err",
        message : "This route is not yet implemented"
    });
};

module.exports = {
    getAllusers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    updateMe,
    deleteMe
}