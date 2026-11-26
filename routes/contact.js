const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const requestsByIp = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (requestsByIp.get(ip) || []).filter(time => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    requestsByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  requestsByIp.set(ip, recent);

  if (requestsByIp.size > 1000) {
    for (const [key, times] of requestsByIp) {
      const active = times.filter(time => now - time < WINDOW_MS);
      if (active.length) requestsByIp.set(key, active);
      else requestsByIp.delete(key);
    }
  }
  return false;
}

function validateMessage({ name, email, message }) {
  if (!name || !email || !message) return 'Please complete all fields.';
  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return 'One or more fields are too long.';
  }
  if ([...name].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) {
    return 'Please enter a valid name.';
  }

  const atIndex = email.indexOf('@');
  const domain = email.slice(atIndex + 1);
  if (
    atIndex < 1 ||
    atIndex !== email.lastIndexOf('@') ||
    /\\s/.test(email) ||
    !domain.includes('.') ||
    domain.startsWith('.') ||
    domain.endsWith('.')
  ) {
    return 'Please enter a valid email address.';
  }
  return null;
}

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

router.post('/', async (req, res) => {
  if (String(req.body.website || '').trim()) {
    return res.status(200).json({ success: true, message: 'Message received.' });
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(ip)) {
    res.setHeader('Retry-After', String(Math.ceil(WINDOW_MS / 1000)));
    return res.status(429).json({ error: 'Too many messages. Please try again in 15 minutes.' });
  }

  const contact = {
    name: String(req.body.name || '').trim(),
    email: String(req.body.email || '').trim(),
    message: String(req.body.message || '').trim()
  };
  const validationError = validateMessage(contact);
  if (validationError) return res.status(400).json({ error: validationError });

  const transporter = createTransporter();
  const recipient = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
  const sender = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!transporter || !recipient || !sender) {
    console.error('Contact email is not configured. Set the SMTP environment variables.');
    return res.status(503).json({ error: 'The contact form is temporarily unavailable. Please try again later.' });
  }

  try {
    await transporter.sendMail({
      from: sender,
      to: recipient,
      replyTo: contact.email,
      subject: 'New portfolio message from ' + contact.name,
      text: [
        'You received a new message through your portfolio contact form.',
        '',
        'Name: ' + contact.name,
        'Email: ' + contact.email,
        '',
        'Message:',
        contact.message
      ].join('\\n'),
      html: '<h2>New portfolio message</h2>' +
        '<p><strong>Name:</strong> ' + escapeHtml(contact.name) + '</p>' +
        '<p><strong>Email:</strong> ' + escapeHtml(contact.email) + '</p>' +
        '<p><strong>Message:</strong></p><p>' + escapeHtml(contact.message).replace(/\\n/g, '<br>') + '</p>'
    });

    return res.status(201).json({ success: true, message: 'Your message has been sent successfully.' });
  } catch (error) {
    console.error('Could not send contact email:', error.message);
    return res.status(502).json({ error: 'Your message could not be sent right now. Please try again later.' });
  }
});

module.exports = router;
