const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const newuserschema = new mongoose.Schema({
  Firstname: {
    type: String,
    required: true,
  },
  Lastname: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Username: {
    type: String,
    required: true,
  },
  Photo: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Cpassword: {
    type: String,
    required: true,
  },
  Followers: [
    {
      request_by: {
        type: ObjectId,
        ref: "user",
      },
      accept: 0,
    },
  ],
  Following: [
    {
      request_by: {
        type: ObjectId,
        ref: "user", 
      },
      accept: 0,
    },
  ],
});

module.exports = mongoose.model("user", newuserschema);
