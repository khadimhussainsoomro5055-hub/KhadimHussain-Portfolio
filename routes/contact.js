const express = require('express');
const { saveMessage } = require('../utils/messageStore');

const router = express.Router();

function validateMessage({ name, email, message }) {
  if (!name || !email || !message) {
    return 'Please complete all fields.';
  }

  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return 'One or more fields are too long.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address.';
  }

  return null;
}

router.post('/', (req, res) => {
  const contact = {
    name: String(req.body.name || '').trim(),
    email: String(req.body.email || '').trim(),
    message: String(req.body.message || '').trim()
  };

  const validationError = validateMessage(contact);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    saveMessage(contact);
    return res.status(201).json({
      success: true,
      message: 'Message received.'
    });
  } catch (error) {
    console.error('Could not save contact message:', error);
    return res.status(500).json({
      error: 'Your message could not be saved right now. Please try again later.'
    });
  }
});

module.exports = router;
