const express = require('express');
const { saveMessage } = require('../utils/messageStore');
const router = express.Router();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const requestsByIp = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (requestsByIp.get(ip) || []).filter(time => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) { requestsByIp.set(ip, recent); return true; }
  recent.push(now);
  requestsByIp.set(ip, recent);
  if (requestsByIp.size > 1000) {
    for (const [key, times] of requestsByIp) {
      const active = times.filter(time => now - time < WINDOW_MS);
      if (active.length) requestsByIp.set(key, active); else requestsByIp.delete(key);
    }
  }
  return false;
}

function validateMessage({ name, email, message }) {
  if (!name || !email || !message) return 'Please complete all fields.';
  if (name.length > 100 || email.length > 254 || message.length > 5000) return 'One or more fields are too long.';
  if ([...name].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return 'Please enter a valid name.';
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return 'Please enter a valid email address.';
  return null;
}

router.post('/', (req, res) => {
  if (String(req.body.website || '').trim()) return res.status(200).json({ success: true, message: 'Message received.' });
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', String(Math.ceil(WINDOW_MS / 1000)));
    return res.status(429).json({ error: 'Too many messages. Please try again in 15 minutes.' });
  }
  const contact = { name: String(req.body.name || '').trim(), email: String(req.body.email || '').trim(), message: String(req.body.message || '').trim() };
  const validationError = validateMessage(contact);
  if (validationError) return res.status(400).json({ error: validationError });
  try {
    saveMessage(contact);
    return res.status(201).json({ success: true, message: 'Message received.' });
  } catch (error) {
    console.error('Could not save contact message:', error);
    return res.status(500).json({ error: 'Your message could not be saved right now. Please try again later.' });
  }
});
module.exports = router;
