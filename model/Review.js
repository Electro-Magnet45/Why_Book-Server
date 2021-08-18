const mongoose = require("mongoose");
const { reviewsConnection } = require("../mongooseConnection");

const reviewsSchema = mongoose.Schema({
  titleName: String,
  authorName: String,
  rating: String,
  reviewTitle: String,
  reviewDescription: String,
  reviewMinAge: String,
  userName: String,
  userId: String,
});

module.exports = reviewsConnection.model("reviews", reviewsSchema);
