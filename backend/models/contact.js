const mongoose = require('mongoose');
const { authDB } = require("../db");
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['ai_guide', 'support', 'general']
  },
  message: {
    type: String,
    required: [true, 'Message cannot be empty']
  }
}, { timestamps: true }); 

module.exports = authDB.model('Contact', contactSchema);