const express = require("express");
const userModules = require("./../controllers/usersController");

const Router = express.Router();

Router.route("/").get(userModules.getAllusers).post(userModules.createUser);
Router.route("/:id").get(userModules.getOneUser).patch(userModules.updateUser).delete(userModules.deleteUser);

module.exports = Router ;
