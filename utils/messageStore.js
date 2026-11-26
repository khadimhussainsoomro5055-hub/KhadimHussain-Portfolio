const fs = require('fs');
const path = require('path');

const dataDirectory = path.join(__dirname, '..', 'data');
const messagesFile = path.join(dataDirectory, 'messages.json');

function readMessages() {
  if (!fs.existsSync(messagesFile)) {
    return [];
  }

  const savedMessages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
  if (!Array.isArray(savedMessages)) {
    throw new Error('Stored messages must be a JSON array.');
  }

  return savedMessages;
}

function saveMessage(message) {
  fs.mkdirSync(dataDirectory, { recursive: true });

  const messages = readMessages();
  messages.push({
    ...message,
    receivedAt: new Date().toISOString()
  });

  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');
}

module.exports = { readMessages, saveMessage };
