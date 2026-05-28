# Collaborative Editor

Project combining a Vite React frontend and an Express + Socket.IO backend. The top-level `dockerfile` builds the frontend, copies the built assets into the backend `public` folder, and runs the backend server.

**Project Overview**
- **Frontend**: Vite + React app in [Frontend/package.json](Frontend/package.json#L1-L40).
- **Backend**: Express + Socket.IO server that serves the frontend build from `public` and exposes a Yjs socket server; entry is [Backend/server.js](Backend/server.js#L1-L20).
- **Docker**: top-level [dockerfile](dockerfile#L1-L40) composes build and runtime image.

**Prerequisites**
- **Node.js** 18+ and **npm**
- **Docker** (optional, for containerized builds/runs)

**Quick Start — Local Development**

1) Backend (development)

```bash
cd Backend
npm install
npm run dev    # runs: npx nodemon server.js
# or run the production start
npm start
```

2) Frontend (development)

```bash
cd Frontend
npm install
npm run dev    # runs vite dev server
```

To build the frontend for production (local):

```bash
cd Frontend
npm run build
# built files are written to Frontend/dist
```

You can copy `Frontend/dist` into `Backend/public` if you want to serve the built app from the backend without Docker.

**Run with Docker (recommended for production-like run)**

The repository includes a top-level `dockerfile` that builds the frontend, installs backend dependencies, copies the built frontend into `Backend/public`, and runs `node server.js`.

Build the image and run the container:

```bash
docker build -t docker-aws-app -f dockerfile .
docker run -p 4000:3000 docker-aws-app
```

This maps host port `4000` to the container's backend port `3000` (the server listens on port `3000`).

**Health check & API**
- Health endpoint: `GET /health` — example: `http://localhost:3000/health` (or `http://localhost:4000/health` when mapped)

**Ports**
- Backend (container): `3000`
- Example host mapping in docs: `4000:3000`

**Repository Structure (high level)**
- [Backend/server.js](Backend/server.js#L1-L20) — backend entry + static server
- [Frontend/package.json](Frontend/package.json#L1-L40) — frontend scripts and deps
- [dockerfile](dockerfile#L1-L40) — multi-stage Docker build for frontend + backend

**Notes & Tips**
- Use `npm run dev` in each folder for a fast dev workflow (frontend hot reload + backend nodemon).
- If you prefer a single-container approach, use the included `dockerfile` as shown above.

**Contributing**
- Open an issue or submit a PR with a clear description of changes and how to run/test them.

**License**
- MIT (change as needed)
