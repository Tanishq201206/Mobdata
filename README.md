# MobData — Backend + Admin (React) + User Mobile (React Native)

This monorepo contains all three parts of **MobData**.

```
mobdata/
├─ README.md
├─ backend/
│  └─ README.md
├─ admin-frontend/
│  └─ README.md
└─ user-mobile/
   └─ README.md
```

## Quick Links
- Backend: `backend/README.md`
- Admin (React): `admin-frontend/README.md`
- User Mobile (React Native): `user-mobile/README.md`


# 🛠️ Project Setup (Root)

This section makes your repo clone‑and‑run. It covers **database seeding**, **MFA setup via Postman**, and **environment configuration** for all three parts (backend, admin, mobile).

---

## 1) Prerequisites

- **Java 17+**
- **Node.js LTS** (18+ recommended)
- **MySQL 8+**
- Android Studio / Xcode (for mobile)
- Postman (for API testing)

---

## 2) Database Setup (MySQL)

Create the database and a default **Admin** user. Two options are provided. Use the one that best matches your current codebase.

### Option A — Use Backend API to create Admin (recommended)
1. Start backend: `cd backend && ./mvnw spring-boot:run`
2. `POST /auth/register` with body:
   ```json
   {
     "username": "admin",
     "password": "Admin@123",
     "email": "admin@example.com"
   }
   ```
3. Promote to admin (if your backend has an admin promotion endpoint) **or** update the DB `role` column to `ROLE_ADMIN` manually:
   ```sql
   UPDATE users SET role = 'ROLE_ADMIN' WHERE username = 'admin';
   ```

> This path ensures the password is properly **BCrypt hashed** by the backend.

### Option B — Seed Admin directly via SQL (manual insert)

> ⚠️ Only use this if you know your exact table/column names. Replace placeholders to match your schema.

```sql
-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS mobdata_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mobdata_db;

-- Example users table columns (adjust to your schema)
-- id (BIGINT AUTO_INCREMENT), username (VARCHAR UNIQUE), email, password (BCrypt),
-- role (VARCHAR), enabled (BOOLEAN), mfa_enabled (BOOLEAN), totp_secret (VARCHAR), created_at, updated_at

-- Insert admin (replace the BCrypt hash with your own!)
INSERT INTO users (username, email, password, role, enabled, mfa_enabled)
VALUES ('admin', 'admin@example.com', '$2a$10$REPLACE_WITH_YOUR_BCRYPT_HASH', 'ROLE_ADMIN', 1, 0);
```

#### Generate a BCrypt Hash
Use a tiny Java snippet (run in a scratch Spring Boot class or any Java runner):

```java
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGen {
  public static void main(String[] args) {
    System.out.println(new BCryptPasswordEncoder().encode("Admin@123"));
  }
}
```

Copy the printed hash into the SQL above.

---

## 3) MFA Setup (via Postman)

Once the admin user exists, set up MFA **for admin** using Postman:

1. **Login**  
   `POST http://localhost:8087/auth/login`  
   Body:
   ```json
   {"username":"admin","password":"Admin@123"}
   ```
   If response indicates MFA is required to complete login, proceed.

2. **Setup TOTP**  
   `POST http://localhost:8087/auth/setup-mfa`  
   Body:
   ```json
   {"username":"admin","password":"Admin@123"}
   ```
   Response contains **QR (base64)** and **secret key**.

3. **Scan QR** in Google Authenticator (or enter the key manually).

4. **Verify OTP**  
   `POST http://localhost:8087/auth/verify-otp`  
   Body:
   ```json
   {"username":"admin","otp":"123456"}
   ```
   On success, admin MFA is active. Use the issued token/cookie for admin APIs.

> Save screenshots in `backend/docs/screenshots/` to document these steps (already defined in backend README).

---

## 4) Backend Configuration

`backend/src/main/resources/application.properties` (example):
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mobdata_db
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASS
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
server.port=8087

# CORS: Admin UI origin
app.frontend.base-url=http://localhost:5173
```

**Tip:** Add a committed example config at `backend/application-example.properties` and keep secrets out of git.

---

## 5) Admin Frontend Configuration

Set API base URL (Vite example):
- File: `admin-frontend/.env`
  ```dotenv
  VITE_API_BASE_URL=http://localhost:8087
  ```

Screenshots live in: `admin-frontend/public/screenshots/` (filenames listed in its README).

---

## 6) User Mobile Configuration

Set API base URL in **`user-mobile/services/api.js`**:
```js
export const BASE_URL = "http://10.0.2.2:8087"; // Android emulator
// iOS simulator: "http://localhost:8087"
// Physical device: "http://<YOUR_PC_LAN_IP>:8087"
```

Place mobile screenshots in: `user-mobile/assets/screenshots/` (filenames listed in its README).

---

## 7) Start All Parts

```bash
# Terminal 1 — Backend
cd backend
./mvnw spring-boot:run

# Terminal 2 — Admin
cd admin-frontend
npm install
npm run dev   # or npm start

# Terminal 3 — Mobile
cd user-mobile
npm install
npm run android   # or: npm run ios
```

---

## 8) Verification Checklist

- Backend reachable at `http://localhost:8087`
- Admin login works, MFA verified
- Admin UI connects to backend (CORS allowed)
- Mobile app can reach backend
- Device registration → admin approval → data request → approval → data submission flow completes
