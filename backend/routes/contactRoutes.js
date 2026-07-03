const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact'); 
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Please fill out all fields.' });
    }
    const newMessage = new Contact({ name, email, subject, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ error: 'Server error. Could not send message.' });
  }
});

module.exports = router;