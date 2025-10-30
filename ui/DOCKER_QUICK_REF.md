# Docker Quick Reference Card - datarhei Core UI

Quick commands and reference for managing datarhei Core UI with Docker.

## 🚀 Quick Start

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# Restart
docker-compose restart
```

## 📦 Basic Commands

### Starting Services

```bash
# Start in detached mode
docker-compose up -d

# Start with logs visible
docker-compose up

# Start specific service
docker-compose up -d datarhei-ui
```

### Stopping Services

```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop datarhei-core

# Stop and remove containers
docker-compose down

# Stop and remove with volumes (⚠️ deletes data)
docker-compose down -v
```

### Restarting Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart datarhei-ui

# Force recreate
docker-compose up -d --force-recreate
```

## 📊 Monitoring

### Check Status

```bash
# List running containers
docker-compose ps

# Check all containers (including stopped)
docker ps -a

# Check resource usage
docker stats
```

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs datarhei-core

# Follow logs (real-time)
docker-compose logs -f

# Last 50 lines
docker-compose logs --tail=50

# Since specific time
docker-compose logs --since 2024-01-01
```

### Health Checks

```bash
# Check API
curl http://localhost:8080/api/v3

# Check UI
curl http://localhost:3000/health

# Test from inside container
docker exec datarhei-core wget -q -O- http://localhost:8080/api/v3
```

## 🔧 Maintenance

### Update Images

```bash
# Pull latest images
docker-compose pull

# Update and restart
docker-compose pull && docker-compose up -d

# Remove old images
docker image prune -f
```

### Backup

```bash
# Backup data
docker-compose stop
tar -czf backup-$(date +%Y%m%d).tar.gz config/ data/
docker-compose start

# Backup with Docker
docker run --rm \
  -v $(pwd)/config:/config \
  -v $(pwd)/data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup-$(date +%Y%m%d).tar.gz /config /data
```

### Restore

```bash
# Stop services
docker-compose down

# Extract backup
tar -xzf backup-20240101.tar.gz

# Start services
docker-compose up -d
```

## 🐛 Troubleshooting

### Reset Everything

```bash
# Complete reset (⚠️ deletes all data)
docker-compose down -v
docker-compose up -d
```

### Fix Permissions

```bash
# Fix data directory permissions
sudo chown -R 1000:1000 config/ data/
sudo chmod -R 755 config/ data/
```

### Clean Docker

```bash
# Remove unused data
docker system prune

# Remove everything (⚠️ including volumes)
docker system prune -a --volumes

# Remove specific items
docker container prune  # Remove stopped containers
docker image prune      # Remove unused images
docker volume prune     # Remove unused volumes
docker network prune    # Remove unused networks
```

### Access Container Shell

```bash
# Access Core backend shell
docker exec -it datarhei-core sh

# Access UI shell
docker exec -it datarhei-ui sh

# Run command in container
docker exec datarhei-core ls -la /core/data
```

## 🔍 Inspection

### Container Details

```bash
# Inspect container
docker inspect datarhei-core

# Get IP address
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' datarhei-core

# Get all ports
docker port datarhei-core
```

### Network Details

```bash
# List networks
docker network ls

# Inspect network
docker network inspect datarhei-network

# Check connectivity
docker exec datarhei-ui ping datarhei-core
```

### Volume Details

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect datarhei-streaming_data

# Remove unused volumes
docker volume prune
```

## 🔐 Security

### Change Passwords

Edit `docker-compose.yml`:
```yaml
environment:
  - CORE_API_AUTH_USERNAME=your_username
  - CORE_API_AUTH_PASSWORD=your_secure_password
```

Then restart:
```bash
docker-compose down
docker-compose up -d
```

### View Environment Variables

```bash
# Show all env vars
docker exec datarhei-core env

# Show specific var
docker exec datarhei-core env | grep AUTH
```

## 📝 Configuration

### Edit Configuration

```bash
# Edit docker-compose.yml
nano docker-compose.yml

# Validate syntax
docker-compose config

# Apply changes
docker-compose up -d
```

### Environment File

Create `.env`:
```bash
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123
DOMAIN_NAME=streaming.example.com
```

Use in docker-compose.yml:
```yaml
environment:
  - CORE_API_AUTH_USERNAME=${AUTH_USERNAME}
  - CORE_API_AUTH_PASSWORD=${AUTH_PASSWORD}
```

## 🏗️ Building

### Build Custom Image

```bash
# Build UI image
cd ui/
docker build -t datarhei-core-ui:custom .

# Build with tag
docker build -t myrepo/datarhei-core-ui:v1.0 .

# Build without cache
docker build --no-cache -t datarhei-core-ui:latest .
```

### Push to Registry

```bash
# Tag image
docker tag datarhei-core-ui:latest myrepo/datarhei-core-ui:latest

# Login to Docker Hub
docker login

# Push image
docker push myrepo/datarhei-core-ui:latest
```

## 📊 Performance

### Resource Limits

Add to docker-compose.yml:
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

### Monitor Resources

```bash
# Real-time stats
docker stats

# Specific container
docker stats datarhei-core

# Format output
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

## 🌐 Networking

### Port Mapping

```bash
# List port mappings
docker port datarhei-ui

# Map additional port
docker-compose.yml:
  ports:
    - "8081:80"    # Add new port mapping
```

### Network Commands

```bash
# Create network
docker network create my-network

# Connect container to network
docker network connect my-network datarhei-core

# Disconnect
docker network disconnect my-network datarhei-core
```

## 📍 Common Issues

### Port Already in Use

```bash
# Find process
lsof -i :3000

# Change port in docker-compose.yml
ports:
  - "3001:80"
```

### Container Keeps Restarting

```bash
# Check logs
docker logs datarhei-core --tail=100

# Check exit code
docker inspect datarhei-core --format='{{.State.ExitCode}}'

# Disable restart
docker update --restart=no datarhei-core
```

### Cannot Connect to Backend

```bash
# Check if running
docker ps | grep datarhei-core

# Check network
docker network inspect datarhei-network

# Test connectivity
docker exec datarhei-ui ping datarhei-core
```

## 🔄 Updates

### Update Workflow

```bash
# 1. Backup
docker-compose stop
tar -czf backup-$(date +%Y%m%d).tar.gz config/ data/

# 2. Pull updates
docker-compose pull

# 3. Restart
docker-compose up -d

# 4. Verify
docker-compose ps
docker-compose logs -f
```

### Rollback

```bash
# Use specific version
docker-compose.yml:
  datarhei-core:
    image: datarhei/core:16.10.0  # Specific version

# Restart with old version
docker-compose up -d
```

## 📱 Useful Aliases

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Docker Compose shortcuts
alias dc='docker-compose'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'
alias dcp='docker-compose ps'
alias dcr='docker-compose restart'

# Docker shortcuts
alias d='docker'
alias dps='docker ps'
alias dpsa='docker ps -a'
alias di='docker images'
alias dex='docker exec -it'
alias dlogs='docker logs -f'

# Datarhei specific
alias core-logs='docker logs -f datarhei-core'
alias ui-logs='docker logs -f datarhei-ui'
alias core-shell='docker exec -it datarhei-core sh'
alias core-restart='docker-compose restart datarhei-core'
```

## 📞 Quick Links

- **UI**: http://localhost:3000
- **API**: http://localhost:8080
- **Swagger**: http://localhost:8080/api/swagger
- **Metrics**: http://localhost:8080/metrics
- **Health**: http://localhost:3000/health

## 🆘 Emergency Commands

```bash
# Kill everything
docker kill $(docker ps -q)

# Remove everything
docker rm -f $(docker ps -aq)

# Clean everything
docker system prune -a --volumes -f

# Start fresh
cd /path/to/project
docker-compose up -d
```

## 📚 Documentation

- **Full Guide**: See DOCKER_INSTALL.md
- **Thai Guide**: See INSTALL_TH.md
- **Quick Start**: See QUICKSTART.md
- **Features**: See FEATURES.md

---

**Default Login**
- Username: `admin`
- Password: `admin123`

**Important Ports**
- 3000: UI (HTTP)
- 8080: API (HTTP)
- 1935: RTMP
- 6000: SRT (UDP)

**Support**
- GitHub: https://github.com/datarhei/core
- Docs: https://docs.datarhei.com/core