const router = require("express").Router();
const ApprovalItems = require("../model/ApprovalItem");
const verify = require("./verifyToken");

router.post("/new", verify, async (req, res) => {
  const newItem = req.body;
  const userId = req.user._id;
  newItem.userId = userId;
  newItem.publishedYear = "";
  delete newItem.token;

  ApprovalItems.create(newItem, (err, data) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(data);
  });
});

module.exports = router;
