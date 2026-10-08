# MediCare / MediFinder - System Requirements & Scope

**Project**: MediCare / MediFinder  
**Role**: Ratn (Backend Lead, Repository Foundation & Database Engineer)  
**Document Version**: 1.0.0  

---

## 1. Executive Summary

MediFinder is a customer-focused healthcare web application designed to simplify medicine discovery, compare online retailer purchasing options, locate nearby physical pharmacies with GPS support, and maintain personal medication adherence reminders.

---

## 2. Core Functional Requirements by Module

### A. Authentication & User Profile Management (Member 1 - Ratn)
- **User Registration**: Secure account creation with username, email, BCrypt-hashed password, and full name.
- **User Login**: JWT-based authentication returning a 256-bit signed Bearer token with 24-hour expiration.
- **Profile Management**: Maintain personal medical profiles (emergency contact, blood group, address, date of birth).
- **Preference Settings**: Manage notification preferences (email, in-app, sound effects, dark mode).
- **Data Isolation**: Strict ownership validation preventing unauthorized cross-user access to private data.

### B. Medicine Catalogue & Search (Member 2 - Vansh)
- **Catalogue Exploration**: Paginated listing of prescription and OTC medications with formulation details.
- **Multi-attribute Search**: Search by brand name, generic formulation, category, or composition.
- **Retailer Price Comparison**: Compare verified prices across partner online stores (Tata 1mg, PharmEasy, Netmeds, Apollo Pharmacy).
- **Medicine Bookmarks**: User ability to save medicines to personal watchlists with notes.

### C. Pharmacy Locator & Maps (Member 3 - Sumit)
- **Store Directory**: Search licensed medical stores by city, PIN code, and 24x7 emergency status.
- **Proximity Search**: Geolocation search using Haversine calculation to find stores within a given radius.
- **Store Details**: Operating hours, contact numbers, address, and Google Maps direct navigation.

### D. Adherence Reminders & Dose Logs (Member 4 - Sameer)
- **Medication Schedules**: Create customizable dosage reminders with frequency, timing, and start/end dates.
- **Adherence Logging**: Record dose intake status (`TAKEN`, `MISSED`, `SKIPPED`) with timestamps and user notes.
- **Adherence History**: Review historical compliance to assist personal health monitoring.

### E. Dashboard UI & Profile Settings (Member 5 - Sachin)
- **Unified Portal**: Centralized dashboard showcasing recent schedules, quick action links, and system stats.
- **Visual Design**: Cohesive medical teal and sapphire blue aesthetic with glassmorphism and responsiveness.

---

## 3. MVP Limitations & Non-Functional Boundaries

1. **Medical Advice Disclaimer**: MediFinder is an informational and scheduling tool; it does not provide automated diagnoses or prescribe pharmaceuticals.
2. **Stock Guarantee**: Online listings and pharmacy maps do not guarantee live, real-time inventory; users are advised to contact pharmacies directly.
3. **Purchasing Workflow**: In the MVP, online purchasing is routed via verified retailer URLs rather than internal checkout and payment gateway processing.
4. **Prescription Compliance**: Prescription drugs (Schedule H / Rx) are clearly marked with warning badges.
