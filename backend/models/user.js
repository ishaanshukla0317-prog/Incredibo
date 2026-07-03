const mongoose = require("mongoose");
const { authDB } = require("../db");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "Email id is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  nationality: {
    type: String,
    enum: {
      values: ["Indian", "Foreigner"],
      message: "{VALUE} is not a valid nationality. Please choose Indian or Foreigner."
    },
    required: true
  },
  address: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: {
      values: ["Guide", "Visitor"],
      message: "{VALUE} is not valid. Please choose Guide or Visitor."
    },
    required: true
  },
  verified:{
    type:Boolean,
    default:false
  }
});

const userModel = authDB.model("users", userSchema);
module.exports = userModel;