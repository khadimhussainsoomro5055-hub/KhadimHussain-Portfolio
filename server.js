const express = require('express');
const path = require('path');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const publicDirectory = path.join(__dirname, 'public');

app.disable('x-powered-by');

app.use(express.urlencoded({ extended: false, limit: '12kb' }));
app.use(express.json({ limit: '12kb' }));
app.use(express.static(publicDirectory));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/contact', contactRoutes);

app.use((_req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});
