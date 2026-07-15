
---

# 🟢 PHASE 1 — Backend Core (NestJS) + OAuth

**Goal:** Set up NestJS with global filters, interceptors, OAuth authentication, and JWT session.



## Sub-Steps

### 1.1 — Initialize NestJS
- [ ] Run `nest new . --skip-git`
- [ ] Install all required packages
- [ ] Verify `npm run build` works

### 1.2 — Core Infrastructure
- [ ] Create `config/` files (database, jwt, oauth, app)
- [ ] Create `main.ts` with global pipe, filter, interceptor, CORS, Swagger
- [ ] Create `common/decorators/` (Roles, CurrentUser, Public)
- [ ] Create `common/guards/` (JwtAuthGuard, RolesGuard)
- [ ] Create `shared/services/aiService.ts`
- [ ] Create `database/data-source.ts`

### 1.3 — User Entity + Auth Repository
- [ ] Create `modules/users/entities/user.entity.ts`
- [ ] Create `modules/auth/repository/auth.repository.ts`
- [ ] Create database migration
- [ ] Run migration successfully

### 1.4 — OAuth Strategies
- [ ] Create `strategies/google.strategy.ts`
- [ ] Create `strategies/github.strategy.ts`
- [ ] Test by visiting `/api/v1/auth/google` in browser

### 1.5 — Auth Service + Controller
- [ ] Create `service/auth.service.ts` with `handleOAuthLogin()`
- [ ] Create `controller/auth.controller.ts` with all endpoints
- [ ] Test full OAuth flow: login → callback → /auth/me

## Deliverables

- NestJS running on `http://localhost:3000`
- Swagger UI at `http://localhost:3000/api/docs`
- OAuth login works for Google + GitHub
- JWT token issued after OAuth
- `/auth/me` returns current user
- User entity has soft delete

## Completion Criteria

- [ ] `npm run build` passes with no errors
- [ ] Google OAuth flow works end-to-end
- [ ] GitHub OAuth flow works end-to-end
- [ ] JWT token is returned after callback
- [ ] Protected routes reject requests without token
- [ ] Role guards work correctly

## Git Commits

```bash
git commit -m "feat(backend): nestjs core infrastructure"
git commit -m "feat(backend): user entity and auth repository"
git commit -m "feat(backend): OAuth strategies and auth module"


🟢 PHASE 2 — Backend Business Modules
Goal: Build Doctors, Hospitals, Ambulance, Appointments, Users modules with full CRUD.



Sub-Steps
2.1 — Doctors Module
 Create entity, repository, service, controller
 Endpoints: CRUD + filtering by category/hospital
 Role guards (doctor, admin)
2.2 — Hospitals Module
 Create entity, repository, service, controller
 Endpoints: CRUD + nearest search (Haversine)
 Geolocation query
2.3 — Ambulance Module
 Create entity, repository, service, controller
 Endpoints: CRUD + filter by hospital/type
 Air/road types
2.4 — Appointments Module
 Create entity, repository, service, controller
 Endpoints: book, list, cancel, update status
 Email notification on booking
 Use transactions
2.5 — Users Module
 Profile management endpoints
 Admin role management
 Soft delete
Deliverables
All 5 modules fully functional
All endpoints in Swagger
Pagination on all list endpoints
Role-based access control
Email sent on appointment booking
Completion Criteria
 All npm run build passes
 All endpoints tested manually via Swagger
 Pagination works
 Soft delete works
 Email service sends real emails
 No N+1 queries (use eager loading carefully

 🟢 PHASE 3 — AI Service (FastAPI) + Kimi + FAISS
Goal: Build FastAPI service for AI features using Kimi 2.5 and FAISS.



Sub-Steps
3.1 — Initialize FastAPI
 Create venv, install packages
 Create folder structure
 Create app/main.py with middleware, CORS, Swagger
 Verify runs with uvicorn
3.2 — Kimi Service
 Create services/kimi_service.py with AsyncOpenAI
 Test connectivity to Kimi API
3.3 — Embedding + FAISS
 Create services/embedding_service.py (sentence-transformers)
 Create services/faiss_service.py (load/save/search)
 Create services/context_service.py
3.4 — Prompts
 Create prompts/symptom_triage.txt
 Create prompts/doctor_recommend.txt
 Create prompts/chat_system.txt
3.5 — Symptoms Endpoint
 Create schemas, service, router
 POST /api/v1/ai/symptoms
 Test with sample symptoms
3.6 — Doctor Recommendation
 Create schemas, service, router
 POST /api/v1/ai/recommend-doctor
3.7 — Chat Endpoint
 Create schemas, service, router
 POST /api/v1/ai/chat
 Conversation memory in FAISS
Deliverables
FastAPI running on http://localhost:8000
Swagger UI at http://localhost:8000/docs
All 3 AI endpoints working
Kimi 2.5 integration verified
FAISS index persisting correctly
Completion Criteria
 Symptoms endpoint returns structured JSON
 Doctor recommendation returns ranked list
 Chat maintains conversation context
 Internal token auth works
 No print() statements
 All Pydantic validation works


 🟢 PHASE 4 — Backend AI Proxy Module
Goal: Connect NestJS to FastAPI through a proxy module using shared aiService.



Sub-Steps
4.1 — AI Proxy Module
 Create modules/ai/ with DTOs, service, controller
 Endpoints: /api/v1/ai/symptoms, /chat, /recommend-doctor
 All protected with JWT
 Uses shared/services/aiService.ts
4.2 — Integration Tests
 Test aiService HTTP client (timeout, retry, errors)
 Test AI controller (auth, forwarding, response format)
 Test full flow: NestJS → aiService → FastAPI
Deliverables
AI proxy module in NestJS
aiService HTTP client with retry, timeout, logging
Internal token auth to FastAPI
Integration tests passing
Completion Criteria
 npm test passes
 End-to-end: NestJS receives AI request → forwards to FastAPI → returns response
 Timeouts handled
 Retries work
 Errors converted to NestJS HttpException


 🟢 PHASE 5 — Frontend Setup + Auth Flow
Goal: Set up React + Vite + Tailwind, build OAuth flow and core layout.



Sub-Steps
5.1 — Initialize React
 Run npm create vite@latest . -- --template react-ts
 Install axios, react-router-dom, tailwindcss
 Configure Tailwind
5.2 — Foundation
 Create src/services/api.ts (all API modules)
 Create AuthContext with useAuth hook
 Create ProtectedRoute component
 Create UI components (Button, Input, Card, Spinner, Toast)
 Create Layout (Navbar, Footer)
5.3 — Login + Callback
 LoginPage with Google + GitHub buttons
 AuthCallbackPage for token handling
 HomePage with hero
5.4 — Dashboard
 DashboardPage with user info
 ProfilePage for editing
 Role-based menu items
Deliverables
React running on http://localhost:5173
OAuth login works through NestJS
Token stored, user fetched
Dashboard shows user info
Protected routes work
Completion Criteria
 npm run build passes
 Login with Google works
 Login with GitHub works
 Token persists across refreshes
 Logout works
 Protected routes redirect to login
 Mobile responsive

 🟢 PHASE 6 — Frontend Core Features
Goal: Build OPD, Emergency, and Doctor List features.



Sub-Steps
6.1 — OPD Page
 Geolocation-based nearest hospital search
 HospitalCard component
 OpdList with pagination
6.2 — Emergency Page
 Emergency-themed UI (red)
 AmbulanceCard with click-to-call
 Quick access emergency numbers
6.3 — Doctor List
 Filter by category, hospital, availability
 Search by name
 DoctorCard with booking button
 URL params for AI chat linking
Deliverables
OPD page working with geo search
Emergency page with ambulance info
Doctor list with all filters
All API calls through services/api.ts
Completion Criteria
 Geolocation works in browser
 Hospital list loads
 Doctor filters work
 All clickable elements (phone, booking) work
 Loading and error states
 Mobile responsive

 🟢 PHASE 7 — Frontend AI Chat + Booking
Goal: Build AI symptom checker and complete booking flow.

Duration: ~4-5 days

Sub-Steps
7.1 — AI Chat Page
 Chat interface with bubbles
 Submit symptoms → display structured result
 Color-coded urgency
 "Book" button links to booking
7.2 — Booking Page
 Form with date, time, reports
 Submit → success confirmation
 Email notification indicator
7.3 — My Appointments
 Patient view
 Doctor view
 Cancel, view details
7.4 — Doctor Dashboard
 Stats
 Manage availability
 View appointments
Deliverables
AI chat with symptom analysis
Complete booking flow
Appointment management
Doctor availability editor
Completion Criteria
 AI chat returns structured results
 Booking creates appointment
 Email confirmation shown
 My appointments loads
 Doctor can manage availability
 Role-based access works
 Mobile responsive


 🟢 PHASE 8 — Integration & Testing
Goal: End-to-end testing, bug fixing, polish.

Duration: ~3-4 days

Tasks
 Manual E2E test of all flows
 Write unit tests (target 70% coverage on critical)
 Fix all TypeScript/Python errors
 Mobile responsive testing
 Cross-browser testing
 Performance optimization
 Update README with setup instructions
 Add API documentation
 Add docstrings
Completion Criteria
 All flows work end-to-end
 Unit tests pass
 No critical bugs
 All 3 services run without errors
 Documentation complete


 
