const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

require('dotenv').config({ path: './config.env' });

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
    console.log(con.connections);
    console.log("✅ Connected to DB");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

const TourSchema = mongoose.Schema({
  name:{
    type: String,
    required: [true,'A Tour must have a name'],
    unique: true
  },
  price:{
    type: Number,
    required: [true,'A Tour must have a price'],
  },
  rating: {
    type: Number,
    default: 4.5
  }
});

const Tour = mongoose.model('Tour', TourSchema); 

const TourTest = new Tour({
  name: "The Park Camber",
  price : 797,
  rating: 4.8
});

TourTest.save().then(doc => {
  console.log(doc);
}).catch(err => {
  console.log('ERROR : ', err);
})