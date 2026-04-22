# Samvaad AI

Samvaad AI is a full-stack AI chat application with user authentication, private chat threads, and persistent conversation history. It uses a React frontend, an Express/MongoDB backend, and a local Ollama model for assistant responses.

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- Private chat threads per authenticated user
- Persistent messages stored in MongoDB
- Sidebar for managing previous conversations
- Markdown rendering for assistant responses
- Local AI responses through Ollama

## Tech Stack

**Frontend**

- React
- Vite
- Axios
- React Markdown
- UUID

**Backend**

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens
- bcryptjs
- Ollama

## Project Structure

```text
Samvaad AI/
├── Backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── Frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Install these before running the project:

- Node.js
- MongoDB or MongoDB Atlas
- Ollama

The backend currently uses the Ollama model:

```bash
llama3.2:1b
```

Pull it with:

```bash
ollama pull llama3.2:1b
```

Make sure Ollama is running locally on:

```text
http://localhost:11434
```

## Environment Variables

Create a `.env` file inside `Backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit `.env` files. They are already ignored by `.gitignore`.

## Installation

Install backend dependencies:

```bash
cd Backend
npm install
```

Install frontend dependencies:

```bash
cd ../Frontend
npm install
```

## Running Locally

Start the backend:

```bash
cd Backend
npx nodemon server.js
```

The backend runs on:

```text
http://localhost:8080
```

Start the frontend in a separate terminal:

```bash
cd Frontend
npm run dev
```

The frontend runs on the Vite dev server, usually:

```text
http://localhost:5173
```

## API Overview

Authentication routes:

```text
POST /api/auth/register
POST /api/auth/login
```

Chat routes:

```text
GET    /api/thread
GET    /api/thread/:threadId
POST   /api/thread/chat
DELETE /api/thread/:threadId
```

Protected chat routes require a JWT token in the request header:

```text
Authorization: Bearer <token>
```

## Notes

- The frontend API base URL is currently set to `http://localhost:8080/api` in `Frontend/src/api.js`.
- The backend listens on port `8080`.
- The Ollama chat endpoint is configured in `Backend/utils/ollama.js`.
