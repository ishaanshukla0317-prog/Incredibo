const mongoose = require("mongoose");
const { authDB } = require("../db");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User is required"],
    },
    refreshTokenHash: {
      type: String,
      required: [true, "Refresh token hash is required"],
    },
    ip: {
      type: String,
      required: [true, "IP ADDRESS IS REQUIRED"],
    },
    userAgent: {
      type: String,
      required: [true, "USER AGENT IS REQUIRED"],
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const sessionModel = authDB.model("sessions", sessionSchema);
module.exports = sessionModel;