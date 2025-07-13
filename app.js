const express = require('express');
const app = express();
const tourRouter = require("./routes/toursRoutes");
const userRouter = require("./routes/usersRoutes");
app.use(express.json()); //midleware to parse JSON bodies
// middleWares
/*app.use((req,res,next) => {
    console.log("Hello from the midleware !");
    next();
});
app.use((req,res,next) => {
    console.log("Hello from the midleware 2 !");
    next();
}); */

//endpoints
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users",userRouter);

app.listen(3000, ()=> {
    console.log("App running on the port 3000...");
});


