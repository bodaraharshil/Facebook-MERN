const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
const { MONGOURI } = require("./connect");
const bodyParser = require("body-parser");

mongoose.connect(MONGOURI, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: true,
});
mongoose.connection.on("connected", () => {
  console.log("mongodb to connect");
});
mongoose.connection.on("error", (error) => {
  console.log("error :", error);
});
app.use(cors());
app.use("/public", express.static("uploads"));
//models
// const Superlogin=require("./models/superadmin");
const User = require("./models/user");
const Post = require("./models/post");

//api
app.use(express.json());
app.use(require("./routes/user"));
app.use(require("./routes/post"));

app.listen(PORT, () => {
  console.log("server runing:", PORT);
});
