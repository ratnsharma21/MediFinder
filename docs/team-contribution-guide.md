# MediCare / MediFinder - Team Contribution & Branching Guide

**Author**: Ratn (Backend Lead & Repository Architect)  
**Target Audience**: All Team Members (Ratn, Vansh, Sumit, Sameer, Sachin)  

---

## 1. Team Roles & Assigned Feature Branches

| Member | Role | Assigned Features | Feature Branches |
| :--- | :--- | :--- | :--- |
| **Ratn (Member 1)** | Backend Lead & Database Architect | Backend foundation, Auth, MySQL schema, Security, Shared APIs | `feature/backend-foundation`<br>`feature/auth-database` |
| **Vansh (Member 2)**| Frontend Engineer (Catalogue) | Medicine store, formulation filters, online price comparison | `feature/medicine-catalogue`<br>`feature/medicine-search` |
| **Sumit (Member 3)**| Frontend Engineer (Locator) | Pharmacy locator, 24x7 filters, GPS & Google Maps integration | `feature/pharmacy-locator`<br>`feature/maps-integration` |
| **Sameer (Member 4)**| Fullstack Engineer (Reminders) | Medicine reminder schedules, dose logs, adherence tracking | `feature/medicine-reminders`<br>`feature/dose-tracking` |
| **Sachin (Member 5)**| Frontend Lead (UI/Dashboard) | Dashboard portal, profile settings, theme, visual QA | `feature/dashboard-ui`<br>`feature/profile-settings` |

---

## 2. Git Workflow Rules

1. **Never commit directly to `main`**:
   - `main` is reserved for stable releases.
   - Always create your feature branch from the latest base branch (`git checkout -b feature/<your-feature>`).

2. **Branching & Commit Guidelines**:
   - Keep commits focused and descriptive (e.g., `feat(medicine): add category filter dropdown`).
   - Run tests before pushing: `cd backend && .\mvnw.cmd test` and `cd frontend && npm run build`.

3. **Shared Files Coordination**:
   - **Frontend Routing & App.tsx**: Coordinate with Sachin (Member 5) before modifying `App.tsx` or `MainLayout.tsx`.
   - **API Client & DTOs**: Coordinate with Ratn (Member 1) before requesting modifications to `backend/src/main/java/com/medicare/**` or `frontend/src/types/index.ts`.
   - **Database Migrations**: Add new Flyway migration files sequentially (`V3__...sql`, `V4__...sql`). Never alter already-executed migrations.

4. **Pull Requests & Code Reviews**:
   - Open a Pull Request targeting `main`.
   - Ensure all automated checks pass.
   - Request review from the module owner and Ratn.

---

## 3. Module Directory Map for Developers

```
MediFinder/
├── backend/                  # Java Spring Boot backend (Ratn)
│   ├── src/main/java/com/medicare/
│   │   ├── auth/            # Auth controllers & services (Ratn)
│   │   ├── user/            # Profile & settings (Ratn & Sachin)
│   │   ├── medicine/        # Medicine catalogue API (Ratn & Vansh)
│   │   ├── pharmacy/        # Pharmacy locator API (Ratn & Sumit)
│   │   ├── reminder/        # Reminders & dose logs API (Ratn & Sameer)
│   │   └── notification/    # In-app notifications
├── frontend/                 # React + TypeScript single page app
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/             # Login & registration modal (Ratn)
│   │   │   ├── medicine-store/   # Medicine catalogue UI (Vansh)
│   │   │   ├── pharmacy-locator/ # Pharmacy maps & list UI (Sumit)
│   │   │   ├── reminders/        # Medication schedules UI (Sameer)
│   │   │   └── dashboard/        # Central portal & overview (Sachin)
│   │   ├── services/             # Type-safe API clients (Ratn)
│   │   └── types/                # Shared TypeScript contracts (Ratn)
├── database/                 # Standalone SQL schema & seed scripts
└── docs/                     # Architecture & integration documentation
```
