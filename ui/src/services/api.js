import axios from 'axios';

/**
 * API Service for datarhei Core
 * Handles all communication with the Core REST API
 */

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    const username = localStorage.getItem('auth_username');
    const password = localStorage.getItem('auth_password');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (username && password) {
      const basicAuth = btoa(`${username}:${password}`);
      config.headers.Authorization = `Basic ${basicAuth}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_username');
      localStorage.removeItem('auth_password');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * API Service Object
 */
const api = {
  // ==================== Authentication ====================
  auth: {
    login: async (username, password) => {
      const basicAuth = btoa(`${username}:${password}`);
      const response = await apiClient.get('/v3', {
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
      });

      // Store credentials
      localStorage.setItem('auth_username', username);
      localStorage.setItem('auth_password', password);

      return response.data;
    },

    loginJWT: async (username, password) => {
      const response = await apiClient.post('/v3/login', {
        username,
        password,
      });

      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
      }

      return response.data;
    },

    logout: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_username');
      localStorage.removeItem('auth_password');
    },

    validateToken: async () => {
      try {
        await apiClient.get('/v3');
        return true;
      } catch (error) {
        return false;
      }
    },
  },

  // ==================== System Info ====================
  system: {
    getInfo: () => apiClient.get('/v3'),

    getAbout: () => apiClient.get('/v3/about'),

    getConfig: () => apiClient.get('/v3/config'),

    updateConfig: (config) => apiClient.put('/v3/config', config),

    reloadConfig: () => apiClient.get('/v3/config/reload'),

    getLog: () => apiClient.get('/v3/log'),

    getSkills: () => apiClient.get('/v3/skills'),
  },

  // ==================== Processes ====================
  process: {
    list: () => apiClient.get('/v3/process'),

    get: (id) => apiClient.get(`/v3/process/${id}`),

    create: (processConfig) => apiClient.post('/v3/process', processConfig),

    update: (id, processConfig) => apiClient.put(`/v3/process/${id}`, processConfig),

    delete: (id) => apiClient.delete(`/v3/process/${id}`),

    command: (id, command) => apiClient.put(`/v3/process/${id}/command`, { command }),

    getState: (id) => apiClient.get(`/v3/process/${id}/state`),

    getReport: (id) => apiClient.get(`/v3/process/${id}/report`),

    getProbe: (id) => apiClient.get(`/v3/process/${id}/probe`),

    getConfig: (id) => apiClient.get(`/v3/process/${id}/config`),

    getMetadata: (id) => apiClient.get(`/v3/process/${id}/metadata`),

    updateMetadata: (id, metadata) => apiClient.put(`/v3/process/${id}/metadata`, metadata),

    getLogs: (id) => apiClient.get(`/v3/process/${id}/log`),
  },

  // ==================== Metadata ====================
  metadata: {
    list: () => apiClient.get('/v3/metadata'),

    get: (key) => apiClient.get(`/v3/metadata/${key}`),

    set: (key, data) => apiClient.put(`/v3/metadata/${key}`, data),

    delete: (key) => apiClient.delete(`/v3/metadata/${key}`),
  },

  // ==================== Filesystems ====================
  fs: {
    list: () => apiClient.get('/v3/fs'),

    listFiles: (name, path = '') => apiClient.get(`/v3/fs/${name}${path}`),

    getFile: (name, path) => apiClient.get(`/v3/fs/${name}${path}`, { responseType: 'blob' }),

    uploadFile: (name, path, file, onProgress) => {
      const formData = new FormData();
      formData.append('file', file);

      return apiClient.post(`/v3/fs/${name}${path}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });
    },

    deleteFile: (name, path) => apiClient.delete(`/v3/fs/${name}${path}`),

    getFileInfo: (name, path) => apiClient.head(`/v3/fs/${name}${path}`),
  },

  // ==================== RTMP ====================
  rtmp: {
    getChannels: () => apiClient.get('/v3/rtmp'),

    getChannel: (channelId) => apiClient.get(`/v3/rtmp/${channelId}`),
  },

  // ==================== SRT ====================
  srt: {
    getChannels: () => apiClient.get('/v3/srt'),

    getChannel: (channelId) => apiClient.get(`/v3/srt/${channelId}`),
  },

  // ==================== Sessions ====================
  session: {
    list: (collectors = []) => {
      const params = collectors.length ? { collectors: collectors.join(',') } : {};
      return apiClient.get('/v3/session', { params });
    },

    getActive: (collectors = []) => {
      const params = collectors.length ? { collectors: collectors.join(',') } : {};
      return apiClient.get('/v3/session/active', { params });
    },

    getSummary: () => apiClient.get('/v3/session/summary'),
  },

  // ==================== Metrics ====================
  metrics: {
    get: () => apiClient.get('/v3/metrics'),

    getPrometheus: () => apiClient.get('/metrics', {
      headers: {
        'Accept': 'text/plain',
      },
      transformResponse: [(data) => data],
    }),
  },

  // ==================== Widget (Publication Website) ====================
  widget: {
    list: () => apiClient.get('/v3/widget'),

    get: (processId) => apiClient.get(`/v3/widget/${processId}`),

    create: (processId, config) => apiClient.post(`/v3/widget/${processId}`, config),

    update: (processId, config) => apiClient.put(`/v3/widget/${processId}`, config),

    delete: (processId) => apiClient.delete(`/v3/widget/${processId}`),
  },

  // ==================== Playout ====================
  playout: {
    getStatus: () => apiClient.get('/v3/playout'),
  },

  // ==================== Wizard Configuration ====================
  wizard: {
    // Helper method to create a simple restream process
    createRestream: async (config) => {
      const {
        name,
        description,
        inputUrl,
        inputType = 'network',
        outputs = [],
        videoCodec = 'copy',
        audioCodec = 'copy',
        videoBitrate,
        audioBitrate,
        audioChannels,
        resolution,
        framerate,
        enableHLS = true,
        hlsSegmentDuration = 2,
        licenseType = 'CC BY 4.0',
      } = config;

      // Build FFmpeg command
      let ffmpegArgs = ['-err_detect', 'ignore_err', '-fflags', '+genpts+discardcorrupt'];

      // Input configuration
      if (inputType === 'rtmp') {
        ffmpegArgs.push('-f', 'live_flv');
      }
      ffmpegArgs.push('-i', inputUrl);

      // Video codec configuration
      if (videoCodec === 'copy') {
        ffmpegArgs.push('-c:v', 'copy');
      } else {
        ffmpegArgs.push('-c:v', videoCodec);
        if (videoBitrate) {
          ffmpegArgs.push('-b:v', `${videoBitrate}k`);
        }
        if (resolution) {
          ffmpegArgs.push('-s', resolution);
        }
        if (framerate) {
          ffmpegArgs.push('-r', framerate.toString());
        }
      }

      // Audio codec configuration
      if (audioCodec === 'copy') {
        ffmpegArgs.push('-c:a', 'copy');
      } else {
        ffmpegArgs.push('-c:a', audioCodec);
        if (audioBitrate) {
          ffmpegArgs.push('-b:a', `${audioBitrate}k`);
        }
        if (audioChannels) {
          ffmpegArgs.push('-ac', audioChannels.toString());
        }
      }

      // Add outputs
      outputs.forEach((output) => {
        if (output.type === 'rtmp') {
          ffmpegArgs.push('-f', 'flv', output.url);
        } else if (output.type === 'srt') {
          ffmpegArgs.push('-f', 'mpegts', output.url);
        } else if (output.type === 'hls' || output.type === 'disk') {
          ffmpegArgs.push(
            '-f', 'hls',
            '-hls_time', hlsSegmentDuration.toString(),
            '-hls_list_size', '6',
            '-hls_flags', 'delete_segments+append_list',
            '-hls_segment_filename', `${output.path}/%05d.ts`,
            `${output.path}/index.m3u8`
          );
        }
      });

      const processConfig = {
        id: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        reference: name,
        input: [
          {
            id: 'input_0',
            address: inputUrl,
            options: ['-err_detect', 'ignore_err'],
          },
        ],
        output: outputs.map((output, idx) => ({
          id: `output_${idx}`,
          address: output.url || output.path,
          options: [],
        })),
        options: ['-loglevel', 'level+info'],
        reconnect: true,
        reconnect_delay_seconds: 10,
        autostart: true,
        stale_timeout_seconds: 30,
        metadata: {
          name,
          description,
          license: licenseType,
          created_at: new Date().toISOString(),
        },
      };

      return api.process.create(processConfig);
    },

    // Helper to get common platform configurations
    getPlatformConfigs: () => ({
      youtube: {
        name: 'YouTube Live',
        rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2/',
        requiresKey: true,
        protocols: ['rtmp'],
      },
      twitch: {
        name: 'Twitch',
        rtmpUrl: 'rtmp://live.twitch.tv/app/',
        requiresKey: true,
        protocols: ['rtmp'],
      },
      facebook: {
        name: 'Facebook Live',
        rtmpUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/',
        requiresKey: true,
        protocols: ['rtmps'],
      },
      custom: {
        name: 'Custom RTMP/SRT Server',
        requiresKey: false,
        protocols: ['rtmp', 'rtmps', 'srt'],
      },
    }),

    // Helper to get codec presets
    getCodecPresets: () => ({
      copy: { name: 'Copy (no transcoding)', video: 'copy', audio: 'copy' },
      h264_aac: { name: 'H.264 + AAC', video: 'libx264', audio: 'aac' },
      h265_aac: { name: 'H.265 + AAC', video: 'libx265', audio: 'aac' },
      vp9_opus: { name: 'VP9 + Opus', video: 'libvpx-vp9', audio: 'libopus' },
    }),

    // Helper to get resolution presets
    getResolutionPresets: () => [
      { name: '4K (3840x2160)', value: '3840x2160' },
      { name: '1080p (1920x1080)', value: '1920x1080' },
      { name: '720p (1280x720)', value: '1280x720' },
      { name: '480p (854x480)', value: '854x480' },
      { name: '360p (640x360)', value: '640x360' },
    ],

    // Helper to get Creative Commons licenses
    getLicenses: () => [
      { name: 'CC BY 4.0', description: 'Attribution' },
      { name: 'CC BY-SA 4.0', description: 'Attribution-ShareAlike' },
      { name: 'CC BY-NC 4.0', description: 'Attribution-NonCommercial' },
      { name: 'CC BY-NC-SA 4.0', description: 'Attribution-NonCommercial-ShareAlike' },
      { name: 'CC BY-ND 4.0', description: 'Attribution-NoDerivatives' },
      { name: 'CC BY-NC-ND 4.0', description: 'Attribution-NonCommercial-NoDerivatives' },
      { name: 'CC0 1.0', description: 'Public Domain' },
    ],
  },

  // ==================== Probe (FFprobe) ====================
  probe: {
    analyze: (url, options = []) => {
      return apiClient.post('/v3/probe', {
        url,
        options,
      });
    },
  },

  // ==================== Device Detection ====================
  device: {
    list: async () => {
      try {
        const response = await apiClient.get('/v3/device');
        return response.data;
      } catch (error) {
        return [];
      }
    },
  },
};

export default api;
export { apiClient };
