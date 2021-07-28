const mongoose = require("mongoose");
const { usersConnection } = require("../mongooseConnection");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  ageName: {
    type: String,
    required: true,
  },
  ageDate: {
    type: String,
    required: true,
  },
  loggedIn: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = usersConnection.model("users", userSchema);
