# NewsHub

A modern news platform built with React and Node.js.

## Setup

### Server

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Fill in your credentials in `.env`:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure secret for JWT tokens
   - `PERPLEXITY_API_KEY` - Your Perplexity API key
   - `GROQ_API_KEY` - Your Groq API key

5. Start the server:
   ```bash
   npm start
   ```

### Client

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **AI:** Groq, Perplexity API
