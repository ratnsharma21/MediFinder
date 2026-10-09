# MediFinder — Medicine Reminders and Dose Tracking

## Reminder schedules

Authenticated users can create, view, edit, enable, disable, and delete their own schedules. A schedule stores an optional catalogue medicine reference, the medicine name, dosage and unit, frequency, one or more comma-separated `HH:mm` times, start and optional end dates, instructions, and enabled state.

Supported frequency values are `ONCE_DAILY`, `TWICE_DAILY`, `THRICE_DAILY`, `FOUR_TIMES_DAILY`, `EVERY_8_HOURS`, and `AS_NEEDED`. The service validates each supplied time and rejects end dates before start dates. `medicineId`, when supplied, must identify an existing catalogue medicine.

## Dose history

Dose records are associated with both a reminder and its owner. Users can log doses as `TAKEN`, `SKIPPED`, or `MISSED`, update a record's status, and retrieve their dose history. Scheduled times are stored to minute precision, and a reminder cannot receive duplicate logs for the same scheduled minute. Logs outside a reminder's date range are rejected.

## API

All endpoints require the existing bearer-token authentication. Ownership comes from the authenticated principal; request bodies do not accept a user ID.

| Method | Endpoint | Operation |
|---|---|---|
| `GET` | `/api/reminders` | List the authenticated user's schedules |
| `GET` | `/api/reminders/{id}` | Get one owned schedule |
| `POST` | `/api/reminders` | Create a schedule |
| `PATCH` | `/api/reminders/{id}` | Partially update schedule fields (including enabled state) |
| `PUT` | `/api/reminders/{id}` | Update a schedule |
| `DELETE` | `/api/reminders/{id}` | Delete an owned schedule and its dependent dose logs |
| `GET` | `/api/dose-logs` | Get the authenticated user's dose history |
| `GET` | `/api/dose-logs?reminderId={id}` | Get history for an owned reminder |
| `POST` | `/api/dose-logs` | Record a taken, skipped, or missed dose |
| `PATCH` | `/api/dose-logs/{id}` | Update an owned dose record |

The existing `reminders` and `dose_logs` tables are reused. Migration `V5__reminder_schedule_indexes.sql` adds indexes for user schedules and reminder dose lookups.

## Browser notifications

The web client can request browser-notification permission and display schedule alerts for enabled reminders while the MediFinder page is open. It uses the browser's local time zone, honors start/end dates, skips disabled schedules and `AS_NEEDED` reminders, and displays a clear notice when notifications are unavailable or denied.

There is no service worker or server-side delivery mechanism for this feature. Alerts are **not** delivered when the app or browser is closed; a background notification guarantee is not made. Browser notification preferences must also be enabled in account settings.

## Scope and testing

Refill alerts are not implemented because the existing medicine/reminder model has no user-specific stock quantity or threshold data. No clinical dosage guidance is generated.

Run the backend integration tests with `backend\\mvnw.cmd -f backend\\pom.xml test` and build the frontend with `npm --prefix frontend run build`.
