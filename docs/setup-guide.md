# MediCare / MediFinder - Local Environment & Setup Guide

**Author**: Ratn (Backend Lead)  
**Applicable OS**: Windows / macOS / Linux  

---

## 1. Prerequisites Checklist

Before running the project, ensure you have the following installed:

1. **Java Development Kit (JDK)**: JDK 17, 21, or 25 LTS installed.
   - Verify: `java -version`
2. **Maven**: Maven 3.9+ or use the included Maven Wrapper (`mvnw` / `mvnw.cmd`).
3. **Node.js & npm**: Node.js v18+ and npm v9+.
   - Verify: `node -v` and `npm -v`
4. **MySQL Server**: MySQL 8.0+ running on `localhost:3306`.
   - Verify: MySQL Workbench or command line `mysql -u root -p`

---

## 2. MySQL Database Setup & Configuration

### Option A: Automatic Setup with Spring Boot & Flyway (Recommended)
Spring Boot is configured to automatically create and migrate the database schema upon startup if the database exists.

1. Open MySQL Workbench or MySQL CLI:
   ```sql
   CREATE DATABASE IF NOT EXISTS medicare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Set your MySQL credentials in `.env` (or environment variables / `application-dev.properties`):
   ```properties
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=medicare_db
   DB_USERNAME=root
   DB_PASSWORD=your_actual_mysql_password
   ```
3. When you start the backend, Flyway will automatically execute `V1__initial_schema.sql` and `V2__seed_demo_data.sql`.

### Option B: Manual SQL Execution (MySQL Workbench)
If you prefer manual database initialization:
1. Open MySQL Workbench.
2. Open and execute `database/schema.sql`.
3. Open and execute `database/seed-demo-data.sql`.

### Common MySQL Connection Errors & Troubleshooting:
- **`Access denied for user 'root'@'localhost'`**: Verify password in `.env` or `application-dev.properties`.
- **`Communications link failure / Connection refused`**: Ensure MySQL Server service is started (`Get-Service MySQL*` on Windows or `net start MySQL80`).
- **`Public Key Retrieval is not allowed`**: The JDBC connection string in `application-dev.properties` already includes `allowPublicKeyRetrieval=true` to resolve this MySQL 8 caching SHA2 auth issue.

---

## 3. Running the Backend (Spring Boot)

Navigate to the `backend/` directory:

```bash
cd backend

# Option 1: Using Maven Wrapper (Windows)
.\mvnw.cmd spring-boot:run

# Option 2: Using Maven Wrapper (macOS / Linux)
./mvnw spring-boot:run

# Option 3: Using Global Maven
mvn spring-boot:run
```

Once running:
- **REST API Base URL**: `http://localhost:8080/api`
- **Swagger UI API Explorer**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON Spec**: `http://localhost:8080/v3/api-docs`

### Running Backend Automated Tests:
```bash
cd backend
.\mvnw.cmd test
```

---

## 4. Running the Frontend (React + TypeScript)

Navigate to the `frontend/` directory:

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Run the Vite development server
npm run dev
```

Once started:
- Open browser at: `http://localhost:5173`
- The Vite proxy will automatically forward all `/api/*` calls to `http://localhost:8080`.

---

## 5. Seed Demo Accounts for Testing

| Username | Email | Password | Role | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| `ratn_lead` | `ratn@medicare.demo` | `Password@123` | `ROLE_ADMIN` | Admin & full access |
| `demo_user` | `user@medicare.demo` | `Password@123` | `ROLE_USER` | Standard patient user |
| `rahul_sharma`| `rahul@medicare.demo`| `Password@123` | `ROLE_USER` | Standard patient user |
