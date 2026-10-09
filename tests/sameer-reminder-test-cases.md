# MediFinder — Reminder and Dose Tracking Test Cases

**Contributor:** Sameer Achara
**Modules:** M7 — Medicine Reminders, M8 — Dose Logs & Refill Alerts

## 1. Medicine Reminder Test Cases

| ID | Test Scenario | Expected Result |
|---|---|---|
| M7-01 | Create a reminder with valid information | Reminder is saved successfully |
| M7-02 | Submit a reminder without a medicine name | Validation error is returned |
| M7-03 | Submit a reminder without dosage | Validation error is returned |
| M7-04 | Submit a reminder without frequency | Validation error is returned |
| M7-05 | Submit a reminder without a start date | Validation error is returned |
| M7-06 | Retrieve the user's reminders | Only that user's reminders are returned |
| M7-07 | Retrieve an existing reminder by ID | Correct reminder is returned |
| M7-08 | Update a reminder | Updated information is returned |
| M7-09 | Submit an invalid scheduled time | Validation error is returned |
| M7-10 | Submit an end date earlier than the start date | Validation error is returned |
| M7-11 | Reference an unknown catalogue medicine | Not-found error is returned |
| M7-12 | Toggle enabled state with a partial update | Only the requested field changes |
| M7-13 | Delete an existing reminder | Reminder is removed |
| M7-14 | Access another user's reminder | Access is denied |

## 2. Dose Log Test Cases

| ID | Test Scenario | Expected Result |
|---|---|---|
| M8-01 | Record a dose as taken | Dose status is saved |
| M8-02 | Record a dose as skipped | Dose status is saved |
| M8-03 | Record a missed dose | Missed status is recorded |
| M8-04 | Retrieve dose history | Correct dose records are returned |
| M8-05 | Access another user's dose records | Access is denied |
| M8-06 | Record a second dose for the same scheduled minute | Conflict response is returned |
| M8-07 | Record a dose outside the reminder date range | Validation error is returned |
| M8-08 | Update another user's dose record | Access is denied |
| M8-09 | Retrieve history as a different user | No other user's records are returned |

## 3. Browser Notification Test Cases

| ID | Test Scenario | Expected Result |
|---|---|---|
| BN-01 | Enable permission in a supported browser | Alerts are shown for due active schedules while the page is open |
| BN-02 | Deny permission | A message explains how to allow alerts |
| BN-03 | Use a browser without notification support | Alerts are reported as unsupported |
| BN-04 | Close the page or browser | No background alert is claimed or expected |

## 4. Execution Record

The test cases above describe the expected behavior. They must be executed against the application before being marked as passed.

| Test Group | Status |
|---|---|
| Reminder API integration tests | Automated |
| Dose-log API integration tests | Automated |
| Browser notification behavior | Manual browser verification required |