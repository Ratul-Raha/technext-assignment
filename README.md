# Technext Assignment — Frontend

# TechNext URL Shortener

A simple, self-hosted URL shortener built with React (Vite) for the frontend and Express + MongoDB for the backend. Create short links, track click counts, and manage per-user quotas.

## Setup Instructions

## Prerequisites

Before installing and running Technext, make sure you have the following:

### 1️⃣ Node.js and npm
- **Node.js** v18 or higher  
- **npm** (comes with Node.js) or **yarn**  

Check installed versions:

```bash
node -v
npm -v


## Installation

### Backend

1. Clone the repository and navigate to the project

```bash
git clone <repository-url>
cd technext-assignment
```


```bash
cd backend
npm install
npm install -g nodemon #if nodemon is not available on the machine globally or throws any error
```

2. Change the name .env.example to .env

- `MONGO_URI` — "mongodb+srv://gkdratul_db_user:qgDmAGQMianpVXSL@url-shortener.sh56dxt.mongodb.net/"" #replace with this string in .env
- `JWT_EXPIRES_IN` — optional, e.g. `1d`
- `BASE_URL` — public base URL for short links (e.g. `http://localhost:5000`)
- `PORT` — optional server port (default `5000`)

3. Start server (development)

```bash
nodemon server.js
or
nodemon index.js
```

### Frontend

1. Install dependencies and start dev server

cd frontend
npm install
npm run dev
```

2. Build for production

```bash
npm run build

Configure the frontend to use the backend base URL (example: `http://localhost:5000/api`) via environment variables.

## Project Structure

- `frontend/` — React app (Vite)
  - `api/axios.js` — centralized Axios instance

- `backend/` — Express API
  - `controllers/`, `models/`, `routes/`, `middleware/`, `config/db.js`



## API Endpoints

Quick overview of main endpoints (full examples in `backend/README.md`):

### Authentication
- `POST /api/auth/login` — login (returns JWT)
    ```bash
    curl -X POST http://localhost:5000/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"user@example.com","password":"password12@"}'
    ```
- `POST /api/auth/logout` — logout (protected)
    ```bash
    curl -X POST http://localhost:5000/api/auth/logout \
        -H "Authorization: Bearer YOUR_JWT_TOKEN"
    ```

### URL Management
- `POST /api/url` — create a short URL (protected)
    ```bash
    curl -X POST http://localhost:5000/api/url \
        -H "Authorization: Bearer YOUR_JWT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"originalUrl":"https://example.com/very/long/url"}'
    ```
- `GET /api/url` — list user's URLs (protected)
    ```bash
    curl http://localhost:5000/api/url \
        -H "Authorization: Bearer YOUR_JWT_TOKEN"
    ```
- `DELETE /api/url/:id` — delete a URL (protected)
    ```bash
    curl -X DELETE http://localhost:5000/api/url/URL_ID \
        -H "Authorization: Bearer YOUR_JWT_TOKEN"
    ```

### Redirect
- `GET /:code` — redirect to original URL (public)
    ```bash
    curl -L http://localhost:5000/abc123
    ```

### User
- `GET /api/user/profile` — get user profile (protected)
    ```bash
    curl http://localhost:5000/api/user/profile \
        -H "Authorization: Bearer YOUR_JWT_TOKEN"
    ```


## Design Decisions

- JWT-based stateless auth for simplicity.
- MongoDB + Mongoose for flexible schemas.
- Small services layer on the frontend to keep components focused.

## Known Limitations

- No refresh token flow; token expiry requires re-login.
- Short code generation uses randomness; may need a better strategy at high scale.
- No rate limiting or abuse protection out of the box.



