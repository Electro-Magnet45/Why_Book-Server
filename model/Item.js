const mongoose = require("mongoose");
const { itemsConnection } = require("../mongooseConnection");

const itemsSchema = mongoose.Schema({
  seriesName: String,
  titleName: String,
  authorName: String,
  image: String,
  genre: String,
  minAge: String,
  description: String,
  userName: String,
  userId: String,
  publishedYear: String,
});

module.exports = itemsConnection.model("items", itemsSchema);
