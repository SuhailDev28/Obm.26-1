# OBM - AI Consultancy & Software Development Website

OBM is a modern AI consultancy and software development company website built with React, Vite, Tailwind CSS, Node.js, Express.js, and MongoDB.

The platform includes a public landing page, contact form, admin dashboard, logo upload, color control, website content management, SMTP configuration, and contact inquiry management.

---

## Features

### Public Website

- Modern responsive landing page
- AI consultancy and software development service sections
- Product engineering and digital transformation content
- Enterprise automation service content
- Pricing/package section
- Contact form with database storage
- Dark and light mode support
- Mobile responsive navigation
- Animated UI using Framer Motion

### Admin Dashboard

- Secure admin login
- Logo upload and update
- Primary, secondary, and accent color controls
- Hero section content editing
- Contact information management
- Email notification settings
- SMTP settings section
- Contact inquiry email integration
- Settings stored in MongoDB

### Backend

- Node.js and Express.js API
- MongoDB database with Mongoose
- JWT admin authentication
- Contact message storage
- SMTP email sending using Nodemailer
- Static upload handling
- Environment-based configuration

---

## Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React Icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt.js
- Nodemailer
- Multer
- Helmet
- CORS

---

## Project Structure

```bash
OBM-2026.1/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── README.md
│
├── server/
│   ├── src/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── uploads/
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
└── README.md