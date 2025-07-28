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
    console.log("✅ Connected to DB");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
