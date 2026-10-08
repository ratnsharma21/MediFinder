# MediCare / MediFinder - System Architecture

**Author**: Ratn (Backend Lead & Database Architect)  
**Target Environment**: Web Application (React + Spring Boot + MySQL)  

---

## 1. High-Level Architecture Overview

MediFinder follows a clean, decoupled, layered microservices-ready monolithic architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                 React + TypeScript Frontend                 │
│         (Vite • Responsive UI • Common Design System)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Spring Boot REST API Application               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   Security Filter Chain (JWT Auth Filter • CORS)      │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              ▼                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   REST Controllers (@RestController • Swagger Docs)   │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              ▼                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   Service Layer (@Service • Business Logic • Auth)    │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              ▼                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   Repository Layer (Spring Data JPA • Specifications) │  │
│  └───────────────────────────┬───────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │ JDBC (Flyway Migrations)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                MySQL 8.0+ Relational Database                │
│    (users • medicines • pharmacies • reminders • logs)      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Layered Architecture Principles

1. **Controller Layer**:
   - Handles HTTP requests and parameter deserialization.
   - Validates input using Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Size`, `@Email`).
   - Delegates business execution directly to services.
   - Never accesses repositories or returns raw JPA entities directly; all payloads are wrapped in `ApiResponse<T>` or `PagedResponse<T>`.

2. **Service Layer**:
   - Implements business logic, validation rules, and authorization boundaries.
   - Enforces user isolation (checks that the requesting `UserPrincipal` matches record ownership).
   - Manages database transactions with `@Transactional`.

3. **Repository Layer**:
   - Uses Spring Data JPA repositories with custom JPQL queries and Specification executors for flexible search filtering.

4. **Security & Authentication Layer**:
   - Stateless JWT authentication via `JwtAuthenticationFilter`.
   - HMAC-SHA256 signature validation with configurable secret and expiration.
   - Passwords encoded using BCrypt with 10 salt rounds.
   - Centralized exception mapping via `GlobalExceptionHandler` returning consistent JSON errors without leaking sensitive stack traces.

---

## 3. Technology Stack & Compatibility Matrix

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend Runtime** | Java JDK | 21 / 25 | High performance LTS runtime |
| **Backend Framework** | Spring Boot | 3.3.5 | Core dependency injection and web MVC |
| **Security** | Spring Security | 6.3.x | Role-based authorization & filter chains |
| **Token Handling** | JJWT (Java JWT) | 0.12.6 | Cryptographic JWT signing and parsing |
| **Database** | MySQL Server | 8.0+ | Persistent relational storage |
| **Database Migrations**| Flyway | 10.x | Version-controlled schema evolutions |
| **API Documentation** | Springdoc OpenAPI | 2.6.0 | Swagger UI interactive documentation |
| **Frontend Framework**| React + TypeScript | 18.3.x / 5.6.x | Type-safe single-page web client |
| **Frontend Tooling** | Vite | 5.4.x | Fast dev server and optimized bundling |
| **Testing** | JUnit 5 + MockMvc | 5.10.x | Automated unit & integration testing |
