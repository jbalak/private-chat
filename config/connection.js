const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
// const config = require("./index");

const mongoUri = process.env.LOCAL_MONGO__URI ?? process.env.STAGING_MONGO__URI;

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "socket-test",
};
module.exports = () => {
  mongoose
    .connect(mongoUri, mongoOptions)
    .then((resp) => {
      console.log(
        "🚀 Connected to Database: " +
          resp.connection.host +
          "/" +
          mongoOptions.dbName
      );
    })
    .catch((err) => {
      console.log("error", err);
    });

  mongoose.connection.on(
    "error",
    console.error.bind(console, "connection error:")
  );
};
