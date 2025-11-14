## Inventory Access Portal

Full-stack sample showing a role-protected inventory table. React drives the UI, Express/Node exposes secure APIs, and MySQL stores both users and data rows.

### Tech stack
- Frontend: React 19 + Vite + React Router
- Backend: Node.js, Express 5, mysql2, express-session cookies
- Database: MySQL (schema + seed in `server/schema.sql`)

### Database schema (summary)
- `users` — `user_id` (PK), `username`, `password`, `role`, timestamps
- `inventory_items` — `item_id` (PK), `item_name`, `category`, `stock_qty`, `unit_price`, timestamps
- Default users: `admin/admin123`, `basic/basic123` (stored in plain text for simplicity)

### Getting started
1. **Install deps**
   ```bash
   cd /run/media/loejee/loejee-500-gb/Transfer-from-old-SSD-08-08-25/Others/github-repositories/it-elective-3-final
   npm install --prefix client
   npm install --prefix server
   ```
2. **Provision MySQL**
   ```bash
   mysql -u root -p < server/schema.sql
   ```
   Adjust credentials as needed.
3. **Backend environment**
   ```bash
   cp server/env.example server/.env
   # then edit DB credentials + JWT secret
   ```
4. **Run backend**
   ```bash
   cd server
   npm run dev
   ```
5. **Run frontend**
   ```bash
   cd client
   npm run dev
   ```
   Vite defaults to `http://localhost:5173`.
6. **Run both layers together (new)**
   ```bash
   cd /run/media/loejee/loejee-500-gb/Transfer-from-old-SSD-08-08-25/Others/github-repositories/it-elective-3-final
   npm run dev
   ```
   This uses `concurrently` to invoke the server and client dev servers in one command.

> ⚠️ Security note: Passwords are stored in plain text and compared with `===` to intentionally keep the backend simple for classroom use. Do **not** deploy this setup to the public internet.

### API overview
| Method | Route | Role | Notes |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Public | Compares raw username/password, sets HTTP-only session cookie |
| `POST` | `/api/auth/logout` | Auth | Destroys the active session |
| `GET` | `/api/auth/me` | Auth | Returns the current logged-in user if cookie is valid |
| `GET` | `/api/items` | Admin/Basic | Lists inventory rows (session required) |
| `POST` | `/api/items` | Admin | Creates row |
| `PUT` | `/api/items/:id` | Admin | Updates row |

### Recording checklist (5–8 minutes video)
1. **Intro** — state objectives and stack.
2. **Database** — show MySQL tables + sample rows, highlight users table and seeded passwords.
3. **Backend tour** — walk through:
   - `server/src/index.js` (Express setup + `express-session`)
   - `server/src/routes/authRoutes.js` (raw credential check with `===`, login/logout/me endpoints)
   - `server/src/middleware/auth.js` (session guard + role checks)
   - `server/src/routes/itemRoutes.js` (CRUD)
   - `.env` usage (DB + `SESSION_SECRET`)
4. **Frontend tour** — show:
   - `client/src/App.jsx` (auth flow, role gates)
   - `client/src/components/*` (Login form, table, admin forms)
   - Styling in `App.css`
5. **Live demo** — run `npm run dev` for both layers:
   - Login as admin → list/add/update rows (show DB change via MySQL)
   - Login as basic user → verify read-only behavior
6. **Wrap-up** — summarize how requirements were satisfied, mention GitHub repo, and provide the (unlisted) Google Drive link in your submission form.

> Note: I cannot record videos in this environment, but the outline above hits every rubric item. Use screen-recording software (OBS, Loom, etc.) and keep it between 5 and 8 minutes.


