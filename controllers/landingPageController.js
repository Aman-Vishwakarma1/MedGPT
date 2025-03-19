const userModel = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const homePage = async (req, res, next) => {
  res.render("homePage.ejs");
};

const featuresPage = async (req, res, next) => {
  res.render("featuresPage.ejs");
};

const contactPage = async (req, res, next) => {
  res.render("contactPage.ejs");
};

const submitContact = async (req, res, next) => {
  return res.render("errorPage.ejs", {
    errorMessage: "UNDER DEVELOPMENT",
  });
};

const registerPage = async (req, res, next) => {
  res.render("registerPage");
};

const loginPage = async (req, res, next) => {
  res.render("loginPage.ejs");
};

const mainPage = async (req, res, next) => {
  res.render("mainPage.ejs");
};

//Page Functionalities

const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(203)
      .json({ messgae: "Email, username and Password is required" });
  }
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(email)) {
    return res.render("errorPage.ejs", {
      errorMessage: "Invalid Email !",
    });
  }

  const isUser = await userModel.exists({ email: email });
  if (isUser) {
    return res.render("errorPage.ejs", {
      errorMessage: "User Already Registered.",
    });
  }
  console.log(isUser);

  const payload = { name, email, password };
  const user = new userModel(payload);
  const savedUser = await user.save().catch((error) => {
    if (error) {
      return res.render("errorPage.ejs", {
        errorMessage: error.message,
      });
    }
  });
  res.status(200).redirect("userRegisteredSuccess.ejs", { name, email });
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.render("errorPage.ejs", {
        errorMessage: "Email and Password is Required !",
      });
    }
    const isUser = await userModel.findOne({ email: email });
    console.log(isUser);
    if (!isUser) {
      return res.render("errorPage.ejs", {
        errorMessage: "User not Found !",
      });
    }
    const isCorrectPassword = await bcrypt.compare(password, isUser.password);
    if (!isCorrectPassword) {
      return res.render("errorPage.ejs", {
        errorMessage: "Invalid username and password",
      });
    }
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "Strict",
    });
    return res.status(200).redirect("/main");
  } catch (error) {
    return res.render("errorPage.ejs", {
      errorMessage: error.message,
    });
  }
};

module.exports = {
  registerPage,
  loginPage,
  loginUser,
  registerUser,
  homePage,
  featuresPage,
  mainPage,
  contactPage,
  submitContact,
};
