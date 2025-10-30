# คู่มือการอัพโหลดโค้ดไปยัง GitHub

คู่มือการอัพเดทโค้ด datarhei Core UI ไปยัง GitHub repository ของคุณ

## 📋 ข้อมูล Repository

- **GitHub URL**: https://github.com/bekuzaa/core-2.git
- **Branch**: main
- **ชื่อผู้ใช้**: bekuzaa

## 🚀 วิธีการอัพโหลด

### วิธีที่ 1: ใช้ Script อัตโนมัติ (แนะนำ)

#### สำหรับ Windows:

```bash
# เข้าไปในโฟลเดอร์ ui
cd D:\Program\Zed\core-dev\core-dev\ui

# รัน script
deploy-to-github.bat
```

#### สำหรับ macOS/Linux:

```bash
# เข้าไปในโฟลเดอร์ ui
cd /path/to/core-dev/ui

# ให้สิทธิ์ execute script
chmod +x deploy-to-github.sh

# รัน script
./deploy-to-github.sh
```

**Script จะทำอะไรบ้าง:**
1. ✅ ตรวจสอบว่าติดตั้ง Git แล้วหรือยัง
2. ✅ ตรวจสอบว่าอยู่ในโฟลเดอร์ที่ถูกต้อง
3. ✅ Initialize Git repository (ถ้ายังไม่มี)
4. ✅ เพิ่ม/อัพเดท remote origin
5. ✅ แสดงสถานะไฟล์ที่จะ commit
6. ✅ ให้คุณใส่ commit message
7. ✅ Add และ commit ไฟล์ทั้งหมด
8. ✅ Push ไปยัง GitHub

### วิธีที่ 2: ใช้ Git Command ด้วยตัวเอง

#### ขั้นตอนที่ 1: ติดตั้ง Git (ถ้ายังไม่มี)

**Windows:**
- ดาวน์โหลดจาก: https://git-scm.com/download/win
- ติดตั้งและเปิด Git Bash

**macOS:**
```bash
# ใช้ Homebrew
brew install git

# หรือใช้ Xcode Command Line Tools
xcode-select --install
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git
```

**ตรวจสอบการติดตั้ง:**
```bash
git --version
```

#### ขั้นตอนที่ 2: ตั้งค่า Git (ครั้งแรกเท่านั้น)

```bash
# ตั้งค่าชื่อ
git config --global user.name "Your Name"

# ตั้งค่าอีเมล
git config --global user.email "your.email@example.com"

# ตรวจสอบการตั้งค่า
git config --list
```

#### ขั้นตอนที่ 3: เข้าไปในโฟลเดอร์โปรเจค

```bash
# Windows
cd D:\Program\Zed\core-dev\core-dev\ui

# macOS/Linux
cd /path/to/core-dev/ui
```

#### ขั้นตอนที่ 4: Initialize Git (ถ้ายังไม่มี)

```bash
# ตรวจสอบว่ามี .git folder หรือยัง
ls -la .git

# ถ้ายังไม่มี ให้ init
git init
```

#### ขั้นตอนที่ 5: เพิ่ม Remote Repository

```bash
# เพิ่ม remote (ถ้ายังไม่มี)
git remote add origin https://github.com/bekuzaa/core-2.git

# หรือถ้ามีแล้ว ให้อัพเดท URL
git remote set-url origin https://github.com/bekuzaa/core-2.git

# ตรวจสอบ remote
git remote -v
```

#### ขั้นตอนที่ 6: เพิ่มไฟล์และ Commit

```bash
# ดูสถานะไฟล์
git status

# เพิ่มไฟล์ทั้งหมด
git add .

# หรือเพิ่มเฉพาะไฟล์ที่ต้องการ
git add package.json
git add src/
git add Dockerfile
git add docker-compose.yml

# Commit พร้อม message
git commit -m "Add datarhei Core UI with Docker support"
```

#### ขั้นตอนที่ 7: Push ไปยัง GitHub

```bash
# Push ครั้งแรก (ตั้งค่า upstream)
git push -u origin main

# Push ครั้งต่อไป
git push origin main
```

## 🔐 การ Authentication

### วิธีที่ 1: Personal Access Token (แนะนำ)

1. **สร้าง Token:**
   - ไปที่ GitHub Settings
   - Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - เลือก scopes: `repo` (ทั้งหมด)
   - คัดลอก token (เก็บไว้ปลอดภัย)

2. **ใช้ Token แทนรหัสผ่าน:**
   ```bash
   # เมื่อ push ครั้งแรก จะถาม username และ password
   Username: bekuzaa
   Password: [paste your token here]
   ```

3. **บันทึก Credentials (Windows):**
   ```bash
   git config --global credential.helper wincred
   ```

4. **บันทึก Credentials (macOS):**
   ```bash
   git config --global credential.helper osxkeychain
   ```

5. **บันทึก Credentials (Linux):**
   ```bash
   git config --global credential.helper store
   ```

### วิธีที่ 2: SSH Key

1. **สร้าง SSH Key:**
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```

2. **คัดลอก Public Key:**
   ```bash
   # Windows
   type %USERPROFILE%\.ssh\id_ed25519.pub

   # macOS/Linux
   cat ~/.ssh/id_ed25519.pub
   ```

3. **เพิ่มใน GitHub:**
   - ไปที่ GitHub Settings
   - SSH and GPG keys
   - New SSH key
   - วาง public key

4. **เปลี่ยน Remote เป็น SSH:**
   ```bash
   git remote set-url origin git@github.com:bekuzaa/core-2.git
   ```

## 📦 ไฟล์ที่จะถูกอัพโหลด

### โครงสร้างโฟลเดอร์:
```
ui/
├── src/
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── store/               # State management
│   ├── utils/               # Utilities
│   ├── App.jsx              # Main app
│   ├── main.jsx             # Entry point
│   └── index.css            # Styles
├── public/                  # Static files
├── Dockerfile               # Docker image build
├── docker-compose.yml       # Docker Compose setup
├── nginx.conf               # Nginx configuration
├── .dockerignore            # Docker ignore
├── .gitignore               # Git ignore
├── package.json             # Dependencies
├── vite.config.js           # Vite config
├── tailwind.config.js       # Tailwind config
├── postcss.config.js        # PostCSS config
├── .eslintrc.cjs            # ESLint config
├── .env.example             # Environment example
├── README.md                # Documentation
├── FEATURES.md              # Features list
├── INSTALL.md               # Installation guide
├── INSTALL_TH.md            # Thai installation guide
├── DOCKER_INSTALL.md        # Docker installation
├── DOCKER_QUICK_REF.md      # Docker quick reference
├── QUICKSTART.md            # Quick start guide
├── PASSWORD_UPDATE.md       # Password update docs
├── PROJECT_SUMMARY.md       # Project summary
└── deploy-to-github.*       # Deployment scripts
```

### ไฟล์ที่สำคัญ:

**Frontend (React):**
- ✅ `src/` - โค้ด React ทั้งหมด
- ✅ `public/` - Static assets
- ✅ `package.json` - Dependencies
- ✅ `vite.config.js` - Build configuration

**Docker:**
- ✅ `Dockerfile` - Production build
- ✅ `docker-compose.yml` - Complete stack
- ✅ `nginx.conf` - Web server config
- ✅ `.dockerignore` - Ignore files

**Documentation:**
- ✅ `README.md` - Main documentation (477 lines)
- ✅ `FEATURES.md` - Features (837 lines)
- ✅ `INSTALL_TH.md` - Thai guide (773 lines)
- ✅ `DOCKER_INSTALL.md` - Docker guide (930 lines)
- ✅ และอื่นๆ อีกมากมาย

## 🎯 Commit Messages ที่ดี

### แบบพื้นฐาน:
```bash
git commit -m "Add feature X"
git commit -m "Fix bug in Y"
git commit -m "Update documentation"
```

### แบบมีรายละเอียด:
```bash
git commit -m "Add datarhei Core UI

- Complete React application
- Docker support with docker-compose
- Multi-language documentation (TH/EN)
- Wizard for easy stream setup
- Full API integration
"
```

### แบบตาม Convention:
```bash
# Feature
git commit -m "feat: add stream wizard"

# Fix
git commit -m "fix: resolve login issue"

# Documentation
git commit -m "docs: add Thai installation guide"

# Style
git commit -m "style: update UI colors"

# Refactor
git commit -m "refactor: improve API service"

# Chore
git commit -m "chore: update dependencies"
```

## 🔄 การอัพเดทครั้งต่อไป

### ถ้ามีการเปลี่ยนแปลงไฟล์:

```bash
# 1. ดูสถานะ
git status

# 2. เพิ่มไฟล์ที่เปลี่ยนแปลง
git add .

# 3. Commit
git commit -m "Update: describe your changes"

# 4. Push
git push origin main
```

### ถ้าใช้ Script:

```bash
# Windows
deploy-to-github.bat

# macOS/Linux
./deploy-to-github.sh

# หรือใส่ message เลย
./deploy-to-github.sh -m "Update features"
```

## 🌿 การทำงานกับ Branches

### สร้าง Branch ใหม่:

```bash
# สร้างและเปลี่ยนไป branch ใหม่
git checkout -b feature/new-feature

# เพิ่มไฟล์และ commit
git add .
git commit -m "Add new feature"

# Push branch ใหม่
git push -u origin feature/new-feature
```

### Merge Branch:

```bash
# กลับไป main branch
git checkout main

# Pull อัพเดทล่าสุด
git pull origin main

# Merge feature branch
git merge feature/new-feature

# Push
git push origin main
```

## ❌ ไฟล์ที่ไม่ควรอัพโหลด

ไฟล์เหล่านี้ถูก ignore แล้วใน `.gitignore`:

```
# Dependencies
node_modules/
package-lock.json (optional)

# Build output
dist/
build/

# Environment
.env
.env.local

# Logs
*.log
logs/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Temp
*.tmp
.cache
```

## 🐛 แก้ไขปัญหา

### ปัญหา: Authentication failed

**วิธีแก้:**
```bash
# ใช้ Personal Access Token แทนรหัสผ่าน
# หรือตั้งค่า credential helper
git config --global credential.helper wincred  # Windows
git config --global credential.helper osxkeychain  # macOS
```

### ปัญหา: Remote already exists

**วิธีแก้:**
```bash
# ลบ remote เดิม
git remote remove origin

# เพิ่มใหม่
git remote add origin https://github.com/bekuzaa/core-2.git
```

### ปัญหา: Push rejected (non-fast-forward)

**วิธีแก้:**
```bash
# Pull ก่อน
git pull origin main --rebase

# แก้ conflicts (ถ้ามี)
# จากนั้น push
git push origin main
```

### ปัญหา: Large files

**วิธีแก้:**
```bash
# ใช้ Git LFS สำหรับไฟล์ใหญ่
git lfs install
git lfs track "*.mp4"
git lfs track "*.zip"
```

### ปัญหา: Accidentally committed sensitive data

**วิธีแก้:**
```bash
# ลบไฟล์ออกจาก history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/sensitive/file" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin main --force
```

## 📊 ตรวจสอบสถานะ

### ดูไฟล์ที่เปลี่ยนแปลง:
```bash
git status
```

### ดู Commit history:
```bash
git log
git log --oneline
git log --graph --oneline --all
```

### ดู Diff:
```bash
# ดูการเปลี่ยนแปลงที่ยังไม่ stage
git diff

# ดูการเปลี่ยนแปลงที่ stage แล้ว
git diff --cached

# ดูการเปลี่ยนแปลงของไฟล์เฉพาะ
git diff filename
```

### ดู Remote:
```bash
git remote -v
```

## 🔍 ตรวจสอบบน GitHub

หลังจาก push เสร็จแล้ว:

1. เปิด browser ไปที่: https://github.com/bekuzaa/core-2
2. ตรวจสอบว่าไฟล์อัพโหลดครบหรือไม่
3. ตรวจสอบ README.md แสดงถูกต้องหรือไม่
4. ทดสอบ clone repository:
   ```bash
   git clone https://github.com/bekuzaa/core-2.git test-clone
   cd test-clone
   ls -la
   ```

## 📝 Checklist ก่อน Push

- [ ] ตรวจสอบไฟล์ที่จะ commit: `git status`
- [ ] ลบไฟล์ที่ไม่จำเป็นออก
- [ ] อัพเดท `.gitignore` ถ้าจำเป็น
- [ ] ตรวจสอบไม่มีข้อมูลลับ (passwords, tokens)
- [ ] เขียน commit message ที่ดี
- [ ] ทดสอบโค้ดก่อน push (ถ้าเป็นไปได้)
- [ ] Pull อัพเดทล่าสุดก่อน push

## 🎓 Tips & Best Practices

### 1. Commit บ่อยๆ
```bash
# แทนที่จะเก็บไว้นานแล้วค่อย commit ใหญ่
# ควร commit เล็กๆ บ่อยๆ
git add feature1.js
git commit -m "Add feature 1"

git add feature2.js
git commit -m "Add feature 2"
```

### 2. เขียน Message ที่ชัดเจน
```bash
# ❌ ไม่ดี
git commit -m "update"
git commit -m "fix"

# ✅ ดี
git commit -m "Update login page with new design"
git commit -m "Fix authentication timeout issue"
```

### 3. ใช้ Branch สำหรับฟีเจอร์ใหม่
```bash
# สร้าง branch สำหรับแต่ละฟีเจอร์
git checkout -b feature/user-dashboard
# พัฒนาเสร็จแล้วค่อย merge เข้า main
```

### 4. Pull ก่อน Push เสมอ
```bash
# ป้องกัน conflicts
git pull origin main
git push origin main
```

### 5. ใช้ .gitignore
```bash
# เพิ่มไฟล์ที่ไม่ต้องการลงใน .gitignore
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
```

## 🚀 Quick Commands

```bash
# เริ่มต้นรวดเร็ว
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/bekuzaa/core-2.git
git push -u origin main

# อัพเดทรวดเร็ว
git add .
git commit -m "Update"
git push

# Clone repository
git clone https://github.com/bekuzaa/core-2.git

# Pull อัพเดท
git pull origin main
```

## 📞 ต้องการความช่วยเหลือ?

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf

## ✅ สรุป

หลังจากทำตามคู่มือนี้ คุณจะได้:

1. ✅ โค้ดทั้งหมดอัพโหลดไปยัง GitHub
2. ✅ Repository พร้อมใช้งาน
3. ✅ สามารถ clone และใช้งานได้ทุกที่
4. ✅ มี version control ที่ดี
5. ✅ สามารถทำงานร่วมกับคนอื่นได้

**Repository URL**: https://github.com/bekuzaa/core-2.git

---

**Happy Coding! 🚀**

Made with ❤️ for datarhei community