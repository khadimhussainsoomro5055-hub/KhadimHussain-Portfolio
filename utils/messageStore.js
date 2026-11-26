const fs = require('fs');
const path = require('path');
const dataDirectory = path.join(__dirname, '..', 'data');
const messagesFile = path.join(dataDirectory, 'messages.json');

function readMessages() {
  if (!fs.existsSync(messagesFile)) return [];
  const savedMessages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
  if (!Array.isArray(savedMessages)) throw new Error('Stored messages must be a JSON array.');
  return savedMessages;
}

function saveMessage(message) {
  fs.mkdirSync(dataDirectory, { recursive: true });
  const messages = readMessages();
  messages.push({ ...message, receivedAt: new Date().toISOString() });
  const temporaryFile = messagesFile + '.tmp';
  fs.writeFileSync(temporaryFile, JSON.stringify(messages, null, 2), { encoding: 'utf8', mode: 0o600 });
  fs.renameSync(temporaryFile, messagesFile);
}
module.exports = { readMessages, saveMessage };
