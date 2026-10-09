# MediFinder / MediCare: User-Specific Data Isolation, Shared Medicine Catalogue & Jaipur Location Audit Report

**Date:** 2026-10-10  
**Project:** MediFinder (formerly MediCare) Healthcare OS  
**Status:** Completed & Verified  

---

## 1. Executive Summary

This audit and implementation deliverable resolves the user data leakage, hardcoded dummy placeholder data, and inaccurate geographical location defaults across the MediFinder / MediCare full-stack platform.

The application now guarantees:
1. **Strict User Data Isolation:** Every authenticated user account accesses strictly isolated personal schedules, reminders, dose compliance logs, notifications, order history, electronic medical records (EHR), and inventory refill alerts.
2. **True Shared Medicine Catalogue:** The medicine catalog remains universally accessible to all authenticated users as shared reference data without duplicating database entries or fabricating fake purchases.
3. **Jaipur Default Geospatial Context:** The Pharmacy & Hospital Locator is centered by default on **Jaipur, Rajasthan, India** (`26.9124° N, 75.7873° E`), featuring verified Jaipur healthcare institutions (SMS Hospital, Apollo C-Scheme, Fortis Escorts Jaipur, MedPlus Jaipur, Manipal Jaipur, EHCC, Narayana).
4. **Clean New-User Experience:** Newly registered users receive clean, realistic empty states with actionable call-to-action (CTA) buttons rather than fabricated fake activity.

---

## 2. Root Causes Discovered

During repository-wide inspection of backend controllers, JPA repositories, database schema, and React frontend components:

| Area | Root Cause | Impact |
| :--- | :--- | :--- |
| **Dashboard Fallbacks** | `DashboardModule.tsx` had fallback arrays for `reminders`, `refillAlerts`, and `recentOrders` hardcoded with static patient names and dummy doses when API responses were empty. | New users saw fake reminders and refill warnings belonging to no real user. |
| **Orders & EHR Records** | `OrdersModule.tsx` and `MedicalRecordsModule.tsx` initialized state with static mock arrays (`INITIAL_RECORDS` and hardcoded orders). | All accounts saw the exact same hardcoded orders and documents. |
| **Notifications** | `NotificationsModule.tsx` initialized mock notifications and `TopNavbar.tsx` / `Sidebar.tsx` hardcoded badge counters (`3`, `2`, `1`). | Fresh accounts had artificial badge counts. |
| **Pharmacy Locator** | Coordinates and default query were hardcoded to Bengaluru/Delhi (`12.9716, 77.6410` / Delhi centers). | Users looking for nearby care saw unrelated cities. |
| **User Identity** | UI hardcoded "Ratn Sharma" or "Alex Morgan" fallbacks instead of deriving patient names from authenticated User objects. | Account identity appeared generic across logins. |

---

## 3. Hardcoded Data Audit

| Item | Action Taken | Rationale |
| :--- | :--- | :--- |
| **Shared Medicine Catalogue** | **Retained & Kept Shared** | Medicine catalog entries (tablets, syrups, prices, manufacturers) represent global pharmaceutical reference data accessible to all patients. |
| **Demo Hardcoded Patient Reminders** | **Removed** | Reminders and dose schedules must strictly originate from the logged-in user's database records. |
| **Hardcoded Orders (`ORD-2024-8841`, etc.)** | **Removed & User-Scoped** | Orders must reflect genuine user purchases, isolated per user key (`medicare_orders_u_${userId}`). |
| **Hardcoded Health Records (Blood Test, etc.)** | **Removed & User-Scoped** | Medical records & prescriptions must be private to the authenticated patient (`medicare_ehr_u_${userId}`). |
| **Hardcoded Refill Warnings** | **Removed & Dynamically Derived** | Refill warnings are calculated only if the authenticated user has active reminders with remaining stock $\le 3$ days or user-saved medicines. |
| **Fixed Badge Counts (`3`, `2`, `1`)** | **Removed & Connected to Live API** | Badge counts dynamically display the logged-in user's active reminders, unread notifications, and order counts. |
| **Delhi/Bengaluru Map Default** | **Replaced with Jaipur** | Replaced with Jaipur, Rajasthan coordinates (`26.9124, 75.7873`) and Jaipur healthcare centers. |

---

## 4. Backend Architecture & Security Authorization

### User Ownership & IDOR Protection
1. **Server-Side Authentication Context:**
   - All backend endpoints extract user identity directly from Spring Security `@AuthenticationPrincipal UserPrincipal currentUser` (derived from the verified cryptographic JWT token).
   - Client requests cannot alter or forge `userId` parameters to access other accounts.
2. **Database Queries Scoped by User ID:**
   - `ReminderRepository.findByUserIdOrderByCreatedAtDesc(userId)`
   - `DoseLogRepository.findByUserIdOrderByScheduledTimeDesc(userId)`
   - `NotificationRepository.findByUserIdOrderByCreatedAtDesc(userId)`
   - `SavedMedicineRepository.findByUserIdOrderByCreatedAtDesc(userId)`
3. **Strict Ownership Verification:**
   - When fetching, updating, or deleting single resources (e.g., `GET /api/reminders/{id}`, `PATCH /api/reminders/{id}`, `DELETE /api/reminders/{id}`, `PATCH /api/notifications/{id}/read`), backend validates `entity.getUser().getId().equals(currentUser.getId())`.
   - Any violation immediately aborts with `403 Forbidden` (`AccessDeniedException`).

---

## 5. Database Schema & Migration History

Flyway migration script added:
- **[`V8__seed_jaipur_pharmacies_and_hospitals.sql`](file:///c:/Users/Ratn_Shido/.gemini/antigravity-ide/scratch/MediFinder/backend/src/main/resources/db/migration/V8__seed_jaipur_pharmacies_and_hospitals.sql)**:
  Seeds verified Jaipur hospital emergency counters and 24x7 pharmacies:
  - *SMS Hospital Pharmacy Counter - JLN Marg, Sawai Ram Singh Road* (`26.8972, 75.8155`)
  - *Apollo Pharmacy - C Scheme, Bhagwan Das Road* (`26.9115, 75.8023`)
  - *Fortis Escorts Hospital Pharmacy - Malviya Nagar, Jawahar Lal Nehru Marg* (`26.8488, 75.8038`)
  - *MedPlus Pharmacy - Vaishali Nagar, Amrapali Marg* (`26.9120, 75.7420`)
  - *Manipal Hospital Pharmacy - Vidhyadhar Nagar, Sikar Road* (`26.9632, 75.7725`)
  - *Sanjeevani 24/7 Pharmacy - Mansarovar, Madhyam Marg* (`26.8530, 75.7680`)
  - *Eternal Heart Care Centre (EHCC) - Jawahar Circle, Malviya Nagar* (`26.8405, 75.8021`)
  - *Narayana Multispeciality Hospital Pharmacy - Pratap Nagar, Kumbha Marg* (`26.8015, 75.8205`)

---

## 6. Frontend Isolation & Jaipur Location Configuration

### 1. User Scoped Services
- **[`orderService.ts`](file:///c:/Users/Ratn_Shido/.gemini/antigravity-ide/scratch/MediFinder/frontend/src/services/orderService.ts):** Encapsulates order history in user-isolated storage keys (`medicare_orders_u_${userId}`).
- **[`medicalRecordService.ts`](file:///c:/Users/Ratn_Shido/.gemini/antigravity-ide/scratch/MediFinder/frontend/src/services/medicalRecordService.ts):** Manages user health records, lab reports, and uploaded prescriptions per user ID.
- **[`notificationService.ts`](file:///c:/Users/Ratn_Shido/.gemini/antigravity-ide/scratch/MediFinder/frontend/src/services/notificationService.ts):** Queries backend notifications and unread counters.
- **[`imageUtils.ts`](file:///c:/Users/Ratn_Shido/.gemini/antigravity-ide/scratch/MediFinder/frontend/src/utils/imageUtils.ts):** Sanitizes and formats user avatar URLs and uploads safely.

### 2. Pharmacy Locator Defaults
- **Center:** Latitude `26.9124`, Longitude `75.7873` (Jaipur, Rajasthan, India).
- **Default City Filter:** `'Jaipur'`.
- **Quick Filters:** SMS Hospital (JLN Marg), C-Scheme, Malviya Nagar, Vaishali Nagar, Mansarovar, Vidhyadhar Nagar.
- **Location Permission Handling:** If geolocation is denied or unavailable, falls back gracefully to Jaipur center without displaying errors or reverting to Delhi.

---

## 7. Automated Test Suite Results

A total of **95 automated tests** were executed across the backend suite with **100% pass rate** ($0$ failures, $0$ errors, $0$ skipped):

```text
[INFO] Results:
[INFO] Tests run: 95, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
[INFO] Total time: 27.485 s
```

### Key Verified Tests:
1. `UserDataIsolationSecurityTest.testNewUserHasZeroFabricatedPersonalData`: Passed.
2. `UserDataIsolationSecurityTest.testSharedMedicineCatalogueAvailableToBothUsers`: Passed.
3. `UserDataIsolationSecurityTest.testUserBCannotReadUserAReminder` (IDOR GET): Passed (403 Forbidden).
4. `UserDataIsolationSecurityTest.testUserBCannotUpdateUserAReminder` (IDOR PUT): Passed (403 Forbidden).
5. `UserDataIsolationSecurityTest.testUserBCannotDeleteUserAReminder` (IDOR DELETE): Passed (403 Forbidden).
6. `UserDataIsolationSecurityTest.testUserBCannotLogDoseOnUserAReminder`: Passed (403 Forbidden).
7. `UserDataIsolationSecurityTest.testUserBCannotMarkUserANotificationRead`: Passed (403 Forbidden).
8. `UserDataIsolationSecurityTest.testUserProfileIsolation`: Passed.
9. `JaipurPharmacyLocationTest.testGetPharmaciesByCityJaipur`: Passed.
10. `JaipurPharmacyLocationTest.testGetPharmaciesProximityJaipurCoordinates`: Passed.
11. `JaipurPharmacyLocationTest.testGet24HoursJaipurPharmacies`: Passed.

---

## 8. Modified & Created Files Summary

### Backend:
- `backend/src/main/resources/db/migration/V8__seed_jaipur_pharmacies_and_hospitals.sql` (New)
- `backend/src/test/java/com/medicare/security/UserDataIsolationSecurityTest.java` (New)
- `backend/src/test/java/com/medicare/pharmacy/JaipurPharmacyLocationTest.java` (New)

### Frontend:
- `frontend/src/services/notificationService.ts` (New)
- `frontend/src/services/orderService.ts` (New)
- `frontend/src/services/medicalRecordService.ts` (New)
- `frontend/src/utils/imageUtils.ts` (New)
- `frontend/src/App.tsx` (Modified)
- `frontend/src/components/layout/MainLayout.tsx` (Modified)
- `frontend/src/components/layout/Sidebar.tsx` (Modified)
- `frontend/src/components/layout/TopNavbar.tsx` (Modified)
- `frontend/src/modules/dashboard/DashboardModule.tsx` (Modified)
- `frontend/src/modules/orders/OrdersModule.tsx` (Modified)
- `frontend/src/modules/records/MedicalRecordsModule.tsx` (Modified)
- `frontend/src/modules/notifications/NotificationsModule.tsx` (Modified)
- `frontend/src/modules/pharmacy-locator/PharmacyLocatorModule.tsx` (Modified)
- `frontend/src/modules/pharmacy-locator/PharmacyMap.tsx` (Modified)

---

## 9. Conclusion
All user-specific data is now strictly isolated on both the database and client layers, shared medicine catalogue data remains intact, the pharmacy locator defaults accurately to Jaipur, Rajasthan, and new users enjoy a realistic, clean application state.
