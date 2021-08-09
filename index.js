const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/item");

const app = express();
app.use(
  cors({
    origin: [
      process.env.WEBSITE1_URL,
      process.env.WEBSITE2_URL,
      process.env.WEBSITE3_URL,
    ],
  })
);
app.use(express.json());
app.use("/api/user", authRoutes);
app.use("/api/item", itemRoutes);

app.listen(5000, () => console.log("Server running"));
