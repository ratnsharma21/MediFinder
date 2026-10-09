<div align="center">

<a href="https://github.com/ratnsharma21/MediFinder">
  <img src="https://img.shields.io/badge/MediFinder-Find%20·%20Reach%20·%20Remember-0D9488?style=for-the-badge&labelColor=0B1120" alt="MediFinder">
</a>

<h1>MediFinder</h1>

<p><strong>Find the medicine. Reach the pharmacy. Stay on the dose.</strong></p>

<p>
A Java web application that unifies <strong>medicine search</strong>, <strong>nearby pharmacy access</strong>,
and <strong>personal medication follow-up</strong> into one signed-in workflow — with an honest PIN fallback
when location is denied and reminder behaviour that respects browser notification limits.
</p>

<p>
  <img src="https://img.shields.io/badge/Java-Backend%20%26%20Auth-EA580C?style=flat-square&labelColor=0B1120&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/MySQL-Persistence-2563EB?style=flat-square&labelColor=0B1120&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/JDBC-Data%20Access-6366F1?style=flat-square&labelColor=0B1120" alt="JDBC">
  <img src="https://img.shields.io/badge/HTML%2FCSS-Prototype%20UI-0EA5E9?style=flat-square&labelColor=0B1120&logo=html5&logoColor=white" alt="HTML/CSS">
</p>

<p>
  <img src="https://img.shields.io/badge/Modules-10-0D9488?style=flat-square&labelColor=0B1120" alt="10 modules">
  <img src="https://img.shields.io/badge/Team-5%20Members-4F46E5?style=flat-square&labelColor=0B1120" alt="5 members">
  <img src="https://img.shields.io/badge/Timeline-06_Jul_→_06_Oct_2026-BE123C?style=flat-square&labelColor=0B1120" alt="Timeline">
  <img src="https://img.shields.io/badge/Status-Academic%20Build-64748B?style=flat-square&labelColor=0B1120" alt="Status">
</p>

<p>
  <a href="https://github.com/ratnsharma21/MediFinder"><strong>📦 Repository</strong></a>
  &nbsp;·&nbsp;
  <a href="#-overview"><strong>Overview</strong></a>
  &nbsp;·&nbsp;
  <a href="#-architecture"><strong>Architecture</strong></a>
  &nbsp;·&nbsp;
  <a href="#-12-week-development-log"><strong>12-Week Log</strong></a>
  &nbsp;·&nbsp;
  <a href="#-team"><strong>Team</strong></a>
</p>

<sub><em>Demo URL: not published yet · Deployment URL: not published yet</em></sub>

</div>

<p align="center">
  <a href="#-overview">Overview</a> ·
  <a href="#-the-problem">Problem</a> ·
  <a href="#-how-it-works">How it works</a> ·
  <a href="#-features">Features</a> ·
  <a href="#-modules">Modules</a> ·
  <a href="#-architecture">Architecture</a> ·
  <a href="#-user-journey">Journey</a> ·
  <a href="#-team">Team</a> ·
  <a href="#-12-week-development-log">Weeks</a> ·
  <a href="#-github-workflow">GitHub</a> ·
  <a href="#-testing--quality">Quality</a> ·
  <a href="#-screenshots">Screenshots</a> ·
  <a href="#-getting-started">Setup</a>
</p>

📌 Overview

<table>
  <tr>
    <td width="55%" valign="top">

What it is
A five-member academic Java web system for medicine catalogue search, pharmacy locator with PIN fallback, dose reminders and refill alerts, wrapped in a guided UI with QA evidence.

Why it exists
Medicine lookup, nearby pharmacy access, and medication follow-up are typically split across disconnected tools — and they fail together the moment location permission or notifications are blocked.

What it is not
Not a pharmacy marketplace. Not a clinical diagnosis engine. Not a guaranteed push-notification service.

</td>
<td width="45%" valign="top">

Attribute

Value

Type

Java web application

Duration

06 Jul 2026 → 06 Oct 2026

Team

5 members

Modules

10 (M1 – M10)

Data

MySQL via JDBC

Access

Account-based (M1)

Repository

ratnsharma21/MediFinder

Status

Academic build — evidence-driven

</td>

  </tr>
</table>

The core loop is simple and intentional: search → details → locate → remind → log.

🎯 The Problem

People managing everyday medication hit three independent failures — often on the same day.

<table>
<tr>
<td width="33%" valign="top" align="center">

<img src="https://img.icons8.com/fluency/56/pills.png" alt="Medicine data" height="48">

Fragmented medicine data

Brand vs generic, strength, pack, manufacturer, MRP vs seller price, source and last-updated time rarely live in a single view. Case-sensitive or inconsistent search returns empty or wrong results.

</td>
<td width="33%" valign="top" align="center">

<img src="https://img.icons8.com/fluency/56/place-marker.png" alt="Location" height="48">

Locators that assume GPS

A nearby-pharmacy screen that only works with coordinates breaks when the browser denies location. Users need a PIN / city fallback, a clear denied state, and directions that do not pretend GPS succeeded.

</td>
<td width="33%" valign="top" align="center">

<img src="https://img.icons8.com/fluency/56/alarm.png" alt="Reminders" height="48">

Reminders that ignore reality

Doses are taken, missed or skipped. Refills have thresholds. Browsers restrict background notifications. A reminder that shows a different time after refresh is worse than no reminder.

</td>
</tr>
</table>

💡 How it works

Ten owned modules behind one shared repository and one user session.

Sign in
  →  Search the catalogue
  →  Open details & price provenance
  →  Find a nearby pharmacy
  →  Use GPS — or PIN / city fallback
  →  Open directions
  →  Set a reminder
  →  Log taken / missed / skipped
  →  Follow refill warnings
  →  Dashboard · profile · settings · help

Layer

What the user gets

Identity

Secure login, authorization, consistent API errors, account-scoped records

Discovery

Search / filter medicines; manufacturer, strength, pack, MRP vs seller price, source, update time

Access

Map / list pharmacies, address & contact, permission handling, manual PIN fallback, directions

Adherence

Reminder CRUD, schedules, dose logs, refill warnings, notification-limitation messaging

Experience

Prototype-faithful UI, dashboard, profile, settings, help, QA evidence and demo support

flowchart LR
  A[User] --> B[M1 · Auth]
  B --> C[M3–M4 · Medicine Store]
  C --> D[M5–M6 · Pharmacy Locator]
  D --> E[M7–M8 · Reminders]
  E --> F[M9–M10 · Shell · QA]
  B -.-> F

✨ Features

<table>
<tr>
<td width="33%" valign="top">

🔐 Authentication

Registration, login, authorization on module pages, and shared API error handling so every other module has a reliable user context.

</td>
<td width="33%" valign="top">

🔎 Medicine discovery

Catalogue search and filters across brand / generic naming, with explicit empty, loading and error states — not silent failure.

</td>
<td width="33%" valign="top">

💊 Price provenance

Detail views surface manufacturer, strength, pack, MRP vs seller price, source, and last-updated time.

</td>
</tr>
<tr>
<td width="33%" valign="top">

📍 Pharmacy locator

Nearby pharmacy search as map / list, plus address and contact for a selected pharmacy.

</td>
<td width="33%" valign="top">

🧭 Directions & fallback

Location permission is a first-class state. Denied / unavailable GPS → manual PIN / city, denied copy, direction links, honest no-result handling.

</td>
<td width="33%" valign="top">

⏰ Medicine reminders

Create, edit and delete schedules with dose instructions — persisted per account.

</td>
</tr>
<tr>
<td width="33%" valign="top">

📝 Dose tracking

Log taken / missed / skipped and keep history on the logged-in user.

</td>
<td width="33%" valign="top">

📦 Refill alerts

Threshold-based refill warnings, with honest copy about browser notification limits.

</td>
<td width="33%" valign="top">

🧪 Profile & QA

Dashboard, profile, settings, help, guided UI, test checklists, bug reports, screenshots and README.

</td>
</tr>
</table>

🧩 Modules

Ten modules. Five owners. No overlapping claims.

ID

Module

Owner

Purpose

M1

Authentication & Accounts

Ratn Kumar Sharma

Java APIs, secure login, authorization, common errors

M2

API / Configuration / Integration

Ratn Kumar Sharma

API contracts, configuration, integration, code review

M3

Medicine Catalogue & Search

Vansh Oberoi

Search / filter over the medicine store

M4

Medicine Details & Price Provenance

Vansh Oberoi

Details, manufacturer / strength / pack, MRP vs seller price, source & update time

M5

Pharmacy Locator

Sumit Kumar Saini

Nearby pharmacy search, map / list, address / contact

M6

Directions & Location Fallback

Sumit Kumar Saini

Permission handling, manual PIN fallback, directions, no-result states

M7

Medicine Reminders

Sameer Achara

Create / edit / delete schedules and reminder forms

M8

Dose Logs & Refill Alerts

Sameer Achara

Taken / missed / skipped logs, refill warnings, notification limitations

M9

Dashboard / Profile / Settings / Help

Sachin Kumawat

Prototype style, guided UI, account-facing pages

M10

QA / Documentation / Demo

Sachin Kumawat

Test checklists, bug reports, screenshots, README, report

<details>
<summary><strong>📋 Module responsibility map (by owner)</strong></summary>

<br>

Owner

Modules

Responsibility

Ratn Kumar Sharma

M1 · M2

Java APIs, secure login, authorization, common errors, code reviews and integration

Vansh Oberoi

M3 · M4

Search / filter, medicine details, manufacturer / strength / pack, MRP vs seller price, source and update time

Sumit Kumar Saini

M5 · M6

Nearby pharmacy search, map / list, address / contact, permission handling and manual PIN fallback

Sameer Achara

M7 · M8

Create / edit / delete schedules, taken / missed / skipped logs, refill warnings and notification limitations

Sachin Kumawat

M9 · M10

Preserve prototype style, guided UI support, test checklists, bug reports, screenshots, README and report

</details>

🏗️ Architecture

Conceptual architecture — Java APIs, MySQL, browser geolocation, browser notifications. Nothing else is drawn as if it already exists.

flowchart TB
  U[Browser]

  subgraph Presentation
    UI[Dashboard · Catalogue · Locator · Reminders · Help]
  end

  subgraph Application
    API[Java APIs]
    AUTH[M1 · Authentication]
    CFG[M2 · Config & integration]
  end

  subgraph Domain
    CAT[M3–M4 · Medicine store]
    LOC[M5–M6 · Pharmacy locator]
    REM[M7–M8 · Reminders & logs]
    SHELL[M9–M10 · UI / QA]
  end

  DB[(MySQL)]
  GEO[Geolocation / PIN fallback]
  NTF[Notifications — limited]

  U --> UI --> API
  API --> AUTH
  API --> CFG
  AUTH --> CAT
  AUTH --> LOC
  AUTH --> REM
  CFG --> CAT
  CFG --> LOC
  CFG --> REM
  CAT --> DB
  LOC --> DB
  REM --> DB
  LOC --> GEO
  REM --> NTF
  SHELL --> UI

Layer

Responsibility

Presentation

Prototype-aligned screens for search, details, locator, reminders, dashboard, profile, settings, help

Application

Java APIs, secure login, authorization, shared configuration, integration seams

Domain

Catalogue, price provenance, locator, fallback, reminders, dose logs, refill alerts

Data

MySQL through JDBC

Browser services

Geolocation and notifications are client capabilities, not guaranteed server features

🔒 Secrets, local server files and machine-specific JDBC URLs stay out of Git.

🔄 User journey

flowchart LR
  A[Login] --> B[Search]
  B --> C[Details / price]
  C --> D[Find pharmacy]
  D --> E{GPS allowed?}
  E -->|Yes| F[Nearby results]
  E -->|Denied| G[PIN / city]
  F --> H[Directions]
  G --> H
  H --> I[Set reminder]
  I --> J[Log dose]
  J --> K[Refill alert]

Sign in through M1 so later records stay account-scoped.

Search / filter the catalogue (M3), then open details with price provenance (M4).

Locate a pharmacy (M5). If permission is denied, continue through M6.

Create a reminder (M7), log taken / missed / skipped, follow refill warnings (M8).

Use dashboard, profile, settings and help (M9) under the same visual system (M10).

👥 Team

<p align="center"><em>One shared repository · one feature branch per member · review before merge to <code>main</code></em></p>

<table>
  <tr>
    <td align="center" width="20%">
      <img src="https://ui-avatars.com/api/?name=Ratn+Kumar+Sharma&background=0F766E&color=F0FDFA&size=128&bold=true&font-size=0.40" width="72" alt="Ratn Kumar Sharma"><br>
      <strong>Ratn Kumar Sharma</strong><br>
      <sub>Java Backend / Lead</sub><br><br>
      <code>M1</code> Auth<br>
      <code>M2</code> API &amp; config<br><br>
      <sub>APIs, secure login, authorization, common errors, reviews, integration</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://ui-avatars.com/api/?name=Vansh+Oberoi&background=1D4ED8&color=EFF6FF&size=128&bold=true&font-size=0.40" width="72" alt="Vansh Oberoi"><br>
      <strong>Vansh Oberoi</strong><br>
      <sub>Medicine Store</sub><br><br>
      <code>M3</code> Catalogue<br>
      <code>M4</code> Price provenance<br><br>
      <sub>Search / filter, manufacturer, strength, pack, MRP vs seller price, source, update time</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://ui-avatars.com/api/?name=Sumit+Kumar+Saini&background=6D28D9&color=F5F3FF&size=128&bold=true&font-size=0.40" width="72" alt="Sumit Kumar Saini"><br>
      <strong>Sumit Kumar Saini</strong><br>
      <sub>Pharmacy Locator</sub><br><br>
      <code>M5</code> Locator<br>
      <code>M6</code> Fallback<br><br>
      <sub>Nearby search, map / list, address / contact, GPS permission, manual PIN fallback</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://ui-avatars.com/api/?name=Sameer+Achara&background=C2410C&color=FFF7ED&size=128&bold=true&font-size=0.40" width="72" alt="Sameer Achara"><br>
      <strong>Sameer Achara</strong><br>
      <sub>Reminders / Notifications</sub><br><br>
      <code>M7</code> Reminders<br>
      <code>M8</code> Logs &amp; refills<br><br>
      <sub>Schedule CRUD, taken / missed / skipped logs, refill warnings, notification limitations</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://ui-avatars.com/api/?name=Sachin+Kumawat&background=BE123C&color=FFF1F2&size=128&bold=true&font-size=0.40" width="72" alt="Sachin Kumawat"><br>
      <strong>Sachin Kumawat</strong><br>
      <sub>UI / UX, QA &amp; Docs</sub><br><br>
      <code>M9</code> Shell<br>
      <code>M10</code> QA &amp; docs<br><br>
      <sub>Prototype style, guided UI, checklists, bug reports, screenshots, README</sub>
    </td>
  </tr>
</table>

Sameer Achara owns only M7 and M8. Sachin Kumawat leads guided UI, QA evidence and documentation.

🗓️ 12-Week Development Log

Academic window: 06 July 2026 → 06 October 2026.

Source planning listed additional late beats (release candidate, regression, final demo). They are folded into Week 12, not stretched into extra weeks. College portal numbering wins if it differs.

Week

Dates

Phase

Focus

1

06 – 12 Jul

Foundation

Team, scope, abstract, prototype review

2

13 – 19 Jul

Requirements

SRS, stories, acceptance criteria

3

20 – 26 Jul

Design

Use-case / activity / class / ER, navigation

4

27 Jul – 02 Aug

Contracts

Schema, API contracts, UI mock-ups

5

03 – 09 Aug

Skeleton

Shared layout, auth foundation, module frames

6

10 – 16 Aug

Slices

Login, search / detail, locator prototype, reminder CRUD

7

17 – 23 Aug

Depth

Filters, PIN fallback, dose logs

8

24 – 30 Aug

Completeness

Settings, catalogue edges, directions, refill rules

9

31 Aug – 06 Sep

Integration

Cross-module journey, end-to-end tests

10

07 – 13 Sep

Hardening

Security, validation, responsive UI, error states

11

14 – 20 Sep

Evidence

System tests, screenshots, documentation

12

21 Sep – 06 Oct

Release

UAT, fixes, candidate, demo, handover

timeline
  title MediFinder — 12 weeks
  section Shape
    Week 1 Foundation : Team and scope
    Week 2 Requirements : SRS and stories
    Week 3 Design : UML and ER
    Week 4 Contracts : Schema and APIs
  section Build
    Week 5 Skeleton : Layout and auth
    Week 6 Slices : First working paths
    Week 7 Depth : Filters and fallback
    Week 8 Completeness : Directions and refills
  section Prove
    Week 9 Integration : End-to-end
    Week 10 Hardening : Security and errors
    Week 11 Evidence : Tests and docs
    Week 12 Release : UAT and handover

<details>
<summary><strong>Week 1 — Foundation · 06 – 12 Jul 2026</strong></summary>

<br>

Objective. Form the five-member team, freeze module ownership, write the project abstract, and review the prototype so later weeks do not argue about what MediFinder is.

A 10-module Java project fails when ownership is fuzzy. This week makes M1–M10 named, visible and bounded. No feature code is claimed.

Area

Work this week

M1–M2

Confirm lead role: APIs, auth, integration, review protocol

M3–M4

Confirm catalogue vs price-provenance boundary

M5–M6

Confirm nearby search vs GPS-denied fallback as two modules

M7–M8

Confirm reminder CRUD vs dose logs / refill alerts as two modules

M9–M10

Confirm prototype-style ownership, QA and documentation lane

Daily progress

Date

Activity

Outcome

06 Jul 2026

Team discussion — availability, interests, academic load

Five-member team agreed in principle

07 Jul 2026

Module ownership freeze

M1–M10 mapped to the five names above

08 Jul 2026

Problem shortlisting

Medicine search + pharmacy access + adherence selected

09 Jul 2026

Problem research

GPS-denied locators and notification limits recorded as constraints

10 Jul 2026

Solution sketch

One-session Java web workflow drafted

11 Jul 2026

Guide and repository rules

Shared-repo + feature-branch-per-member rule written down

12 Jul 2026

Abstract and prototype review

Initial abstract prepared; prototype intent reviewed

Problems faced

Balancing ten modules across five people without overlapping claims.

Keeping marketplace, diagnosis and guaranteed push out of scope.

Agreeing that GPS-denied is a designed path, not a later patch.

Outcomes

Deliverable

Status

Team and module split

✅ Done

Project abstract

✅ Done

Prototype review

✅ Done

Shared-repo agreement

✅ Done

SRS

🟡 Planned — Week 2

Next week. SRS, user stories, acceptance criteria, data-source research.

</details>

<details>
<summary><strong>Week 2 — Requirements · 13 – 19 Jul 2026</strong></summary>

<br>

Objective. Turn the problem into rules a Java API can implement: SRS, user stories, acceptance criteria and data-source research.

GPS-denied, empty search and notification limits are written as accepted behaviour, not stretch goals.

Area

Work this week

M1–M2

Auth stories: register, login, session, unauthorized access, common API errors

M3–M4

Search / filter stories; detail fields including MRP vs seller price, source, update time

M5–M6

Nearby list / map; address / contact; permission denied as a first-class story

M7–M8

Reminder CRUD; taken / missed / skipped; refill threshold; notification limits

M9–M10

Dashboard / profile / settings / help stories; evidence format for later QA

Daily progress

Date

Activity

Outcome

13 Jul 2026

Actor and workflow pass

Signed-in user and administrator paths listed

14 Jul 2026

Store requirements

Search, filter and provenance fields captured

15 Jul 2026

Locator requirements

GPS-on, GPS-denied, PIN / city, directions, no-result

16 Jul 2026

Reminder requirements

CRUD, schedules, dose states, refill threshold, notification limits

17 Jul 2026

Non-functional and security notes

Session, validation, secrets-out-of-Git

18 Jul 2026

Acceptance criteria

Stories written so they can be tested later

19 Jul 2026

SRS review

SRS packed for design week

Outcomes

Deliverable

Status

SRS

✅ Done

User stories and acceptance criteria

✅ Done

Data-source research

✅ Done

Honest scope cuts

✅ Done

UML

🟡 Planned — Week 3

Next week. Use-case, activity, class and ER diagrams, plus a navigation map.

</details>

<details>
<summary><strong>Week 3 — Design · 20 – 26 Jul 2026</strong></summary>

<br>

Objective. Draw users, flows, entities and navigation before anyone writes schema-conflicting code.

Area

Work this week

M1–M2

Auth use cases; session as a shared actor on every protected page

M3–M4

Search → detail activity; provenance fields on the class / ER model

M5–M6

Locate → permission → results or PIN fallback → directions / no-result

M7–M8

Reminder → schedule → dose log → refill alert sequence

M9–M10

Navigation map: dashboard, profile, settings, help as chrome around modules

Daily progress

Date

Activity

Outcome

20 Jul 2026

Use-case diagram

User and administrator mapped to M1–M10

21 Jul 2026

Activity diagram

Store, locator and reminder flows drawn as one product

22 Jul 2026

Sequence sketch

UI → Java API → MySQL; location and notification as client steps

23 Jul 2026

Class diagram

User, pharmacy, reminder, dose log, refill alert, notification preference

24 Jul 2026

ER draft

Shared user identity across store, locator and reminders

25 Jul 2026

Navigation map

Protected routes listed under the shared shell

26 Jul 2026

Design review

Diagrams aligned with the SRS

Outcomes

Deliverable

Status

Use-case / activity / class / ER diagrams

✅ Done

Navigation map

✅ Done

Schema freeze

🟡 Planned — Week 4

Next week. Database schema, API contracts, UI mock-ups.

</details>

<details>
<summary><strong>Week 4 — Contracts · 27 Jul – 02 Aug 2026</strong></summary>

<br>

Objective. Freeze schema, API contracts and UI mock-ups before feature code. This is the last cheap week to disagree.

Area

Work this week

M1–M2

Auth API contracts; shared error shape; configuration seams

M3–M4

Catalogue schema; search parameters; detail / provenance fields

M5–M6

Pharmacy and search-query tables; permission / fallback fields; directions payload

M7–M8

Reminder / schedule / dose-log / refill tables; datetime convention

M9–M10

Mock-ups for dashboard, profile, settings, help; visual tokens for shared layout

Daily progress

Date

Activity

Outcome

27 Jul 2026

Entity list from UML

Users, pharmacies, searches, reminders, logs, alerts named

28 Jul 2026

Relationships and constraints

Account-scoped reminders; pharmacy search history kept separate

29 Jul 2026

API contract draft

Request / response fields for search, locate, remind

30 Jul 2026

Store and locator mock-ups

Search, detail, list / map, denied-permission and PIN screens

31 Jul 2026

Reminder and shell mock-ups

CRUD forms, dose history, dashboard, settings, help

01 Aug 2026

Datetime convention

One storage / display rule written for reminders

02 Aug 2026

Contract review

Schema, APIs and mock-ups checked against the SRS

Outcomes

Deliverable

Status

Database schema

✅ Done

API contracts

✅ Done

UI mock-ups

✅ Done

Datetime convention note

✅ Done

Running skeleton

🟡 Planned — Week 5

Next week. Shared layout, auth foundation, catalogue schema in MySQL, module frames.

</details>

<details>
<summary><strong>Week 5 — Skeleton · 03 – 09 Aug 2026</strong></summary>

<br>

Objective. Stand up one runnable Java web skeleton: shared chrome, auth foundation, MySQL reachable through JDBC, empty module frames.

Area

Work this week

M1–M2

Shared layout, auth foundation, JDBC utility, common errors — secrets stay local

M3–M4

Catalogue schema in MySQL; empty search / detail frames

M5–M6

Pharmacy tables; empty list / map frames

M7–M8

Reminder / log tables; empty form frames

M9–M10

Prototype layout on shared chrome; skeleton dashboard / help pages

Daily progress

Date

Activity

Outcome

03 Aug 2026

Schema implementation

First tables created in MySQL

04 Aug 2026

Project layout

Common folders for APIs, views, static assets, module ownership

05 Aug 2026

Server boot

Agreed Java web server started with a test page

06 Aug 2026

JDBC handshake

Connection utility verified; credentials not committed

07 Aug 2026

Model / DAO mapping

Store, locator and reminder tables mapped to initial classes

08 Aug 2026

Empty pages

Search, fallback, reminder and dashboard shells linked from chrome

09 Aug 2026

Repo hygiene

Feature-branch rule checked; local server files kept untracked

Outcomes

Deliverable

Status

MySQL schema in place

✅ Done

Shared layout

✅ Done

Auth foundation

✅ Done

Module skeletons

✅ Done

Finished login product

🟡 Planned — Week 6

JDBC connection errors are a known failure class. Record only if they actually happen; keep secrets out of Git.

</details>

<details>
<summary><strong>Week 6 — Vertical slices · 10 – 16 Aug 2026</strong></summary>

<br>

Objective. First real path per domain: login, search / detail, locator prototype, reminder CRUD. Still incomplete on purpose.

Area

Work this week

M1–M2

Registration / login / logout / session on protected pages

M3–M4

Search → detail happy path (filters still open)

M5–M6

Locator prototype against seed data (fallback not finished)

M7–M8

Reminder create / edit / delete for the logged-in user

M9–M10

Navigation to the new slices without breaking prototype chrome

Daily progress

Date

Activity

Outcome

10 Aug 2026

Registration

New accounts stored through JDBC

11 Aug 2026

Login

Credential check and error messages for invalid login

12 Aug 2026

Session

Login creates session; logout invalidates it

13 Aug 2026

Search / detail slice

Catalogue happy path wired UI → API → MySQL

14 Aug 2026

Locator prototype

Nearby list / map against seed rows

15 Aug 2026

Reminder CRUD

Add / edit / delete persisted per session user

16 Aug 2026

Slice review

Protected navigation checked; unfinished paths labelled

Outcomes

Deliverable

Status

Registration / login / session

✅ Done

Search / detail slice

✅ Done

Locator prototype

✅ Done

Reminder CRUD slice

✅ Done

Filters, PIN fallback, dose logs

🟡 Planned — Week 7

</details>

<details>
<summary><strong>Week 7 — Depth · 17 – 23 Aug 2026</strong></summary>

<br>

Objective. Make the slices survive messy input: filters, PIN fallback, dose logs.

Area

Work this week

M1–M2

Integration review; shared error responses for bad payloads

M3–M4

Search filters; case-insensitive / field mapping; empty-query response

M5–M6

Manual PIN / city fallback when GPS is denied or unavailable

M7–M8

Taken / missed / skipped dose logs against reminder records

M9–M10

Loading / empty / error presentation consistent with the prototype

Daily progress

Date

Activity

Outcome

17 Aug 2026

Filter UI

Catalogue filter controls added to the search page

18 Aug 2026

Filter API

Query mapping aligned between UI and backend fields

19 Aug 2026

Empty search

Empty-query and no-hit responses made explicit

20 Aug 2026

PIN fallback

Manual PIN / city path after denied or missing GPS

21 Aug 2026

Dose logs

Taken / missed / skipped saved against the reminder

22 Aug 2026

Shared error copy

Empty / loading / error states aligned in chrome

23 Aug 2026

Depth review

Denied GPS and empty search no longer dead-end

Outcomes

Deliverable

Status

UI / API integration on live slices

✅ Done

Catalogue filters

✅ Done

PIN fallback path

✅ Done

Dose-log states

✅ Done

Directions, refill rules, settings

🟡 Planned — Week 8

</details>

<details>
<summary><strong>Week 8 — Completeness · 24 – 30 Aug 2026</strong></summary>

<br>

Objective. Close owned edges so Week 9 can integrate instead of inventing leftover screens.

Area

Work this week

M1–M2

Auth and API hardening around profile / settings calls

M3–M4

Catalogue edge cases: no hit, partial name, brand vs generic

M5–M6

Directions from a selected pharmacy; no-result copy; permission-denied message

M7–M8

Refill-threshold rules; notification permission and limitation messaging

M9–M10

Profile / settings / help in prototype style

Daily progress

Date

Activity

Outcome

24 Aug 2026

Permission copy

Denied-location message on the locator

25 Aug 2026

Directions

Link from pharmacy details using stored address

26 Aug 2026

No-result state

Dedicated empty pharmacy result view

27 Aug 2026

Catalogue edges

Partial name, no hit, brand / generic cases checked

28 Aug 2026

Refill rules

Threshold compared against reminder / log data

29 Aug 2026

Notifications

Permission prompt plus limitation text — no delivery promise

30 Aug 2026

Profile / settings

Account pages in shared chrome; leftover placeholders removed

Outcomes

Deliverable

Status

Profile / settings / help

✅ Done

Catalogue edge cases

✅ Done

Directions and no-result

✅ Done

Refill rules and notification-limit copy

✅ Done

Cross-module E2E

🟡 Planned — Week 9

</details>

<details>
<summary><strong>Week 9 — Integration · 31 Aug – 06 Sep 2026</strong></summary>

<br>

Objective. One journey across ten modules. Session, MySQL and chrome must survive the hand-offs.

Area

Work this week

M1–M2

Cross-module session; API error consistency; merge review

M3–M4

Search / detail inside the full journey, not a standalone page

M5–M6

GPS-allowed and GPS-denied journeys in the same session

M7–M8

Reminder + dose log + refill after a store / locator visit

M9–M10

E2E script, checklists, first bug list — no invented pass rates

Daily progress

Date

Activity

Outcome

31 Aug 2026

Journey wiring

Login → store → locator → reminders without re-auth

01 Sep 2026

Store in E2E

Hit, miss and filter cases inside the shell

02 Sep 2026

Locator in E2E

Allowed GPS, denied GPS, invalid PIN, no-result

03 Sep 2026

Reminders in E2E

CRUD, three dose states, refill threshold

04 Sep 2026

Error handling

Invalid session, missing IDs, JDBC failure copy

05 Sep 2026

Session isolation

Reminder rows stay account-scoped; search does not overwrite session keys

06 Sep 2026

Defect list

Open issues handed to Week 10 — not hidden

Outcomes

Deliverable

Status

Integrated navigation

✅ Done

End-to-end happy path

✅ Done

GPS-denied path in E2E

✅ Done

Defect list

✅ Done

Defect closure

🟡 Planned — Week 10

</details>

<details>
<summary><strong>Week 10 — Hardening · 07 – 13 Sep 2026</strong></summary>

<br>

Objective. Make failure states first-class: security, validation, responsive UI, error-state fixes.

Area

Work this week

M1–M2

Authz on every write; validation; safer error reporting; JDBC hygiene

M3–M4

Query / filter validation; empty / error / loading at smaller widths

M5–M6

Invalid PIN, no-result, denied permission — copy and layout pass

M7–M8

Consistent date/time parse; refill recalculation after a log

M9–M10

Responsive chrome; visual check against prototype

Daily progress

Date

Activity

Outcome

07 Sep 2026

Reproduce Week 9 defects

Outstanding issues confirmed on a clean session

08 Sep 2026

Locator fixes

Fallback timing, invalid PIN, directions from incomplete addresses

09 Sep 2026

Reminder fixes

Ownership checks, log updates, refill refresh, datetime parse

10 Sep 2026

Validation

Required fields, threshold values, search input rules

11 Sep 2026

Responsive pass

Catalogue, locator, reminder and dashboard at multiple widths

12 Sep 2026

Regression

Week 9 journeys re-run after the fixes

13 Sep 2026

Priority close

High-priority defects closed or explicitly deferred

Outcomes

Deliverable

Status

Security / validation pass

✅ Done

Responsive UI pass

✅ Done

Error-state fixes

✅ Done

Regression on Week 9 journeys

✅ Done

Evidence pack

🟡 Planned — Week 11

Reminder time changing after refresh is a known failure class. Lock one datetime convention and retest create / edit / refresh / repeat — only if it actually happens.

</details>

<details>
<summary><strong>Week 11 — Evidence · 14 – 20 Sep 2026</strong></summary>

<br>

Objective. Prove behaviour. System tests, screenshots, documentation that matches the running app. Feature scope freezes.

Area

Work this week

M1–M2

Auth evidence: valid / invalid credentials, session expiry

M3–M4

Search hit / miss / filter; provenance fields visible

M5–M6

Allowed GPS, denied GPS, invalid PIN, directions, no-result

M7–M8

CRUD, three dose states, refill threshold, notification-limit messaging

M9–M10

Checklists, bug reports, screenshot pack, README alignment, repo hygiene

Daily progress

Date

Activity

Outcome

14 Sep 2026

Final functional pass

Auth + M3–M8 retested on the hardened build

15 Sep 2026

Screenshot capture

Slots filled under docs/screenshots/ as files exist

16 Sep 2026

Module notes

Implementation notes written only for work that exists

17 Sep 2026

GitHub organisation

Folders cleaned; local server / secret files untracked

18 Sep 2026

Code cleanup

Unused placeholders and duplicate helpers removed

19 Sep 2026

README vs product

Docs stripped of screens that were never built

20 Sep 2026

Evidence review

Gaps listed for Week 12, not invented as completed

Outcomes

Deliverable

Status

System test notes

✅ Done

Screenshot / evidence pack

✅ Done

Documentation updates

✅ Done

Repo hygiene

✅ Done

UAT and handover

🟡 Planned — Week 12

</details>

<details>
<summary><strong>Week 12 — Release · 21 Sep – 06 Oct 2026</strong></summary>

<br>

Objective. User acceptance against stories and prototype style, last bug fixes, candidate build, final README, demo and handover. No thirteenth week.

Window

Focus

21 – 27 Sep

UAT, bug fixes, deployment preparation

28 Sep – 04 Oct

Release candidate, README / report freeze, demo script

05 – 06 Oct

Final regression, repository evidence, handover

Area

Work this week

M1–M2

Candidate build, config notes, no secrets in Git, merge discipline

M3–M4

UAT on search / detail / provenance

M5–M6

UAT on GPS-on, GPS-off, directions

M7–M8

UAT on schedules, logs, refill, notification limits

M9–M10

Demo rehearsal, visual check vs prototype, final docs

Daily progress

Date

Activity

Outcome

21 Sep 2026

UAT start

Candidate build; first full login-to-modules walkthrough

22 Sep 2026

Store UAT

Search, filters, details, provenance

23 Sep 2026

Locator UAT

GPS on / off, PIN, directions, no-result

24 Sep 2026

Reminder UAT

CRUD, dose states, refill, notification-limit copy

25 Sep 2026

Shell UAT

Dashboard, profile, settings, help vs prototype

26 Sep 2026

Bug-fix pass

Only demo-blocking issues; no new modules

27 Sep 2026

Deploy notes

Local run / JDBC notes prepared — secrets still local

28 Sep 2026

README freeze

Week log and module claims match the running app

29 Sep 2026

Repo review

Repository checked for source, evidence, ignored files

30 Sep 2026

Demo script

One path, one owner per screen

01 Oct 2026

Screenshot recapture

Any pre-fix labels replaced

02 Oct 2026

Feature freeze

Only critical demo blockers allowed

03 Oct 2026

Freeze verification

Auth + M3–M10 rechecked on the frozen build

04 Oct 2026

Report alignment

Weekly reports and demo script agree with this README

05 Oct 2026

Final polish

Image paths, diagram rendering, repository cleanliness

06 Oct 2026

Handover

Submission pack closed at the end of the academic window

Outcomes

Deliverable

Status

UAT notes

✅ Done

Final bug-fix pass

✅ Done

Release candidate

✅ Done

Final README and evidence

✅ Done

Demo / handover pack

✅ Done

</details>

🔀 GitHub workflow

One shared repository. A separate feature branch per member. Review before main.

flowchart LR
  A[Feature branch] --> B[Small commits]
  B --> C[Pull request]
  C --> D[Review]
  D --> E[Merge to main]
  E --> F[Weekly evidence]

Rule

Practice

One repo

All five members ship in the same project

Branch per member

Feature work stays isolated until reviewed

Small commits

Messages describe the change — not “update”

PR before main

Review, then merge. Unmerged PRs are reported honestly

Weekly evidence

Report includes the repository plus that week’s PR / commit links

No fiction

Commits, issues, errors and results are recorded only when they exist

Repository : https://github.com/ratnsharma21/MediFinder
Demo       : not published yet
Deployment : not published yet

🧪 Testing & quality

Planned test types — not fabricated pass rates.

Layer

What is exercised

Typical owners

Functional / module

Auth, catalogue search, details, locator, reminders, dose logs, dashboard

Module owners

Integration

UI ↔ Java API ↔ MySQL; shared session across M3–M8

M1 / M2 + owners

Edge cases

Empty search, GPS denied, invalid PIN, no results, blocked notifications, reminder time after refresh

M3–M8 + M10

System / E2E

Login → search → details → locate → remind → log → refill

Whole team

Regression

Re-run happy paths after CSS / API / schema fixes

M10 + owners

UAT

Walkthrough against acceptance criteria and prototype style

Week 12 · M9 / M10

Evidence

Checklists, bug reports, screenshots, README

M10

Failure classes treated as normal test cases

MySQL / JDBC connection or configuration mismatch

Search returning wrong or empty rows from case / field inconsistency

Locator unusable when GPS permission is denied

Reminder time shifting after refresh (parse / timezone)

Merge conflicts on shared CSS breaking dashboard layout

If a week had no major error, say so. Do not invent one.

📸 Screenshots

⚠️ The frames below are placeholder slots — not product photos. Drop real captures into docs/screenshots/ and replace the URLs. This repository has not yet been verified to contain screenshot assets.

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://placehold.co/960x540/0B1120/0D9488/png?text=docs%2Fscreenshots%2F01-auth.png%0APlaceholder+-+Authentication" alt="Placeholder: Authentication screen"><br>
      <sub><strong>Authentication</strong> · <code>docs/screenshots/01-auth.png</code> · <em>placeholder</em></sub>
    </td>
    <td align="center" width="50%">
      <img src="https://placehold.co/960x540/0B1120/1D4ED8/png?text=docs%2Fscreenshots%2F02-search.png%0APlaceholder+-+Medicine+Search" alt="Placeholder: Medicine search screen"><br>
      <sub><strong>Medicine search</strong> · <code>docs/screenshots/02-search.png</code> · <em>placeholder</em></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://placehold.co/960x540/0B1120/1E40AF/png?text=docs%2Fscreenshots%2F03-details.png%0APlaceholder+-+Price+Provenance" alt="Placeholder: Details screen"><br>
      <sub><strong>Details / price provenance</strong> · <code>docs/screenshots/03-details.png</code> · <em>placeholder</em></sub>
    </td>
    <td align="center">
      <img src="https://placehold.co/960x540/0B1120/6D28D9/png?text=docs%2Fscreenshots%2F04-locator.png%0APlaceholder+-+Pharmacy+Locator" alt="Placeholder: Locator screen"><br>
      <sub><strong>Pharmacy locator</strong> · <code>docs/screenshots/04-locator.png</code> · <em>placeholder</em></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://placehold.co/960x540/0B1120/7C3AED/png?text=docs%2Fscreenshots%2F05-fallback.png%0APlaceholder+-+GPS+Denied+%2F+PIN" alt="Placeholder: Fallback screen"><br>
      <sub><strong>GPS denied / PIN / directions</strong> · <code>docs/screenshots/05-fallback.png</code> · <em>placeholder</em></sub>
    </td>
    <td align="center">
      <img src="https://placehold.co/960x540/0B1120/C2410C/png?text=docs%2Fscreenshots%2F06-reminder.png%0APlaceholder+-+Reminder+Form" alt="Placeholder: Reminder screen"><br>
      <sub><strong>Medicine reminder</strong> · <code>docs/screenshots/06-reminder.png</code> · <em>placeholder</em></sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://placehold.co/960x540/0B1120/9A3412/png?text=docs%2Fscreenshots%2F07-dose-log.png%0APlaceholder+-+Dose+Log+%2F+Refill" alt="Placeholder: Dose log screen"><br>
      <sub><strong>Dose log / refill alert</strong> · <code>docs/screenshots/07-dose-log.png</code> · <em>placeholder</em></sub>
    </td>
    <td align="center">
      <img src="https://placehold.co/960x540/0B1120/BE123C/png?text=docs%2Fscreenshots%2F08-dashboard.png%0APlaceholder+-+Dashboard" alt="Placeholder: Dashboard screen"><br>
      <sub><strong>Dashboard / profile / help</strong> · <code>docs/screenshots/08-dashboard.png</code> · <em>placeholder</em></sub>
    </td>
  </tr>
</table>

📁 Project structure

⚠️ The actual folder layout of the repository has not been verified in this update. Paste the real tree output here once confirmed. Treat M1–M10 as folder ownership until then.

[ADD ACTUAL PROJECT STRUCTURE HERE]

Shared layout, auth and API configuration live with M1 / M2 — do not duplicate them per feature branch.

🛠️ Stack

Only what the project specifies.

Concern

Choice

Backend

Java APIs

Data

MySQL

Connectivity

JDBC — URL, database, credentials never committed

Client location

Browser geolocation + manual PIN / city fallback

Alerts

Browser notifications, with documented limitations

UI

Shared layout preserving the approved prototype

<p align="center">
  <img src="https://skillicons.dev/icons?i=java,mysql,html,css&theme=dark" alt="Stack">
</p>

🚀 Getting started

⚠️ Exact build tooling (Maven / Gradle / Ant / plain javac + servlet container) has not been verified in this update. Fill the commands in after confirming against the repository.

[ADD SETUP STEPS]
[ADD DATABASE SCRIPT PATH]
[ADD LOCAL RUN COMMAND]
[ADD ENVIRONMENT / JDBC NOTES]

Suggested flow once the above is confirmed:

Clone the repository

git clone https://github.com/ratnsharma21/MediFinder.git
cd MediFinder

Create the MySQL schema from the project script.

Configure JDBC locally — do not commit credentials.

Run the Java web application with the team’s agreed server setup.

Sign in, then exercise search → locator → reminders on a feature branch.

📚 Documentation

Document

Location

SRS / user stories / acceptance criteria

docs/ (to be confirmed)

UML / ER / navigation map

docs/ (to be confirmed)

API contracts

docs/ (to be confirmed)

UI mock-ups / prototype

docs/ (to be confirmed)

Test checklists and bug reports

docs/ (to be confirmed)

Weekly reports

docs/ (to be confirmed)

<details>
<summary><strong>📊 Reporting standard</strong></summary>

<br>

Each member files their own daily log and weekly report. Points only with evidence.

Daily log

Field

Content

Date

Actual work date

Hours

Actual hours

Status

Completed / In Progress / Blocked

Work

Action + module + result

Evidence

Commit / PR, test, screenshot or document

Blocker / next

Error, discussion, fix, or next action

Weekly scorecard (max 100)

Criterion

Points

Assigned tasks completed

40

Quality and testing

20

GitHub evidence

15

Documentation / reporting

10

Team discussion / collaboration

10

Next-week plan

5

Weekly pack: date range, completed-work bullets, score breakdown, repository link, PR / commit links, problems faced or “no major blocker”, specific next-week plan.

</details>

🤝 Working agreements

Feature branch per member; review before merge to main.

Shared CSS / layout files have a clear owner — discuss before rewriting them.

GPS denied, empty search, and blocked notifications are expected test cases.

Sachin Kumawat leads guided UI, QA evidence and documentation.

Sameer Achara owns M7 and M8 only.

Use the college portal’s week numbering if it differs from this calendar.

<div align="center">

MediFinder

<sub>06 July 2026 — 06 October 2026 · 5 members · 10 modules · one repository</sub>

<p>
  <img src="https://img.shields.io/badge/Search-Catalogue-0F766E?style=flat-square&labelColor=0B1120" alt="Search">
  <img src="https://img.shields.io/badge/Locate-Pharmacies-1D4ED8?style=flat-square&labelColor=0B1120" alt="Locate">
  <img src="https://img.shields.io/badge/Remind-Doses-C2410C?style=flat-square&labelColor=0B1120" alt="Remind">
</p>

<a href="https://github.com/ratnsharma21/MediFinder">🔗 github.com/ratnsharma21/MediFinder</a>

</div>
<!-- <!-- ```
