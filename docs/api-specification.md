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
| `GET` | `/api/users/me` | Protected | Retrieve the authenticated user's account, profile, and settings |
| `GET` | `/api/users/me/profile` | Protected | Retrieve the authenticated user's contact and medical profile |
| `PATCH`| `/api/users/me` | Protected | Partially update the authenticated user's profile |
| `PUT` | `/api/users/me/profile` | Protected | Update the authenticated user's profile |
| `GET` | `/api/users/me/settings` | Protected | Retrieve notification and appearance preferences |
| `PATCH`| `/api/users/me/settings`| Protected | Persist notification preferences, dark mode, and reminder sound choice |

Profile and settings operations always use the user ID from the authenticated token; clients do not submit a target user ID. Profile updates validate supported column lengths, phone-number and postal-code formats, and require dates of birth to be in the past. Notification channel values are persisted preferences; they do not enable notification delivery by themselves.

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
| `GET` | `/api/pharmacies` | Public | Paginated pharmacy listing with keyword, city, PIN code search, and optional GPS distance calculation |
| `GET` | `/api/pharmacies/{id}` | Public | Detailed pharmacy operating hours, license, contact details, rating, and coordinates |
| `GET` | `/api/pharmacies/nearby` | Public | Geolocation nearby search calculating Haversine proximity distance in kilometers |

#### `GET /api/pharmacies` Query Parameters
| Parameter | Type | Required | Default | Validation & Description |
| :--- | :--- | :--- | :--- | :--- |
| `query` | string | No | `null` | Substring search against store name, address, or city |
| `city` | string | No | `null` | Exact case-insensitive city filter (e.g. `Bengaluru`) |
| `postalCode` | string | No | `null` | Exact Indian postal PIN code (e.g. `560038`) |
| `is24Hours` | boolean| No | `null` | Filter only 24x7 emergency medical counters |
| `latitude` | number | No | `null` | User GPS latitude (-90.0 to 90.0) for distance enrichment |
| `longitude`| number | No | `null` | User GPS longitude (-180.0 to 180.0) for distance enrichment |
| `page` | integer| No | `0` | 0-indexed page number (`>= 0`) |
| `size` | integer| No | `10` | Page size (`1` to `100`) |

#### `GET /api/pharmacies/nearby` Query Parameters
| Parameter | Type | Required | Default | Validation & Description |
| :--- | :--- | :--- | :--- | :--- |
| `latitude` | number | **Yes** | — | User GPS latitude (-90.0 to 90.0 degrees) |
| `longitude`| number | **Yes** | — | User GPS longitude (-180.0 to 180.0 degrees) |
| `radiusInKm` | number | No | `10.0` | Proximity radius in kilometers (`> 0.0` and `<= 500.0`) |

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
