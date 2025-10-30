# datarhei Core UI - Quick Start Guide

Get up and running with datarhei Core UI in under 5 minutes!

## ⚡ Quick Install

### Prerequisites
- Node.js 18+ and npm 9+
- datarhei Core backend running on port 8080

### 3 Simple Steps

```bash
# 1. Navigate to UI directory
cd core-dev/ui

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

**Done!** 🎉 Open http://localhost:3000

## 🔐 First Login

**Default Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change these credentials after first login!

## 🚀 Create Your First Stream

### Option 1: Use the Wizard (Recommended)

1. Click **"Wizard"** in the sidebar
2. Follow the 5 easy steps:
   - **Step 1:** Enter stream name (e.g., "My Live Stream")
   - **Step 2:** Choose input type (Network, RTMP, SRT, or Device)
   - **Step 3:** Add output destinations (YouTube, Twitch, HLS, etc.)
   - **Step 4:** Configure encoding (or select "Copy" for no transcoding)
   - **Step 5:** Review and click "Create Stream"

### Option 2: Manual Setup

1. Go to **"Processes"** page
2. Click **"Create Process"**
3. Configure your FFmpeg command
4. Start the process

## 📊 Monitor Your Streams

### Dashboard
- View all active processes
- Monitor CPU, memory, disk usage
- See active viewer sessions
- Quick access to all features

### Process Details
- Click any process to see:
  - Real-time statistics
  - Input/output bitrates
  - Frame rates
  - Logs
  - Configuration

## 🎥 Common Streaming Scenarios

### 1. Stream to YouTube Live

**Using Wizard:**
1. Input: Network stream URL (your source)
2. Output: Select "YouTube Live"
3. Enter your YouTube stream key
4. Encoding: Select "H.264 + AAC" preset
5. Launch!

**URL Format:**
```
rtmp://a.rtmp.youtube.com/live2/YOUR_STREAM_KEY
```

### 2. Stream to Twitch

**Using Wizard:**
1. Input: Your video source
2. Output: Select "Twitch"
3. Enter your Twitch stream key
4. Encoding: "H.264 + AAC"
5. Launch!

**URL Format:**
```
rtmp://live.twitch.tv/app/YOUR_STREAM_KEY
```

### 3. Create HLS Stream for Website

**Using Wizard:**
1. Input: Your video source
2. Output: Add "HLS (Web Player)"
3. Encoding: Configure as needed
4. Launch!

**Player URL:**
```
http://your-server:8080/memfs/your-stream-name/index.m3u8
```

### 4. Multi-Stream to Multiple Platforms

**Using Wizard:**
1. Input: Your video source
2. Output: Click "Add Output" multiple times
   - Add YouTube Live
   - Add Twitch
   - Add HLS for web
3. Each output is independent
4. Launch!

## 🛠️ Quick Troubleshooting

### Can't Connect to Backend

**Check backend is running:**
```bash
curl http://localhost:8080/api/v3
```

**If not running, start datarhei Core:**
```bash
docker run -p 8080:8080 datarhei/core:latest
```

### Login Fails

1. Verify Core backend is accessible
2. Check credentials (default: admin/admin123)
3. Check browser console for errors

### Port 3000 Already in Use

```bash
# Use different port
npm run dev -- --port 3001
```

### Build Fails

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📱 Navigation Guide

### Sidebar Menu

| Icon | Page | Purpose |
|------|------|---------|
| 🏠 Home | Dashboard | System overview |
| 📡 Radio | Processes | Manage FFmpeg processes |
| ✨ Sparkles | Wizard | Easy stream setup |
| 📊 Chart | Metrics | System performance |
| 👥 Users | Sessions | Active viewers |
| 📁 Folder | Files | File management |
| 📄 File | Logs | System & process logs |
| ⚙️ Settings | Settings | Configuration |
| 📖 Book | Docs | Help & documentation |

## 🎯 Pro Tips

### 1. Use Copy Mode for Performance
When you don't need transcoding, use "Copy" codec:
- **Pros:** Minimal CPU usage, instant processing
- **Cons:** Can't change resolution, bitrate, or codec

### 2. Monitor Resource Usage
Keep an eye on:
- CPU: Should stay under 80%
- Memory: Watch for memory leaks
- Bandwidth: Don't exceed your limits

### 3. Set Up Automatic Restart
Enable "Reconnect" in process settings:
- Auto-restarts on failure
- Configurable delay
- Perfect for 24/7 streaming

### 4. Use Hardware Acceleration
If available:
- NVIDIA: Use CUDA-enabled Docker image
- Intel: Use VAAPI-enabled Docker image
- RPi: Use RPi-specific Docker image

### 5. Enable Let's Encrypt
For HTTPS:
1. Configure hostname in Settings
2. Enable Let's Encrypt
3. Automatic SSL certificates!

## 📚 Learn More

### Essential Reading
- **README.md** - Complete documentation
- **FEATURES.md** - All features explained
- **INSTALL.md** - Detailed installation guide

### API Documentation
- **Swagger UI:** http://localhost:8080/api/swagger
- **API Endpoint:** http://localhost:8080/api/v3

### External Resources
- **Docs:** https://docs.datarhei.com/core
- **GitHub:** https://github.com/datarhei/core
- **Website:** https://datarhei.com

## 🔧 Configuration Quick Reference

### Environment Variables
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_DEBUG=false
VITE_DEFAULT_THEME=dark
```

### API Proxy (Vite)
Already configured in `vite.config.js`:
```javascript
proxy: {
  '/api': 'http://localhost:8080'
}
```

## 🚢 Production Deployment

### Build for Production
```bash
npm run build
```

### Test Production Build
```bash
npm run preview
```

### Deploy
Copy `dist/` folder to your web server or configure Core:
```json
{
  "router": {
    "ui_path": "/path/to/ui/dist"
  }
}
```

## 🆘 Getting Help

### Check These First
1. Browser console for errors
2. Network tab for failed requests
3. Backend logs for Core errors
4. Documentation in /docs

### Need Support?
- **GitHub Issues:** https://github.com/datarhei/core/issues
- **Discussions:** https://github.com/datarhei/core/discussions
- **Documentation:** https://docs.datarhei.com/core

## ✅ Next Steps

Now that you're up and running:

1. **Change Password** - Go to Settings
2. **Create First Stream** - Use the Wizard
3. **Explore Features** - Check out all menu items
4. **Read Documentation** - Learn advanced features
5. **Monitor Performance** - Keep an eye on Metrics
6. **Set Up HTTPS** - Enable Let's Encrypt
7. **Configure Backups** - Save your configuration

## 🎉 You're Ready!

You now have a fully functional streaming management interface!

**Happy Streaming! 🎥📡**

---

**Quick Links:**
- Dashboard: http://localhost:3000/dashboard
- Wizard: http://localhost:3000/wizard
- API Docs: http://localhost:8080/api/swagger
- Core Docs: https://docs.datarhei.com/core

**Remember:**
- Default login: `admin` / `admin123`
- Backend must be running on port 8080
- Frontend dev server runs on port 3000
- Production build goes in `dist/` folder

**Questions?** Check the documentation or ask in GitHub Discussions!