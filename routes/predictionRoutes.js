const express = require("express");
const router = express.Router();
const multer = require("multer");
const predict = require("../controllers/predictionController");

const upload = multer({ dest: "uploads/" });

router.post("/predict", upload.single("image"), predict.predict);
router.post("/chat", predict.chat);

module.exports = router;
