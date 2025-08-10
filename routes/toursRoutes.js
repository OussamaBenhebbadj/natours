const express = require("express");
const Router = express.Router();
const tourModules = require("./../controllers/toursController");
const authModules = require("./../controllers/authController");

//Param middleware
Router.param ('id', (req,res,next,val) => {
    console.log(`Tour id id : ${val}`);
    next();
})

Router.route('/stats').get(tourModules.getTourStat);
Router.route('/').get(authModules.protect , tourModules.getAllTours).post(tourModules.createTour);
Router.route("/:id").get(tourModules.getOneTour).patch(tourModules.updateTour).delete(authModules.protect, authModules.restrictTo('admin', 'lead-guide'), tourModules.deleteTour);

module.exports = Router ;
