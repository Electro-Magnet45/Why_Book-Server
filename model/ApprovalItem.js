const mongoose = require("mongoose");
const { itemsConnection } = require("../mongooseConnection");

const approvalItemsSchema = mongoose.Schema({
  name: String,
  image: String,
  genre: String,
  minAge: String,
  description: String,
  userId: String,
  userName: String,
});

module.exports = itemsConnection.model("approvalItems", approvalItemsSchema);
