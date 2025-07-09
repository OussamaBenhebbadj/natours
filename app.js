const fs = require("fs");
const express = require('express');

const app = express();
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

//endpoint
app.get("/api/v1/tours",(req,res)=>{
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours
        }
    });
})

app.listen(3000, ()=> {
    console.log("App running on the port 3000...");
});


