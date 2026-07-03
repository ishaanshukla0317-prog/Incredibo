const mongoose = require("mongoose");
require("dotenv").config();

const mainDB = mongoose.createConnection(process.env.MONGO_URI);
mainDB.on("connected", () => console.log("Main MongoDB connected successfully"));
mainDB.on("error", (err) => console.log("Main MongoDB Error:", err));

const authDB = mongoose.createConnection(process.env.MONGO_URI_AUTH);
authDB.on("connected", () => console.log("Authentication System Started"));
authDB.on("error", (err) => console.log("Auth MongoDB Error:", err));

module.exports = { mainDB, authDB };