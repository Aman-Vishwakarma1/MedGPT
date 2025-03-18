const express = require("express");
const path = require("path");
const app = express();

const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", require("./routes/landingPageRoutes"));

app.listen(PORT, (error) => {
  if (error) {
    console.log("error while initializing server", error);
  }
  console.log(`http://localhost:${PORT}`);
});
