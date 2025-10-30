# คู่มือการทดสอบการเชื่อมต่อ API

คู่มือการตรวจสอบและทดสอบการเชื่อมต่อระหว่าง Web UI Console กับ datarhei Core API

## 📋 สารบัญ

1. [ภาพรวม](#ภาพรวม)
2. [เครื่องมือทดสอบ](#เครื่องมือทดสอบ)
3. [วิธีการทดสอบ](#วิธีการทดสอบ)
4. [การทดสอบด้วย Browser Console](#การทดสอบด้วย-browser-console)
5. [การทดสอบด้วย cURL](#การทดสอบด้วย-curl)
6. [แก้ไขปัญหา](#แก้ไขปัญหา)

## ภาพรวม

Web UI ต้องเชื่อมต่อกับ datarhei Core API เพื่อ:
- ✅ Login/Authentication
- ✅ จัดการ FFmpeg processes
- ✅ ดู metrics และ statistics
- ✅ จัดการไฟล์
- ✅ ตั้งค่าระบบ
- ✅ ดู logs

**API Endpoints สำคัญ:**
- `GET /api/v3` - System information
- `GET /api/v3/config` - Configuration
- `GET /api/v3/process` - Process list
- `GET /api/v3/metrics` - System metrics
- `GET /api/v3/session` - Active sessions

## เครื่องมือทดสอบ

### วิธีที่ 1: ใช้ Test Page (แนะนำ)

เราได้สร้างหน้าทดสอบที่ใช้งานง่าย:

```bash
# เปิดไฟล์นี้ในเว็บเบราว์เซอร์
D:\Program\Zed\core-dev\core-dev\ui\test-api-connection.html
```

**ฟีเจอร์:**
- ✅ ทดสอบ API ทั้งหมด 10 endpoints
- ✅ ตรวจสอบ authentication
- ✅ แสดงผลลัพธ์แบบ real-time
- ✅ วัดเวลา response
- ✅ แสดง error messages
- ✅ สรุปผลการทดสอบ

**วิธีใช้งาน:**
1. เปิดไฟล์ `test-api-connection.html` ในเว็บเบราว์เซอร์
2. กรอกข้อมูล:
   - API URL: `http://localhost:8080`
   - Username: `admin`
   - Password: `admin123`
3. คลิก "Run All Tests"
4. รอผลการทดสอบ

### วิธีที่ 2: ทดสอบใน Web UI Console

#### ขั้นตอนที่ 1: เปิด Developer Tools

```
Chrome/Edge: กด F12 หรือ Ctrl+Shift+I
Firefox: กด F12 หรือ Ctrl+Shift+K
Safari: กด Cmd+Option+I (ต้องเปิด Developer menu ก่อน)
```

#### ขั้นตอนที่ 2: ไปที่ Console Tab

คุณจะเห็น console พร้อมใช้งาน

#### ขั้นตอนที่ 3: ทดสอบ API

**ทดสอบการเชื่อมต่อพื้นฐาน:**

```javascript
// Test 1: Basic connectivity (ไม่ต้อง auth)
fetch('http://localhost:8080/api/v3')
  .then(response => response.json())
  .then(data => {
    console.log('✅ API Connected!');
    console.log('Version:', data.version);
    console.log('Data:', data);
  })
  .catch(error => {
    console.error('❌ Connection failed:', error);
  });
```

**ทดสอบ Authentication:**

```javascript
// Test 2: Authentication
const username = 'admin';
const password = 'admin123';
const authHeader = 'Basic ' + btoa(username + ':' + password);

fetch('http://localhost:8080/api/v3', {
  headers: {
    'Authorization': authHeader
  }
})
  .then(response => {
    console.log('Status:', response.status);
    if (response.ok) {
      console.log('✅ Authentication successful!');
      return response.json();
    } else {
      console.error('❌ Authentication failed!');
      throw new Error('Auth failed');
    }
  })
  .then(data => {
    console.log('System Info:', data);
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
```

**ทดสอบ Process List:**

```javascript
// Test 3: Get processes
const username = 'admin';
const password = 'admin123';
const authHeader = 'Basic ' + btoa(username + ':' + password);

fetch('http://localhost:8080/api/v3/process', {
  headers: {
    'Authorization': authHeader
  }
})
  .then(response => response.json())
  .then(data => {
    console.log('✅ Processes:', data.length);
    console.log('Data:', data);
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
```

**ทดสอบ Metrics:**

```javascript
// Test 4: Get metrics
const username = 'admin';
const password = 'admin123';
const authHeader = 'Basic ' + btoa(username + ':' + password);

fetch('http://localhost:8080/api/v3/metrics', {
  headers: {
    'Authorization': authHeader
  }
})
  .then(response => response.json())
  .then(data => {
    console.log('✅ Metrics received!');
    console.log('CPU:', data.cpu);
    console.log('Memory:', data.memory);
    console.log('Data:', data);
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
```

**ทดสอบ Configuration:**

```javascript
// Test 5: Get configuration
const username = 'admin';
const password = 'admin123';
const authHeader = 'Basic ' + btoa(username + ':' + password);

fetch('http://localhost:8080/api/v3/config', {
  headers: {
    'Authorization': authHeader
  }
})
  .then(response => response.json())
  .then(data => {
    console.log('✅ Configuration loaded!');
    console.log('Config:', data.config);
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
```

### วิธีที่ 3: ทดสอบแบบครบวงจร (All-in-One)

Copy โค้ดนี้ทั้งหมดลง Console:

```javascript
// API Connection Tester
const API_URL = 'http://localhost:8080';
const USERNAME = 'admin';
const PASSWORD = 'admin123';
const AUTH = 'Basic ' + btoa(USERNAME + ':' + PASSWORD);

const tests = [
  { name: 'Basic Connection', endpoint: '/api/v3', auth: false },
  { name: 'Authentication', endpoint: '/api/v3', auth: true },
  { name: 'System Info', endpoint: '/api/v3', auth: true },
  { name: 'Configuration', endpoint: '/api/v3/config', auth: true },
  { name: 'Processes', endpoint: '/api/v3/process', auth: true },
  { name: 'Skills', endpoint: '/api/v3/skills', auth: true },
  { name: 'Metrics', endpoint: '/api/v3/metrics', auth: true },
  { name: 'Sessions', endpoint: '/api/v3/session/active', auth: true },
  { name: 'Filesystems', endpoint: '/api/v3/fs', auth: true }
];

console.log('🔍 Starting API Connection Tests...\n');

async function runTests() {
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const url = API_URL + test.endpoint;
    const options = {
      headers: test.auth ? { 'Authorization': AUTH } : {}
    };
    
    try {
      const startTime = performance.now();
      const response = await fetch(url, options);
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${test.name}: PASSED (${responseTime}ms)`);
        passed++;
      } else {
        console.error(`❌ ${test.name}: FAILED (${response.status} ${response.statusText})`);
        failed++;
      }
    } catch (error) {
      console.error(`❌ ${test.name}: ERROR (${error.message})`);
      failed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n📊 Test Results:');
  console.log(`   Total: ${tests.length}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   Success Rate: ${Math.round((passed / tests.length) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! API connection is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the configuration.');
  }
}

runTests();
```

## การทดสอบด้วย cURL

### Test 1: Basic Connection

```bash
# ไม่ต้องใช้ authentication
curl http://localhost:8080/api/v3
```

**ผลลัพธ์ที่ต้องการ:**
```json
{
  "version": {
    "number": "16.x.x",
    "build": "...",
    "arch": "amd64"
  },
  "name": "datarhei Core",
  "id": "..."
}
```

### Test 2: Authentication

```bash
# ใช้ Basic Auth
curl -u admin:admin123 http://localhost:8080/api/v3
```

**หรือใช้ Header:**
```bash
curl -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" http://localhost:8080/api/v3
```

### Test 3: Get Processes

```bash
curl -u admin:admin123 http://localhost:8080/api/v3/process
```

### Test 4: Get Configuration

```bash
curl -u admin:admin123 http://localhost:8080/api/v3/config
```

### Test 5: Get Metrics

```bash
curl -u admin:admin123 http://localhost:8080/api/v3/metrics
```

### Test 6: Get Skills

```bash
curl -u admin:admin123 http://localhost:8080/api/v3/skills
```

### Test 7: Check CORS

```bash
curl -I -X OPTIONS http://localhost:8080/api/v3
```

**ต้องมี Headers เหล่านี้:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: ...
```

## วิธีการทดสอบ

### ขั้นตอนที่ 1: ตรวจสอบว่า Core Backend ทำงานอยู่

```bash
# ตรวจสอบ Docker containers
docker ps | grep datarhei

# หรือตรวจสอบด้วย curl
curl http://localhost:8080/api/v3

# ตรวจสอบ logs
docker logs datarhei-core
```

### ขั้นตอนที่ 2: ทดสอบจาก UI

1. เปิด Web UI: http://localhost:3000
2. กด F12 เปิด Developer Tools
3. ไปที่ Console tab
4. ดู Network tab (แสดง API requests)
5. พยายาม Login

**ตรวจสอบ Network Tab:**
- ดู Request URL: ควรเป็น `http://localhost:8080/api/v3`
- ดู Status Code: ควรเป็น `200 OK`
- ดู Response: ควรได้ JSON data
- ดู Headers: ต้องมี `Authorization` header

### ขั้นตอนที่ 3: ทดสอบแต่ละฟีเจอร์

**Login:**
```javascript
// ใน Browser Console
fetch('http://localhost:8080/api/v3', {
  headers: {
    'Authorization': 'Basic ' + btoa('admin:admin123')
  }
})
.then(r => r.json())
.then(d => console.log('✅ Login OK:', d))
.catch(e => console.error('❌ Login Failed:', e));
```

**Get Processes:**
```javascript
fetch('http://localhost:8080/api/v3/process', {
  headers: {
    'Authorization': 'Basic ' + btoa('admin:admin123')
  }
})
.then(r => r.json())
.then(d => console.log('✅ Processes:', d))
.catch(e => console.error('❌ Failed:', e));
```

**Get Metrics:**
```javascript
fetch('http://localhost:8080/api/v3/metrics', {
  headers: {
    'Authorization': 'Basic ' + btoa('admin:admin123')
  }
})
.then(r => r.json())
.then(d => console.log('✅ Metrics:', d))
.catch(e => console.error('❌ Failed:', e));
```

## แก้ไขปัญหา

### ปัญหา 1: Connection Refused

**อาการ:**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**วิธีแก้:**
```bash
# 1. ตรวจสอบว่า Core ทำงานอยู่หรือไม่
docker ps | grep datarhei-core

# 2. ถ้าไม่ทำงาน ให้เริ่มต้น
docker-compose up -d datarhei-core

# 3. รอให้ Core พร้อม (15-30 วินาที)
docker logs -f datarhei-core

# 4. ทดสอบอีกครั้ง
curl http://localhost:8080/api/v3
```

### ปัญหา 2: CORS Error

**อาการ:**
```
Access to fetch has been blocked by CORS policy
```

**วิธีแก้:**

**ถ้าใช้ Development Mode:**
```javascript
// vite.config.js มี proxy อยู่แล้ว
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

**ถ้าใช้ Production (Docker):**
```nginx
# nginx.conf มี CORS headers อยู่แล้ว
location /api {
    proxy_pass http://datarhei-core:8080;
    
    # CORS headers
    add_header Access-Control-Allow-Origin * always;
    add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS' always;
}
```

**ตรวจสอบ CORS:**
```bash
curl -I -X OPTIONS http://localhost:8080/api/v3
```

### ปัญหา 3: Authentication Failed (401)

**อาการ:**
```
401 Unauthorized
```

**วิธีแก้:**

```bash
# 1. ตรวจสอบ credentials ใน docker-compose.yml
cat docker-compose.yml | grep AUTH

# 2. ตรวจสอบ Base64 encoding
echo -n 'admin:admin123' | base64
# Output: YWRtaW46YWRtaW4xMjM=

# 3. ทดสอบด้วย curl
curl -u admin:admin123 http://localhost:8080/api/v3

# 4. ถ้ายังไม่ได้ ลอง restart Core
docker-compose restart datarhei-core
```

### ปัญหา 4: 404 Not Found

**อาการ:**
```
404 Not Found
```

**สาเหตุ:**
- URL ผิด
- Endpoint ไม่มีจริง
- Proxy ไม่ทำงาน

**วิธีแก้:**

```bash
# 1. ตรวจสอบ URL
curl http://localhost:8080/api/v3

# 2. ตรวจสอบ version
curl http://localhost:8080/api/v3/about

# 3. ดู Swagger documentation
# เปิดเว็บ: http://localhost:8080/api/swagger/index.html
```

### ปัญหา 5: Network Timeout

**อาการ:**
```
Request timeout
net::ERR_TIMED_OUT
```

**วิธีแก้:**

```bash
# 1. ตรวจสอบ network
ping localhost

# 2. ตรวจสอบ firewall
# Windows
netsh advfirewall firewall show rule name=all | findstr 8080

# Linux
sudo ufw status | grep 8080

# 3. ตรวจสอบ Docker network
docker network inspect datarhei-network

# 4. Restart Docker
docker-compose restart
```

### ปัญหา 6: Proxy Error (502 Bad Gateway)

**อาการ:**
```
502 Bad Gateway
```

**วิธีแก้:**

```bash
# 1. ตรวจสอบ Core backend
curl http://localhost:8080/api/v3

# 2. ตรวจสอบ UI container
docker logs datarhei-ui

# 3. ตรวจสอบ nginx config
docker exec datarhei-ui cat /etc/nginx/conf.d/default.conf

# 4. Restart UI
docker-compose restart datarhei-ui
```

## Checklist การทดสอบ

### ก่อนเริ่มต้น:
- [ ] Docker ติดตั้งแล้ว
- [ ] Docker Compose ติดตั้งแล้ว
- [ ] Containers ทำงานอยู่
- [ ] Port 8080 และ 3000 ว่าง

### การทดสอบพื้นฐาน:
- [ ] Core backend ทำงานอยู่ (port 8080)
- [ ] UI ทำงานอยู่ (port 3000)
- [ ] เข้าถึง http://localhost:8080/api/v3 ได้
- [ ] เข้าถึง http://localhost:3000 ได้

### การทดสอบ API:
- [ ] Basic connection ได้
- [ ] Authentication ผ่าน
- [ ] Get system info ได้
- [ ] Get configuration ได้
- [ ] Get processes ได้
- [ ] Get metrics ได้
- [ ] Get sessions ได้

### การทดสอบ UI:
- [ ] Login ได้
- [ ] Dashboard แสดงข้อมูล
- [ ] Process list แสดง
- [ ] Metrics แสดงกราฟ
- [ ] Settings โหลดได้
- [ ] Logs แสดง

## เครื่องมือเพิ่มเติม

### 1. Postman Collection

สร้าง Collection สำหรับทดสอบ:

```json
{
  "info": {
    "name": "datarhei Core API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "basic",
    "basic": [
      {"key": "username", "value": "admin"},
      {"key": "password", "value": "admin123"}
    ]
  },
  "item": [
    {
      "name": "Get System Info",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/v3"
      }
    },
    {
      "name": "Get Processes",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/v3/process"
      }
    }
  ]
}
```

### 2. Chrome Extension: REST Client

ใช้ extension เช่น:
- **REST Client** - ทดสอบ API ใน VSCode
- **Insomnia** - REST client สำหรับ Desktop
- **Thunder Client** - VSCode extension

### 3. Script อัตโนมัติ

สร้างไฟล์ `test-api.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:8080"
USERNAME="admin"
PASSWORD="admin123"
AUTH=$(echo -n "$USERNAME:$PASSWORD" | base64)

echo "Testing datarhei Core API..."
echo ""

# Test 1: Basic Connection
echo "1. Testing basic connection..."
curl -s "$API_URL/api/v3" > /dev/null && echo "   ✅ PASSED" || echo "   ❌ FAILED"

# Test 2: Authentication
echo "2. Testing authentication..."
curl -s -u "$USERNAME:$PASSWORD" "$API_URL/api/v3" > /dev/null && echo "   ✅ PASSED" || echo "   ❌ FAILED"

# Test 3: Get Processes
echo "3. Testing get processes..."
curl -s -u "$USERNAME:$PASSWORD" "$API_URL/api/v3/process" > /dev/null && echo "   ✅ PASSED" || echo "   ❌ FAILED"

# Test 4: Get Config
echo "4. Testing get config..."
curl -s -u "$USERNAME:$PASSWORD" "$API_URL/api/v3/config" > /dev/null && echo "   ✅ PASSED" || echo "   ❌ FAILED"

# Test 5: Get Metrics
echo "5. Testing get metrics..."
curl -s -u "$USERNAME:$PASSWORD" "$API_URL/api/v3/metrics" > /dev/null && echo "   ✅ PASSED" || echo "   ❌ FAILED"

echo ""
echo "Tests completed!"
```

รัน:
```bash
chmod +x test-api.sh
./test-api.sh
```

## สรุป

### ✅ API ทำงานได้ถูกต้องเมื่อ:

1. **Basic Connection**: สามารถเข้าถึง `/api/v3` ได้
2. **Authentication**: Login ด้วย admin/admin123 ได้
3. **Data Access**: ดึงข้อมูลจาก endpoints ต่างๆ ได้
4. **Response Time**: < 1000ms สำหรับ requests ทั่วไป
5. **No Errors**: ไม่มี CORS errors, 401, 403, 500 errors

### 🔧 เครื่องมือทดสอบที่มี:

1. ✅ `test-api-connection.html` - Web-based tester
2. ✅ Browser Console - JavaScript tests
3. ✅ cURL commands - Command-line tests
4. ✅ Network tab - Browser DevTools
5. ✅ Swagger UI - Interactive API docs

### 📚 เอกสารเพิ่มเติม:

- **Swagger UI**: http://localhost:8080/api/swagger
- **API Documentation**: See `README.md`
- **Docker Logs**: `docker logs datarhei-core`

---

**หากพบปัญหา:**
1. ตรวจสอบ Checklist ด้านบน
2. ดู logs: `docker-compose logs -f`
3. ทดสอบด้วย test-api-connection.html
4. อ่าน Troubleshooting section

**การช่วยเหลือ:**
- GitHub: https://github.com/datarhei/core/issues
- Documentation: https://docs.datarhei.com/core

Made with ❤️ for datarhei community