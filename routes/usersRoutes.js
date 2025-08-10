const express = require("express");
const userModules = require("./../controllers/usersController");
const authModules = require("./../controllers/authController");

const Router = express.Router();

Router.route("/signup").post(authModules.signup);
Router.route("/login").post(authModules.login);
Router.route("/forgotPassword").post(authModules.forgotPassword);
Router.route("/resetPassword/:token").patch(authModules.resetPassword);
Router.route("/updateMe").patch(authModules.protect, userModules.updateMe);
Router.route("/deleteMe").delete(authModules.protect, userModules.deleteMe);
Router.route("/").get(userModules.getAllusers).post(userModules.createUser);
Router.route("/:id").get(userModules.getOneUser).patch(userModules.updateUser).delete(userModules.deleteUser);

module.exports = Router ;
