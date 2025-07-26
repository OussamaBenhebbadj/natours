const fs = require("fs");
const Tour = require("./../models/tourModels");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));

const getAllTours = async (req,res)=> { //get all tours
    try{
        let query = Tour.find();

        if (req.query){
            query = query.find(req.query);
        }

        if (req.query.sort) {
            // ex : ?sort=price,-ratingsAverage
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }

        const tours = await query;

        res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours
        }
    });
    }catch(err){
        res.status(400).json({
        status: "fail",
        message: err
    });
    }  
};

const getOneTour = async (req,res)=>{ //get one tour
    //console.log(req.params); //to see the parameters in the URL
    //req.params is an object that contains the parameters in the URL
    //e.g. if the URL is /api/v1/tours/5, req.params will be { id: '5' 
    try{
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        });
    } catch(err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
};

const getTourStat = async (req,res) => {
    try{
        const stats = await Tour.aggregate([
            {
                $match : {ratingsAverage:{$gte:4.7}}
            },
            {
                $group : {
                    _id : "$difficulty",
                    totalPrice : {$sum : "$price"}
                }
            }
        ])
        res.status(200).json({
            status: "success",
            data: {
                stats
            }
        });
    } catch(err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
};

const createTour = async (req,res)=>{ //create a new tour
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    } catch(err){
        res.status(400).json({
            status: "fail",
            message: err
        });
    }
};

const updateTour = async (req,res)=>{ //update a tour
   try {
        const tour = await Tour.findByIdAndUpdate(req.params.id , req.body ,{
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: "success",
            data:{
                tour
            }
        });
   }catch(err) {
        res.status(400).json({
            status: "fail",
            message: err
        });
   };
};

const deleteTour = async (req,res)=>{ //delete a tour
    try{
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null
        });
    } catch(err){
        res.status(400).json({
            status: "fail",
            message: err
        });
    };
};

module.exports = {
    getAllTours,
    getOneTour,
    createTour,
    updateTour,
    deleteTour,
    getTourStat
};