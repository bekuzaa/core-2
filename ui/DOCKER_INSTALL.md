# datarhei Core UI - Docker Installation Guide

Complete guide for installing and deploying datarhei Core UI using Docker.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start with Docker Compose](#quick-start-with-docker-compose)
3. [Manual Docker Installation](#manual-docker-installation)
4. [Building Custom Image](#building-custom-image)
5. [Configuration](#configuration)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

## Prerequisites

### System Requirements
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **RAM**: Minimum 2GB (4GB recommended)
- **Disk Space**: Minimum 5GB
- **CPU**: 2 cores (4 cores recommended for transcoding)

### Check Versions

```bash
# Check Docker version
docker --version
# Expected output: Docker version 20.10.x or higher

# Check Docker Compose version
docker-compose --version
# Expected output: Docker Compose version 2.x.x or higher
```

### Install Docker (if needed)

**Ubuntu/Debian:**
```bash
# Update packages
sudo apt-get update

# Install dependencies
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
```

**macOS:**
```bash
# Install Docker Desktop
# Download from: https://docs.docker.com/desktop/install/mac-install/
# Or use Homebrew
brew install --cask docker
```

**Windows:**
- Download Docker Desktop from: https://docs.docker.com/desktop/install/windows-install/
- Enable WSL 2 for better performance

## Quick Start with Docker Compose

This is the **recommended method** for most users.

### Step 1: Create Project Directory

```bash
# Create directory for the project
mkdir datarhei-streaming
cd datarhei-streaming
```

### Step 2: Create docker-compose.yml

Create a file named `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # datarhei Core Backend
  datarhei-core:
    image: datarhei/core:latest
    container_name: datarhei-core
    restart: unless-stopped
    ports:
      - "8080:8080"      # HTTP API
      - "1935:1935"      # RTMP
      - "6000:6000/udp"  # SRT
    environment:
      # Authentication
      - CORE_API_AUTH_USERNAME=admin
      - CORE_API_AUTH_PASSWORD=admin123
      - CORE_API_AUTH_ENABLE=true

      # Logging
      - CORE_LOG_LEVEL=info

      # Storage
      - CORE_STORAGE_DISK_DIR=/core/data
      - CORE_STORAGE_DISK_SIZE=10240

      # RTMP Server
      - CORE_RTMP_ENABLE=true
      - CORE_RTMP_ADDRESS=:1935

      # SRT Server
      - CORE_SRT_ENABLE=true
      - CORE_SRT_ADDRESS=:6000

      # Sessions
      - CORE_SESSIONS_ENABLE=true
      - CORE_SESSIONS_PERSIST=true

      # Metrics
      - CORE_METRICS_ENABLE=true
      - CORE_METRICS_ENABLE_PROMETHEUS=true
    volumes:
      - ./config:/core/config
      - ./data:/core/data
    networks:
      - datarhei-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080/api/v3"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # datarhei Core UI
  datarhei-ui:
    image: datarhei/core-ui:latest
    container_name: datarhei-ui
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      datarhei-core:
        condition: service_healthy
    networks:
      - datarhei-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

networks:
  datarhei-network:
    driver: bridge

volumes:
  config:
    driver: local
  data:
    driver: local
```

### Step 3: Create Directory Structure

```bash
# Create directories for persistent data
mkdir -p config data
```

### Step 4: Start Services

```bash
# Start all services in detached mode
docker-compose up -d

# Expected output:
# Creating network "datarhei-network" with the default driver
# Creating datarhei-core ... done
# Creating datarhei-ui   ... done
```

### Step 5: Check Status

```bash
# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f

# Check specific service logs
docker-compose logs -f datarhei-core
docker-compose logs -f datarhei-ui
```

### Step 6: Access the Application

Open your web browser and navigate to:

- **UI**: http://localhost:3000
- **API**: http://localhost:8080
- **Swagger API Docs**: http://localhost:8080/api/swagger

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change the password after first login!

## Manual Docker Installation

### Method 1: Run Containers Separately

**Step 1: Create Network**
```bash
docker network create datarhei-network
```

**Step 2: Start datarhei Core Backend**
```bash
docker run -d \
  --name datarhei-core \
  --network datarhei-network \
  -p 8080:8080 \
  -p 1935:1935 \
  -p 6000:6000/udp \
  -e CORE_API_AUTH_USERNAME=admin \
  -e CORE_API_AUTH_PASSWORD=admin123 \
  -e CORE_API_AUTH_ENABLE=true \
  -e CORE_RTMP_ENABLE=true \
  -e CORE_SRT_ENABLE=true \
  -v $(pwd)/config:/core/config \
  -v $(pwd)/data:/core/data \
  datarhei/core:latest
```

**Step 3: Wait for Backend to Start**
```bash
# Wait for backend to be ready
until curl -s http://localhost:8080/api/v3 > /dev/null; do
  echo "Waiting for datarhei Core..."
  sleep 2
done
echo "datarhei Core is ready!"
```

**Step 4: Start UI**
```bash
docker run -d \
  --name datarhei-ui \
  --network datarhei-network \
  -p 3000:80 \
  datarhei/core-ui:latest
```

### Method 2: Using Docker Run with Link

```bash
# Start backend
docker run -d \
  --name datarhei-core \
  -p 8080:8080 \
  -p 1935:1935 \
  -p 6000:6000/udp \
  -e CORE_API_AUTH_USERNAME=admin \
  -e CORE_API_AUTH_PASSWORD=admin123 \
  -v $(pwd)/config:/core/config \
  -v $(pwd)/data:/core/data \
  datarhei/core:latest

# Start UI with link to backend
docker run -d \
  --name datarhei-ui \
  --link datarhei-core:datarhei-core \
  -p 3000:80 \
  datarhei/core-ui:latest
```

## Building Custom Image

### Step 1: Clone Repository

```bash
git clone https://github.com/datarhei/core.git
cd core/ui
```

### Step 2: Build Docker Image

```bash
# Build the image
docker build -t datarhei-core-ui:latest .

# Expected output:
# [+] Building 123.4s (15/15) FINISHED
# => => naming to docker.io/library/datarhei-core-ui:latest
```

### Step 3: Verify Image

```bash
# List images
docker images | grep datarhei

# Expected output:
# datarhei-core-ui    latest    abc123def456    2 minutes ago    50MB
```

### Step 4: Run Custom Image

```bash
docker run -d \
  --name datarhei-ui \
  --link datarhei-core:datarhei-core \
  -p 3000:80 \
  datarhei-core-ui:latest
```

### Step 5: Tag and Push (Optional)

```bash
# Tag image for Docker Hub
docker tag datarhei-core-ui:latest yourusername/datarhei-core-ui:latest

# Login to Docker Hub
docker login

# Push image
docker push yourusername/datarhei-core-ui:latest
```

## Configuration

### Environment Variables

**datarhei Core Backend:**
```bash
# Authentication
CORE_API_AUTH_USERNAME=admin
CORE_API_AUTH_PASSWORD=your_secure_password
CORE_API_AUTH_ENABLE=true

# TLS/HTTPS
CORE_TLS_ENABLE=true
CORE_TLS_AUTO=true          # Enable Let's Encrypt
CORE_HOST_NAME=your-domain.com
CORE_TLS_EMAIL=your@email.com

# Storage
CORE_STORAGE_DISK_DIR=/core/data
CORE_STORAGE_DISK_SIZE=20480  # 20GB in MB

# RTMP
CORE_RTMP_ENABLE=true
CORE_RTMP_ADDRESS=:1935
CORE_RTMP_APP=live
CORE_RTMP_TOKEN=your_rtmp_token

# SRT
CORE_SRT_ENABLE=true
CORE_SRT_ADDRESS=:6000
CORE_SRT_PASSPHRASE=your_srt_passphrase

# FFmpeg
CORE_FFMPEG_BINARY=/usr/local/bin/ffmpeg
CORE_FFMPEG_MAX_PROCESSES=10

# Sessions
CORE_SESSIONS_ENABLE=true
CORE_SESSIONS_PERSIST=true
CORE_SESSIONS_MAX_BITRATE=50  # Mbps
CORE_SESSIONS_MAX_SESSIONS=100

# Metrics
CORE_METRICS_ENABLE=true
CORE_METRICS_ENABLE_PROMETHEUS=true
```

### Custom Nginx Configuration

Create `custom-nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Proxy to Core backend
    location /api {
        proxy_pass http://datarhei-core:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Mount it in docker-compose.yml:
```yaml
datarhei-ui:
  volumes:
    - ./custom-nginx.conf:/etc/nginx/conf.d/default.conf:ro
```

### Resource Limits

Add resource limits in docker-compose.yml:

```yaml
services:
  datarhei-core:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G
```

## Production Deployment

### 1. Use Production-Ready Configuration

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  datarhei-core:
    image: datarhei/core:latest
    container_name: datarhei-core
    restart: always
    ports:
      - "8080:8080"
      - "1935:1935"
      - "6000:6000/udp"
    environment:
      - CORE_API_AUTH_USERNAME=${AUTH_USERNAME}
      - CORE_API_AUTH_PASSWORD=${AUTH_PASSWORD}
      - CORE_TLS_ENABLE=true
      - CORE_TLS_AUTO=true
      - CORE_HOST_NAME=${DOMAIN_NAME}
      - CORE_LOG_LEVEL=warn
    volumes:
      - ./config:/core/config
      - ./data:/core/data
    networks:
      - datarhei-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  datarhei-ui:
    image: datarhei/core-ui:latest
    container_name: datarhei-ui
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - datarhei-core
    networks:
      - datarhei-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Watchtower for automatic updates
  watchtower:
    image: containrrr/watchtower
    container_name: watchtower
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 3600 --cleanup

networks:
  datarhei-network:
    driver: bridge
```

**Create .env file:**
```bash
AUTH_USERNAME=admin
AUTH_PASSWORD=your_very_secure_password_here
DOMAIN_NAME=streaming.yourdomain.com
```

**Start production services:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Setup Reverse Proxy (Nginx)

**Install Nginx:**
```bash
sudo apt update
sudo apt install nginx
```

**Create Nginx configuration** (`/etc/nginx/sites-available/datarhei`):
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name streaming.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name streaming.yourdomain.com;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/streaming.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/streaming.yourdomain.com/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Proxy to UI
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy to API
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy HLS streams
    location /memfs {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        
        # CORS headers for video streaming
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'GET, OPTIONS' always;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/datarhei /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Setup Let's Encrypt SSL

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d streaming.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

### 4. Setup Firewall

```bash
# Ubuntu/Debian with ufw
sudo ufw enable
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 1935/tcp    # RTMP
sudo ufw allow 6000/udp    # SRT

# Check status
sudo ufw status
```

### 5. Setup Monitoring

**Add Prometheus and Grafana:**

```yaml
# Add to docker-compose.yml
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: always
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    networks:
      - datarhei-network

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: always
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_SERVER_ROOT_URL=https://streaming.yourdomain.com/grafana
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - datarhei-network

volumes:
  prometheus-data:
  grafana-data:
```

**Create prometheus.yml:**
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'datarhei-core'
    static_configs:
      - targets: ['datarhei-core:8080']
```

## Troubleshooting

### Check Container Status

```bash
# List all containers
docker ps -a

# Check logs
docker logs datarhei-core
docker logs datarhei-ui

# Follow logs in real-time
docker logs -f datarhei-core
```

### Container Won't Start

```bash
# Check detailed error
docker inspect datarhei-core

# Remove and recreate
docker-compose down
docker-compose up -d

# Force recreate
docker-compose up -d --force-recreate
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Change port in docker-compose.yml
ports:
  - "3001:80"  # Change from 3000 to 3001
```

### Network Issues

```bash
# Recreate network
docker network rm datarhei-network
docker network create datarhei-network

# Restart containers
docker-compose restart
```

### Storage Issues

```bash
# Check disk space
df -h

# Clean up Docker
docker system prune -a

# Remove unused volumes
docker volume prune
```

### Permission Issues

```bash
# Fix permissions on data directories
sudo chown -R 1000:1000 config/ data/
sudo chmod -R 755 config/ data/
```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v

# Remove all containers
docker rm -f $(docker ps -aq)

# Remove all images
docker rmi -f $(docker images -q)

# Remove all volumes
docker volume rm $(docker volume ls -q)

# Start fresh
docker-compose up -d
```

## Maintenance

### Backup

**Backup configuration and data:**
```bash
# Stop containers
docker-compose stop

# Backup
tar -czf backup-$(date +%Y%m%d).tar.gz config/ data/

# Or use Docker volume backup
docker run --rm \
  -v $(pwd)/config:/config \
  -v $(pwd)/data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup-$(date +%Y%m%d).tar.gz /config /data

# Start containers
docker-compose start
```

### Restore

```bash
# Stop containers
docker-compose down

# Restore
tar -xzf backup-20240101.tar.gz

# Start containers
docker-compose up -d
```

### Update

**Update images:**
```bash
# Pull latest images
docker-compose pull

# Recreate containers
docker-compose up -d

# Remove old images
docker image prune -f
```

### Monitor Resources

```bash
# Check container resource usage
docker stats

# Check container details
docker inspect datarhei-core
```

### View Logs

```bash
# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Logs for specific service
docker-compose logs datarhei-core

# Last 100 lines
docker-compose logs --tail=100

# Since timestamp
docker-compose logs --since 2024-01-01T00:00:00
```

## Best Practices

### 1. Use Environment Variables

Create `.env` file for sensitive data:
```bash
AUTH_USERNAME=admin
AUTH_PASSWORD=secure_password_here
DOMAIN_NAME=yourdomain.com
```

### 2. Regular Backups

Setup automatic backups:
```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

### 3. Monitor Logs

Setup log rotation:
```yaml
services:
  datarhei-core:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 4. Update Regularly

```bash
# Create update script
#!/bin/bash
docker-compose pull
docker-compose up -d
docker image prune -f
```

### 5. Security Hardening

- Change default passwords
- Use HTTPS (Let's Encrypt)
- Setup firewall
- Limit exposed ports
- Use non-root user in containers
- Keep Docker updated

## Next Steps

1. **Access the UI** at http://localhost:3000
2. **Login** with default credentials
3. **Change password** immediately
4. **Create your first stream** using the Wizard
5. **Explore features** in the dashboard
6. **Setup monitoring** with Prometheus/Grafana
7. **Configure backups** for production use

## Resources

- **Official Documentation**: https://docs.datarhei.com/core
- **GitHub Repository**: https://github.com/datarhei/core
- **Docker Hub**: https://hub.docker.com/r/datarhei/core
- **Community Support**: https://github.com/datarhei/core/discussions

---

**Happy Streaming! 🎥📡**

Made with ❤️ by datarhei