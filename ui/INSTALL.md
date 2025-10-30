# datarhei Core UI - Installation Guide

Complete installation guide for setting up the datarhei Core user interface.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Development Setup](#development-setup)
4. [Production Build](#production-build)
5. [Docker Deployment](#docker-deployment)
6. [Integration with Core](#integration-with-core)
7. [Configuration](#configuration)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **datarhei Core**: Backend service running (v16+)

### Check Your Environment

```bash
# Check Node.js version
node --version
# Should output: v18.x.x or higher

# Check npm version
npm --version
# Should output: 9.x.x or higher
```

### Install Node.js (if needed)

**Windows:**
Download from [nodejs.org](https://nodejs.org/) and run the installer.

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

## Quick Start

Get the UI running in under 5 minutes:

```bash
# 1. Navigate to the UI directory
cd core-dev/ui

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The UI will be available at: **http://localhost:3000**

Default login credentials:
- **Username:** `admin`
- **Password:** `admin123`

## Development Setup

### Step 1: Clone/Navigate to Project

```bash
# If you haven't cloned the repository yet
git clone https://github.com/datarhei/core.git
cd core/ui

# Or if you already have it
cd path/to/core-dev/ui
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# This will install:
# - React and React DOM
# - Vite (build tool)
# - Tailwind CSS
# - Video.js
# - Axios
# - Zustand (state management)
# - And all other dependencies
```

Expected output:
```
added 1234 packages, and audited 1235 packages in 45s

234 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Step 3: Configure Environment (Optional)

Create a `.env` file in the UI directory:

```bash
# Create .env file
touch .env
```

Add configuration:

```env
# API Base URL (default: /api via proxy)
VITE_API_BASE_URL=http://localhost:8080

# Application Title
VITE_APP_TITLE=datarhei Core

# Enable debug mode
VITE_DEBUG=false
```

### Step 4: Start Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v5.0.8  ready in 543 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.100:3000/
  ➜  press h to show help
```

### Step 5: Access the UI

Open your browser and navigate to:
- **Local:** http://localhost:3000
- **Network:** http://[your-ip]:3000

## Production Build

### Build for Production

```bash
# Create optimized production build
npm run build
```

This will:
1. Compile and minify JavaScript
2. Optimize CSS with Tailwind
3. Optimize images and assets
4. Generate source maps (optional)
5. Create the `dist/` directory

Expected output:
```
vite v5.0.8 building for production...
✓ 1234 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-abc123.css     12.34 kB │ gzip:  3.45 kB
dist/assets/index-def456.js     123.45 kB │ gzip: 45.67 kB
✓ built in 5.67s
```

### Preview Production Build

```bash
# Test the production build locally
npm run preview
```

The production build will be available at: http://localhost:4173

### Build Output

The `dist/` directory structure:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   ├── react-vendor-[hash].js
│   ├── video-vendor-[hash].js
│   └── ...
└── favicon.svg
```

## Docker Deployment

### Option 1: Use with datarhei Core Docker Image

The UI is automatically included when building the official datarhei Core Docker image.

```bash
# Run datarhei Core with UI
docker run -d \
  --name datarhei-core \
  -p 8080:8080 \
  -e CORE_API_AUTH_USERNAME=admin \
  -e CORE_API_AUTH_PASSWORD=secret \
  -e CORE_ROUTER_UI_PATH=/path/to/ui/dist \
  -v $(pwd)/config:/core/config \
  -v $(pwd)/data:/core/data \
  datarhei/core:latest
```

Access the UI at: http://localhost:8080/ui

### Option 2: Separate UI Container (Nginx)

Create `Dockerfile` in UI directory:

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Proxy API requests to Core backend
    location /api {
        proxy_pass http://datarhei-core:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Build and run:

```bash
# Build Docker image
docker build -t datarhei-core-ui .

# Run container
docker run -d \
  --name core-ui \
  -p 3000:80 \
  --link datarhei-core:datarhei-core \
  datarhei-core-ui
```

### Option 3: Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  datarhei-core:
    image: datarhei/core:latest
    container_name: datarhei-core
    ports:
      - "8080:8080"
    environment:
      - CORE_API_AUTH_USERNAME=admin
      - CORE_API_AUTH_PASSWORD=secret
      - CORE_ROUTER_UI_PATH=/ui
    volumes:
      - ./config:/core/config
      - ./data:/core/data
      - ./ui/dist:/ui
    restart: unless-stopped

  # Optional: Separate UI container
  core-ui:
    build: ./ui
    container_name: core-ui
    ports:
      - "3000:80"
    depends_on:
      - datarhei-core
    restart: unless-stopped
```

Run with Docker Compose:

```bash
docker-compose up -d
```

## Integration with Core

### Configure Core to Serve UI

Edit Core configuration (`config.json`):

```json
{
  "router": {
    "ui_path": "/path/to/ui/dist",
    "routes": {},
    "blocked_prefixes": ["/api"]
  }
}
```

### Using Environment Variables

```bash
# Set UI path via environment variable
export CORE_ROUTER_UI_PATH=/path/to/ui/dist

# Run Core
./core
```

### Verify Integration

1. Start datarhei Core
2. Navigate to: http://localhost:8080/ui
3. You should see the login page

## Configuration

### Vite Configuration

Edit `vite.config.js` to customize:

```javascript
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
```

### Tailwind Configuration

Edit `tailwind.config.js` to customize theme:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#0ea5e9', // Change primary color
        },
      },
    },
  },
};
```

### API Configuration

Create `.env` file:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8080

# API timeout (ms)
VITE_API_TIMEOUT=30000

# Enable debug logging
VITE_DEBUG=true
```

## Troubleshooting

### Common Issues

#### 1. Port 3000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use a different port
npm run dev -- --port 3001
```

#### 2. Module Not Found

**Error:**
```
Error: Cannot find module 'react'
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Cannot Connect to API

**Error:**
```
Network Error: Failed to fetch
```

**Solutions:**
```bash
# Check if Core is running
curl http://localhost:8080/api/v3

# Verify proxy configuration in vite.config.js
# Check CORS settings in Core configuration
```

#### 4. Build Fails

**Error:**
```
Error: Build failed with errors
```

**Solution:**
```bash
# Clear cache and rebuild
rm -rf dist node_modules/.vite
npm install
npm run build
```

#### 5. White Screen After Build

**Problem:** Production build shows blank page

**Solution:**
```bash
# Check browser console for errors
# Verify base path in vite.config.js:
export default defineConfig({
  base: '/ui/',  // If serving from subdirectory
});

# Rebuild
npm run build
```

### Debug Mode

Enable detailed logging:

```javascript
// In src/main.jsx
if (import.meta.env.DEV) {
  console.log('Running in development mode');
}

// In browser console
localStorage.setItem('debug', 'true');
```

### Check Versions

```bash
# Verify all dependencies are correct
npm list

# Check for outdated packages
npm outdated

# Update packages
npm update
```

### Network Issues

```bash
# Clear npm cache
npm cache clean --force

# Use different registry
npm config set registry https://registry.npmjs.org/

# Install with verbose logging
npm install --verbose
```

## Performance Optimization

### Production Optimizations

```bash
# Analyze bundle size
npm run build -- --mode analyze

# Enable compression in nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### Caching Strategy

```nginx
# In nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Next Steps

After installation:

1. **Login** to the UI with default credentials
2. **Change password** in Settings
3. **Run the Wizard** to create your first stream
4. **Explore features** in the sidebar menu
5. **Read documentation** at /docs

## Support

- **Documentation:** https://docs.datarhei.com/core
- **GitHub Issues:** https://github.com/datarhei/core/issues
- **Discussions:** https://github.com/datarhei/core/discussions
- **Website:** https://datarhei.com

## License

Apache License 2.0 - see LICENSE file

---

**Happy Streaming! 🎥**