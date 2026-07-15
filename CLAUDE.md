📄 File 1: Root CLAUDE.md
Path: CLAUDE_CODE_HACKATHON/CLAUDE.md

# Nepal Health Hospital — Master Rules

> This is the ROOT rulebook. Module-specific rules are in each subfolder.

---

## 🎯 Project Overview

Nepal Health Hospital is a healthcare platform that allows patients to:
- Find nearest hospitals (OPD + Emergency)
- Book doctor appointments
- Chat with AI for symptom triage
- Get doctor recommendations
- Receive email confirmations

**User roles:** Patient, Doctor, Admin

---

## 🏗️ Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend (Primary) | NestJS + TypeScript |
| AI Service | FastAPI + Python |
| Database | PostgreSQL |
| Vector DB | FAISS |
| LLM | Kimi 2.5 API (Moonshot AI) |
| Auth | OAuth 2.0 (Google + GitHub) |
| Email | Nodemailer (SMTP) |

---

## 🏛️ Architecture (NEVER violate)

┌──────────────┐ │ Frontend │ (React) └──────┬───────┘ │ HTTPS REST ↓ ┌──────────────────────────────────────┐ │ NESTJS (Primary) │ │ • Auth (OAuth) • Users │ │ • Doctors • Hospitals │ │ • Appointments • Ambulance │ │ • File Uploads • Email │ └──────┬───────────────────────┬───────┘ │ │ │ PostgreSQL │ REST ↓ ↓ ┌──────────────┐ ┌──────────────┐ │ PostgreSQL │ │ FastAPI │ │ (Source of │ │ (AI Only) │ │ Truth) │ └──────┬───────┘ └──────────────┘ │ ┌─────┴─────┐ ↓ ↓ ┌───────┐ ┌────────┐ │ FAISS │ │ Kimi │ │ │ │ 2.5 │ └───────┘ └────────┘


---

## 🚦 Communication Rules

### Frontend → NestJS ONLY
- Frontend NEVER calls FastAPI directly
- Frontend NEVER calls Kimi directly
- Frontend NEVER calls FAISS directly
- All AI features go: Frontend → NestJS → FastAPI → Kimi

### NestJS → FastAPI
- Use shared HTTP client at `backend/src/shared/services/aiService.ts`
- Pass internal token in headers
- Never call FastAPI from controllers
- Never call FastAPI from repositories

### FastAPI Restrictions
- FastAPI is for AI ONLY
- No authentication logic
- No CRUD outside AI context
- No direct PostgreSQL access (unless explicitly required)

---

## 👥 Module Responsibilities

### NestJS (Primary Backend)
- ✅ OAuth Authentication
- ✅ User Management (patient, doctor, admin)
- ✅ Doctor Management
- ✅ Hospital Management
- ✅ Appointment Management
- ✅ Ambulance Service
- ✅ File Uploads
- ✅ Email Notifications
- ✅ PostgreSQL Operations
- ✅ Calling FastAPI for AI features
- ❌ NO direct Kimi calls
- ❌ NO direct FAISS calls
- ❌ NO business logic in controllers

### FastAPI (AI Service)
- ✅ Chat
- ✅ Symptom Analysis
- ✅ Embeddings Generation
- ✅ FAISS Similarity Search
- ✅ AI Recommendations
- ✅ Prompt Engineering
- ✅ Context Retrieval
- ✅ Conversation Memory
- ❌ NO auth logic
- ❌ NO CRUD outside AI
- ❌ NO direct PostgreSQL (unless explicit)

### Frontend (React)
- ✅ User Interface
- ✅ OAuth redirect buttons
- ✅ API calls to NestJS
- ✅ Form validation
- ✅ State management
- ❌ NO direct FastAPI calls
- ❌ NO direct Kimi calls
- ❌ NO direct FAISS calls

---

## 📁 Project Structure

CLAUDE_CODE_HACKATHON/ ├── .gitignore ├── CLAUDE.md ← You are here ├── README.md │ ├── backend/ ← NestJS │ ├── CLAUDE.md │ ├── .gitignore │ ├── .env.example │ ├── package.json │ ├── tsconfig.json │ ├── nest-cli.json │ └── src/ │ ├── main.ts │ ├── app.module.ts │ ├── common/ │ ├── config/ │ ├── database/ │ ├── shared/ │ └── modules/ │ ├── ai-service/ ← FastAPI │ ├── CLAUDE.md │ ├── .gitignore │ ├── .env.example │ ├── requirements.txt │ ├── Dockerfile │ └── app/ │ └── froented/ ← React ├── CLAUDE.md ├── .gitignore ├── .env.example ├── package.json └── src/


---

## 📜 Module CLAUDE.md Files

- **`/backend/CLAUDE.md`** — NestJS rules
- **`/ai-service/CLAUDE.md`** — FastAPI + Kimi rules
- **`/froented/CLAUDE.md`** — React rules

Claude Code will **automatically read** the relevant CLAUDE.md based on the current working directory.

---

## 🌐 API Response Format (Use EVERYWHERE)

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
Error Response
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": []
  }
}
🔐 Environment Variables
Backend (NestJS) — /backend/.env
DATABASE_URL=
PORT=3000

# OAuth 2.0 — Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback

# OAuth 2.0 — GitHub
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:3000/api/v1/auth/github/callback

# JWT (session token after OAuth)
JWT_SECRET=
JWT_EXPIRES_IN=7d

# FastAPI
FASTAPI_URL=http://localhost:8000
FASTAPI_INTERNAL_TOKEN=

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:5173

# Email (SMTP)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
AI Service (FastAPI) — /ai-service/.env
# Kimi 2.5 API (Moonshot AI)
KIMI_API_KEY=
KIMI_BASE_URL=https://api.moonshot.cn/v1
KIMI_MODEL=moonshot-v1-8k

# Auth
NESTJS_INTERNAL_TOKEN=

# FAISS
FAISS_INDEX_PATH=./vectorstore/faiss_index

PORT=8000
Frontend (React) — /froented/.env.local
VITE_API_URL=http://localhost:3000/api/v1
⚠️ Never commit .env files. Use .env.example for templates.

🔄 Development Workflow
For EVERY feature, follow this loop:

1. 📋 Plan the feature
2. 💬 Prompt Claude Code with context (reference CLAUDE.md)
3. 🔍 Review generated code
4. ✅ Test manually + write tests
5. 💾 Git commit (small, focused)
6. 🔄 Move to next feature
🏆 Golden Rules (NEVER violate)
NestJS is the primary backend — all business logic lives here
FastAPI exists ONLY for AI — chat, embeddings, FAISS, Kimi
PostgreSQL is the source of truth — FAISS is supplementary
Kimi is NEVER accessed directly from NestJS or frontend
Business logic belongs in services — not controllers
Database logic belongs in repositories — not services
AI logic belongs in FastAPI services — not NestJS
Reuse existing code before creating new code
Never duplicate implementations
Never change architecture without explicit approval
If a change conflicts with architecture, ask first
🚫 Anti-Patterns (NEVER do these)
❌ Calling FastAPI from controllers
❌ Calling Kimi directly from NestJS
❌ Calling FAISS from NestJS
❌ Putting business logic in controllers
❌ Putting SQL in services
❌ Using any in TypeScript
❌ Using print() or console.log() for logging
❌ Hardcoding secrets or URLs
❌ Skipping input validation
❌ Exposing internal errors to clients
❌ Committing .env files
❌ Mixing frontend with backend logic
❌ Calling OAuth providers directly from frontend
📊 Database Conventions
Table Naming
Use snake_case: users, doctor_profiles, appointments
Plural for tables, singular for entities
Column Naming
snake_case: created_at, user_id, password_hash
Common Columns
Every table should have:

id (UUID, primary key)
created_at (timestamp)
updated_at (timestamp)
deleted_at (timestamp, nullable) — for soft delete
🔍 Code Review Checklist
Before accepting any code, verify:

 Follows the layer architecture
 Uses correct response format
 Has input validation
 Has proper error handling
 No hardcoded values
 No direct external API calls from wrong layer
 Reuses existing utilities
 Has appropriate logging
 Has unit tests (when applicable)
 No console.log / print statements
 TypeScript strict / Python type hints
 Soft delete implemented
 OAuth uses Passport strategies
🎓 Learning Resources
NestJS: https://docs.nestjs.com
FastAPI: https://fastapi.tiangolo.com
React + Vite: https://vitejs.dev
FAISS: https://faiss.ai
Kimi API: https://platform.moonshot.cn/docs
Passport OAuth: https://www.passportjs.org
