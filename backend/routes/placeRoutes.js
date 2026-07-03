const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const Place = require("../models/Place");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Only image files are allowed"));
    cb(null, true);
  },
});

router.get("/", async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ error: "Place not found" });
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch place" });
  }
});

router.post("/add", authMiddleware, requireRole("Guide"), upload.single("photo"), async (req, res) => {
  try {
    const placeData = JSON.parse(req.body.placeData);
    let uploadedPhotos = [];

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, { folder: "incredibo_places" });
      uploadedPhotos.push({ url: result.secure_url, caption: placeData.name });
    }

    const newPlace = new Place({ ...placeData, photos: uploadedPhotos });
    await newPlace.save();

    res.status(201).json({ message: "Place added successfully", data: newPlace });
  } catch (error) {
    console.error("Error adding place:", error);
    res.status(500).json({ error: "Failed to add the place to the database" });
  }
});

module.exports = router;