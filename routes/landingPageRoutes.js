const express = require("express");
const router = express.Router();

const validate = require("../middleware/validationHandler");

const {
  registerPage,
  loginPage,
  loginUser,
  registerUser,
  homePage,
  featuresPage,
  mainPage,
  contactPage,
  submitContact,
} = require("../controllers/landingPageController");

router.get("/", homePage);
router.get("/features", featuresPage);
router.get("/contact", contactPage);
router.post("/submit-contact", submitContact);

//Create user route and register user page route.
router.get("/register", registerPage);
router.post("/register", registerUser);

//login user and login user page routes.
router.get("/login", loginPage);
router.post("/login", loginUser);

//main page.
router.get("/main", validate, mainPage);

module.exports = router;
