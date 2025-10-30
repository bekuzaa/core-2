# datarhei Core UI

Modern, feature-rich user interface for datarhei Core - FFmpeg process management and streaming platform.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Apache%202.0-green)
![React](https://img.shields.io/badge/react-18.2-61dafb)

## 🚀 Features

### Simplified User Interface
- **Modern Design**: Clean, intuitive interface built with React and Tailwind CSS
- **Dark Theme**: Eye-friendly dark mode optimized for extended use
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Live monitoring of processes, metrics, and sessions
- **Drag & Drop**: Easy file uploads and interface interactions

### Easy Wizard Configuration
- **Step-by-Step Setup**: Guided wizard for configuring streams in minutes
- **5-Step Process**:
  1. Basic Information (name, description, license)
  2. Input Configuration (network, RTMP, SRT, device)
  3. Output Configuration (multiple destinations)
  4. Encoding Settings (codecs, bitrate, resolution)
  5. Review & Launch
- **Platform Presets**: Quick setup for YouTube Live, Twitch, Facebook Live
- **Visual Feedback**: Progress indicators and validation at each step

### Multiple Audio/Video Inputs & Outputs

#### Input Support
- **Network Streams**: HTTP, HLS, RTSP, RTMP
- **RTMP Input**: Receive RTMP streams from encoders
- **SRT Input**: Low-latency SRT streaming
- **Device Input**: Camera, capture cards (V4L2, DirectShow)
- **File Input**: Local and remote video files

#### Output Support
- **HTTP/S Streaming**: HLS output for web players
- **RTMP/S Output**: Stream to any RTMP server
- **SRT Output**: Low-latency delivery
- **Multiple Simultaneous Outputs**: Stream to multiple platforms at once
- **Disk Storage**: Save streams to filesystem

### Protocol & Codec Support

#### Protocols
- **RTMP**: Real-Time Messaging Protocol
- **RTMPS**: RTMP over TLS/SSL
- **SRT**: Secure Reliable Transport
- **HLS**: HTTP Live Streaming
- **RTSP**: Real-Time Streaming Protocol
- **HTTP/HTTPS**: Standard web protocols

#### Video Codecs
- H.264 (libx264)
- H.265/HEVC (libx265)
- VP9 (libvpx-vp9)
- VP8 (libvpx)
- Copy (no transcoding)

#### Audio Codecs
- AAC (aac, libfdk_aac)
- Opus (libopus)
- MP3 (libmp3lame)
- Vorbis (libvorbis)
- Copy (no transcoding)

### ReStreaming Capabilities
- **YouTube Live**: Direct integration with stream key
- **Twitch**: Built-in Twitch streaming support
- **Facebook Live**: Stream to Facebook with RTMPS
- **Custom Servers**: Support for Wowza, Nimble, and other RTMP servers
- **Multi-streaming**: Simultaneously stream to multiple platforms
- **Automatic Reconnection**: Resilient streaming with auto-reconnect

### Audio Channel Muxing
- **Separate Audio Input**: Add independent audio source to video
- **Audio Channel Selection**: Choose specific audio channels
- **Audio Mixing**: Mix multiple audio sources
- **Audio Synchronization**: Automatic audio/video sync
- **Format Conversion**: Convert between mono, stereo, 5.1 surround

### Built-in Video.js Player
- **Embedded Player**: Modern HTML5 video player
- **HLS Support**: Native HLS playback
- **Responsive Design**: Adapts to any screen size
- **Custom Controls**: Playback, volume, fullscreen controls
- **Live Streaming**: Optimized for live stream playback
- **Low Latency**: Minimal delay for live content

### Configurable Publication Website
- **Stream Widget**: Embeddable player for your streams
- **Custom Branding**: Add your logo and colors
- **Share Options**: Social media sharing buttons
- **Viewer Analytics**: Track audience engagement
- **No Player Embedding Required**: Standalone publication page
- **SEO Optimized**: Meta tags for social sharing

### Creative Commons Licensing
- **CC BY 4.0**: Attribution
- **CC BY-SA 4.0**: Attribution-ShareAlike
- **CC BY-NC 4.0**: Attribution-NonCommercial
- **CC BY-NC-SA 4.0**: Attribution-NonCommercial-ShareAlike
- **CC BY-ND 4.0**: Attribution-NoDerivatives
- **CC BY-NC-ND 4.0**: Attribution-NonCommercial-NoDerivatives
- **CC0 1.0**: Public Domain
- **Automatic License Display**: Shows license on publication pages

### Server Features

#### HTTP/S Streaming Server
- **HLS Server**: Built-in HLS streaming
- **CORS Support**: Cross-origin resource sharing
- **Custom Routes**: Flexible URL routing
- **Static File Serving**: Host web content
- **Bandwidth Management**: Control data usage

#### RTMP/S Server
- **RTMP Publishing**: Accept incoming RTMP streams
- **RTMPS Support**: Encrypted RTMP over TLS
- **Authentication**: Token-based access control
- **Multiple Apps**: Organize streams by application

#### SRT Server
- **Low Latency**: Sub-second streaming delay
- **Encryption**: Built-in AES encryption
- **Passphrase Protection**: Secure stream access
- **Caller/Listener Modes**: Flexible connection modes

### Automatic Let's Encrypt HTTPS
- **Free SSL Certificates**: Automatic certificate acquisition
- **Auto-Renewal**: Certificates renew automatically
- **Multiple Domains**: Support for multiple hostnames
- **HTTP to HTTPS Redirect**: Automatic secure redirects
- **Certificate Management**: View and manage certificates

### Viewer & Bandwidth Monitoring
- **Real-time Session Tracking**: Monitor active viewers
- **Bandwidth Usage**: Track data consumption
- **Session History**: View historical viewer data
- **Geographic Distribution**: See viewer locations (if available)
- **Connection Details**: IP addresses, user agents, referrers

### Bandwidth Limiting
- **Per-Session Limits**: Control individual viewer bandwidth
- **Global Limits**: Set server-wide bandwidth caps
- **Bitrate Enforcement**: Prevent excessive data usage
- **Session Limits**: Maximum concurrent viewers
- **IP-based Controls**: Block or allow specific IPs

### Hardware & Virtual Device Support

#### Hardware Acceleration
- **NVIDIA CUDA**: GPU-accelerated encoding/decoding
- **Intel VAAPI**: Intel Quick Sync Video
- **Raspberry Pi**: V4L2 M2M hardware encoding
- **AMD AMF**: AMD GPU acceleration (via FFmpeg)

#### Virtual Devices
- **Virtual Audio**: Generate test audio signals
- **Virtual Video**: Color bars, test patterns
- **Null Devices**: Development and testing

### FFmpeg Video Processing
- **Native FFmpeg**: Full FFmpeg command-line support
- **Process Management**: Start, stop, restart processes
- **Live Monitoring**: Real-time process statistics
- **Error Recovery**: Automatic restart on failure
- **Resource Limits**: CPU and memory constraints
- **Log Access**: View FFmpeg output in real-time

### REST API Integration
- **Full API Access**: Complete REST API (v3)
- **JSON Format**: Standard JSON request/response
- **Authentication**: Basic Auth and JWT support
- **Swagger Documentation**: Interactive API docs at `/api/swagger`
- **GraphQL Support**: Alternative GraphQL endpoint
- **Webhook Support**: Event notifications

### Resource Monitoring

#### System Metrics
- **CPU Usage**: Real-time CPU utilization
- **Memory Usage**: RAM consumption tracking
- **Disk Usage**: Storage space monitoring
- **Network I/O**: Bandwidth utilization
- **Process Count**: Active FFmpeg processes

#### Prometheus Metrics
- **Prometheus Exporter**: Metrics endpoint at `/metrics`
- **Custom Metrics**: Application-specific measurements
- **Time Series Data**: Historical metric storage
- **Grafana Compatible**: Works with Grafana dashboards
- **Alert Integration**: Connect to alerting systems

### Logging System
- **Server Logs**: Application-level logging
- **Process Logs**: Individual FFmpeg process logs
- **Log Levels**: Debug, Info, Warn, Error, Silent
- **Log History**: Configurable log retention
- **Log Search**: Find specific log entries
- **Real-time Streaming**: Live log updates
- **Download Logs**: Export logs for analysis

### GDPR Compliance
- **No Third-Party Analytics**: No Google Analytics, etc.
- **No Audience Data Storage**: Viewer data not persisted
- **Privacy-First**: Minimal data collection
- **Self-Hosted**: Complete data control
- **No External Dependencies**: All processing on-premise
- **Session Cleanup**: Automatic session data deletion
- **Transparent**: Open-source and auditable

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm 9+
- datarhei Core backend running

### Setup

1. **Clone or navigate to the UI directory**:
```bash
cd core-dev/ui
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment** (optional):
Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=datarhei Core
```

4. **Development server**:
```bash
npm run dev
```
Access at `http://localhost:3000`

5. **Build for production**:
```bash
npm run build
```
Output will be in the `dist/` directory

## 🛠️ Configuration

### Vite Configuration
Edit `vite.config.js` to customize:
- API proxy settings
- Build output directory
- Code splitting strategy
- Asset optimization

### Tailwind Configuration
Edit `tailwind.config.js` to customize:
- Color scheme
- Fonts
- Spacing
- Animations
- Breakpoints

## 📱 Usage

### Login
1. Navigate to `/login`
2. Enter credentials (default: `admin` / `admin123`)
3. Click "Sign In"

### Quick Start with Wizard
1. Click "Wizard" in the sidebar
2. Follow the 5-step process:
   - Enter stream name and description
   - Choose input source
   - Add output destinations
   - Configure encoding settings
   - Review and launch

### Manual Process Creation
1. Go to "Processes" page
2. Click "Create Process"
3. Configure inputs, outputs, and FFmpeg options
4. Save and start the process

### Monitoring
- **Dashboard**: Overview of all processes and system metrics
- **Processes**: Detailed view of each FFmpeg process
- **Metrics**: CPU, memory, and network graphs
- **Sessions**: Active viewer connections
- **Logs**: Real-time and historical logs

### File Management
1. Navigate to "Files" page
2. Browse filesystem
3. Upload files via drag & drop
4. Download or delete files

## 🎨 Customization

### Theming
Modify colors in `tailwind.config.js`:
```javascript
colors: {
  primary: { /* your colors */ },
  secondary: { /* your colors */ },
  // ...
}
```

### Logo
Replace logo in:
- `public/favicon.svg`
- `index.html` (loading screen)
- Components as needed

### Branding
Update application title and metadata in:
- `index.html`
- `package.json`
- `.env` file

## 🏗️ Project Structure

```
ui/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable React components
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   └── ...
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Processes.jsx
│   │   ├── Wizard.jsx
│   │   └── ...
│   ├── services/       # API services
│   │   └── api.js
│   ├── store/          # State management (Zustand)
│   │   └── index.js
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS config
└── README.md           # This file
```

## 🔌 API Integration

The UI communicates with datarhei Core REST API v3:

### Authentication
- Basic Authentication
- JWT tokens
- Auth0 integration (if enabled)

### Key Endpoints
- `GET /api/v3` - System information
- `GET /api/v3/process` - List processes
- `POST /api/v3/process` - Create process
- `GET /api/v3/metrics` - System metrics
- `GET /api/v3/session` - Active sessions
- `GET /api/v3/fs` - Filesystem access

## 🚀 Deployment

### Static Hosting
Build the application and serve from any web server:
```bash
npm run build
# Serve the dist/ folder
```

### Docker
The UI is automatically included in datarhei Core Docker images when built.

### Reverse Proxy
Configure your reverse proxy to serve the UI at `/ui`:
```nginx
location /ui {
    root /path/to/ui/dist;
    try_files $uri $uri/ /index.html;
}
```

## 🔐 Security

- **Authentication Required**: All API calls require valid credentials
- **HTTPS Support**: Automatic Let's Encrypt certificates
- **CORS Configuration**: Configurable cross-origin policies
- **Input Validation**: Client-side form validation
- **XSS Protection**: React's built-in XSS protection
- **No Sensitive Data in URLs**: Credentials not exposed in URLs

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📊 Performance

- **Code Splitting**: Automatic chunk splitting for faster loads
- **Lazy Loading**: Components loaded on demand
- **Asset Optimization**: Minified JS/CSS, optimized images
- **Caching**: Service worker for offline support (optional)
- **CDN-Ready**: Static assets can be served from CDN

## 🐛 Debugging

Enable debug mode:
```javascript
localStorage.setItem('debug', 'true');
```

View logs in browser console:
- API requests/responses
- State changes
- Component renders

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

Apache License 2.0 - see [LICENSE](../LICENSE) file

## 🆘 Support

- **Documentation**: https://docs.datarhei.com/core
- **Issues**: https://github.com/datarhei/core/issues
- **Discussions**: https://github.com/datarhei/core/discussions
- **Website**: https://datarhei.com

## 🎯 Roadmap

- [ ] Multi-language support (i18n)
- [ ] Light theme option
- [ ] Advanced FFmpeg command builder
- [ ] Stream health analytics
- [ ] Mobile app version
- [ ] Plugin system
- [ ] A/B testing for streams
- [ ] Cloud storage integration (S3, Azure, GCS)

## 🙏 Acknowledgments

- **React**: UI framework
- **Tailwind CSS**: Styling
- **Video.js**: Video player
- **Framer Motion**: Animations
- **Zustand**: State management
- **React Query**: Data fetching
- **Lucide Icons**: Icon library

---

Made with ❤️ by [datarhei](https://datarhei.com)