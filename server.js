const express = require('express');
const path = require('path');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const publicDirectory = path.join(__dirname, 'public');

app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use(express.urlencoded({ extended: false, limit: '12kb' }));
app.use(express.json({ limit: '12kb' }));
app.use(express.static(publicDirectory));

app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/contact', contactRoutes);
app.use((_req, res) => res.status(404).send('Page not found.'));
app.use((error, _req, res, _next) => {
  if (error && error.type === 'entity.too.large') return res.status(413).json({ error: 'The submitted message is too large.' });
  if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'Invalid request body.' });
  console.error('Unhandled request error:', error);
  return res.status(500).json({ error: 'An unexpected server error occurred.' });
});

app.listen(PORT, () => console.log('Portfolio running at http://localhost:' + PORT));
