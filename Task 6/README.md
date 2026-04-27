# Task 6 - Simple Signup (React + Express + MongoDB)

This task includes:
- React client signup form (name and roll number)
- Express server API
- MongoDB connection with Mongoose
- Save signup data in database

Prerequisite: MongoDB should be running locally on the default URL from `.env.example`.

## 1) Start Server

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

## 2) Start Client

```bash
cd client
npm install
npm run dev
```

Client runs on http://localhost:5173
Server runs on http://localhost:5000

## API

- POST `/signup`
- Body:

```json
{
  "name": "Ali",
  "rollNumber": "101"
}
```
