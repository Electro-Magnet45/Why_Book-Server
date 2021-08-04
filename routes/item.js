const router = require("express").Router();
const ApprovalItems = require("../model/ApprovalItem");
const verify = require("./verifyToken");
const puppeteer = require("puppeteer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.UPLOAD_CLOUD_NAME,
  api_key: process.env.UPLOAD_API_KEY,
  api_secret: process.env.UPLOAD_API_SECRET,
});

const fetchImage = async (image) => {
  const url = image;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  await page.waitForSelector("#book_div");
  await page.setViewport({ height: 318, width: 212, deviceScaleFactor: 2 });
  const element = await page.$("#book_div");
  const screenshot = await element.screenshot({ encoding: "binary" });
  await browser.close();

  return screenshot;
};

const uploadScreenshot = (screenshot) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {};
    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(screenshot);
  });
};

router.post("/new", verify, async (req, res) => {
  fetchImage(req.body.imageUrl).then((screenshot) => {
    uploadScreenshot(screenshot).then((result) => {
      const newItem = req.body;
      const userId = req.user._id;
      newItem.userId = userId;
      newItem.image = result.secure_url;
      newItem.publishedYear = "";

      ApprovalItems.create(newItem, (err, data) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(data);
      });
    });
  });
});

module.exports = router;
