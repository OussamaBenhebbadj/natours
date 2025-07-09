const fs = require("fs");
const express = require('express');

const app = express();
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));
app.use(express.json()); //midleware to parse JSON bodies

//endpoint
app.get("/api/v1/tours",(req,res)=>{ //get all tours
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours
        }
    });
})

app.get("/api/v1/tours/:id",(req,res)=>{ //get one tour
    //console.log(req.params); //to see the parameters in the URL
    //req.params is an object that contains the parameters in the URL
    //e.g. if the URL is /api/v1/tours/5, req.params will be { id: '5' 
    const id = req.params.id * 1; //convert string to number   
    if(id > tours.length) { //if the id is greater than the number of tours
        return res.status(404).json({ //return 404 error
            status: "fail",
            message: "Invalid ID"
        });
    }
    const tour = tours.find(el => el.id === id); //find the tour with the given id
    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    });
})

app.post("/api/v1/tours",(req,res)=>{ //create a new tour
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    });
});

app.patch("/api/v1/tours/:id",(req,res)=>{ //update a tour
    const id = req.params.id * 1; //convert string to number
    if(id > tours.length) { 
        return res.status(404).json({ 
            status: "fail",
            message: "Invalid ID"
        });
    }
    res.status(200).json({
        status: "success",
        message: "Updated tour successfully"
    });
});

app.delete("/api/v1/tours/:id",(req,res)=>{ //delete a tour
    const id = req.params.id * 1; //convert string to number
    if(id > tours.length) { 
        return res.status(404).json({ 
            status: "fail",
            message: "Invalid ID"
        });
    }
    res.status(204).json({
        status: "success",
        data: null
    });
});

app.listen(3000, ()=> {
    console.log("App running on the port 3000...");
});


