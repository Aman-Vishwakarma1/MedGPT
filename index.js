const express = require("express");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const connectDatabase = require("./config/databaseConnect");

const PORT = 4000;
console.clear();
app.use(express.json(), cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

connectDatabase();

app.use("/", require("./routes/landingPageRoutes"));
app.use("/image", require("./routes/predictionRoutes"));

app.listen(PORT, (error) => {
  if (error) {
    console.log("error while initializing server", error);
  }
  console.log(`http://localhost:${PORT}`);
});
