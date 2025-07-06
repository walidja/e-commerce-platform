# Yalla Shop E-Commerce Platform

This repository contains the **Yalla Shop** e-commerce platform, including both the **backend** (Node.js, Express, Prisma, PostgreSQL) and **frontend** (React, Bootstrap).

---

## Table of Contents

- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Features](#features)
- [License](#license)

---

## Project Structure

```
e-commerce-platform/
│
├── backend/
│   ├── prisma/           # Prisma schema and migrations
│   ├── src/
│   │   ├── controller/   # Express controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── utils/        # Utility functions
│   │   └── ...           # Other backend code
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── api/          # API calls
│   │   ├── styles/       # CSS and Bootstrap
│   │   └── ...           # Other frontend code
│   └── ...
└── ...
```

---

## Backend Setup

1. **Install dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**

   - Copy `.env.example` to `.env` and fill in your values (DB, JWT, email, etc).

3. **Set up the database:**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

---

## Frontend Setup

1. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables:**

   - Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your backend URL.

3. **Start the frontend dev server:**
   ```bash
   npm run dev
   ```

---

## Environment Variables

### Backend (`backend/.env`)

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — JWT secret key
- `EMAIL_USER`, `EMAIL_PASS` — Email credentials for nodemailer
- `MY_DOMAIN` — Your frontend domain for reset links

### Frontend (`frontend/.env`)

- `VITE_API_BASE_URL` — URL of your backend API

---

## Scripts

### Backend

- `npm run dev` — Start backend in development mode
- `npx prisma studio` — Open Prisma Studio for DB management

### Frontend

- `npm run dev` — Start frontend in development mode
- `npm run build` — Build frontend for production

---

## Features

- User registration, login, and authentication (JWT, "remember me" tokens)
- Password reset via email with secure tokens
- Responsive frontend with React and Bootstrap
- Prisma ORM with PostgreSQL
- Modular code structure for scalability

---

## License

This project is licensed
