import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Radio,
  Users,
  HardDrive,
  Cpu,
  MemoryStick,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  PlayCircle,
  StopCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useProcessStore, useSystemStore, useMetricsStore } from '../store';

function Dashboard() {
  const { processes } = useProcessStore();
  const { systemInfo } = useSystemStore();
  const { metrics } = useMetricsStore();

  // Fetch system info
  const { data: system } = useQuery({
    queryKey: ['system'],
    queryFn: () => api.system.getInfo(),
    refetchInterval: 5000,
  });

  // Fetch processes
  const { data: processList } = useQuery({
    queryKey: ['processes'],
    queryFn: () => api.process.list(),
    refetchInterval: 3000,
  });

  // Fetch metrics
  const { data: systemMetrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => api.metrics.get(),
    refetchInterval: 2000,
  });

  // Calculate statistics
  const runningProcesses = processList?.filter(p => p.state?.exec === 'running').length || 0;
  const totalProcesses = processList?.length || 0;
  const errorProcesses = processList?.filter(p => p.state?.exec === 'failed').length || 0;

  const stats = [
    {
      name: 'Total Processes',
      value: totalProcesses,
      icon: Radio,
      color: 'primary',
      link: '/processes',
    },
    {
      name: 'Running',
      value: runningProcesses,
      icon: PlayCircle,
      color: 'success',
      change: runningProcesses > 0 ? '+' + runningProcesses : '0',
    },
    {
      name: 'Errors',
      value: errorProcesses,
      icon: AlertCircle,
      color: 'error',
    },
    {
      name: 'Active Sessions',
      value: systemMetrics?.sessions?.active || 0,
      icon: Users,
      color: 'secondary',
      link: '/sessions',
    },
  ];

  const resourceStats = [
    {
      name: 'CPU Usage',
      value: systemMetrics?.cpu?.usage?.toFixed(1) || 0,
      unit: '%',
      icon: Cpu,
      color: 'primary',
      max: 100,
    },
    {
      name: 'Memory',
      value: systemMetrics?.memory?.usage?.toFixed(1) || 0,
      unit: '%',
      icon: MemoryStick,
      color: 'secondary',
      max: 100,
    },
    {
      name: 'Disk Usage',
      value: systemMetrics?.disk?.usage?.toFixed(1) || 0,
      unit: '%',
      icon: HardDrive,
      color: 'warning',
      max: 100,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-400 mt-1">
            Monitor your streaming infrastructure
          </p>
        </div>
        <Link
          to="/wizard"
          className="btn-primary flex items-center"
        >
          <PlayCircle className="w-5 h-5 mr-2" />
          Create Stream
        </Link>
      </div>

      {/* System Status */}
      {system && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-success-500/10 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-success-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-white">System Online</h3>
                  <p className="text-sm text-dark-400">
                    {system.name} v{system.version?.number || '16'} • Uptime: {formatUptime(system.uptime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-success-400">Operational</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={stat.link || '#'}
              className={`card hover:shadow-glow transition-all ${!stat.link && 'pointer-events-none'}`}
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark-400 mb-1">{stat.name}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    {stat.change && (
                      <p className={`text-sm mt-1 ${stat.color === 'success' ? 'text-success-400' : 'text-dark-400'}`}>
                        {stat.change}
                      </p>
                    )}
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {resourceStats.map((resource, index) => (
          <motion.div
            key={resource.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="card"
          >
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-10 h-10 bg-${resource.color}-500/10 rounded-lg flex items-center justify-center`}>
                    <resource.icon className={`w-5 h-5 text-${resource.color}-400`} />
                  </div>
                  <h3 className="ml-3 text-white font-medium">{resource.name}</h3>
                </div>
                <span className="text-2xl font-bold text-white">
                  {resource.value}{resource.unit}
                </span>
              </div>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${resource.value}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Processes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Processes</h2>
            <Link to="/processes" className="text-primary-400 hover:text-primary-300 text-sm">
              View All →
            </Link>
          </div>
        </div>
        <div className="card-body">
          {processList && processList.length > 0 ? (
            <div className="space-y-3">
              {processList.slice(0, 5).map((process) => (
                <Link
                  key={process.id}
                  to={`/processes/${process.id}`}
                  className="flex items-center justify-between p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      process.state?.exec === 'running'
                        ? 'bg-success-500/10'
                        : process.state?.exec === 'failed'
                        ? 'bg-error-500/10'
                        : 'bg-dark-600'
                    }`}>
                      {process.state?.exec === 'running' ? (
                        <PlayCircle className="w-5 h-5 text-success-400" />
                      ) : process.state?.exec === 'failed' ? (
                        <AlertCircle className="w-5 h-5 text-error-400" />
                      ) : (
                        <StopCircle className="w-5 h-5 text-dark-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium">
                        {process.metadata?.name || process.id}
                      </p>
                      <p className="text-sm text-dark-400">
                        {process.reference || 'No reference'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${
                      process.state?.exec === 'running'
                        ? 'badge-success'
                        : process.state?.exec === 'failed'
                        ? 'badge-error'
                        : 'badge-gray'
                    }`}>
                      {process.state?.exec || 'stopped'}
                    </span>
                    {process.state?.progress?.bitrate && (
                      <p className="text-sm text-dark-400 mt-1">
                        {(process.state.progress.bitrate / 1000).toFixed(1)} Mbps
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Radio className="w-12 h-12 text-dark-500 mx-auto mb-3" />
              <p className="text-dark-400">No processes yet</p>
              <Link to="/wizard" className="btn-primary mt-4 inline-flex items-center">
                <PlayCircle className="w-4 h-4 mr-2" />
                Create Your First Stream
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Helper function to format uptime
function formatUptime(seconds) {
  if (!seconds) return '0s';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default Dashboard;
