require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const contactRoutes = require('./routes/contactRoutes')
require("./db");
const placeRoutes = require("./routes/placeRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const { contactLimiter } = require("./middleware/rateLimiter");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/places", placeRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use("/api/yatri", aiRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));