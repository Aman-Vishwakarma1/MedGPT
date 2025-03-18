const homePage = async (req, res, next) => {
  res.render("homePage.ejs");
};

const featuresPage = async (req, res, next) => {
  res.render("featuresPage.ejs");
};

const contactPage = async (req, res, next) => {
  res.render("contactPage.ejs");
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
  const { name, username, password } = req.body;
  console.log(name, username, password);
  res.json({ messgae: "success" });
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);
  res.redirect("/main");
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
};
