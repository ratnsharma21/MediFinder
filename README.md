# 🩺 MediFinder

```{=html}
<p align="center">
```
`<img src="https://img.shields.io/badge/MediFinder-Smart%20Medicine%20Platform-0A66C2?style=for-the-badge">`{=html}
`<img src="https://img.shields.io/badge/Java-Web%20Application-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white">`{=html}
`<img src="https://img.shields.io/badge/Team-5%20Members-16A34A?style=for-the-badge">`{=html}
`<img src="https://img.shields.io/badge/Reporting-12%20Weeks-7C3AED?style=for-the-badge">`{=html}
```{=html}
</p>
```
```{=html}
<p align="center">
```
`<strong>`{=html}Find medicines. Locate pharmacies. Manage medication.
Stay informed.`</strong>`{=html}`<br>`{=html} A modular Java web project
focused on medicine discovery, pharmacy location, directions, reminders,
dose logs and refill support.
```{=html}
</p>
```

------------------------------------------------------------------------

## 🌟 Project Snapshot

  -----------------------------------------------------------------------
                                      Details
  ----------------------------------- -----------------------------------
  🏷️ Project                          **MediFinder**

  👥 Team                             **5 Members**

  🧩 Modules                          **10**

  🗓️ Project Window                   **06 July 2026 → 06 October 2026**

  📊 Reporting                        **90 daily entries + 12 weekly
                                      reports**

  🔀 Collaboration                    **One shared GitHub repository +
                                      feature branches**

  💻 Project Type                     **Java-based Web Application**
  -----------------------------------------------------------------------

> The source project plan defines 5-member ownership, 10 modules, GitHub
> reporting and evidence-based daily/weekly reporting.
> fileciteturn2file0L13-L44

------------------------------------------------------------------------

# 🚀 What is MediFinder?

**MediFinder** is a team-built web application concept that brings
medicine and pharmacy related workflows into one place.

``` text
                    ┌─────────────────────┐
                    │     MEDIFINDER      │
                    │ Medicine Assistance │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
  💊 Medicine             📍 Pharmacy             ⏰ Medication
    Discovery              Locator                 Support
        │                      │                      │
 Search • Details       Location • Directions   Reminders • Logs
 Price Information      PIN Fallback             Refill Alerts
```

### 🎯 Core Problem

The project brings together workflows for:

-   medicine catalogue/search
-   medicine details and price information
-   nearby pharmacy discovery
-   location/PIN search
-   directions and location fallback
-   medication reminders
-   taken/missed/skipped dose logs
-   refill threshold alerts

------------------------------------------------------------------------

# 🧩 10-Module Architecture

   Module   Feature                                 Owner
  --------- --------------------------------------- -------------------
   **M1**   Authentication & Accounts               Ratn Kumar Sharma
   **M2**   API / Configuration / Integration       Ratn Kumar Sharma
   **M3**   Medicine Catalogue & Search             Vansh Oberoi
   **M4**   Medicine Details & Price Provenance     Vansh Oberoi
   **M5**   Pharmacy Locator                        Sumit Kumar Saini
   **M6**   Directions & Location Fallback          Sumit Kumar Saini
   **M7**   Medicine Reminders                      Sameer Achara
   **M8**   Dose Logs & Refill Alerts               Sameer Achara
   **M9**   Dashboard / Profile / Settings / Help   Sachin Kumawat
   **M10**  QA / Documentation / Demo               Sachin Kumawat

The original allocation assigns two modules to each member and defines
responsibilities for backend, medicine store, locator, reminders, and
UI/QA/documentation. fileciteturn2file0L13-L35

------------------------------------------------------------------------

# 👥 Team

   \#  Member                  Role                        Modules
  ---- ----------------------- --------------------------- ---------
   01  **Ratn Kumar Sharma**   Java Backend / Lead         M1, M2
   02  **Vansh Oberoi**        Medicine Store              M3, M4
   03  **Sumit Kumar Saini**   Pharmacy Locator            M5, M6
   04  **Sameer Achara**       Reminders / Notifications   M7, M8
   05  **Sachin Kumawat**      UI/UX, QA & Documentation   M9, M10

------------------------------------------------------------------------

# 🏗️ Architecture

``` text
┌─────────────────────────────────────────────┐
│                 USER / BROWSER              │
└──────────────────────┬──────────────────────┘
                       ▼
┌─────────────────────────────────────────────┐
│              UI / JSP / Frontend            │
│ Forms • Search • Dashboard • Results • UI   │
└──────────────────────┬──────────────────────┘
                       ▼
┌─────────────────────────────────────────────┐
│             JAVA WEB / SERVLETS             │
│ Auth • Search • Locator • Reminders • QA    │
└──────────────────────┬──────────────────────┘
                       ▼
┌─────────────────────────────────────────────┐
│          DATABASE / INTEGRATION             │
│ Accounts • Medicines • Pharmacies • Logs    │
└─────────────────────────────────────────────┘
```

## 🛠️ Technology Direction

  Layer             Technology
  ----------------- --------------------------------------
  Language          Java
  Web               HTML, CSS, JSP
  Backend           Java Servlets / Java APIs
  Database Access   JDBC
  Database          MySQL
  Server            Apache Tomcat
  Client-side       JavaScript where required
  Version Control   Git + GitHub
  Testing           Functional, Integration & Regression

------------------------------------------------------------------------

# 🔎 Module Highlights

### 🔐 M1 + M2 --- Backend Foundation

Authentication, accounts, APIs, configuration, authorization and
integration.

### 💊 M3 + M4 --- Medicine Store

Catalogue/search, filters, medicine details, manufacturer/strength/pack
and price provenance.

### 📍 M5 + M6 --- Pharmacy & Location

Nearby pharmacy list/map, address/contact, location/PIN search,
permission handling, manual fallback and directions.

### ⏰ M7 + M8 --- Medication Support

Reminder CRUD, schedules, repeat rules, taken/missed/skipped logs,
refill thresholds and notification limitations.

### 🎨 M9 + M10 --- UI / QA / Documentation

Dashboard/profile/settings/help, testing checklists, bug reports,
screenshots, README and demo.

------------------------------------------------------------------------

# 📅 12-WEEK DEVELOPMENT JOURNEY

## 🟦 WEEK 01 --- Kickoff & Problem Definition

**Phase:** `DISCOVERY`

-   Team formation and ownership allocation
-   Problem statement discussion
-   Project scope
-   Prototype review
-   Initial GitHub setup

**Deliverable:** Shared project direction and module ownership.

------------------------------------------------------------------------

## 🟦 WEEK 02 --- Requirements & SRS

**Phase:** `REQUIREMENTS`

-   SRS preparation
-   User stories
-   Acceptance criteria
-   Functional requirements
-   Non-functional requirements
-   Data-source research

**Deliverable:** Clear requirement baseline.

------------------------------------------------------------------------

## 🟦 WEEK 03 --- UML & System Design

**Phase:** `ARCHITECTURE`

-   Use-case diagrams
-   Activity diagrams
-   Class diagrams
-   Sequence diagrams
-   Navigation map
-   Module interaction planning

**Deliverable:** Common system design.

------------------------------------------------------------------------

## 🟦 WEEK 04 --- Database, APIs & UI Foundation

**Phase:** `DESIGN`

-   Database schema
-   Entity relationships
-   API contracts
-   UI mockups
-   Shared layout
-   Module skeletons

**Deliverable:** Development-ready technical foundation.

------------------------------------------------------------------------

## 🟦 WEEK 05 --- Java Web Foundation

**Phase:** `SETUP`

-   Java web project setup
-   Server/configuration setup
-   Database connectivity
-   Shared layout
-   Authentication foundation
-   Module skeleton implementation

**Deliverable:** Working development environment.

------------------------------------------------------------------------

## 🟦 WEEK 06 --- Core Feature Development

**Phase:** `DEVELOPMENT`

-   Registration/login
-   Medicine search/detail workflow
-   Pharmacy locator prototype
-   Reminder CRUD
-   Validation
-   Initial integration

**Deliverable:** First executable core workflows.

------------------------------------------------------------------------

## 🟦 WEEK 07 --- Module Integration

**Phase:** `INTEGRATION`

-   UI/API integration
-   Medicine filters
-   PIN fallback
-   Dose logs
-   Authentication integration
-   Shared navigation

**Deliverable:** Modules begin behaving as one system.

------------------------------------------------------------------------

## 🟦 WEEK 08 --- Advanced Features

**Phase:** `FEATURE EXPANSION`

-   Profile/settings/help
-   Catalogue edge cases
-   Directions
-   Location fallback
-   Refill rules
-   Reminder behaviour
-   Validation improvements

**Deliverable:** Major module requirements implemented.

------------------------------------------------------------------------

## 🟦 WEEK 09 --- End-to-End Testing

**Phase:** `TESTING`

-   Module integration
-   Search testing
-   Locator testing
-   Reminder testing
-   Dose/refill testing
-   No-result states
-   Error-state testing

**Deliverable:** Integration defects identified and fixed/documented.

------------------------------------------------------------------------

## 🟦 WEEK 10 --- Security, Validation & UI Refinement

**Phase:** `STABILIZATION`

-   Authentication/authorization checks
-   Input validation
-   Error handling
-   Responsive UI
-   Database/query improvements
-   Bug fixing
-   Regression testing

**Deliverable:** Stable and consistent application.

------------------------------------------------------------------------

## 🟦 WEEK 11 --- QA, Evidence & Documentation

**Phase:** `QUALITY`

-   System test cases
-   Test evidence
-   Screenshots
-   Bug reports
-   Code cleanup
-   README updates
-   GitHub review

**Deliverable:** Review-ready project with evidence.

------------------------------------------------------------------------

## 🟦 WEEK 12 --- Finalization & Submission

**Phase:** `RELEASE`

-   User acceptance testing
-   Final bug fixes
-   End-to-end regression
-   Final documentation
-   Demo preparation
-   Repository cleanup
-   Contribution evidence

**Deliverable:** Submission-ready MediFinder.

------------------------------------------------------------------------

# 🧪 Testing Pipeline

``` text
Requirement
     ↓
Implementation
     ↓
Module Test
     ↓
Integration Test
     ↓
Edge Case
     ↓
Bug / Blocker
     ↓
Fix
     ↓
Retest
     ↓
Regression
     ↓
Evidence
```

### 🔍 Test Coverage

-   Authentication & authorization
-   Empty/invalid inputs
-   Medicine search/no-result states
-   Pharmacy location permission
-   Manual PIN fallback
-   Directions
-   Reminder CRUD
-   Taken/Missed/Skipped logs
-   Refill thresholds
-   UI consistency
-   Database persistence
-   Cross-module integration

------------------------------------------------------------------------

# 🐛 Issue Resolution

> **Only real project issues should be reported as actual incidents.**

The reporting workflow is:

``` text
REPRODUCE
   ↓
CAPTURE EVIDENCE
   ↓
ROOT CAUSE
   ↓
TEAM DISCUSSION
   ↓
FIX
   ↓
RETEST
   ↓
PEER REVIEW
   ↓
COMMIT / PR
```

The source plan explicitly recommends recording only actual errors,
actual workdays and evidence-backed fixes.
fileciteturn2file0L103-L123

Possible issue categories include:

-   MySQL/JDBC connection issues
-   Medicine search returning incorrect/empty results
-   GPS permission denial
-   Reminder time parsing/refresh problems
-   Merge conflicts affecting shared UI

------------------------------------------------------------------------

# 🔀 GitHub Collaboration

The team uses **one shared repository** with separate feature branches.
Meaningful commits and peer-reviewed changes are preferred.
fileciteturn2file0L37-L44

``` text
main
│
├── feature/member-1-backend
├── feature/member-2-medicine
├── feature/member-3-locator
├── feature/member-4-reminders
└── feature/member-5-ui-qa
```

### 🔗 Repository

`[GITHUB_REPOSITORY_LINK]`

> The same repository URL can be used in every weekly report. Where
> available, add that week's **actual commit/PR links** as supporting
> evidence; the source reporting plan specifically asks for repository
> URL plus weekly PR/commit links. fileciteturn2file0L90-L94

------------------------------------------------------------------------

# 📊 Weekly Scorecard

  Criterion                             Points
  ---------------------------------- ---------
  ✅ Assigned tasks completed               40
  🧪 Quality & testing                      20
  🔀 GitHub evidence                        15
  📝 Documentation/reporting                10
  🤝 Team discussion/collaboration          10
  🔜 Next-week plan                          5
  **TOTAL**                            **100**

This follows the 100-point weekly scoring structure in the supplied
project plan. fileciteturn2file0L72-L87

------------------------------------------------------------------------

# 📸 Evidence Checklist

-   [ ] GitHub commit
-   [ ] Pull Request
-   [ ] Test case
-   [ ] Screenshot
-   [ ] Database/result evidence
-   [ ] Error/fix evidence
-   [ ] Documentation update
-   [ ] Team review/discussion record

------------------------------------------------------------------------

# 🌱 Future Scope

-   📱 Dedicated mobile application
-   🔔 Advanced notification scheduling
-   🗺️ Improved map integration
-   💊 Medicine availability synchronization
-   👨‍⚕️ Healthcare integration
-   📈 Medication adherence analytics
-   🔐 Stronger security
-   ☁️ Cloud deployment
-   🤖 Intelligent medicine-search assistance

------------------------------------------------------------------------

# 📈 Project Evolution

``` text
IDEA
  ↓
PROBLEM
  ↓
REQUIREMENTS
  ↓
UML + ARCHITECTURE
  ↓
DATABASE + UI
  ↓
JAVA WEB FOUNDATION
  ↓
MODULE DEVELOPMENT
  ↓
INTEGRATION
  ↓
TESTING
  ↓
DOCUMENTATION
  ↓
FINAL DEMO 🚀
```

------------------------------------------------------------------------

# 🏆 Final Goals

-   ✔️ Clear modular ownership
-   ✔️ Java web application foundation
-   ✔️ Integrated medicine and pharmacy workflows
-   ✔️ Location and fallback handling
-   ✔️ Reminder and dose-log workflows
-   ✔️ Refill warning logic
-   ✔️ Tested error and edge states
-   ✔️ Organized GitHub collaboration
-   ✔️ Evidence-backed reporting
-   ✔️ Professional documentation

------------------------------------------------------------------------

# 👨‍💻 Team Contribution

  -----------------------------------------------------------------------
  Member                  Modules                 Contribution
  ----------------------- ----------------------- -----------------------
  **Ratn Kumar Sharma**   M1, M2                  Backend,
                                                  authentication, APIs,
                                                  integration

  **Vansh Oberoi**        M3, M4                  Medicine catalogue,
                                                  search, details,
                                                  pricing

  **Sumit Kumar Saini**   M5, M6                  Pharmacy locator,
                                                  fallback, directions

  **Sameer Achara**       M7, M8                  Reminders, dose logs,
                                                  refill alerts

  **Sachin Kumawat**      M9, M10                 UI/UX, QA,
                                                  documentation, demo
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 📌 Project Status

```{=html}
<p align="center">
```
`<img src="https://img.shields.io/badge/Status-In%20Development-F59E0B?style=for-the-badge">`{=html}
`<img src="https://img.shields.io/badge/Modules-10-2563EB?style=for-the-badge">`{=html}
`<img src="https://img.shields.io/badge/Team-5-16A34A?style=for-the-badge">`{=html}
`<img src="https://img.shields.io/badge/Reports-12%20Weeks-7C3AED?style=for-the-badge">`{=html}
```{=html}
</p>
```

------------------------------------------------------------------------

```{=html}
<p align="center">
```
**Ratn Kumar Sharma • Vansh Oberoi • Sumit Kumar Saini • Sameer Achara •
Sachin Kumawat**

`<br>`{=html}`<br>`{=html}

`PLAN → BUILD → TEST → REVIEW → INTEGRATE → IMPROVE`

### 🚀 MediFinder

**Making medicine access a little simpler, one module at a time.**

```{=html}
</p>
```

------------------------------------------------------------------------

> **Academic Project --- 2026**
>
> Built as a collaborative 5-member Java web project with module
> ownership, GitHub-based development and evidence-backed reporting.
