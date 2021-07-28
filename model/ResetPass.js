const mongoose = require("mongoose");
const { usersConnection } = require("../mongooseConnection");

const resetPassSchema = mongoose.Schema({
  userId: String,
  token: String,
  email: String,
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

resetPassSchema.index({ timeStamp: 1 }, { expireAfterSeconds: 1800 });

module.exports = usersConnection.model("resetPass", resetPassSchema);
