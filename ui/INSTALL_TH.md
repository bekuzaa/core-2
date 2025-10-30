# คู่มือการติดตั้ง datarhei Core UI (ภาษาไทย)

คู่มือการติดตั้งและใช้งาน datarhei Core UI อย่างครบถ้วน

## 📋 สารบัญ

1. [ข้อกำหนดเบื้องต้น](#ข้อกำหนดเบื้องต้น)
2. [การติดตั้งด้วย Docker (แนะนำ)](#การติดตั้งด้วย-docker-แนะนำ)
3. [การติดตั้งแบบ Manual](#การติดตั้งแบบ-manual)
4. [การตั้งค่า](#การตั้งค่า)
5. [การใช้งาน](#การใช้งาน)
6. [แก้ไขปัญหา](#แก้ไขปัญหา)

## ข้อกำหนดเบื้องต้น

### สำหรับการติดตั้งด้วย Docker
- **Docker**: เวอร์ชัน 20.10 หรือสูงกว่า
- **Docker Compose**: เวอร์ชัน 2.0 หรือสูงกว่า
- **RAM**: อย่างน้อย 2GB
- **Disk Space**: อย่างน้อย 5GB

### สำหรับการติดตั้งแบบ Manual
- **Node.js**: เวอร์ชัน 18.0 หรือสูงกว่า
- **npm**: เวอร์ชัน 9.0 หรือสูงกว่า
- **datarhei Core**: Backend ที่ทำงานอยู่

### ตรวจสอบเวอร์ชัน

```bash
# ตรวจสอบ Docker
docker --version
docker-compose --version

# ตรวจสอบ Node.js และ npm
node --version
npm --version
```

## การติดตั้งด้วย Docker (แนะนำ)

วิธีนี้เหมาะสำหรับการใช้งานจริง (Production) และง่ายที่สุด

### วิธีที่ 1: ใช้ Docker Compose (แนะนำ)

#### ขั้นตอนที่ 1: เตรียมไฟล์

```bash
# สร้างโฟลเดอร์สำหรับโปรเจค
mkdir datarhei-streaming
cd datarhei-streaming

# ดาวน์โหลดไฟล์ docker-compose.yml
# หรือคัดลอกจากโฟลเดอร์ ui/
```

#### ขั้นตอนที่ 2: สร้างโครงสร้างโฟลเดอร์

```bash
# สร้างโฟลเดอร์สำหรับเก็บข้อมูล
mkdir -p config data
```

#### ขั้นตอนที่ 3: เริ่มต้นใช้งาน

```bash
# เริ่ม Docker containers
docker-compose up -d

# ตรวจสอบสถานะ
docker-compose ps

# ดู logs
docker-compose logs -f
```

#### ขั้นตอนที่ 4: เข้าใช้งานระบบ

เปิดเว็บเบราว์เซอร์และไปที่:
- **UI**: http://localhost:3000
- **API**: http://localhost:8080
- **Swagger**: http://localhost:8080/api/swagger

**ข้อมูลเข้าสู่ระบบเริ่มต้น:**
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **สำคัญ**: เปลี่ยนรหัสผ่านหลังจากเข้าสู่ระบบครั้งแรก!

### วิธีที่ 2: Build Docker Image เอง

#### ขั้นตอนที่ 1: เข้าไปในโฟลเดอร์ UI

```bash
cd core-dev/ui
```

#### ขั้นตอนที่ 2: Build Docker Image

```bash
# Build image
docker build -t datarhei-core-ui:latest .

# ตรวจสอบ image ที่สร้าง
docker images | grep datarhei
```

#### ขั้นตอนที่ 3: เริ่มต้น Container

**หมายเหตุ**: ต้องมี datarhei Core backend ทำงานอยู่ก่อน

```bash
# เริ่ม datarhei Core backend ก่อน
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

# เริ่ม UI
docker run -d \
  --name datarhei-ui \
  --link datarhei-core:datarhei-core \
  -p 3000:80 \
  datarhei-core-ui:latest
```

### วิธีที่ 3: ใช้ Pre-built Image (ถ้ามี)

```bash
# Pull image จาก Docker Hub
docker pull datarhei/core-ui:latest

# Run container
docker run -d \
  --name datarhei-ui \
  --link datarhei-core:datarhei-core \
  -p 3000:80 \
  datarhei/core-ui:latest
```

## การติดตั้งแบบ Manual

เหมาะสำหรับการพัฒนาหรือกรณีที่ไม่ต้องการใช้ Docker

### ขั้นตอนที่ 1: ติดตั้ง Node.js

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS:**
```bash
brew install node
```

**Windows:**
ดาวน์โหลดจาก https://nodejs.org/

### ขั้นตอนที่ 2: Clone หรือเข้าไปในโฟลเดอร์ UI

```bash
cd core-dev/ui
```

### ขั้นตอนที่ 3: ติดตั้ง Dependencies

```bash
# ติดตั้ง packages ทั้งหมด
npm install

# รอจนเสร็จ (อาจใช้เวลา 2-5 นาที)
```

### ขั้นตอนที่ 4: ตั้งค่า Environment (ถ้าต้องการ)

สร้างไฟล์ `.env`:

```bash
# สร้างไฟล์ .env
cat > .env << 'EOF'
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=datarhei Core
VITE_DEBUG=false
EOF
```

### ขั้นตอนที่ 5: เริ่มต้น Development Server

```bash
npm run dev
```

เปิดเว็บเบราว์เซอร์ไปที่: http://localhost:3000

### ขั้นตอนที่ 6: Build สำหรับ Production

```bash
# Build
npm run build

# ผลลัพธ์จะอยู่ในโฟลเดอร์ dist/
```

### ขั้นตอนที่ 7: ทดสอบ Production Build

```bash
npm run preview
```

เปิดเว็บเบราว์เซอร์ไปที่: http://localhost:4173

## การตั้งค่า

### การตั้งค่า Docker Compose

แก้ไขไฟล์ `docker-compose.yml`:

```yaml
services:
  datarhei-core:
    environment:
      # เปลี่ยนชื่อผู้ใช้และรหัสผ่าน
      - CORE_API_AUTH_USERNAME=your_username
      - CORE_API_AUTH_PASSWORD=your_strong_password
      
      # เปิดใช้งาน TLS (HTTPS)
      - CORE_TLS_ENABLE=true
      - CORE_TLS_AUTO=true
      - CORE_HOST_NAME=your-domain.com
      
      # ปรับขนาด Storage
      - CORE_STORAGE_DISK_SIZE=20480  # 20GB
```

### การตั้งค่า Nginx (ถ้า Deploy บน Server จริง)

สร้างไฟล์ `/etc/nginx/sites-available/datarhei`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Proxy to UI
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
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
}
```

เปิดใช้งาน:
```bash
sudo ln -s /etc/nginx/sites-available/datarhei /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### การตั้งค่า Let's Encrypt (HTTPS ฟรี)

```bash
# ติดตั้ง Certbot
sudo apt install certbot python3-certbot-nginx

# ขอ Certificate
sudo certbot --nginx -d your-domain.com

# ทดสอบ Auto-renewal
sudo certbot renew --dry-run
```

## การใช้งาน

### การเข้าสู่ระบบครั้งแรก

1. เปิดเว็บเบราว์เซอร์ไปที่ http://localhost:3000
2. กรอกข้อมูล:
   - Username: `admin`
   - Password: `admin123`
3. คลิก "Sign In"
4. **เปลี่ยนรหัสผ่าน** ในหน้า Settings ทันที!

### การสร้าง Stream ด้วย Wizard

1. คลิก "Wizard" ในเมนูด้านซ้าย
2. ทำตามขั้นตอนทั้ง 5 ขั้นตอน:

#### ขั้นตอนที่ 1: ข้อมูลพื้นฐาน
- ใส่ชื่อ stream (เช่น "My Live Stream")
- ใส่คำอธิบาย
- เลือก License (Creative Commons)

#### ขั้นตอนที่ 2: ตั้งค่า Input
- **Network Stream**: สำหรับ URL แหล่งที่มาของวิดีโอ
- **RTMP Input**: รับสัญญาณจาก OBS/Encoder
- **SRT Input**: สำหรับ Low-latency streaming
- **Device**: กล้อง/Capture card

#### ขั้นตอนที่ 3: ตั้งค่า Output
คลิก "Add Output" เพื่อเพิ่มปลายทาง:
- **YouTube Live**: ใส่ Stream Key
- **Twitch**: ใส่ Stream Key
- **Facebook Live**: ใส่ Stream Key
- **HLS**: สำหรับ Web Player
- **Custom Server**: RTMP/SRT URL ของคุณ

#### ขั้นตอนที่ 4: ตั้งค่า Encoding
- **Video Codec**: H.264, H.265, VP9 หรือ Copy
- **Audio Codec**: AAC, Opus, MP3 หรือ Copy
- **Resolution**: 4K, 1080p, 720p, 480p, 360p
- **Bitrate**: ตั้งค่าตามต้องการ

#### ขั้นตอนที่ 5: ตรวจสอบและเริ่มต้น
- ตรวจสอบการตั้งค่าทั้งหมด
- คลิก "Create Stream"
- รอจนระบบเริ่มต้น stream

### การจัดการ Processes

**ดู Process ทั้งหมด:**
1. คลิก "Processes" ในเมนู
2. ดูรายการ process ทั้งหมด
3. คลิกที่ process เพื่อดูรายละเอียด

**ควบคุม Process:**
- **Start**: เริ่มต้น process
- **Stop**: หยุด process
- **Restart**: เริ่มต้นใหม่
- **Delete**: ลบ process

### การตรวจสอบระบบ

**Dashboard:**
- ดูภาพรวมของระบบ
- CPU, Memory, Disk usage
- จำนวน viewers
- สถานะ processes

**Metrics:**
- กราฟแสดงประสิทธิภาพระบบ
- ข้อมูลในอดีต
- Export ข้อมูล

**Sessions:**
- ดู viewers ที่กำลังดูอยู่
- Bandwidth ที่ใช้
- ข้อมูลการเชื่อมต่อ

**Logs:**
- Log ของระบบ
- Log ของแต่ละ process
- ค้นหา log
- ดาวน์โหลด log

## แก้ไขปัญหา

### ปัญหา: Docker Container ไม่สามารถเริ่มต้นได้

**ตรวจสอบ logs:**
```bash
docker-compose logs datarhei-core
docker-compose logs datarhei-ui
```

**แก้ไข:**
```bash
# หยุด containers
docker-compose down

# ลบ volumes (ระวัง: จะลบข้อมูลทั้งหมด)
docker-compose down -v

# เริ่มใหม่
docker-compose up -d
```

### ปัญหา: ไม่สามารถเข้าสู่ระบบได้

**ตรวจสอบ:**
1. ตรวจสอบว่า datarhei Core backend ทำงานอยู่
   ```bash
   curl http://localhost:8080/api/v3
   ```

2. ตรวจสอบ username/password ใน docker-compose.yml

3. ลอง reset password:
   ```bash
   docker-compose restart datarhei-core
   ```

### ปัญหา: UI แสดงหน้าว่างเปล่า

**แก้ไข:**
1. ตรวจสอบ Browser Console (F12)
2. Clear browser cache (Ctrl+Shift+Delete)
3. ลองเปิดใน Incognito/Private mode
4. ตรวจสอบว่า API เชื่อมต่อได้:
   ```bash
   curl http://localhost:3000/health
   ```

### ปัญหา: Port ถูกใช้งานอยู่แล้ว

**ข้อความแสดงข้อผิดพลาด:**
```
Error: bind: address already in use
```

**แก้ไข:**
```bash
# หา process ที่ใช้ port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# หรือเปลี่ยน port ใน docker-compose.yml
ports:
  - "3001:80"  # เปลี่ยนจาก 3000 เป็น 3001
```

### ปัญหา: Build ล้มเหลว

**แก้ไข:**
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install

# ลบ cache
npm cache clean --force

# Build อีกครั้ง
npm run build
```

### ปัญหา: Stream ไม่ทำงาน

**ตรวจสอบ:**
1. ดู Logs ของ process
2. ตรวจสอบ Input URL ว่าถูกต้อง
3. ตรวจสอบ Output URL/Stream Key
4. ตรวจสอบ Firewall (ต้องเปิด ports: 1935 สำหรับ RTMP, 6000 สำหรับ SRT)

**เปิด Firewall ports:**
```bash
# Ubuntu/Debian
sudo ufw allow 1935/tcp  # RTMP
sudo ufw allow 6000/udp  # SRT
sudo ufw allow 8080/tcp  # API
sudo ufw allow 3000/tcp  # UI
```

### ปัญหา: Out of Memory

**แก้ไข:**
```bash
# เพิ่ม memory limit ใน docker-compose.yml
services:
  datarhei-core:
    mem_limit: 4g
    memswap_limit: 4g
```

### ปัญหา: CORS Error

**แก้ไข:**
แก้ไขไฟล์ `nginx.conf`:
```nginx
location /api {
    # เพิ่ม CORS headers
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header Access-Control-Allow-Headers 'Authorization, Content-Type' always;
    
    proxy_pass http://datarhei-core:8080;
}
```

## คำสั่งที่มีประโยชน์

### Docker Commands

```bash
# ดูสถานะ containers
docker-compose ps

# ดู logs แบบ real-time
docker-compose logs -f

# Restart services
docker-compose restart

# หยุด services
docker-compose stop

# เริ่ม services
docker-compose start

# ลบ containers และ volumes
docker-compose down -v

# Pull images ใหม่
docker-compose pull

# Rebuild images
docker-compose build --no-cache

# เข้าไปใน container
docker exec -it datarhei-core sh
docker exec -it datarhei-ui sh

# ดู resource usage
docker stats

# ล้าง Docker (ระวัง!)
docker system prune -a
```

### npm Commands

```bash
# ติดตั้ง dependencies
npm install

# เริ่ม dev server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format

# ตรวจสอบ outdated packages
npm outdated

# Update packages
npm update
```

## การ Backup และ Restore

### Backup

```bash
# Backup data
tar -czf backup-$(date +%Y%m%d).tar.gz config/ data/

# หรือใช้ Docker volume backup
docker run --rm \
  -v datarhei-streaming_config:/config \
  -v datarhei-streaming_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/backup-$(date +%Y%m%d).tar.gz /config /data
```

### Restore

```bash
# Restore data
tar -xzf backup-20240101.tar.gz

# หรือ restore จาก volume backup
docker run --rm \
  -v datarhei-streaming_config:/config \
  -v datarhei-streaming_data:/data \
  -v $(pwd):/backup \
  alpine sh -c "cd / && tar xzf /backup/backup-20240101.tar.gz"
```

## Security Best Practices

### 1. เปลี่ยนรหัสผ่านเริ่มต้น
```bash
# แก้ไขใน docker-compose.yml
CORE_API_AUTH_USERNAME=your_username
CORE_API_AUTH_PASSWORD=your_strong_password_here
```

### 2. ใช้ HTTPS
```bash
# เปิดใช้งาน Let's Encrypt
CORE_TLS_ENABLE=true
CORE_TLS_AUTO=true
CORE_HOST_NAME=your-domain.com
```

### 3. จำกัดการเข้าถึง
```bash
# ใน docker-compose.yml - เปิด ports เฉพาะที่จำเป็น
ports:
  - "127.0.0.1:8080:8080"  # API เฉพาะ localhost
  - "3000:80"               # UI เปิดให้ทุกคนเข้าถึงได้
```

### 4. อัพเดทเป็นประจำ
```bash
# Pull images ใหม่
docker-compose pull
docker-compose up -d
```

### 5. ตั้งค่า Firewall
```bash
# Ubuntu/Debian with ufw
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 1935/tcp  # RTMP
sudo ufw allow 6000/udp  # SRT
```

## การอัพเกรด

### อัพเกรดผ่าน Docker Compose

```bash
# Pull images ใหม่
docker-compose pull

# Restart containers
docker-compose down
docker-compose up -d

# ตรวจสอบ logs
docker-compose logs -f
```

### อัพเกรดแบบ Manual

```bash
# Pull code ใหม่
git pull origin main

# ติดตั้ง dependencies ใหม่
npm install

# Build ใหม่
npm run build

# Restart server
```

## การ Monitor และ Maintenance

### ตรวจสอบ Health

```bash
# ตรวจสอบ API
curl http://localhost:8080/api/v3

# ตรวจสอบ UI
curl http://localhost:3000/health

# ตรวจสอบ Prometheus metrics
curl http://localhost:8080/metrics
```

### ตั้งค่า Monitoring ด้วย Prometheus + Grafana

สร้างไฟล์ `monitoring-docker-compose.yml`:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
    networks:
      - datarhei-network

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    networks:
      - datarhei-network
```

## ทรัพยากรเพิ่มเติม

### เอกสารประกอบ
- **README.md** - เอกสารหลัก
- **FEATURES.md** - รายการคุณสมบัติทั้งหมด
- **QUICKSTART.md** - เริ่มต้นใช้งานอย่างรวดเร็ว
- **API Documentation** - http://localhost:8080/api/swagger

### ลิงก์ที่เป็นประโยชน์
- **เว็บไซต์**: https://datarhei.com
- **เอกสาร**: https://docs.datarhei.com/core
- **GitHub**: https://github.com/datarhei/core
- **Community**: https://github.com/datarhei/core/discussions

### ติดต่อและสนับสนุน
- **GitHub Issues**: https://github.com/datarhei/core/issues
- **Discussions**: https://github.com/datarhei/core/discussions
- **Email**: support@datarhei.com

## สรุป

คุณได้เรียนรู้วิธีการ:
- ✅ ติดตั้ง datarhei Core UI ด้วย Docker
- ✅ ติดตั้งแบบ Manual
- ✅ ตั้งค่าและใช้งานระบบ
- ✅ สร้าง Stream ด้วย Wizard
- ✅ แก้ไขปัญหาที่พบบ่อย
- ✅ ดูแลรักษาระบบ

## ขั้นตอนถัดไป

1. **เข้าสู่ระบบ** และเปลี่ยนรหัสผ่าน
2. **ทดลองสร้าง Stream** ด้วย Wizard
3. **อ่านคู่มือเพิ่มเติม** ใน FEATURES.md
4. **ทดลองฟีเจอร์ต่างๆ** ในระบบ
5. **ตั้งค่า Monitoring** สำหรับการใช้งานจริง

---

**สนุกกับการ Streaming! 🎥📡**

Made with ❤️ by datarhei