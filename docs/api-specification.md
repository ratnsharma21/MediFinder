# MediCare / MediFinder - REST API Specification

**Author**: Ratn (Backend Lead)  
**Base URL**: `http://localhost:8080/api`  
**Swagger UI Interactive Documentation**: `http://localhost:8080/swagger-ui.html`  
**OpenAPI Specification JSON**: `http://localhost:8080/v3/api-docs`  

---

## 1. Authentication & Security Scheme

All protected endpoints require a JWT Bearer token in the `Authorization` header:
```http
Authorization: Bearer <your_jwt_token>
```

### Standard Response Envelope:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-10-08 20:00:00"
}
```

### Standard Error Response:
```json
{
  "success": false,
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for one or more fields",
  "path": "/api/auth/register",
  "validationErrors": {
    "email": "Email must be a valid email address"
  },
  "timestamp": "2026-10-08 20:00:00"
}
```

---

## 2. API Endpoints Catalog

### Authentication & Users
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate with credentials and receive JWT |
| `POST` | `/api/auth/logout` | Protected | Logout session / token invalidation notice |
| `GET` | `/api/users/me` | Protected | Retrieve authenticated user details and profile |
| `PATCH`| `/api/users/me` | Protected | Update profile (name, emergency contact, address) |
| `GET` | `/api/users/me/settings` | Protected | Retrieve notification and theme settings |
| `PATCH`| `/api/users/me/settings`| Protected | Update notification toggles, dark mode, sounds |

### Medicines & Catalogue
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/medicines` | Public | Paginated medicine catalogue with search and filters |
| `GET` | `/api/medicines/{id}` | Public | Detailed medicine formulation, precautions, manufacturer |
| `GET` | `/api/medicines/{id}/offers`| Public | Verified partner retailer price comparison quotes |
| `GET` | `/api/medicines/categories`| Public | List of distinct medicine categories for filter dropdowns |
| `GET` | `/api/saved-medicines` | Protected | User's bookmarked medicines watchlist |
| `POST`| `/api/saved-medicines/{id}`| Protected | Bookmark a medicine with personal notes |
| `DELETE`| `/api/saved-medicines/{id}`| Protected | Remove medicine from bookmarks |

### Pharmacies & Locator
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/pharmacies` | Public | Paginated pharmacy listing with city and postal code search |
| `GET` | `/api/pharmacies/{id}` | Public | Pharmacy operating hours, license, contact details |
| `GET` | `/api/pharmacies/nearby` | Public | Geolocation search calculating proximity in kilometers |

### Medicine Reminders & Dose Tracking
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reminders` | Protected | List all medication schedules for the current user |
| `POST` | `/api/reminders` | Protected | Create a new medication schedule |
| `GET` | `/api/reminders/{id}` | Protected | Retrieve a specific medication schedule (owner only) |
| `PATCH`| `/api/reminders/{id}`| Protected | Partially update reminder timing, dosage, or active status |
| `DELETE`| `/api/reminders/{id}`| Protected | Delete reminder schedule |
| `GET` | `/api/dose-logs` | Protected | Retrieve dose history for the authenticated user |
| `POST` | `/api/dose-logs` | Protected | Record intake confirmation or missed dose |
| `PATCH`| `/api/dose-logs/{id}` | Protected | Update dose adherence status (`TAKEN`, `MISSED`, `SKIPPED`) |

### In-App Notifications
| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Protected | Retrieve in-app reminder and system notifications |
| `GET` | `/api/notifications/unread-count` | Protected | Unread alert badge counter |
| `PATCH`| `/api/notifications/{id}/read` | Protected | Mark notification as read |
