const express = require("express");
const userModules = require("./../controllers/usersController");
const authModules = require("./../controllers/authController");

const Router = express.Router();

Router.route("/signup").post(authModules.signup);
Router.route("/").get(userModules.getAllusers).post(userModules.createUser);
Router.route("/:id").get(userModules.getOneUser).patch(userModules.updateUser).delete(userModules.deleteUser);

module.exports = Router ;
