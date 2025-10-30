// Export all page components
export { default as Dashboard } from './Dashboard';
export { default as Login } from './Login';
export { default as Wizard } from './Wizard';

// Placeholder pages
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Radio,
  BarChart3,
  Users,
  FolderOpen,
  FileText,
  Settings as SettingsIcon,
  Book,
  AlertCircle,
} from 'lucide-react';

// Processes Page
export function Processes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Processes</h1>
        <p className="text-dark-400 mt-1">Manage your FFmpeg processes</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-body text-center py-12">
          <Radio className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Process Management</h3>
          <p className="text-dark-400 mb-6 max-w-md mx-auto">
            View and manage all your FFmpeg processes. Monitor status, statistics, and logs in real-time.
          </p>
          <Link to="/wizard" className="btn-primary inline-flex items-center">
            Create New Process
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// Process Details Page
export function ProcessDetails() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Process Details</h1>
        <p className="text-dark-400 mt-1">View detailed process information</p>
      </div>

      <div className="card">
        <div className="card-body text-center py-12">
          <Radio className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Process Information</h3>
          <p className="text-dark-400 mb-6">
            Detailed process statistics, logs, and configuration will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}

// Metrics Page
export function Metrics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Metrics</h1>
        <p className="text-dark-400 mt-1">System performance and analytics</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-body text-center py-12">
          <BarChart3 className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">System Metrics</h3>
          <p className="text-dark-400 mb-6 max-w-md mx-auto">
            Monitor CPU, memory, network usage, and more. View historical data and trends.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
            <div className="bg-dark-700 rounded-lg p-4">
              <p className="text-dark-400 text-sm mb-1">CPU Usage</p>
              <p className="text-2xl font-bold text-white">--</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <p className="text-dark-400 text-sm mb-1">Memory</p>
              <p className="text-2xl font-bold text-white">--</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <p className="text-dark-400 text-sm mb-1">Network</p>
              <p className="text-2xl font-bold text-white">--</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Sessions Page
export function Sessions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Sessions</h1>
        <p className="text-dark-400 mt-1">Active viewer connections</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-body text-center py-12">
          <Users className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Viewer Sessions</h3>
          <p className="text-dark-400 mb-6 max-w-md mx-auto">
            Monitor active viewer sessions, bandwidth usage, and connection details.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-md mx-auto">
            <div className="bg-dark-700 rounded-lg p-4">
              <p className="text-dark-400 text-sm mb-1">Active Sessions</p>
              <p className="text-3xl font-bold text-white">0</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <p className="text-dark-400 text-sm mb-1">Total Bandwidth</p>
              <p className="text-3xl font-bold text-white">0 MB/s</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// File Manager Page
export function FileManager() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">File Manager</h1>
        <p className="text-dark-400 mt-1">Browse and manage files</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-body text-center py-12">
          <FolderOpen className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">File Management</h3>
          <p className="text-dark-400 mb-6 max-w-md mx-auto">
            Browse filesystems, upload files, and manage your media content.
          </p>
          <button className="btn-primary">
            Upload Files
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Logs Page
export function Logs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Logs</h1>
        <p className="text-dark-400 mt-1">System and process logs</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-primary-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">System Logs</h3>
            </div>
            <button className="btn-ghost text-sm">
              Clear Logs
            </button>
          </div>
          <div className="bg-dark-900 rounded-lg p-4 font-mono text-sm text-dark-300 max-h-96 overflow-auto">
            <div className="space-y-1">
              <p className="text-primary-400">[INFO] System started successfully</p>
              <p className="text-success-400">[INFO] API server listening on port 8080</p>
              <p className="text-primary-400">[INFO] Ready to accept connections</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Settings Page
export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-dark-400 mt-1">Configure your datarhei Core</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-body text-center py-12">
          <SettingsIcon className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">System Configuration</h3>
          <p className="text-dark-400 mb-6 max-w-md mx-auto">
            Configure system settings, network, security, storage, and more.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto text-left">
            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">General</h4>
              <p className="text-dark-400 text-sm">System name, timezone, updates</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Network</h4>
              <p className="text-dark-400 text-sm">RTMP, SRT, TLS settings</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Security</h4>
              <p className="text-dark-400 text-sm">Authentication, access control</p>
            </div>
            <div className="bg-dark-700 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">Storage</h4>
              <p className="text-dark-400 text-sm">Disk, memory, S3 configuration</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Documentation Page
export function Documentation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Documentation</h1>
        <p className="text-dark-400 mt-1">Learn how to use datarhei Core</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-body text-center py-12">
          <Book className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Documentation & Help</h3>
          <p className="text-dark-400 mb-6 max-w-md mx-auto">
            Access guides, tutorials, and API documentation.
          </p>
          <div className="space-y-3 mt-8 max-w-md mx-auto">
            <a
              href="https://docs.datarhei.com/core"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-dark-700 hover:bg-dark-600 rounded-lg p-4 text-left transition-colors"
            >
              <h4 className="text-white font-semibold mb-1">📚 User Guide</h4>
              <p className="text-dark-400 text-sm">Complete documentation and tutorials</p>
            </a>
            <Link
              to="/api/swagger"
              className="block bg-dark-700 hover:bg-dark-600 rounded-lg p-4 text-left transition-colors"
            >
              <h4 className="text-white font-semibold mb-1">🔌 API Reference</h4>
              <p className="text-dark-400 text-sm">REST API documentation with Swagger</p>
            </Link>
            <a
              href="https://github.com/datarhei/core/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-dark-700 hover:bg-dark-600 rounded-lg p-4 text-left transition-colors"
            >
              <h4 className="text-white font-semibold mb-1">💬 Community</h4>
              <p className="text-dark-400 text-sm">Ask questions and share experiences</p>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// 404 Not Found Page
export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <AlertCircle className="w-20 h-20 text-error-400 mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-dark-300 mb-6">Page Not Found</h2>
        <p className="text-dark-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn-primary inline-flex items-center">
          Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
