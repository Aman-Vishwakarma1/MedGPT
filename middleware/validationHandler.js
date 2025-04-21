const jwt = require("jsonwebtoken");
const userModel = require("../model/userSchema");
const validate = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.render("errorPage.ejs", {
      errorMessage: "Please Login First !",
    });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const isValidId = await userModel.find({ email: decode.email });
    if (!isValidId) {
      return res.render("errorPage.ejs", {
        errorMessage: "user not found, invalid login",
      });
    }
    req.user = isValidId.email;
    next();
  } catch (error) {
    return res.render("errorPage.ejs", {
      errorMessage: error.message,
    });
  }
};

module.exports = validate;
