const mongoose = require("mongoose");
const { mainDB } = require("../db");

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String },
  history: { type: String },
  description: { type: String },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  photos: [{
    url: { type: String },
    caption: { type: String }
  }],
  entry_fee: {
    indian: { type: Number, default: 0 },
    foreigner: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }
  },
  timings: { type: String },
  best_time_to_visit: { type: String },
  tags: [{ type: String }],
  rating: { type: Number, min: 0, max: 5 },
  created_at: { type: Date, default: Date.now }
})

const Place = mainDB.model("Place", placeSchema);
module.exports = Place;