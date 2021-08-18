const mongoose = require("mongoose");

function makeNewConnection(uri) {
  const db = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  console.log("DB connected");
  return db;
}

const usersConnection = makeNewConnection(process.env.DB1_URL);
const itemsConnection = makeNewConnection(process.env.DB2_URL);
const reviewsConnection = makeNewConnection(process.env.DB3_URL);

module.exports = { usersConnection, itemsConnection, reviewsConnection };
