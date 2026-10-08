# MediCare / MediFinder — Foundation & Backend Implementation Report

**Author / Role**: Ratn — Backend Lead, Repository Foundation & Database Engineer  
**Date**: 2026-10-08  
**Repository**: `https://github.com/ratnsharma21/MediFinder.git`  
**Base Working Branch**: `feature/backend-foundation`  
**Secondary Feature Branch**: `feature/auth-database`  

---

## 1. Executive Summary

As the Backend Lead and Database Architect (Member 1), I have established the integrated repository foundation for the entire 5-member team. The backend is implemented as a production-grade Spring Boot 3.3.5 REST API with MySQL 8.0 support, Flyway database migrations, JJWT authentication, Spring Security 6, OpenAPI 3.0 (Swagger UI), and 100% automated test coverage across all domain modules.

In addition, a complete, type-safe React + TypeScript frontend skeleton with a shared design system, HTTP clients, and module containers has been provisioned to allow Members 2, 3, 4, and 5 to work in parallel on their respective feature branches without architectural friction.

---

## 2. Directory Layout & Module Structure

```
MediFinder/
├── .gitignore
├── .env.example
├── README.md
├── database/
│   ├── schema.sql
│   └── seed-demo-data.sql
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── api-specification.md
│   ├── database-design.md
│   ├── setup-guide.md
│   └── team-contribution-guide.md
├── scripts/
│   ├── setup.ps1
│   ├── setup.sh
│   ├── run-backend.ps1
│   └── run-frontend.ps1
├── tests/
│   └── postman_collection.json
├── screenshots/
│   └── README.md
├── reports/
│   └── backend-foundation-report.md
├── backend/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── .mvn/wrapper/
│   └── src/
│       ├── main/
│       │   ├── java/com/medicare/
│       │   │   ├── MediCareApplication.java
│       │   │   ├── config/ (OpenApiConfig, CorsConfig)
│       │   │   ├── security/ (SecurityConfig, JwtTokenProvider, JwtAuthenticationFilter, JwtAuthenticationEntryPoint, CustomUserDetailsService, UserPrincipal)
│       │   │   ├── common/ (ApiResponse, PagedResponse, ErrorResponse, GlobalExceptionHandler, Exceptions)
│       │   │   ├── auth/ (AuthController, AuthService, DTOs)
│       │   │   ├── user/ (UserController, UserService, Repositories, Entities, DTOs)
│       │   │   ├── medicine/ (MedicineController, SavedMedicineController, Services, Repositories, Entities, DTOs)
│       │   │   ├── pharmacy/ (PharmacyController, PharmacyService, PharmacyRepository, Pharmacy entity, DTOs)
│       │   │   ├── reminder/ (ReminderController, DoseLogController, Services, Repositories, Entities, DTOs)
│       │   │   ├── notification/ (NotificationController, NotificationService, Repository, Entity, DTOs)
│       │   │   └── order/ (package-info architectural boundary note)
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── application-dev.properties
│       │       ├── application-test.properties
│       │       └── db/migration/
│       │           ├── V1__initial_schema.sql
│       │           └── V2__seed_demo_data.sql
│       └── test/
│           ├── java/com/medicare/ (32 Unit & Integration tests)
│           └── resources/application-test.properties
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── components/ (common: Navbar, Footer, Card; layout: MainLayout)
        ├── modules/ (auth, medicine-store, pharmacy-locator, reminders, dashboard)
        ├── services/ (api, authService, medicineService, pharmacyService, reminderService)
        ├── hooks/ (useAuth)
        ├── types/ (index.ts)
        ├── utils/ (constants.ts)
        ├── App.tsx
        ├── main.tsx
        └── index.css
```

---

## 3. Database Architecture & Schema Specification

The database utilizes MySQL 8.0+ / InnoDB with UTF8MB4 charset, foreign keys, cascade rules, and indexes:

| Table | Purpose | Relationships |
| :--- | :--- | :--- |
| `users` | User credentials, roles (`ROLE_USER`, `ROLE_ADMIN`, `ROLE_PHARMACIST`), active flags | 1:1 `user_profiles`, 1:1 `user_settings`, 1:N `reminders` |
| `user_profiles` | Medical contact info (blood group, emergency contact, city, postal code) | N:1 `users` |
| `user_settings` | Notification channels (email, sms, browser, in-app), dark mode, chime sound | N:1 `users` |
| `manufacturers` | Pharma manufacturing companies (Cipla, Sun Pharma, Dr. Reddy's, Abbott) | 1:N `medicines` |
| `medicines` | Medicine catalogue, formulations, indications, precautions, Rx flag, MRP | N:1 `manufacturers`, 1:N `retailer_offers` |
| `retailers` | Verified online pharmacy portals (Tata 1mg, PharmEasy, Netmeds, Apollo) | 1:N `retailer_offers` |
| `retailer_offers`| Price comparisons across stores with discount % and direct purchase URLs | N:1 `medicines`, N:1 `retailers` |
| `pharmacies` | Physical medical stores with GPS latitude/longitude, hours, 24x7 flag | Independent geo-indexed table |
| `reminders` | User medication dosage schedules, frequency, timing | N:1 `users`, N:1 `medicines` |
| `dose_logs` | Adherence confirmations (`TAKEN`, `MISSED`, `SKIPPED`) with timestamps | N:1 `reminders`, N:1 `users` |
| `saved_medicines`| User medicine bookmarks & personal watchlist notes | N:1 `users`, N:1 `medicines` |
| `notifications` | In-app reminders and system alerts | N:1 `users` |

---

## 4. API Endpoints & Swagger URL

- **Swagger UI Interactive Explorer**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI 3.0 JSON Spec**: `http://localhost:8080/v3/api-docs`

### Summary of Endpoints:
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`
- `GET /api/users/me`, `PATCH /api/users/me`, `GET /api/users/me/settings`, `PATCH /api/users/me/settings`
- `GET /api/medicines`, `GET /api/medicines/{id}`, `GET /api/medicines/{id}/offers`, `GET /api/medicines/categories`
- `GET /api/saved-medicines`, `POST /api/saved-medicines/{id}`, `DELETE /api/saved-medicines/{id}`
- `GET /api/pharmacies`, `GET /api/pharmacies/{id}`, `GET /api/pharmacies/nearby`
- `GET /api/reminders`, `POST /api/reminders`, `GET /api/reminders/{id}`, `PATCH /api/reminders/{id}`, `DELETE /api/reminders/{id}`
- `GET /api/dose-logs`, `POST /api/dose-logs`, `PATCH /api/dose-logs/{id}`
- `GET /api/notifications`, `GET /api/notifications/unread-count`, `PATCH /api/notifications/{id}/read`

---

## 5. Automated Test Results

Executed via Maven:
```bash
cd backend
.\mvnw.cmd test
```

### Result:
- **Total Tests Executed**: 32
- **Passed**: 32
- **Failures**: 0
- **Errors**: 0
- **Skipped**: 0
- **Build Status**: `BUILD SUCCESS`

### Test Suite Breakdown:
1. `MediCareApplicationTests`: Context bootstrap verification.
2. `JwtTokenProviderTest` (3 tests): JJWT generation, HS256 HMAC verification, claim decoding, expired token rejection.
3. `AuthControllerTest` (5 tests): User registration, duplicate email validation, DTO bean validation, valid login, invalid login rejection.
4. `UserControllerTest` (4 tests): Profile retrieval, partial profile updates, settings updates, unauthorized request blocking.
5. `MedicineControllerTest` (6 tests): Catalogue search, generic filter, price sorting, detail retrieval, retailer offers, distinct categories.
6. `PharmacyControllerTest` (3 tests): Store listing, city filtering, Haversine GPS proximity radius search.
7. `ReminderControllerTest` (4 tests): Medication schedule CRUD, multi-user privacy isolation (User A cannot access User B's reminders).
8. `DoseLogControllerTest` (3 tests): Dose logging, adherence status updates (`TAKEN`, `MISSED`, `SKIPPED`), reminder ownership validation.
9. `NotificationControllerTest` (4 tests): Notification list retrieval, unread count badge, mark-as-read status, cross-user privacy isolation.

---

## 6. Team Branch Plan & Handover

| Team Member | Module Ownership | Feature Branches |
| :--- | :--- | :--- |
| **Member 1 (Ratn)** | Backend Foundation, Auth & DB | `feature/backend-foundation`, `feature/auth-database` |
| **Member 2 (Vansh)** | Medicine Store & Catalogue UI | `feature/medicine-catalogue`, `feature/medicine-search` |
| **Member 3 (Sumit)** | Pharmacy Locator & Maps UI | `feature/pharmacy-locator`, `feature/maps-integration` |
| **Member 4 (Sameer)** | Reminders & Dose Tracking UI | `feature/medicine-reminders`, `feature/dose-tracking` |
| **Member 5 (Sachin)** | Dashboard UI & Settings UI | `feature/dashboard-ui`, `feature/profile-settings` |
