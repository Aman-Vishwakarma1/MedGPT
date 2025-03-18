const express = require("express");
const router = express.Router();
const {
  registerPage,
  loginPage,
  loginUser,
  registerUser,
  homePage,
  featuresPage,
  mainPage,
  contactPage,
} = require("../controllers/landingPageController");

router.get("/", homePage);
router.get("/features", featuresPage);
router.get("/contact", contactPage);

//Create user route and register user page route.
router.get("/register", registerPage);
router.post("/register", registerUser);

//login user and login user page routes.
router.get("/login", loginPage);
router.post("/login", loginUser);

//main page.
router.get("/main", mainPage);

module.exports = router;
