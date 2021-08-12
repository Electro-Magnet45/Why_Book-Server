const mongoose = require("mongoose");
const { usersConnection } = require("../mongooseConnection");

const resetPassSchema = mongoose.Schema({
  userId: String,
  token: String,
  email: String,
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: "5m" },
  },
});

module.exports = usersConnection.model("resetPass", resetPassSchema);
