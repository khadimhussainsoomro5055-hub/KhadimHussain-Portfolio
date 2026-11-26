# Khadim Hussain — Personal Portfolio

A responsive personal portfolio built with HTML, CSS, vanilla JavaScript, Node.js, and Express.

## Project structure

```text
KhadimHussain-Portfolio/
├── index.html
├── server.js
├── package.json
├── routes/
│   └── contact.js
├── utils/
│   └── messageStore.js
├── data/
│   └── messages.json        # Created automatically when a message is received
└── public/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── images/
        └── profile.jpg
```

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000.

For development with automatic server restarts, run `npm run dev`.

## Features

- Responsive portfolio layout and mobile navigation
- Project category filters
- Contact form backed by an Express API
- Contact validation and local JSON message storage
- Health endpoint at `/api/health`

## Personal details

- Email: khadimhussainsoomro5055@gmail.com
- University: Sukkur IBA University

## Stack

- HTML5 and CSS3
- Vanilla JavaScript
- Node.js and Express
