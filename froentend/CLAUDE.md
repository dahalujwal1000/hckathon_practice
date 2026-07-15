
## 📄 File 4: `froented/CLAUDE.md`

**Path:** `CLAUDE_CODE_HACKATHON/froented/CLAUDE.md`

```markdown
# Frontend (React) Rules — Nepal Health Hospital

> Read this BEFORE writing any frontend code.
> Root rules in `/CLAUDE.md` also apply.

---

## 🎯 Purpose

React frontend that provides UI for:
- OAuth login (Google + GitHub)
- Home page with user/doctor signup tabs
- OPD + Emergency hospital finder
- AI Chat for symptom triage
- Doctor list + booking
- Appointment management

---

## 🛠️ Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State:** React Context (for auth) + local state
- **Forms:** React Hook Form (optional)
- **Icons:** Lucide React

---

## 🏛️ Architecture

User Browser ↓ React App ↓ React Router (pages) ↓ Components (UI) ↓ Services (api.ts) ← ONLY file that calls APIs ↓ NestJS Backend


**Frontend NEVER calls FastAPI or Kimi directly.**

---

## 📁 Required Folder Structure

src/ ├── main.tsx ← Entry point ├── App.tsx ← Root component ├── index.css ← Tailwind imports │ ├── components/ │ ├── auth/ │ │ ├── GoogleLoginButton.tsx │ │ ├── GitHubLoginButton.tsx │ │ ├── ProtectedRoute.tsx │ │ └── RoleGuard.tsx │ ├── home/ │ │ ├── Hero.tsx │ │ ├── SignupTabs.tsx │ │ └── Features.tsx │ ├── opd/ │ │ ├── OpdPage.tsx │ │ └── HospitalCard.tsx │ ├── emergency/ │ │ ├── EmergencyPage.tsx │ │ └── AmbulanceCard.tsx │ ├── ai/ │ │ ├── ChatInterface.tsx │ │ ├── ChatBubble.tsx │ │ └── SymptomResult.tsx │ ├── doctors/ │ │ ├── DoctorList.tsx │ │ └── DoctorCard.tsx │ ├── booking/ │ │ ├── BookingForm.tsx │ │ └── BookingConfirmation.tsx │ ├── appointments/ │ │ ├── AppointmentList.tsx │ │ └── AppointmentCard.tsx │ ├── layout/ │ │ ├── Navbar.tsx │ │ ├── Footer.tsx │ │ └── Sidebar.tsx │ └── ui/ │ ├── Button.tsx │ ├── Input.tsx │ ├── Card.tsx │ ├── Modal.tsx │ ├── Spinner.tsx │ └── Toast.tsx │ ├── pages/ │ ├── HomePage.tsx │ ├── LoginPage.tsx │ ├── AuthCallbackPage.tsx │ ├── DashboardPage.tsx │ ├── OpdPage.tsx │ ├── EmergencyPage.tsx │ ├── AiChatPage.tsx │ ├── DoctorListPage.tsx │ ├── BookingPage.tsx │ └── MyAppointmentsPage.tsx │ ├── services/ │ └── api.ts ← ONLY file that makes HTTP calls │ ├── context/ │ ├── AuthContext.tsx │ └── ToastContext.tsx │ ├── hooks/ │ ├── useAuth.ts │ ├── useApi.ts │ └── useToast.ts │ ├── utils/ │ ├── format.ts │ ├── validation.ts │ └── constants.ts │ ├── types/ │ ├── user.ts │ ├── doctor.ts │ ├── hospital.ts │ ├── appointment.ts │ └── api.ts │ └── routes/ └── AppRoutes.tsx


---

## 🌐 API Service Layer (CRITICAL)

**Only `src/services/api.ts` makes HTTP calls.** No exceptions.

```typescript
// src/services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // for httpOnly cookies
  timeout: 30000,
});

// Attach JWT token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API modules
export const authAPI = {
  getMe: () => api.get('/auth/me').then((r) => r.data.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
};

export const doctorAPI = {
  list: (params?: any) => api.get('/doctors', { params }).then((r) => r.data),
  get: (id: string) => api.get(`/doctors/${id}`).then((r) => r.data.data),
  create: (data: any) => api.post('/doctors', data).then((r) => r.data),
};

export const hospitalAPI = {
  list: (params?: any) => api.get('/hospitals', { params }).then((r) => r.data),
  nearest: (lat: number, lng: number) =>
    api.get('/hospitals/nearest', { params: { lat, lng } }).then((r) => r.data),
};

export const appointmentAPI = {
  book: (data: any) => api.post('/appointments', data).then((r) => r.data),
  listByPatient: (patientId: string) =>
    api.get(`/appointments/patient/${patientId}`).then((r) => r.data),
  listByDoctor: (doctorId: string) =>
    api.get(`/appointments/doctor/${doctorId}`).then((r) => r.data),
  cancel: (id: string) => api.patch(`/appointments/${id}/cancel`).then((r) => r.data),
};

export const ambulanceAPI = {
  list: (params?: any) => api.get('/ambulance', { params }).then((r) => r.data),
  byHospital: (hospitalId: string) =>
    api.get(`/ambulance?hospital_id=${hospitalId}`).then((r) => r.data),
};

export const aiAPI = {
  chat: (message: string) => api.post('/ai/chat', { message }).then((r) => r.data),
  symptoms: (data: any) => api.post('/ai/symptoms', data).then((r) => r.data),
  recommendDoctor: (data: any) =>
    api.post('/ai/recommend-doctor', data).then((r) => r.data),
};
Rules
✅ ALL HTTP calls go through services/api.ts
❌ Never use axios, fetch in components
❌ Never call FastAPI or Kimi directly
❌ Never hardcode API URLs
🔐 OAuth Login Flow
Login Page
// src/pages/LoginPage.tsx
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Login to Nepal Health Hospital</h1>
      <button
        onClick={handleGoogleLogin}
        className="px-6 py-3 bg-white border rounded-lg shadow hover:shadow-md"
      >
        Continue with Google
      </button>
      <button
        onClick={handleGithubLogin}
        className="px-6 py-3 bg-gray-900 text-white rounded-lg"
      >
        Continue with GitHub
      </button>
    </div>
  );
};
Auth Callback
// src/pages/AuthCallbackPage.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      navigate('/dashboard');
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Completing login...</p>
    </div>
  );
};
Auth Context
// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'patient' | 'doctor' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await authAPI.getMe();
      setUser(userData);
    } catch {
      localStorage.removeItem('auth_token');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
Protected Route
// src/components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};
OAuth Rules
✅ Use <button onClick> to trigger OAuth
✅ Use window.location.href for full redirect
✅ Store JWT in localStorage (or httpOnly cookie)
✅ Show loading state during auth check
❌ Never call Google/GitHub APIs from frontend
❌ Never store OAuth provider tokens
❌ Never handle OAuth flow in React state
🔤 TypeScript Rules
Strict mode only
Never use any — use unknown if needed
Use interfaces for props and data shapes
Use optional chaining (?.)
Use nullish coalescing (??)
Use async/await
Define types in src/types/
Use enums or union types for fixed values
🎨 Component Rules
Keep components small and focused
One responsibility per component
Reuse before creating — check components/ui/
Use Tailwind utility classes (no inline styles)
Mobile responsive by default (md:, lg: breakpoints)
Use semantic HTML
Add aria-* attributes for accessibility
Component Template
interface DoctorCardProps {
  doctor: Doctor;
  onBook: (id: string) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold">{doctor.name}</h3>
      <p className="text-gray-600">{doctor.category}</p>
      <p className="text-sm">{doctor.description}</p>
      <button
        onClick={() => onBook(doctor.id)}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Book
      </button>
    </div>
  );
};
📋 Pages
Page	Route	Purpose
Home	/	Hero + signup tabs
Login	/login	OAuth buttons
Auth Callback	/auth/callback	Handle OAuth redirect
Dashboard	/dashboard	User/Doctor dashboard
OPD	/opd	Find OPD hospitals
Emergency	/emergency	Find emergency hospitals
AI Chat	/ai-chat	Symptom triage chat
Doctor List	/doctors	Browse doctors
Book Appointment	/book	Booking form
My Appointments	/appointments	List of bookings
🗂️ State Management
Auth: React Context (AuthContext)
Toast notifications: React Context (ToastContext)
Server data: Direct API calls (no Redux needed for MVP)
Local state: useState, useReducer
Form state: Controlled components
⚠️ Error Handling
Show user-friendly error messages
Use Toast for non-blocking errors
Use Modal for blocking errors
Never expose API errors directly
Handle 401 → redirect to login
Handle 403 → show "permission denied"
Handle 500 → show "something went wrong"
Handle network errors → show "check your connection"
⚡ Performance
Lazy load routes with React.lazy()
Use Suspense with fallback
Memoize expensive components with React.memo
Optimize images (use WebP, lazy loading)
Use proper key props in lists
Avoid unnecessary re-renders
Use useCallback for event handlers passed to children
🔒 Security
Never store sensitive data in localStorage (only JWT)
Sanitize user inputs before display (React does this by default)
Validate forms before submit
Use HTTPS in production
Never commit .env.local
Never expose API keys in frontend code
⚙️ Configuration
Required env vars (.env.local):

VITE_API_URL=http://localhost:3000/api/v1
Never hardcode API URLs.

📝 Logging
Never use console.log in production code
Use console.error only for caught errors
For debugging, use React DevTools
Use proper error boundaries
🔍 Code Quality
Before creating new code, search for:

Existing components in components/ui/
Existing services in services/
Existing utilities in utils/
Existing types in types/
Existing hooks in hooks/
Reuse before creating. Never duplicate.

📋 Before Writing Code
Claude must:

Read all related files
Understand current architecture
Explain the implementation plan
Identify reusable code (especially UI components)
Avoid architectural conflicts
Ask questions if unclear
✅ Before Finishing
Verify:

 No TypeScript errors
 No ESLint errors
 No unused imports
 No console.log
 No any types
 Mobile responsive
 All API calls go through services/api.ts
 Protected routes use ProtectedRoute
 No hardcoded URLs
 OAuth buttons work correctly
 No direct FastAPI/Kimi calls
Then provide:

Summary of changed components
Architectural decisions
Potential risks
Manual testing checklist
