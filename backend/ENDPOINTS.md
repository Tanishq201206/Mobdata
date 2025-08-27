# MobData Backend — Endpoint Checklist

> Paste this into `backend/README.md` (or save as `backend/docs/endpoint-checklist.md`).  
> Roles: `Public` (no auth), `User` (ROLE_USER), `Admin` (ROLE_ADMIN). JWT is provided via HttpOnly cookie `jwt` or `Authorization: Bearer <token>`.

---

## Legend
- **✔** = implemented in project scope
- **(Admin)** / **(User)** = required role
- Body examples are indicative; align with your DTOs.

---

## 1) Authentication (`/auth/**`) — Public entry points

| ✔ | Method | Path | Role | Purpose | Body (JSON) | Notes |
|---|--------|------|------|---------|-------------|------|
| ✔ | POST | `/auth/register` | Public | Create a new user | `{ "username","password","email" }` | Password stored as BCrypt |
| ✔ | POST | `/auth/login` | Public | Login; may prompt MFA | `{ "username","password", "client":"mob" }` | Returns MFA prompt or partial/session |
| ✔ | POST | `/auth/setup-mfa` | Public/Auth step | Start TOTP (QR + secret) | `{ "username","password" }` | Use for first-time MFA setup |
| ✔ | POST | `/auth/verify-otp` | Public/Auth step | Verify TOTP, issue JWT | `{ "username","otp" }` | Sets cookie or return token |
| ✔ | POST | `/auth/set-new-password` | Public/Auth step | Force-change password (first login) | `{ "username","otp","newPassword" }` | Requires valid OTP |
| ✔ | POST | `/auth/check` | Public | Quick auth/session check | _none_ | Useful for health UI |
| ✔ | POST | `/auth/logout` | Public | Clear cookie / invalidate token | _none_ | If cookie-based flow |
| ✔ | POST | `/auth/send-email-otp` | Public | Send email OTP | `{ "email" }` | For email verification |
| ✔ | POST | `/auth/verify-email-otp` | Public | Verify email OTP | `{ "email","otp" }` | Marks email verified |

---

## 2) Device (`/device/**`) — (User)

| ✔ | Method | Path | Role | Purpose | Body (JSON) | Notes |
|---|--------|------|------|---------|-------------|------|
| ✔ | POST | `/device/register` | User | Register device | `{ "uuid","model","os","imei?", "label?" }` | Sets `verified=false`, returns `deviceId`/token |
| ✔ | GET | `/device/check` | User | Check device + user binding | _none_ | Confirms `verified` & token validity |
| ✔ | GET | `/device/attributes/{username}` | User | Device attributes by username | _none_ | Admin/Support may not need this |

---

## 3) Data (`/data/**`) — (User)

| ✔ | Method | Path | Role | Purpose | Body (JSON) | Notes |
|---|--------|------|------|---------|-------------|------|
| ✔ | POST | `/data/request-permission/{deviceId}` | User | Ask admin to allow data sending | _none_ or `{ "reason?" }` | Creates `DeviceDataRequest (pending)` |
| ✔ | POST | `/data/submit` | User | Submit data after approval | `{ "deviceId","payload":{...} }` | Fails unless approved |
| ✔ | GET | `/data/my-submissions` | User | List submissions for current user | _none_ | Optional filters via query |

---

## 4) App Status (`/app/**`) — (User)

| ✔ | Method | Path | Role | Purpose | Body (JSON) | Notes |
|---|--------|------|------|---------|-------------|------|
| ✔ | GET | `/app/user/status/{username}` | User | Aggregate status for the mobile app | _none_ | Email verified, device verified, data permission, blocked |

---

## 5) Admin: Devices (`/admin/devices/**`) — (Admin)

| ✔ | Method | Path | Role | Purpose | Body (JSON) | Notes |
|---|--------|------|------|---------|-------------|------|
| ✔ | GET | `/admin/devices/pending` | Admin | List pending device registrations | _none_ | Pagination optional |
| ✔ | POST | `/admin/devices/approve/{deviceId}` | Admin | Approve device | _none_ | Sets `verified=true` |
| ✔ | POST | `/admin/devices/block/{id}` | Admin | Block a device | _none_ | Sets blocked flag |
| ✔ | POST | `/admin/devices/unblock/{id}` | Admin | Unblock a device | _none_ | Clears blocked flag |
| ✔ | GET | `/admin/manage/devices` | Admin | List devices (all) | query: `page,size` | For admin tables |
| ✔ | GET | `/admin/manage/devices/user/{username}` | Admin | List devices by user | _none_ | |

---

## 6) Admin: Data Requests (`/admin/data-requests/**`) — (Admin)

| ✔ | Method | Path | Role | Purpose | Body (JSON) | Notes |
|---|--------|------|------|---------|-------------|------|
| ✔ | GET | `/admin/data-requests/pending` | Admin | List pending data requests | _none_ | |
| ✔ | GET | `/admin/data-requests/all` | Admin | List all data requests | query: `page,size,status?` | |
| ✔ | POST | `/admin/data-requests/approve/{requestId}` | Admin | Approve data request | _none_ | Enables data sending for device |

---

## 7) Admin: Users (`/admin/manage/**`) — (Admin)

| ✔ | Method | Path | Role | Purpose | Body (JSON) | Notes |
|---|--------|------|------|---------|-------------|------|
| ✔ | GET | `/admin/manage/users` | Admin | List users (paginated) | query: `page,size,search?` | |
| ✔ | POST | `/admin/manage/users/disable/{userId}` | Admin | Disable user | _none_ | |
| ✔ | POST | `/admin/manage/users/enable/{userId}` | Admin | Enable user | _none_ | |

---

## 8) Error Codes & Common Responses

- **401 Unauthorized** — Missing/invalid JWT; re-login or re-verify OTP.
- **403 Forbidden** — Role missing for the endpoint (user vs admin).
- **409 Conflict** — Duplicate device UUID/IMEI/email.
- **422 Unprocessable Entity** — Validation failed (missing fields, bad OTP).
- **500 Server Error** — Check logs; likely DB or service error.

---

## 9) Postman Smoke Test Order

1. `POST /auth/register` (optional if admin is seeded)  
2. `POST /auth/login` → `POST /auth/verify-otp`  
3. `POST /device/register` (User)  
4. `GET /admin/devices/pending` → `POST /admin/devices/approve/{deviceId}`  
5. `POST /data/request-permission/{deviceId}` (User)  
6. `GET /admin/data-requests/pending` → `POST /admin/data-requests/approve/{requestId}`  
7. `POST /data/submit` (User)  
8. `GET /data/my-submissions` (User)  
9. `GET /app/user/status/{username}` (User)

---

## 10) Notes
- Ensure CORS allows admin and mobile origins.
- JWT may be sent as **cookie** or **Bearer** header.
- For teams, prefer DB migrations (Flyway/Liquibase) instead of `ddl-auto=update`.
