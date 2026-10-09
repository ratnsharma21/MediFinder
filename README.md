<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0D9488,50:0EA5E9,100:6366F1&height=220&section=header&text=MediFinder&fontSize=80&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Find%20the%20medicine.%20Reach%20the%20pharmacy.%20Stay%20on%20the%20dose.&descAlignY=60&descSize=18" width="100%" alt="MediFinder"/>

<p>
  <a href="https://github.com/ratnsharma21/MediFinder">
    <img src="https://img.shields.io/badge/Status-Active_Development-00D9A3?style=for-the-badge&labelColor=0B1120" alt="Status"/>
  </a>
  <img src="https://img.shields.io/badge/Version-1.0.0--beta-0EA5E9?style=for-the-badge&labelColor=0B1120" alt="Version"/>
  <img src="https://img.shields.io/badge/License-MIT-A855F7?style=for-the-badge&labelColor=0B1120" alt="License"/>
  <a href="https://github.com/ratnsharma21/MediFinder/stargazers">
    <img src="https://img.shields.io/github/stars/ratnsharma21/MediFinder?style=for-the-badge&color=F59E0B&labelColor=0B1120&logo=github" alt="Stars"/>
  </a>
</p>

<p>
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=22&duration=2800&pause=1000&color=0EA5E9&center=true&vCenter=true&width=720&lines=🔍+Search+medicines+across+brands+%26+generics;📍+Locate+nearby+pharmacies+with+PIN+fallback;⏰+Smart+dose+reminders+%26+refill+alerts;💊+One+signed-in+workflow+for+your+medication" alt="Typing SVG"/>
</p>

<br/>

<a href="https://github.com/ratnsharma21/MediFinder">
  <img src="https://img.shields.io/badge/🚀_Explore_Repository-0D9488?style=for-the-badge&labelColor=0B1120" alt="Repo"/>
</a>
<a href="#-the-mediFinder-story">
  <img src="https://img.shields.io/badge/📖_Story-6366F1?style=for-the-badge&labelColor=0B1120" alt="Story"/>
</a>
<a href="#-tech-arsenal">
  <img src="https://img.shields.io/badge/⚙️_Tech-EC4899?style=for-the-badge&labelColor=0B1120" alt="Tech"/>
</a>
<a href="#-the-crew">
  <img src="https://img.shields.io/badge/👥_Team-F59E0B?style=for-the-badge&labelColor=0B1120" alt="Team"/>
</a>
<a href="#-12-week-sprint-timeline">
  <img src="https://img.shields.io/badge/📅_Timeline-EF4444?style=for-the-badge&labelColor=0B1120" alt="Timeline"/>
</a>

</div>

<br/>

---

## 🌟 The MediFinder Story

<table>
<tr>
<td width="60%" valign="top">

### Why we built this

Three everyday problems. One Monday morning. The same person.

> 🔍 You search for a medicine online — the brand name works but the generic doesn't. Price? Nowhere.  
> 📍 You open a locator — it needs GPS. You deny permission. The app gives up.  
> ⏰ You set a reminder — refresh the page, time is gone. Browser blocked the notification anyway.

**MediFinder** is a Java web application that treats each of these failures as **first-class design decisions**, not afterthoughts.

One login. One workflow. **Search → Locate → Remind → Track.**  
No marketplace tricks. No diagnosis magic. Just honest, working software.

</td>
<td width="40%" valign="top">

<div align="center">

<img src="https://img.shields.io/badge/⚡-Fast-0D9488?style=for-the-badge&labelColor=0B1120" alt=""/><br/>
<img src="https://img.shields.io/badge/🔒-Secure-6366F1?style=for-the-badge&labelColor=0B1120" alt=""/><br/>
<img src="https://img.shields.io/badge/📱-Responsive-EC4899?style=for-the-badge&labelColor=0B1120" alt=""/><br/>
<img src="https://img.shields.io/badge/🎯-Focused-F59E0B?style=for-the-badge&labelColor=0B1120" alt=""/><br/>
<img src="https://img.shields.io/badge/✅-Account--Scoped-10B981?style=for-the-badge&labelColor=0B1120" alt=""/>

<br/><br/>

| 📊 | **At a glance** |
|:---:|---|
| 📅 | 06 Jul → 06 Oct 2026 |
| 👥 | 5 members |
| 🧩 | 10 modules |
| 🗄️ | MySQL + JDBC |
| ☕ | Java backend |

</div>

</td>
</tr>
</table>

---

## ✨ What makes it different

<table>
<tr>
<td width="33%" align="center" valign="top">

### 🔐
### Honest Auth
Secure login with session-scoped records across every module. Your reminders, your searches, your data — never leaked between accounts.

<img src="https://img.shields.io/badge/M1-Authentication-0D9488?style=flat-square&labelColor=0B1120" alt=""/>

</td>
<td width="33%" align="center" valign="top">

### 💊
### Price Provenance
Not just "₹120". We show manufacturer, strength, pack, **MRP vs seller price**, source, and when it was last updated.

<img src="https://img.shields.io/badge/M4-Transparency-6366F1?style=flat-square&labelColor=0B1120" alt=""/>

</td>
<td width="33%" align="center" valign="top">

### 📍
### GPS-Denied? Fine.
Permission denied is a **designed path**, not an error screen. Switch to PIN or city instantly. Directions still work.

<img src="https://img.shields.io/badge/M6-Fallback-EC4899?style=flat-square&labelColor=0B1120" alt=""/>

</td>
</tr>
<tr>
<td width="33%" align="center" valign="top">

### ⏰
### Reminders that Persist
Create, edit, delete schedules. Refresh the page — your time **stays exactly where you set it**. One datetime convention, no drift.

<img src="https://img.shields.io/badge/M7-Reminders-F59E0B?style=flat-square&labelColor=0B1120" alt=""/>

</td>
<td width="33%" align="center" valign="top">

### 📝
### Taken / Missed / Skipped
Three honest dose states. Full history per account. Refill thresholds that recalculate the moment you log a dose.

<img src="https://img.shields.io/badge/M8-Adherence-EF4444?style=flat-square&labelColor=0B1120" alt=""/>

</td>
<td width="33%" align="center" valign="top">

### 🎨
### Prototype-Faithful UI
Dashboard, profile, settings, help — all under one shared visual system. QA evidence baked in, not added later.

<img src="https://img.shields.io/badge/M9-Experience-10B981?style=flat-square&labelColor=0B1120" alt=""/>

</td>
</tr>
</table>

---

## ⚙️ Tech Arsenal

<div align="center">

### Core Stack

<img src="https://skillicons.dev/icons?i=java,mysql,html,css,js,git,github,vscode&theme=dark&perline=8" alt="Tech Stack"/>

<br/><br/>

| Layer | Technology | Purpose |
|:---:|:---:|---|
| ☕ **Backend** | ![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white) | Business logic, APIs, authentication |
| 🗄️ **Database** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) | Relational persistence |
| 🔌 **Connectivity** | ![JDBC](https://img.shields.io/badge/JDBC-F80000?style=flat-square&logo=oracle&logoColor=white) | Database access layer |
| 🎨 **Frontend** | ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Prototype-aligned UI |
| 📍 **Location** | ![Geolocation](https://img.shields.io/badge/Geolocation_API-4285F4?style=flat-square&logo=googlemaps&logoColor=white) | GPS + PIN fallback |
| 🔔 **Alerts** | ![Notifications](https://img.shields.io/badge/Web_Notifications-FF6B35?style=flat-square&logo=firefox&logoColor=white) | Browser-native, honest limits |
| 🔀 **VCS** | ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white) | Branch-per-member workflow |

</div>



## 🏛️ Architecture

<div align="center">

%%{init: {'theme':'dark', 'themeVariables': {'primaryColor':'#0D9488','primaryTextColor':'#fff','primaryBorderColor':'#0EA5E9','lineColor':'#6366F1','secondaryColor':'#1E293B','tertiaryColor':'#0B1120'}}}%%
flowchart TB
    User(["👤 User"]) --> Browser["🌐 Browser Shell<br/>M9 · M10"]
    
    Browser --> |"HTTPS"| Auth["🔐 Authentication Layer<br/>M1"]
    Auth --> |"Session"| API["⚙️ Java API Gateway<br/>M2"]
    
    API --> Store["💊 Medicine Store<br/>M3 · M4"]
    API --> Locator["📍 Pharmacy Locator<br/>M5 · M6"]
    API --> Reminder["⏰ Reminders Engine<br/>M7 · M8"]
    
    Store --> DB[("🗄️ MySQL<br/>via JDBC")]
    Locator --> DB
    Reminder --> DB
    
    Locator -.->|"Client API"| GPS["📡 Geolocation<br/>+ PIN Fallback"]
    Reminder -.->|"Client API"| Notif["🔔 Web Notifications<br/>limited by browser"]
    
    style User fill:#0D9488,stroke:#0EA5E9,color:#fff
    style Browser fill:#1E293B,stroke:#6366F1,color:#fff
    style Auth fill:#6366F1,stroke:#A855F7,color:#fff
    style API fill:#6366F1,stroke:#A855F7,color:#fff
    style Store fill:#0D9488,stroke:#10B981,color:#fff
    style Locator fill:#EC4899,stroke:#F472B6,color:#fff
    style Reminder fill:#F59E0B,stroke:#FBBF24,color:#fff
    style DB fill:#4479A1,stroke:#60A5FA,color:#fff
    style GPS fill:#334155,stroke:#64748B,color:#fff
    style Notif fill:#334155,stroke:#64748B,color:#fff
</div>
🧭 Layer responsibilities
<table> <tr> <td width="25%" align="center">
🖥️ Presentation
Prototype-aligned screens for every module

</td> <td width="25%" align="center">
⚙️ Application
Java APIs, authentication, shared configuration

</td> <td width="25%" align="center">
🧠 Domain
Catalogue, locator, reminders, logs, alerts

</td> <td width="25%" align="center">
🗄️ Data
MySQL through JDBC — secrets stay local

</td> </tr> </table>
🔄 User Journey
<div align="center">
mermaid

%%{init: {'theme':'dark', 'themeVariables': {'primaryColor':'#0EA5E9','primaryTextColor':'#fff','primaryBorderColor':'#0D9488','lineColor':'#A855F7'}}}%%
journey
    title A day with MediFinder
    section Morning
      Sign in: 5: User
      Search medicine: 5: User
      View price details: 4: User
    section Afternoon
      Find pharmacy: 5: User
      GPS denied → PIN: 3: User
      Open directions: 5: User
    section Evening
      Set reminder: 5: User
      Log dose taken: 5: User
      Refill alert pops: 4: User
</div>
🧩 Modules — 10 pieces, 5 owners
<div align="center"><table> <thead> <tr> <th>ID</th> <th>Module</th> <th>Owner</th> <th>Core Responsibility</th> <th>Status</th> </tr> </thead> <tbody> <tr> <td align="center"><img src="https://img.shields.io/badge/M1-0D9488?style=for-the-badge" alt=""/></td> <td><strong>🔐 Authentication & Accounts</strong></td> <td>Ratn Kumar Sharma</td> <td>Secure login, authorization, common errors</td> <td align="center">🟢 Core</td> </tr> <tr> <td align="center"><img src="https://img.shields.io/badge/M2-0D9488?style=for-the-badge" alt=""/></td> <td><strong>⚙️ API / Config / Integration</strong></td> <td>Ratn Kumar Sharma</td> <td>API contracts, integration, code review</td> <td align="center">🟢 Core</td> </tr> <tr> <td align="center"><img src="https://img.shields.io/badge/M3-6366F1?style=for-the-badge" alt=""/></td> <td><strong>🔍 Medicine Catalogue & Search</strong></td> <td>Vansh Oberoi</td> <td>Search & filter over the medicine store</td> <td align="center">🟢 Core</td> </tr> <tr> <td align="center"><img src="https://img.shields.io/badge/M4-6366F1?style=for-the-badge" alt=""/></td> <td><strong>💊 Details & Price Provenance</strong></td> <td>Vansh Oberoi</td> <td>MRP vs seller, source, update time</td> <td align="center">🟢 Core</td> </tr> <tr> <td align="center"><img src="https://img.shields.io/badge/M5-EC4899?style=for-the-badge" alt=""/></td> <td><strong>📍 Pharmacy Locator</strong></td> <td>Sumit Kumar Saini</td> <td>Nearby search, map/list, address/contact</td> <td align="center">🟢 Core</td> </tr> <tr> <td align="center"><img src="https://img.shields.io/badge/M6-EC4899?style=for-the-badge" alt=""/></td> <td><strong>🧭 Directions & Fallback</strong></td> <td>Sumit Kumar Saini</td> <td>Permission handling, PIN fallback</td> <td align="center">🟢 Core</td> </tr> <tr> <td align="center"><img src="https://img.shields.io/badge/M7-F59E0B?style=for-the-badge" alt=""/></td> <td><strong>⏰ Medicine Reminders</strong></td> <td>Sameer Achara</td> <td>Create/edit/delete schedules</td> <td align="center">🟢 Core</td> </tr> <tr> <td align="center"><img src="https://img.shields.io/badge/M8-F59E0B?style=for-the-badge" alt=""/></td> <td><strong>📝 Dose Logs & Refill Alerts</strong></td> <td>Sameer Achara</td> <td>Taken/missed/skipped, refill warnings</td> <td align="center">🟢 Core</td> </tr> <tr> <td align="center"><img src="https://img.shields.io/badge/M9-EF4444?style=for-the-badge" alt=""/></td> <td><strong>🎨 Dashboard / Profile / Help</strong></td> <td>Sachin Kumawat</td> <td>Prototype style, guided UI</td> <td align="center">🟢 Core</td> </tr> <tr> <td align="center"><img src="https://img.shields.io/badge/M10-EF4444?style=for-the-badge" alt=""/></td> <td><strong>🧪 QA / Docs / Demo</strong></td> <td>Sachin Kumawat</td> <td>Checklists, bug reports, screenshots</td> <td align="center">🟢 Core</td> </tr> </tbody> </table></div>
👥 The Crew
<div align="center"><table> <tr> <td align="center" width="20%"><img src="https://ui-avatars.com/api/?name=Ratn+Sharma&background=0D9488&color=fff&size=140&bold=true&font-size=0.40&rounded=true" width="100" alt=""/><br/>
Ratn Kumar Sharma
<sub>🚀 Lead · Java Backend</sub>

<br/><img src="https://img.shields.io/badge/M1-0D9488?style=flat-square" alt=""/> <img src="https://img.shields.io/badge/M2-0D9488?style=flat-square" alt=""/>
<sub>Auth, APIs, integration, code review</sub>

</td> <td align="center" width="20%"><img src="https://ui-avatars.com/api/?name=Vansh+Oberoi&background=6366F1&color=fff&size=140&bold=true&font-size=0.40&rounded=true" width="100" alt=""/><br/>
Vansh Oberoi
<sub>💊 Medicine Store</sub>

<br/><img src="https://img.shields.io/badge/M3-6366F1?style=flat-square" alt=""/> <img src="https://img.shields.io/badge/M4-6366F1?style=flat-square" alt=""/>
<sub>Catalogue, search, price provenance</sub>

</td> <td align="center" width="20%"><img src="https://ui-avatars.com/api/?name=Sumit+Saini&background=EC4899&color=fff&size=140&bold=true&font-size=0.40&rounded=true" width="100" alt=""/><br/>
Sumit Kumar Saini
<sub>📍 Pharmacy Locator</sub>

<br/><img src="https://img.shields.io/badge/M5-EC4899?style=flat-square" alt=""/> <img src="https://img.shields.io/badge/M6-EC4899?style=flat-square" alt=""/>
<sub>Nearby search, PIN fallback, directions</sub>

</td> <td align="center" width="20%"><img src="https://ui-avatars.com/api/?name=Sameer+Achara&background=F59E0B&color=fff&size=140&bold=true&font-size=0.40&rounded=true" width="100" alt=""/><br/>
Sameer Achara
<sub>⏰ Reminders Engine</sub>

<br/><img src="https://img.shields.io/badge/M7-F59E0B?style=flat-square" alt=""/> <img src="https://img.shields.io/badge/M8-F59E0B?style=flat-square" alt=""/>
<sub>Schedules, dose logs, refill alerts</sub>

</td> <td align="center" width="20%"><img src="https://ui-avatars.com/api/?name=Sachin+Kumawat&background=EF4444&color=fff&size=140&bold=true&font-size=0.40&rounded=true" width="100" alt=""/><br/>
Sachin Kumawat
<sub>🎨 UI/UX · QA · Docs</sub>

<br/><img src="https://img.shields.io/badge/M9-EF4444?style=flat-square" alt=""/> <img src="https://img.shields.io/badge/M10-EF4444?style=flat-square" alt=""/>
<sub>Dashboard, QA evidence, documentation</sub>

</td> </tr> </table></div>
📅 12-Week Sprint Timeline
<div align="center">
mermaid

%%{init: {'theme':'dark', 'themeVariables': {'primaryColor':'#0D9488','primaryTextColor':'#fff'}}}%%
gantt
    title MediFinder — 06 Jul to 06 Oct 2026
    dateFormat YYYY-MM-DD
    axisFormat %b %d
    
    section 🎯 Shape
    Foundation           :done, w1, 2026-07-06, 7d
    Requirements         :done, w2, after w1, 7d
    Design               :done, w3, after w2, 7d
    Contracts            :done, w4, after w3, 7d
    
    section 🔨 Build
    Skeleton             :active, w5, after w4, 7d
    Vertical Slices      :w6, after w5, 7d
    Depth                :w7, after w6, 7d
    Completeness         :w8, after w7, 7d
    
    section 🧪 Prove
    Integration          :w9, after w8, 7d
    Hardening            :w10, after w9, 7d
    Evidence             :w11, after w10, 7d
    Release              :milestone, w12, after w11, 16d
</div><br/><table> <thead> <tr> <th align="center">Week</th> <th>Window</th> <th>Phase</th> <th>Mission</th> </tr> </thead> <tbody> <tr><td align="center">🥇<br/><strong>1</strong></td><td>06 – 12 Jul</td><td>🎯 Foundation</td><td>Team, scope, abstract, prototype review</td></tr> <tr><td align="center">📋<br/><strong>2</strong></td><td>13 – 19 Jul</td><td>🎯 Requirements</td><td>SRS, stories, acceptance criteria</td></tr> <tr><td align="center">🎨<br/><strong>3</strong></td><td>20 – 26 Jul</td><td>🎯 Design</td><td>Use-case, activity, class, ER, navigation</td></tr> <tr><td align="center">📝<br/><strong>4</strong></td><td>27 Jul – 02 Aug</td><td>🎯 Contracts</td><td>Schema, API contracts, UI mock-ups</td></tr> <tr><td align="center">🏗️<br/><strong>5</strong></td><td>03 – 09 Aug</td><td>🔨 Skeleton</td><td>Shared layout, auth foundation, module frames</td></tr> <tr><td align="center">🧩<br/><strong>6</strong></td><td>10 – 16 Aug</td><td>🔨 Slices</td><td>Login, search/detail, locator, reminder CRUD</td></tr> <tr><td align="center">🔍<br/><strong>7</strong></td><td>17 – 23 Aug</td><td>🔨 Depth</td><td>Filters, PIN fallback, dose logs</td></tr> <tr><td align="center">✅<br/><strong>8</strong></td><td>24 – 30 Aug</td><td>🔨 Completeness</td><td>Settings, edges, directions, refills</td></tr> <tr><td align="center">🔗<br/><strong>9</strong></td><td>31 Aug – 06 Sep</td><td>🧪 Integration</td><td>Cross-module journey, E2E tests</td></tr> <tr><td align="center">🛡️<br/><strong>10</strong></td><td>07 – 13 Sep</td><td>🧪 Hardening</td><td>Security, validation, responsive UI</td></tr> <tr><td align="center">📸<br/><strong>11</strong></td><td>14 – 20 Sep</td><td>🧪 Evidence</td><td>System tests, screenshots, documentation</td></tr> <tr><td align="center">🚀<br/><strong>12</strong></td><td>21 Sep – 06 Oct</td><td>🚀 Release</td><td>UAT, fixes, candidate, demo, handover</td></tr> </tbody> </table><br/>
📖 Weekly deep-dives
<details> <summary><b>🥇 Week 1 — Foundation</b> · <code>06 – 12 Jul 2026</code></summary><br/>
🎯 Mission: Form the five-member team, freeze module ownership, write the abstract, review the prototype.

Daily log

Date	Activity	Outcome
06 Jul	Team discussion — availability, interests, academic load	Five-member team agreed
07 Jul	Module ownership freeze	M1–M10 mapped to the five names
08 Jul	Problem shortlisting	Medicine search + pharmacy access + adherence selected
09 Jul	Problem research	GPS-denied + notification limits recorded as constraints
10 Jul	Solution sketch	One-session Java web workflow drafted
11 Jul	Repository rules	Shared-repo + feature-branch-per-member rule
12 Jul	Abstract & prototype review	Initial abstract prepared
Blockers: Balancing 10 modules across 5 people without overlap · keeping marketplace/diagnosis out of scope.

Deliverables: ✅ Team split · ✅ Abstract · ✅ Prototype review · 🟡 SRS (next week)

</details><details> <summary><b>📋 Week 2 — Requirements</b> · <code>13 – 19 Jul 2026</code></summary><br/>
🎯 Mission: Turn the problem into rules a Java API can implement — SRS, user stories, acceptance criteria.

Daily log

Date	Activity	Outcome
13 Jul	Actor & workflow pass	Signed-in user & admin paths listed
14 Jul	Store requirements	Search, filter, provenance fields captured
15 Jul	Locator requirements	GPS-on, GPS-denied, PIN/city, directions
16 Jul	Reminder requirements	CRUD, schedules, dose states, refill threshold
17 Jul	Non-functional & security	Session, validation, secrets-out-of-Git
18 Jul	Acceptance criteria	Stories written to be testable
19 Jul	SRS review	Packed for design week
Deliverables: ✅ SRS · ✅ User stories · ✅ Data-source research · 🟡 UML (next week)

</details><details> <summary><b>🎨 Week 3 — Design</b> · <code>20 – 26 Jul 2026</code></summary><br/>
🎯 Mission: Draw users, flows, entities, and navigation before schema-conflicting code.

Daily log

Date	Activity	Outcome
20 Jul	Use-case diagram	User & admin mapped to M1–M10
21 Jul	Activity diagram	Store, locator, reminder flows unified
22 Jul	Sequence sketch	UI → Java API → MySQL
23 Jul	Class diagram	User, pharmacy, reminder, dose log, refill alert
24 Jul	ER draft	Shared user identity across modules
25 Jul	Navigation map	Protected routes under shared shell
26 Jul	Design review	Diagrams aligned with SRS
Deliverables: ✅ UML suite · ✅ ER · ✅ Navigation map · 🟡 Schema freeze (next week)

</details><details> <summary><b>📝 Week 4 — Contracts</b> · <code>27 Jul – 02 Aug 2026</code></summary><br/>
🎯 Mission: Freeze schema, API contracts, and UI mock-ups before feature code.

Daily log

Date	Activity	Outcome
27 Jul	Entity list from UML	Users, pharmacies, searches, reminders, logs named
28 Jul	Relationships & constraints	Account-scoped reminders defined
29 Jul	API contract draft	Request/response fields for search, locate, remind
30 Jul	Store & locator mock-ups	Search, detail, list/map, PIN screens
31 Jul	Reminder & shell mock-ups	CRUD forms, dose history, dashboard, settings
01 Aug	Datetime convention	One storage/display rule locked
02 Aug	Contract review	Schema, APIs, mock-ups checked vs SRS
Deliverables: ✅ Schema · ✅ API contracts · ✅ Mock-ups · 🟡 Running skeleton (next week)

</details><details> <summary><b>🏗️ Week 5 — Skeleton</b> · <code>03 – 09 Aug 2026</code></summary><br/>
🎯 Mission: One runnable Java web skeleton — shared chrome, auth foundation, MySQL via JDBC, empty frames.

Daily log

Date	Activity	Outcome
03 Aug	Schema implementation	First tables created in MySQL
04 Aug	Project layout	APIs, views, static assets organized
05 Aug	Server boot	Java web server up with a test page
06 Aug	JDBC handshake	Connection utility verified, credentials local
07 Aug	Model/DAO mapping	Tables mapped to initial classes
08 Aug	Empty pages	Search, fallback, reminder shells linked
09 Aug	Repo hygiene	Feature-branch rule enforced
Deliverables: ✅ Schema · ✅ Shared layout · ✅ Auth foundation · ✅ Skeletons

</details><details> <summary><b>🧩 Week 6 — Vertical Slices</b> · <code>10 – 16 Aug 2026</code></summary><br/>
🎯 Mission: First real path per domain — login, search/detail, locator prototype, reminder CRUD.

Daily log

Date	Activity	Outcome
10 Aug	Registration	Accounts stored via JDBC
11 Aug	Login	Credential check + error messages
12 Aug	Session	Create on login, invalidate on logout
13 Aug	Search/detail slice	Catalogue happy path wired
14 Aug	Locator prototype	Nearby list/map against seed rows
15 Aug	Reminder CRUD	Add/edit/delete per session user
16 Aug	Slice review	Protected navigation checked
Deliverables: ✅ Auth · ✅ Search/detail · ✅ Locator proto · ✅ Reminder CRUD

</details><details> <summary><b>🔍 Week 7 — Depth</b> · <code>17 – 23 Aug 2026</code></summary><br/>
🎯 Mission: Make slices survive messy input — filters, PIN fallback, dose logs.

Daily log

Date	Activity	Outcome
17 Aug	Filter UI	Catalogue filter controls added
18 Aug	Filter API	UI ↔ backend field mapping aligned
19 Aug	Empty search	Empty-query & no-hit responses explicit
20 Aug	PIN fallback	Manual PIN/city path after GPS denied
21 Aug	Dose logs	Taken/missed/skipped persisted
22 Aug	Shared error copy	Empty/loading/error states aligned
23 Aug	Depth review	GPS-denied & empty search no longer dead-end
Deliverables: ✅ Filters · ✅ PIN fallback · ✅ Dose states

</details><details> <summary><b>✅ Week 8 — Completeness</b> · <code>24 – 30 Aug 2026</code></summary><br/>
🎯 Mission: Close owned edges so Week 9 can integrate.

Daily log

Date	Activity	Outcome
24 Aug	Permission copy	Denied-location message on locator
25 Aug	Directions	Link from pharmacy details
26 Aug	No-result state	Dedicated empty view
27 Aug	Catalogue edges	Partial name, no hit, brand/generic covered
28 Aug	Refill rules	Threshold vs reminder/log data
29 Aug	Notifications	Permission prompt + limitation text
30 Aug	Profile/settings	Account pages in shared chrome
Deliverables: ✅ Profile/settings · ✅ Edge cases · ✅ Directions · ✅ Refill rules

</details><details> <summary><b>🔗 Week 9 — Integration</b> · <code>31 Aug – 06 Sep 2026</code></summary><br/>
🎯 Mission: One journey across ten modules — session, MySQL, chrome survive the hand-offs.

Daily log

Date	Activity	Outcome
31 Aug	Journey wiring	Login → store → locator → reminders without re-auth
01 Sep	Store in E2E	Hit, miss, filter cases inside the shell
02 Sep	Locator in E2E	GPS allowed, denied, invalid PIN, no-result
03 Sep	Reminders in E2E	CRUD, three dose states, refill threshold
04 Sep	Error handling	Invalid session, missing IDs, JDBC failure copy
05 Sep	Session isolation	Rows stay account-scoped
06 Sep	Defect list	Open issues handed to Week 10
Deliverables: ✅ Integrated navigation · ✅ E2E happy path · ✅ GPS-denied path · ✅ Defect list

</details><details> <summary><b>🛡️ Week 10 — Hardening</b> · <code>07 – 13 Sep 2026</code></summary><br/>
🎯 Mission: Make failure states first-class — security, validation, responsive UI, error-state fixes.

Daily log

Date	Activity	Outcome
07 Sep	Reproduce defects	Outstanding issues confirmed
08 Sep	Locator fixes	Fallback timing, PIN validation, directions
09 Sep	Reminder fixes	Ownership checks, log updates, datetime parse
10 Sep	Validation	Required fields, threshold values, search rules
11 Sep	Responsive pass	Multi-width check on all modules
12 Sep	Regression	Week 9 journeys re-run after fixes
13 Sep	Priority close	High-priority defects closed or deferred
Deliverables: ✅ Security pass · ✅ Responsive · ✅ Error fixes · ✅ Regression

</details><details> <summary><b>📸 Week 11 — Evidence</b> · <code>14 – 20 Sep 2026</code></summary><br/>
🎯 Mission: Prove behaviour — system tests, screenshots, documentation. Feature scope freezes.

Daily log

Date	Activity	Outcome
14 Sep	Final functional pass	Auth + M3–M8 retested
15 Sep	Screenshot capture	docs/screenshots/ populated
16 Sep	Module notes	Implementation notes written
17 Sep	GitHub organisation	Folders cleaned, secrets untracked
18 Sep	Code cleanup	Unused placeholders removed
19 Sep	README vs product	Docs aligned with running app
20 Sep	Evidence review	Gaps listed for Week 12
Deliverables: ✅ System tests · ✅ Screenshot pack · ✅ Doc updates · ✅ Repo hygiene

</details><details> <summary><b>🚀 Week 12 — Release</b> · <code>21 Sep – 06 Oct 2026</code></summary><br/>
🎯 Mission: UAT, last fixes, release candidate, final README, demo, handover. No thirteenth week.

Three sub-windows

Window	Focus
21 – 27 Sep	UAT, bug fixes, deployment prep
28 Sep – 04 Oct	Release candidate, README freeze, demo script
05 – 06 Oct	Final regression, repository evidence, handover
Daily log

Date	Activity	Outcome
21 Sep	UAT start	Full login-to-modules walkthrough
22 Sep	Store UAT	Search, filters, details, provenance
23 Sep	Locator UAT	GPS on/off, PIN, directions, no-result
24 Sep	Reminder UAT	CRUD, dose states, refill
25 Sep	Shell UAT	Dashboard, profile, settings vs prototype
26 Sep	Bug-fix pass	Demo-blocking issues only
27 Sep	Deploy notes	Local run / JDBC notes prepared
28 Sep	README freeze	Final alignment with running app
29 Sep	Repo review	Source, evidence, ignored files checked
30 Sep	Demo script	One path, one owner per screen
01 Oct	Screenshot recapture	Pre-fix labels replaced
02 Oct	Feature freeze	Critical blockers only
03 Oct	Freeze verification	Full retest on frozen build
04 Oct	Report alignment	Reports agree with README
05 Oct	Final polish	Image paths, diagrams, cleanliness
06 Oct	Handover	Submission pack closed
Deliverables: ✅ UAT · ✅ Final fixes · ✅ Release candidate · ✅ Demo pack

</details>
🔀 GitHub Workflow
<div align="center">
mermaid

%%{init: {'theme':'dark', 'themeVariables': {'primaryColor':'#0D9488','primaryTextColor':'#fff','lineColor':'#0EA5E9'}}}%%
gitGraph
    commit id: "init"
    branch ratn/m1-auth
    checkout ratn/m1-auth
    commit id: "login API"
    commit id: "session"
    checkout main
    merge ratn/m1-auth tag: "✅ reviewed"
    branch vansh/m3-catalogue
    checkout vansh/m3-catalogue
    commit id: "search"
    commit id: "filters"
    checkout main
    merge vansh/m3-catalogue tag: "✅ reviewed"
    branch sumit/m5-locator
    checkout sumit/m5-locator
    commit id: "nearby list"
    commit id: "PIN fallback"
    checkout main
    merge sumit/m5-locator tag: "✅ reviewed"
</div><br/>
Rule	Practice
🏛️ One repo	All five members ship in the same project
🌿 Branch per member	Feature work stays isolated until reviewed
📝 Small commits	Messages describe the change — not "update"
🔍 PR before main	Review, then merge
📊 Weekly evidence	Report includes repository + that week's PR/commit links
🚫 No fiction	Commits, issues, errors recorded only when they exist
🧪 Testing & Quality
<table> <tr> <td width="50%" valign="top">
📋 Test layers
Layer	Owner
🧩 Functional / module	Module owners
🔗 Integration	M1/M2 + owners
🎯 Edge cases	M3–M8 + M10
🚀 System / E2E	Whole team
🔁 Regression	M10 + owners
✅ UAT	Week 12 · M9/M10
📸 Evidence	M10
</td> <td width="50%" valign="top">
⚠️ Known failure classes
🔌 MySQL / JDBC connection mismatch
🔍 Search returning wrong rows from case/field inconsistency
📍 Locator unusable when GPS permission denied
⏰ Reminder time shifting after refresh
🎨 Merge conflicts on shared CSS breaking dashboard
If a week had no major error, say so. Don't invent one.

</td> </tr> </table>
🚀 Getting Started
<div align="center"><img src="https://img.shields.io/badge/Prerequisites-Java_17+_·_MySQL_8+_·_Git-0D9488?style=for-the-badge&labelColor=0B1120" alt=""/></div><br/>
Bash

# 1️⃣  Clone the repository
git clone https://github.com/ratnsharma21/MediFinder.git
cd MediFinder

# 2️⃣  Set up MySQL database
mysql -u root -p < db/schema.sql

# 3️⃣  Configure JDBC (keep this LOCAL, never commit)
cp config/db.properties.example config/db.properties
# edit config/db.properties with your credentials

# 4️⃣  Build & run
# Use the team's agreed server setup (Tomcat / embedded)

# 5️⃣  Open in browser
# http://localhost:8080/MediFinder
💡 Pro tip: Always work on your assigned feature branch (your-name/mX-feature) and open a PR for review before merging into main.

📸 Screenshots
📷 Screenshots will land in docs/screenshots/ as modules reach their evidence milestone (Week 11).

<table> <tr> <td align="center" width="33%"><img src="https://placehold.co/600x340/0B1120/0D9488/png?font=source-sans-pro&text=🔐%0AAuthentication" alt="Auth"/>
<sub>🔐 Authentication · M1</sub>

</td> <td align="center" width="33%"><img src="https://placehold.co/600x340/0B1120/6366F1/png?font=source-sans-pro&text=🔍%0AMedicine+Search" alt="Search"/>
<sub>🔍 Medicine Search · M3</sub>

</td> <td align="center" width="33%"><img src="https://placehold.co/600x340/0B1120/A855F7/png?font=source-sans-pro&text=💊%0APrice+Provenance" alt="Details"/>
<sub>💊 Price Provenance · M4</sub>

</td> </tr> <tr> <td align="center"><img src="https://placehold.co/600x340/0B1120/EC4899/png?font=source-sans-pro&text=📍%0APharmacy+Locator" alt="Locator"/>
<sub>📍 Pharmacy Locator · M5</sub>

</td> <td align="center"><img src="https://placehold.co/600x340/0B1120/F472B6/png?font=source-sans-pro&text=🧭%0APIN+Fallback" alt="Fallback"/>
<sub>🧭 PIN Fallback · M6</sub>

</td> <td align="center"><img src="https://placehold.co/600x340/0B1120/F59E0B/png?font=source-sans-pro&text=⏰%0AReminder+Form" alt="Reminder"/>
<sub>⏰ Reminder Form · M7</sub>

</td> </tr> <tr> <td align="center"><img src="https://placehold.co/600x340/0B1120/EF4444/png?font=source-sans-pro&text=📝%0ADose+Log" alt="Dose"/>
<sub>📝 Dose Log · M8</sub>

</td> <td align="center"><img src="https://placehold.co/600x340/0B1120/10B981/png?font=source-sans-pro&text=🎨%0ADashboard" alt="Dashboard"/>
<sub>🎨 Dashboard · M9</sub>

</td> <td align="center"><img src="https://placehold.co/600x340/0B1120/14B8A6/png?font=source-sans-pro&text=🧪%0AQA+Evidence" alt="QA"/>
<sub>🧪 QA Evidence · M10</sub>

</td> </tr> </table>
🤝 Working Agreements
<table> <tr> <td width="50%" valign="top">
🌿 Branch discipline
Feature branch per member
Review before merge to main
Small, descriptive commits
Shared CSS has a clear owner
</td> <td width="50%" valign="top">
🎯 Scope discipline
GPS denied, empty search, blocked notifications are expected test cases
Sachin leads guided UI, QA, docs
Sameer owns M7 & M8 only
College portal week numbering wins if different
</td> </tr> </table>
📊 Project Pulse
<div align="center"><a href="https://github.com/ratnsharma21/MediFinder"> <img src="https://github-readme-stats.vercel.app/api/pin/?username=ratnsharma21&repo=MediFinder&theme=tokyonight&hide_border=true&bg_color=0B1120&title_color=0EA5E9&icon_color=0D9488&text_color=ffffff" alt="Repo Stats"/> </a>
<br/><br/>

<a href="https://github.com/ratnsharma21/MediFinder/graphs/contributors"> <img src="https://img.shields.io/github/contributors/ratnsharma21/MediFinder?style=for-the-badge&color=0D9488&labelColor=0B1120" alt=""/> </a> <a href="https://github.com/ratnsharma21/MediFinder/commits/main"> <img src="https://img.shields.io/github/last-commit/ratnsharma21/MediFinder?style=for-the-badge&color=6366F1&labelColor=0B1120" alt=""/> </a> <a href="https://github.com/ratnsharma21/MediFinder/issues"> <img src="https://img.shields.io/github/issues/ratnsharma21/MediFinder?style=for-the-badge&color=EC4899&labelColor=0B1120" alt=""/> </a> <a href="https://github.com/ratnsharma21/MediFinder/pulls"> <img src="https://img.shields.io/github/issues-pr/ratnsharma21/MediFinder?style=for-the-badge&color=F59E0B&labelColor=0B1120" alt=""/> </a></div>
<div align="center"><img src="https://capsule-render.vercel.app/api?type=waving&color=0:6366F1,50:0EA5E9,100:0D9488&height=140&section=footer&text=Built%20with%20💊%20by%20Team%20MediFinder&fontSize=22&fontColor=ffffff&animation=twinkling&fontAlignY=70" width="100%" alt=""/>
<sub>06 July 2026 → 06 October 2026 · 5 members · 10 modules · one repository · zero fiction</sub>

<br/><br/>

<a href="https://github.com/ratnsharma21/MediFinder"> <img src="https://img.shields.io/badge/⭐_Star_the_repo-0D9488?style=for-the-badge&labelColor=0B1120" alt=""/> </a> <a href="https://github.com/ratnsharma21/MediFinder/fork"> <img src="https://img.shields.io/badge/🍴_Fork-6366F1?style=for-the-badge&labelColor=0B1120" alt=""/> </a> <a href="https://github.com/ratnsharma21/MediFinder/issues/new"> <img src="https://img.shields.io/badge/🐛_Report_Bug-EF4444?style=for-the-badge&labelColor=0B1120" alt=""/> </a></div> 
