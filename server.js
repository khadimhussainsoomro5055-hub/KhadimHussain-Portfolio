const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const messagesDirectory = path.join(__dirname, 'data');
const messagesFile = path.join(messagesDirectory, 'messages.json');

app.disable('x-powered-by');
app.use(express.urlencoded({ extended: false, limit: '12kb' }));
app.use(express.json({ limit: '12kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/contact', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim();
  const message = String(req.body.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please complete all fields.' });
  }
  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return res.status(400).json({ error: 'One or more fields are too long.' });
  }
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    fs.mkdirSync(messagesDirectory, { recursive: true });
    let entries = [];
    if (fs.existsSync(messagesFile)) {
      const saved = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
      if (!Array.isArray(saved)) throw new Error('Stored messages must be a JSON array.');
      entries = saved;
    }
    entries.push({
      name,
      email,
      message,
      receivedAt: new Date().toISOString()
    });
    fs.writeFileSync(messagesFile, JSON.stringify(entries, null, 2), 'utf8');
    return res.status(201).json({ success: true, message: 'Message received.' });
  } catch (error) {
    console.error('Could not save contact message:', error);
    return res.status(500).json({ error: 'Your message could not be saved right now. Please try again later.' });
  }
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log('Portfolio running at http://localhost:' + PORT);
});
