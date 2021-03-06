const mongoose = require("mongoose");
const { itemsConnection } = require("../mongooseConnection");

const approvalItemsSchema = mongoose.Schema({
  seriesName: String,
  titleName: String,
  authorName: String,
  genre: String,
  minAge: String,
  description: String,
  userName: String,
  userId: String,
  publishedYear: String,
});

module.exports = itemsConnection.model("approvalItems", approvalItemsSchema);
