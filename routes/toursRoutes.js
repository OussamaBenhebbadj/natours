const express = require("express");
const Router = express.Router();
const tourModules = require("./../controllers/toursController");

//Param middleware
Router.param ('id', (req,res,next,val) => {
    console.log(`Tour id id : ${val}`);
    next();
})


Router.route('/').get(tourModules.getAllTours).post(tourModules.createTour);
Router.route("/:id").get(tourModules.getOneTour).patch(tourModules.updateTour).delete(tourModules.deleteTour);

module.exports = Router ;

app.use(express.static(`${__dirname}/public`));