import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Global State Store using Zustand
 * Manages application state including auth, processes, system info, and UI state
 */

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      login: (user, token) => {
        set({ isAuthenticated: true, user, token });
      },

      logout: () => {
        set({ isAuthenticated: false, user: null, token: null });
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_username');
        localStorage.removeItem('auth_password');
      },

      updateUser: (user) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

// System Store
export const useSystemStore = create((set, get) => ({
  systemInfo: null,
  config: null,
  skills: null,
  loading: false,
  error: null,

  setSystemInfo: (info) => set({ systemInfo: info }),
  setConfig: (config) => set({ config }),
  setSkills: (skills) => set({ skills }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));

// Process Store
export const useProcessStore = create((set, get) => ({
  processes: [],
  selectedProcess: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all', // all, running, stopped, error
    sortBy: 'name', // name, status, created, cpu, memory
    sortOrder: 'asc', // asc, desc
  },

  setProcesses: (processes) => set({ processes }),

  addProcess: (process) => {
    const processes = get().processes;
    set({ processes: [...processes, process] });
  },

  updateProcess: (processId, updates) => {
    const processes = get().processes;
    set({
      processes: processes.map((p) =>
        p.id === processId ? { ...p, ...updates } : p
      ),
    });
  },

  removeProcess: (processId) => {
    const processes = get().processes;
    set({ processes: processes.filter((p) => p.id !== processId) });
  },

  selectProcess: (process) => set({ selectedProcess: process }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  getFilteredProcesses: () => {
    const { processes, filters } = get();
    let filtered = [...processes];

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.id?.toLowerCase().includes(search) ||
          p.reference?.toLowerCase().includes(search) ||
          p.metadata?.name?.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((p) => {
        const state = p.state?.exec || 'stopped';
        if (filters.status === 'running') return state === 'running';
        if (filters.status === 'stopped') return state === 'finished' || state === 'stopped';
        if (filters.status === 'error') return state === 'failed' || state === 'error';
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (filters.sortBy) {
        case 'name':
          aVal = a.metadata?.name || a.id || '';
          bVal = b.metadata?.name || b.id || '';
          break;
        case 'status':
          aVal = a.state?.exec || '';
          bVal = b.state?.exec || '';
          break;
        case 'cpu':
          aVal = a.state?.progress?.cpu || 0;
          bVal = b.state?.progress?.cpu || 0;
          break;
        case 'memory':
          aVal = a.state?.progress?.memory_bytes || 0;
          bVal = b.state?.progress?.memory_bytes || 0;
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string') {
        return filters.sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else {
        return filters.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
    });

    return filtered;
  },
}));

// Metrics Store
export const useMetricsStore = create((set, get) => ({
  metrics: null,
  history: [],
  maxHistoryLength: 60, // Keep last 60 data points
  loading: false,

  setMetrics: (metrics) => {
    const history = get().history;
    const timestamp = Date.now();

    set({
      metrics,
      history: [
        ...history.slice(-(get().maxHistoryLength - 1)),
        { timestamp, ...metrics },
      ],
    });
  },

  setLoading: (loading) => set({ loading }),

  clearHistory: () => set({ history: [] }),
}));

// Session Store
export const useSessionStore = create((set, get) => ({
  sessions: [],
  activeSessions: [],
  summary: null,
  loading: false,

  setSessions: (sessions) => set({ sessions }),
  setActiveSessions: (activeSessions) => set({ activeSessions }),
  setSummary: (summary) => set({ summary }),
  setLoading: (loading) => set({ loading }),
}));

// UI Store
export const useUIStore = create(
  persist(
    (set, get) => ({
      theme: 'dark',
      sidebarOpen: true,
      sidebarCollapsed: false,
      notifications: [],
      modals: {
        createProcess: false,
        editProcess: false,
        deleteProcess: false,
        settings: false,
        wizard: false,
      },

      toggleTheme: () => {
        const theme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },

      toggleSidebar: () => {
        set({ sidebarOpen: !get().sidebarOpen });
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebarCollapsed: () => {
        set({ sidebarCollapsed: !get().sidebarCollapsed });
      },

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      addNotification: (notification) => {
        const id = Date.now().toString();
        const notifications = get().notifications;
        set({
          notifications: [...notifications, { id, ...notification }],
        });

        // Auto remove after 5 seconds
        if (notification.autoClose !== false) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration || 5000);
        }

        return id;
      },

      removeNotification: (id) => {
        const notifications = get().notifications;
        set({
          notifications: notifications.filter((n) => n.id !== id),
        });
      },

      clearNotifications: () => set({ notifications: [] }),

      openModal: (modalName) => {
        set({
          modals: { ...get().modals, [modalName]: true },
        });
      },

      closeModal: (modalName) => {
        set({
          modals: { ...get().modals, [modalName]: false },
        });
      },

      closeAllModals: () => {
        const modals = Object.keys(get().modals).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
        set({ modals });
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// Wizard Store
export const useWizardStore = create((set, get) => ({
  step: 0,
  totalSteps: 5,
  data: {
    // Step 1: Basic Info
    name: '',
    description: '',
    license: 'CC BY 4.0',

    // Step 2: Input Configuration
    inputType: 'network', // network, rtmp, srt, device
    inputUrl: '',
    inputDevice: null,

    // Step 3: Output Configuration
    outputs: [],

    // Step 4: Encoding Settings
    videoCodec: 'copy',
    audioCodec: 'copy',
    videoBitrate: null,
    audioBitrate: null,
    resolution: null,
    framerate: null,
    audioChannels: null,

    // Step 5: Advanced Options
    enableHLS: true,
    hlsSegmentDuration: 2,
    enableWidget: false,
    autoStart: true,
    reconnect: true,
    reconnectDelay: 10,
  },
  completed: false,

  nextStep: () => {
    const { step, totalSteps } = get();
    if (step < totalSteps - 1) {
      set({ step: step + 1 });
    }
  },

  prevStep: () => {
    const { step } = get();
    if (step > 0) {
      set({ step: step - 1 });
    }
  },

  goToStep: (step) => {
    if (step >= 0 && step < get().totalSteps) {
      set({ step });
    }
  },

  updateData: (data) => {
    set({ data: { ...get().data, ...data } });
  },

  addOutput: (output) => {
    const data = get().data;
    set({
      data: {
        ...data,
        outputs: [...data.outputs, output],
      },
    });
  },

  removeOutput: (index) => {
    const data = get().data;
    set({
      data: {
        ...data,
        outputs: data.outputs.filter((_, i) => i !== index),
      },
    });
  },

  updateOutput: (index, output) => {
    const data = get().data;
    set({
      data: {
        ...data,
        outputs: data.outputs.map((o, i) => (i === index ? { ...o, ...output } : o)),
      },
    });
  },

  reset: () => {
    set({
      step: 0,
      data: {
        name: '',
        description: '',
        license: 'CC BY 4.0',
        inputType: 'network',
        inputUrl: '',
        inputDevice: null,
        outputs: [],
        videoCodec: 'copy',
        audioCodec: 'copy',
        videoBitrate: null,
        audioBitrate: null,
        resolution: null,
        framerate: null,
        audioChannels: null,
        enableHLS: true,
        hlsSegmentDuration: 2,
        enableWidget: false,
        autoStart: true,
        reconnect: true,
        reconnectDelay: 10,
      },
      completed: false,
    });
  },

  complete: () => set({ completed: true }),
}));

// Export all stores as a single object for convenience
export default {
  useAuthStore,
  useSystemStore,
  useProcessStore,
  useMetricsStore,
  useSessionStore,
  useUIStore,
  useWizardStore,
};
