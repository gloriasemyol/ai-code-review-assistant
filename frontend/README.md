# AI Code Review Assistant

A full-stack web app that analyzes code using static analysis (ESLint) and AI (Google Gemini) to provide feedback on bugs, code quality, complexity, and best practices.

## Live Demo
- Frontend: https://your-vercel-url.vercel.app
- Backend: https://your-render-url.onrender.com

## Features
- User authentication (sign up, login, logout, forgot password) via Supabase Auth
- Paste code or upload a file for review
- Static code analysis with ESLint (JavaScript)
- AI-powered code review with Google Gemini (bugs, code smells, security, performance)
- Cyclomatic complexity and code metrics (functions, classes, lines of code)
- Auto-generated documentation for submitted code
- Review dashboard with search, filtering, and delete
- Full input validation and error handling

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Supabase) |
| Authentication | Supabase Auth |
| AI | Google Gemini API (free tier) |
| Static Analysis | ESLint, Acorn (AST parsing) |
| Deployment | Vercel (frontend), Render (backend) |

## Local Setup
1. Clone the repo: `git clone https://github.com/yourusername/ai-code-review-assistant.git`
2. Backend: `cd backend && npm install`, create `.env` with `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `PORT`, then `npm run dev`
3. Frontend: `cd frontend && npm install`, create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`, then `npm run dev`

## Database Schema
- `projects` — submitted code and metadata
- `reviews` — score, summary, complexity metrics, documentation per submission
- `review_findings` — individual issues found, with severity and suggested fixes