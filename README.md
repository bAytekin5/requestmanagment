# Request Management System

A full-stack ticketing platform built with Spring Boot (REST API, JWT security, Flyway, Docker) and a React + Ant Design frontend. Users submit ve track requests, admins update status/assignee.

## Features
- JWT-based authentication & role-based authorization (`ROLE_USER`, `ROLE_ADMIN`)
- Request lifecycle management (create, list, update status, assign admin)
- Postgres database migrations with Flyway
- Structured logging & global error handling
- Docker support (`docker-compose` for backend + Postgres)
- React UI with Ant Design, React Query, React Router
- Centralized Axios API client with auth token handling

## Tech Stack
- **Backend:** Java 21, Spring Boot 3.3, Spring Security, Spring Data JPA, Flyway, PostgreSQL, Lombok
- **Frontend:** React 19 (CRA TypeScript), Ant Design 5, Axios, React Query, React Router DOM
- **Infrastructure:** Docker, Docker Compose

## Getting Started
### Prerequisites
- Java 21+
- Maven 3.9+
- Node.js 18+/npm
- Docker Desktop (optional but recommended)

### Backend (Local)
```bash
cd backend/reqman-backend
mvn clean package
mvn spring-boot:run
```
- API runs at `http://localhost:8080`
- Default admin credentials: `admin@reqman.com / Admin123!`

### Backend (Docker)
```bash
cd backend
mvn -f reqman-backend/pom.xml clean package
docker compose up --build -d
```
- Backend: `http://localhost:8080`
- Postgres: `localhost:5432` (db/user/password `reqman`)
- Logs stored at `backend/reqman-backend/logs/`

### Frontend
```bash
cd frontend
npm install
npm start
```
- App runs at `http://localhost:3000`
- Dev server proxies `/api` to backend (via `src/setupProxy.js`)

### Environment
- `application.yml` defaults to local Postgres
- `application-docker.yml` used when `SPRING_PROFILES_ACTIVE=docker`
- Frontend uses `REACT_APP_API_BASE_URL` (fallback `http://localhost:8080/api`)

## Running Tests
### Backend
```bash
cd backend/reqman-backend
mvn test
```
### Frontend
```bash
cd frontend
npm test -- --watchAll=false --passWithNoTests
npm run build
```

## API Overview (key endpoints)
- `POST /api/auth/register` – register new user (assigns ROLE_USER)
- `POST /api/auth/login` – authenticate, receive JWT tokens
- `GET /api/requests` – list requests (filter via query params)
- `POST /api/requests` – create request (USER role)
- `PUT /api/requests/{id}/status` – update status/assignee (ADMIN role)

## Frontend Usage
1. Open `http://localhost:3000`
2. Login using default admin or register new user
3. Submit new requests via "Yeni Talep"
4. View and manage via dashboard & list

## Logging & Monitoring
- `logback-spring.xml` writes to console
- `RequestLoggingAspect` adds request IDs in logs
- `GlobalExceptionHandler` standardizes error responses

## Migrations & Data Seed
- Flyway migration `V1__init.sql` creates schema & seeds roles
- `DataInitializer` seeds admin user on startup

## Deployment Notes
- For production, define `JWT_SECRET`, `DB_*` env vars
- Use `docker compose up --build -d` after setting environment
- React build artifacts available via `npm run build`

## Roadmap / Improvements
- Add unit/integration tests (backend controllers, services)
- Implement refresh token endpoint and token rotation
- Enable pagination, sorting/filter UI enhancements
- Add file upload support for attachments
- CI/CD pipeline (GitHub Actions) for build & tests

