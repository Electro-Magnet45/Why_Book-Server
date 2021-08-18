const router = require("express").Router();
const Reviews = require("../model/Review");
const verify = require("./verifyToken");

router.post("/new", verify, (req, res) => {
  const newReview = req.body;
  newReview.userId = req.user._id;
  Reviews.create(req.body, (err, data) => {
    if (err) return res.status(500).send(err);
    res.status(200).send("Review Added");
  });
});

module.exports = router;
