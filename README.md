# 💬 GenQuery

**Talk to your database using plain English.**

GenQuery is an AI-powered chat application. Instead of writing complex SQL queries, you just ask a question in English. The AI agent automatically understands your database, writes the SQL, runs it, and streams the answer back to you.

---

## ✨ Features

- **Natural Language to SQL**: Ask questions and get instant answers directly from your database.
- **Autonomous AI Agent**: Built with Gemini 3.5 Flash and Vercel AI SDK, the agent automatically fetches your schema and executes queries.
- **Modern UI**: A beautiful, animated chat interface with dark/light mode and fluid interactions.
- **Fast Database**: Powered by Drizzle ORM and Turso (LibSQL).

---

## 🚀 Quick Setup

Get GenQuery running locally in 4 simple steps.

### 1. Install Dependencies
```bash
git clone https://github.com/yourusername/genquery.git
cd genquery
npm install
```

### 2. Environment Variables
Create a `.env.local` file and add your keys:
```env
# Get this from Google AI Studio
GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"

# Turso Database 
TURSO_DATABASE_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"
```

### 3. Setup the Database
Generate the tables and apply them to your database:
```bash
npm run db:generate
npm run db:migrate
```

### 4. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and start chatting!

---

## 🛠️ Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **AI**: Vercel AI SDK, `@ai-sdk/google`
- **Database**: Drizzle ORM, Turso / LibSQL
- **Animations**: GSAP, Framer Motion
