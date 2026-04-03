# Docker Guide for exp project

## Prerequisites

Install Docker Desktop from https://docker.com/products/docker-desktop/  
Verify installation:

```bash
docker --version
docker compose version
```

---

## Project structure

```
exp/
├── frontend/
│   ├── Dockerfile          # builds frontend + serves with nginx
│   ├── nginx.conf          # nginx config for SPA
│   ├── package.json
│   ├── src/
│   └── ...
├── backend/
│   ├── Dockerfile          # runs Node + Express server
│   ├── package.json
│   ├── src/
│   └── ...
├── docker-compose.yml      # orchestrates both containers
└── .dockerignore           # files to exclude from Docker build
```

---

## File 1: `frontend/Dockerfile`

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### Line by line:

| Line | What it does |
|---|---|
| `FROM node:20-alpine AS builder` | Downloads a lightweight Linux image with Node 20. Names this stage "builder" |
| `WORKDIR /app` | Creates `/app` directory inside the container, all next commands run here |
| `COPY package.json package-lock.json ./` | Copies only these 2 files first (for caching — see below) |
| `RUN npm ci` | Installs dependencies. This layer is cached until package.json changes |
| `COPY . .` | Copies the rest of your source code |
| `RUN npm run build` | Runs Vite build → produces `dist/` |
| `FROM nginx:alpine` | Starts a NEW image — fresh, clean, only nginx. Everything from stage 1 is discarded |
| `COPY --from=builder /app/dist ...` | Grabs ONLY `dist/` from stage 1 and puts it in nginx's serving directory |
| `COPY nginx.conf ...` | Copies your nginx config into the container |
| `EXPOSE 80` | Documents that this container listens on port 80 (nginx default) |

### Why two stages?
Stage 1 has Node, npm, node_modules, source code (~1 GB). You only need the built `dist/` folder (~200 KB). Stage 2 keeps only that + nginx. Final image: ~25 MB.

---

## File 2: `frontend/nginx.conf`

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Line by line:

| Line | What it does |
|---|---|
| `listen 80` | Accept connections on port 80 |
| `root ...` | Where the files are (where we copied dist/) |
| `index index.html` | Default file to serve |
| `try_files $uri $uri/ /index.html` | Try the exact file → try as directory → fallback to index.html. This is SPA fallback — React handles routing |
| `location /assets/` | Special rules for Vite's hashed assets |
| `expires 1y` | Browser caches these files for 1 year |
| `immutable` | Browser never re-checks — the hash in the filename guarantees freshness |

---

## File 3: `backend/Dockerfile`

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 4000
CMD ["node", "src/index.js"]
```

### Line by line:

| Line | What it does |
|---|---|
| `FROM node:20-alpine` | Single stage — backend NEEDS Node at runtime (unlike frontend) |
| `WORKDIR /app` | Working directory inside container |
| `COPY package.json ...` → `RUN npm ci` | Install dependencies (cached layer) |
| `COPY . .` | Copy your backend source code |
| `EXPOSE 4000` | Documents the port your Express server listens on |
| `CMD ["node", "src/index.js"]` | The command that runs when the container starts |

### Why no multi-stage?
Frontend throws away Node after building. Backend IS Node — it runs Node at runtime. So one stage is enough.

---

## File 4: `docker-compose.yml` (in project root `exp/`)

```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    restart: unless-stopped

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    restart: unless-stopped
```

### Line by line:

| Line | What it does |
|---|---|
| `services:` | List of containers to run |
| `frontend:` | Name of the first service (you choose the name) |
| `build: ./frontend` | Build using `./frontend/Dockerfile` |
| `ports: "3000:80"` | Your machine's port 3000 → container's port 80 (nginx) |
| `restart: unless-stopped` | Auto-restart if container crashes |
| `backend:` | Second service |
| `build: ./backend` | Build using `./backend/Dockerfile` |
| `ports: "4000:4000"` | Your machine's port 4000 → container's port 4000 (Express) |

---

## File 5: `.dockerignore` (in project root)

```
node_modules
dist
.git
.github
*.md
```

Like `.gitignore` but for Docker. These files won't be sent to Docker during build → faster builds, smaller context.

---

## Important: fix `vite.config.js` before building

Change `base` from `'/Web_claude/'` to `'/'` — Docker serves from root, not a GitHub Pages subfolder.

---

## Commands

```bash
# Build and start everything
docker compose up -d --build

# Check what's running
docker ps

# View logs
docker compose logs -f              # both services
docker compose logs -f frontend     # just frontend
docker compose logs -f backend      # just backend

# Stop everything
docker compose down

# Rebuild after code changes
docker compose up -d --build

# Remove everything (containers + images)
docker compose down --rmi all
```

## After running `docker compose up -d --build`:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000/api/health

---

## How Docker layer caching works

This is why we `COPY package.json` before `COPY . .`:

```
COPY package.json package-lock.json ./    ← Layer 1
RUN npm ci                                ← Layer 2 (slow, ~30s)
COPY . .                                  ← Layer 3
RUN npm run build                         ← Layer 4
```

Docker caches each layer. If `package.json` didn't change, layers 1+2 are cached — Docker skips `npm ci` entirely. Only layers 3+4 rebuild (fast, ~5s).

If you did `COPY . .` first, ANY file change (even a typo in a component) would invalidate the cache and re-run `npm ci` every time.

---

## Key concepts

| Concept | Analogy |
|---|---|
| **Image** | A class — a template/blueprint |
| **Container** | An object — a running instance of an image |
| **Dockerfile** | Constructor — instructions to build the image |
| **docker-compose.yml** | Main function — runs multiple containers together |
| **Volume** | External hard drive — persistent storage that survives restarts |
| **Port mapping** | Door number — `host:container` connects outside world to container |
| **Layer** | Git commit — each instruction is a snapshot, cached independently |
| **Multi-stage build** | Use one container to build, copy result to a clean container |
