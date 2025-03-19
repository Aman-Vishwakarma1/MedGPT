const predict = async (req, res, next) => {
  const { image } = req.body;

  console.log(image);

  res.status(200).json({ message: "Under Development" });
};

module.exports = predict;
