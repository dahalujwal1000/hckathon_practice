
---

## 📄 File 2: `backend/CLAUDE.md`

**Path:** `CLAUDE_CODE_HACKATHON/backend/CLAUDE.md`

```markdown
# Backend (NestJS) Rules — Nepal Health Hospital

> Read this BEFORE writing any backend code.
> Root rules in `/CLAUDE.md` also apply.

---

## 🎯 Purpose

NestJS is the **primary backend**. It handles:
- OAuth 2.0 Authentication
- User Management (patients, doctors, admins)
- Doctor & Hospital Management
- Appointment Booking
- Ambulance Service
- File Uploads
- Email Notifications
- Proxying AI requests to FastAPI

---

## 🛠️ Stack

- **Framework:** NestJS 10
- **Language:** TypeScript (strict mode)
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Auth:** OAuth 2.0 (Google + GitHub) + JWT session
- **Validation:** class-validator + class-transformer
- **Docs:** Swagger (@nestjs/swagger)
- **Email:** Nodemailer
- **HTTP Client:** Axios (for FastAPI calls)

---

## 🏛️ Layer Architecture (NEVER bypass)

HTTP Request ↓ ┌─────────────┐ │ Controller │ ← Validates input, calls service, returns response └──────┬──────┘ ↓ ┌─────────────┐ │ Service │ ← Business logic, coordinates repos, calls external APIs └──────┬──────┘ ↓ ┌─────────────┐ │ Repository │ ← ONLY layer that touches PostgreSQL └──────┬──────┘ ↓ ┌─────────────┐ │ PostgreSQL │ └─────────────┘


**For AI features:**
Controller → Service → aiService (shared) → FastAPI


---

## 📁 Required Folder Structure

src/ ├── main.ts ← Bootstrap ├── app.module.ts ← Root module │ ├── common/ │ ├── filters/ │ │ └── global-exception.filter.ts ← Global error handler │ ├── interceptors/ │ │ └── response.interceptor.ts ← Wraps response in standard format │ ├── pipes/ │ │ └── validation.pipe.ts ← Global validation │ ├── decorators/ │ │ ├── roles.decorator.ts │ │ ├── current-user.decorator.ts │ │ └── public.decorator.ts │ └── guards/ │ ├── jwt-auth.guard.ts │ └── roles.guard.ts │ ├── config/ │ ├── database.config.ts │ ├── jwt.config.ts │ ├── oauth.config.ts │ └── app.config.ts │ ├── database/ │ ├── data-source.ts │ ├── migrations/ │ └── seeds/ │ ├── shared/ │ ├── services/ │ │ ├── aiService.ts ← ONLY way to call FastAPI │ │ ├── email.service.ts │ │ └── file-upload.service.ts │ ├── constants/ │ │ ├── roles.constant.ts │ │ ├── permissions.constant.ts │ │ └── error-messages.constant.ts │ └── utils/ │ ├── token.util.ts │ └── pagination.util.ts │ └── modules/ ├── auth/ ← OAuth + JWT ├── users/ ├── doctors/ ├── hospitals/ ├── appointments/ ├── ambulance/ └── ai/ ← Proxy to FastAPI


---

## 📦 Module Structure (EVERY module follows this)

modules/<name>/ ├── <name>.module.ts ├── controller/ │ └── <name>.controller.ts ├── service/ │ └── <name>.service.ts ├── repository/ │ └── <name>.repository.ts ├── dto/ │ ├── create-<name>.dto.ts │ ├── update-<name>.dto.ts │ └── query-<name>.dto.ts ├── entities/ │ └── <name>.entity.ts ├── constants/ └── types/


---

## ✅ Controller Rules

Controllers should ONLY:
- Receive HTTP requests
- Validate input (DTOs + ValidationPipe)
- Call services
- Return responses

Controllers must NEVER:
- Query PostgreSQL directly
- Query FAISS
- Call Kimi
- Implement business logic
- Call FastAPI directly (use aiService via service layer)
- Handle transactions
- Catch errors silently

---

## ✅ Service Rules

Services contain ALL business logic.

Services should:
- Validate business rules
- Coordinate repositories
- Call FastAPI via shared `aiService`
- Handle transactions
- Throw NestJS HTTP exceptions

Services must NEVER:
- Contain raw SQL
- Access TypeORM repositories directly (use injected repos)
- Call HTTP clients directly (use shared services)

---

## ✅ Repository Rules

Repositories are the ONLY layer allowed to communicate with PostgreSQL.

- Never access TypeORM directly from services
- Never duplicate queries
- Reuse repository methods
- Use soft delete (`@DeleteDateColumn()`)
- Use transactions for multi-step operations

---

## 🌐 API Service Rules (Calling FastAPI)

Communication with FastAPI uses a reusable HTTP client.

**Location:** `backend/src/shared/services/aiService.ts`

**Responsibilities:**
- Base URL from `FASTAPI_URL` env
- Internal token from `FASTAPI_INTERNAL_TOKEN` env
- 30s timeout
- Retry 3 times on failure
- Logging (no sensitive data)
- Error handling — convert to NestJS HttpException

**Never call FastAPI directly from controllers.**

```typescript
// Example usage in a service
@Injectable()
export class AiService {
  constructor(private readonly aiService: AiHttpService) {}

  async analyzeSymptoms(payload: SymptomsDto) {
    return this.aiService.post('/symptoms', payload);
  }
}
🔤 TypeScript Rules
Never use var
Prefer const
Use let only when reassignment required
Never use any — use unknown if type is uncertain
Never use @ts-ignore
Strict TypeScript only ("strict": true in tsconfig)
Prefer interfaces for contracts
Use optional chaining (?.)
Use nullish coalescing (??)
Use async/await
📋 DTO Rules
Use class-validator decorators
Use class-transformer
Validate: body, query, params, headers, files
All DTOs must have @Expose() for serialization
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsEnum(UserRole)
  role: UserRole;
}
🔐 Authentication — OAuth 2.0
Strategy
OAuth 2.0 with Passport strategies
Providers: Google + GitHub (extensible)
After OAuth, issue a JWT session token
JWT stored in httpOnly cookie OR returned in response
Flow
User clicks "Login with Google"
        ↓
Frontend redirects to /api/v1/auth/google
        ↓
NestJS redirects to Google OAuth screen
        ↓
User approves
        ↓
Google redirects to /api/v1/auth/google/callback
        ↓
NestJS:
  1. Receives Google profile
  2. Finds/creates user in DB
  3. Generates JWT
  4. Redirects to frontend with token
Required Packages
@nestjs/passport
@nestjs/jwt
passport
passport-google-oauth20
passport-github2
Folder Structure
modules/auth/
├── auth.module.ts
├── controller/
│   └── auth.controller.ts
├── service/
│   └── auth.service.ts
├── repository/
│   └── auth.repository.ts
├── strategies/
│   ├── google.strategy.ts
│   └── github.strategy.ts
├── guards/
│   └── jwt-auth.guard.ts
├── dto/
│   └── oauth-user.dto.ts
├── entities/
│   └── user.entity.ts
└── constants/
    └── auth.constants.ts
Endpoints
Method	Path	Purpose
GET	/api/v1/auth/google	Initiate Google OAuth
GET	/api/v1/auth/google/callback	Google callback
GET	/api/v1/auth/github	Initiate GitHub OAuth
GET	/api/v1/auth/github/callback	GitHub callback
GET	/api/v1/auth/me	Get current user (protected)
POST	/api/v1/auth/logout	Logout
User Entity
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'enum', enum: ['patient', 'doctor', 'admin'], default: 'patient' })
  role: UserRole;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  providerId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
Auth Service
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async handleOAuthLogin(profile: OAuthProfile): Promise<{ token: string; user: User }> {
    let user = await this.authRepository.findByEmail(profile.email);

    if (!user) {
      user = await this.authRepository.create({
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        provider: profile.provider,
        providerId: profile.providerId,
        role: 'patient',
      });
    } else {
      user = await this.authRepository.updateLastLogin(user.id);
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { token, user };
  }
}
Google Strategy
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      provider: 'google',
      providerId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatarUrl: profile.photos[0]?.value,
    };
  }
}
Auth Rules
✅ Always use Passport strategies
✅ Verify state parameter (Passport handles this)
✅ Store provider + providerId for account linking
✅ Use httpOnly cookies for JWT (preferred)
❌ Never log OAuth tokens
❌ Never expose client secrets
❌ Never trust frontend with OAuth flow
🌐 Response Format
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": {}
}
{
  "success": false,
  "message": "Error message",
  "error": { "code": "ERROR_CODE", "details": [] }
}
⚠️ Error Handling
Use NestJS HTTP Exceptions (ConflictException, NotFoundException, etc.)
Centralized via global filter
Never throw raw errors
Never expose stack traces to clients
📝 Logging
Use NestJS Logger
Never use console.log
Never log: passwords, tokens, secrets, medical data, OAuth tokens
🗄️ Database Rules
PostgreSQL only
Use transactions for multi-step operations
Never duplicate queries
Soft delete whenever possible
Index searchable columns
Select only required columns
Avoid N+1 queries
Pagination on all list endpoints
⚡ Performance
Paginate list endpoints (default: 10, max: 100)
Cache expensive operations (Redis if needed)
Optimize SQL queries
Use indexes on FK and search columns
Batch inserts where possible
Use eager loading carefully (avoid over-fetching)
🔒 Security
Validate every request (DTOs)
Sanitize inputs
Protect against: SQL injection, XSS, CSRF, prompt injection
Never trust frontend validation
File upload validation: MIME, extension, size
Rate limiting on auth endpoints
HTTPS in production
⚙️ Configuration
Everything from env vars via @nestjs/config. Never hardcode secrets.

// config/app.config.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackUrl: process.env.GITHUB_CALLBACK_URL,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  fastapi: {
    url: process.env.FASTAPI_URL,
    internalToken: process.env.FASTAPI_INTERNAL_TOKEN,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
});
🔍 Code Quality
Before creating new code, search for:

Existing services
Existing repositories
Existing utilities
Existing constants
Existing DTOs
Existing decorators
Existing guards
Reuse before creating. Never duplicate.

📋 Before Writing Code
Claude must:

Read all related files
Understand current architecture
Explain the implementation plan
Identify reusable code
Avoid architectural conflicts
Ask questions if unclear
✅ Before Finishing
Verify:

 No TypeScript errors
 No lint errors
 No unused imports
 No circular dependencies
 No duplicated code
 No broken APIs
 No architectural conflicts
 No any types
 No console.log
 Soft delete on entities
 DTOs validated
 OAuth uses Passport strategies
Then provide:

Summary of changed files
Architectural decisions
Potential risks
Manual testing checklist