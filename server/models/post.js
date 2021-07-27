const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const addpostschema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Body: {
    type: String,
    required: true,
  },
  Photo: {
    type: String,
    // default:"no photo"
    required: true,
  },
  likes: [{ type: ObjectId, ref: "user" }],
  comments: [
    {
      text: String,
      Postedus: String,
      Postedby: { type: ObjectId, ref: "user" },
    },
  ],
  Postedby: {
    type: ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("post", addpostschema);
