const mongoose = require("mongoose");

const connectDatabase = async () => {
  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((error) => {
      console.error("Error while connecting to Database", error);
    });
};

module.exports = connectDatabase;
