const mongoose = require("mongoose");
const { itemsConnection } = require("../mongooseConnection");

const itemsSchema = mongoose.Schema({
  name: String,
  image: String,
  genre: String,
  minAge: String,
  description: String,
  userName: String,
  userId: String,
});

module.exports = itemsConnection.model("items", itemsSchema);
