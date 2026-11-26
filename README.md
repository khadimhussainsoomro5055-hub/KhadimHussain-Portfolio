# Khadim Hussain — Personal Portfolio

A responsive personal portfolio built with HTML, CSS, vanilla JavaScript, Node.js, and Express.

## Project structure

```text
KhadimHussain-Portfolio/
├── index.html
├── server.js
├── package.json
├── .env.example
├── routes/
│   └── contact.js
└── public/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── images/
        └── profile.jpg
```

## Run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and enter your SMTP provider settings. Keep `.env` private; it is ignored by Git.

3. Start the server:

   ```bash
   npm start
   ```

Open http://localhost:3000.

For development with automatic server restarts, run `npm run dev`.

## SMTP configuration

The contact form sends messages directly to the configured inbox using SMTP and Nodemailer. Configure these environment variables in your local `.env` file or your hosting provider's environment settings:

| Variable | Purpose |
| --- | --- |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port, commonly 465 or 587 |
| `SMTP_SECURE` | `true` for port 465; `false` for STARTTLS on port 587 |
| `SMTP_USER` | SMTP account username |
| `SMTP_PASS` | SMTP password or provider app password |
| `SMTP_FROM` | Optional sender address; defaults to `SMTP_USER` |
| `CONTACT_EMAIL` | Optional destination inbox; defaults to `SMTP_USER` |

For Gmail, use `smtp.gmail.com`, port `465` with `SMTP_SECURE=true` or port `587` with `SMTP_SECURE=false`. Gmail generally requires a Google App Password when using SMTP; do not use your normal account password.

A successful contact submission is emailed to the destination inbox. If SMTP is missing or unavailable, the API returns an error rather than silently reporting that the message was delivered.

## Features

- Responsive portfolio layout and mobile navigation
- Project category filters
- Contact form with server-side validation and rate limiting
- SMTP email delivery through Nodemailer
- Health endpoint at `/api/health`

## Personal details

- Email: khadimhussainsoomro5055@gmail.com
- University: Sukkur IBA University

## Stack

- HTML5 and CSS3
- Vanilla JavaScript
- Node.js and Express
- Nodemailer and SMTP
