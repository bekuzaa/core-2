import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Play,
  Settings,
  Radio,
  Upload,
  Video,
  Music,
  Globe,
  Plus,
  Trash2,
  ChevronDown,
  AlertCircle,
  Info,
  Youtube,
  Twitch,
  Facebook,
  Server,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useWizardStore } from '../store';
import api from '../services/api';

// Step Components
const StepIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: currentStep >= index ? 1 : 0.8,
                  opacity: currentStep >= index ? 1 : 0.5,
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  currentStep > index
                    ? 'bg-success-500 border-success-500'
                    : currentStep === index
                    ? 'bg-primary-500 border-primary-500 shadow-glow'
                    : 'bg-dark-700 border-dark-600'
                }`}
              >
                {currentStep > index ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-white font-semibold">{index + 1}</span>
                )}
              </motion.div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= index ? 'text-white' : 'text-dark-400'
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 bg-dark-700 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: currentStep > index ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-success-500 to-primary-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Step 1: Basic Information
const BasicInfoStep = ({ data, updateData }) => {
  const licenses = api.wizard.getLicenses();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4 flex items-start">
        <Info className="w-5 h-5 text-primary-400 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-primary-400 font-medium mb-1">Welcome to Stream Setup Wizard!</h4>
          <p className="text-sm text-dark-300">
            This wizard will guide you through setting up your stream in just a few simple steps.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-300 mb-2">
          Stream Name <span className="text-error-500">*</span>
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          placeholder="e.g., My Live Stream"
          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-300 mb-2">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          placeholder="Describe your stream..."
          rows={4}
          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-300 mb-2">
          Content License
        </label>
        <select
          value={data.license}
          onChange={(e) => updateData({ license: e.target.value })}
          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {licenses.map((license) => (
            <option key={license.name} value={license.name}>
              {license.name} - {license.description}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-dark-400">
          Choose a Creative Commons license for your content
        </p>
      </div>
    </motion.div>
  );
};

// Step 2: Input Configuration
const InputStep = ({ data, updateData }) => {
  const inputTypes = [
    { id: 'network', name: 'Network Stream', icon: Globe, description: 'HTTP, RTSP, or other network sources' },
    { id: 'rtmp', name: 'RTMP Input', icon: Radio, description: 'Receive RTMP stream' },
    { id: 'srt', name: 'SRT Input', icon: Upload, description: 'Receive SRT stream' },
    { id: 'device', name: 'Device', icon: Video, description: 'Camera or capture card' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-dark-300 mb-4">
          Select Input Type <span className="text-error-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inputTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = data.inputType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => updateData({ inputType: type.id })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-600 bg-dark-700 hover:border-dark-500'
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary-500' : 'bg-dark-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-white font-medium">{type.name}</h4>
                    <p className="text-sm text-dark-400 mt-1">{type.description}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-primary-400 ml-2" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {data.inputType === 'network' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Input URL <span className="text-error-500">*</span>
          </label>
          <input
            type="url"
            value={data.inputUrl}
            onChange={(e) => updateData({ inputUrl: e.target.value })}
            placeholder="https://example.com/stream.m3u8"
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            required
          />
          <p className="mt-2 text-xs text-dark-400">
            Examples: HTTP/HLS, RTSP, RTMP, or file URL
          </p>
        </motion.div>
      )}

      {data.inputType === 'rtmp' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-700 rounded-lg p-4 border border-dark-600"
        >
          <p className="text-dark-300 text-sm mb-2">
            RTMP will be available at:
          </p>
          <code className="block bg-dark-800 text-primary-400 p-3 rounded font-mono text-sm">
            rtmp://your-server-address/live/{data.name.toLowerCase().replace(/\s+/g, '_')}
          </code>
        </motion.div>
      )}

      {data.inputType === 'srt' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-700 rounded-lg p-4 border border-dark-600"
        >
          <p className="text-dark-300 text-sm mb-2">
            SRT will be available at:
          </p>
          <code className="block bg-dark-800 text-primary-400 p-3 rounded font-mono text-sm">
            srt://your-server-address:6000?streamid={data.name.toLowerCase().replace(/\s+/g, '_')}
          </code>
        </motion.div>
      )}
    </motion.div>
  );
};

// Step 3: Output Configuration
const OutputStep = ({ data, updateData, addOutput, removeOutput }) => {
  const [showAddOutput, setShowAddOutput] = useState(false);
  const [newOutput, setNewOutput] = useState({
    type: 'hls',
    platform: 'custom',
    url: '',
    key: '',
  });

  const platforms = api.wizard.getPlatformConfigs();

  const handleAddOutput = () => {
    if (newOutput.type === 'hls') {
      addOutput({
        type: 'hls',
        path: `/memfs/${data.name.toLowerCase().replace(/\s+/g, '_')}`,
      });
    } else {
      const url =
        newOutput.platform === 'custom'
          ? newOutput.url
          : platforms[newOutput.platform].rtmpUrl + newOutput.key;
      addOutput({
        type: newOutput.type,
        platform: newOutput.platform,
        url,
      });
    }

    setNewOutput({ type: 'hls', platform: 'custom', url: '', key: '' });
    setShowAddOutput(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Output Destinations</h3>
        <button
          onClick={() => setShowAddOutput(true)}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Output
        </button>
      </div>

      {/* Existing Outputs */}
      <div className="space-y-3">
        {data.outputs.map((output, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-700 rounded-lg p-4 border border-dark-600 flex items-center justify-between"
          >
            <div className="flex items-center">
              {output.type === 'hls' ? (
                <Globe className="w-5 h-5 text-primary-400 mr-3" />
              ) : (
                <Radio className="w-5 h-5 text-primary-400 mr-3" />
              )}
              <div>
                <p className="text-white font-medium">
                  {output.type.toUpperCase()}{' '}
                  {output.platform && output.platform !== 'custom' && (
                    <span className="text-dark-400">
                      - {platforms[output.platform]?.name}
                    </span>
                  )}
                </p>
                <p className="text-sm text-dark-400 font-mono truncate max-w-md">
                  {output.url || output.path}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeOutput(index)}
              className="p-2 text-error-400 hover:text-error-300 hover:bg-error-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}

        {data.outputs.length === 0 && (
          <div className="text-center py-12 bg-dark-700 rounded-lg border-2 border-dashed border-dark-600">
            <Radio className="w-12 h-12 text-dark-500 mx-auto mb-3" />
            <p className="text-dark-400">No outputs configured yet</p>
            <p className="text-sm text-dark-500 mt-1">Click "Add Output" to get started</p>
          </div>
        )}
      </div>

      {/* Add Output Modal */}
      <AnimatePresence>
        {showAddOutput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddOutput(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-800 rounded-xl p-6 max-w-lg w-full border border-dark-700"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Add Output</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Output Type
                  </label>
                  <select
                    value={newOutput.type}
                    onChange={(e) =>
                      setNewOutput({ ...newOutput, type: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="hls">HLS (Web Player)</option>
                    <option value="rtmp">RTMP</option>
                    <option value="srt">SRT</option>
                  </select>
                </div>

                {newOutput.type !== 'hls' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-dark-300 mb-2">
                        Platform
                      </label>
                      <select
                        value={newOutput.platform}
                        onChange={(e) =>
                          setNewOutput({ ...newOutput, platform: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="youtube">YouTube Live</option>
                        <option value="twitch">Twitch</option>
                        <option value="facebook">Facebook Live</option>
                        <option value="custom">Custom Server</option>
                      </select>
                    </div>

                    {newOutput.platform === 'custom' ? (
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                          Server URL
                        </label>
                        <input
                          type="text"
                          value={newOutput.url}
                          onChange={(e) =>
                            setNewOutput({ ...newOutput, url: e.target.value })
                          }
                          placeholder="rtmp://server.com/live/stream"
                          className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-dark-300 mb-2">
                          Stream Key
                        </label>
                        <input
                          type="password"
                          value={newOutput.key}
                          onChange={(e) =>
                            setNewOutput({ ...newOutput, key: e.target.value })
                          }
                          placeholder="Enter your stream key"
                          className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddOutput(false)}
                  className="flex-1 px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOutput}
                  disabled={
                    newOutput.type !== 'hls' &&
                    (newOutput.platform === 'custom'
                      ? !newOutput.url
                      : !newOutput.key)
                  }
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Output
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Step 4: Encoding Settings
const EncodingStep = ({ data, updateData }) => {
  const codecPresets = api.wizard.getCodecPresets();
  const resolutions = api.wizard.getResolutionPresets();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-warning-500/10 border border-warning-500/30 rounded-lg p-4 flex items-start">
        <AlertCircle className="w-5 h-5 text-warning-400 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-dark-300">
            Choose "Copy" to avoid re-encoding (recommended for best performance). Select specific
            codecs only if you need transcoding.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Video Codec
          </label>
          <select
            value={data.videoCodec}
            onChange={(e) => updateData({ videoCodec: e.target.value })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {Object.entries(codecPresets).map(([key, preset]) => (
              <option key={key} value={preset.video}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Audio Codec
          </label>
          <select
            value={data.audioCodec}
            onChange={(e) => updateData({ audioCodec: e.target.value })}
            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="copy">Copy (no transcoding)</option>
            <option value="aac">AAC</option>
            <option value="libopus">Opus</option>
            <option value="libmp3lame">MP3</option>
          </select>
        </div>
      </div>

      {data.videoCodec !== 'copy' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Resolution
            </label>
            <select
              value={data.resolution || ''}
              onChange={(e) => updateData({ resolution: e.target.value || null })}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Original</option>
              {resolutions.map((res) => (
                <option key={res.value} value={res.value}>
                  {res.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Video Bitrate (kbps)
            </label>
            <input
              type="number"
              value={data.videoBitrate || ''}
              onChange={(e) =>
                updateData({ videoBitrate: e.target.value ? parseInt(e.target.value) : null })
              }
              placeholder="Auto"
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </motion.div>
      )}

      {data.audioCodec !== 'copy' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Audio Bitrate (kbps)
            </label>
            <input
              type="number"
              value={data.audioBitrate || ''}
              onChange={(e) =>
                updateData({ audioBitrate: e.target.value ? parseInt(e.target.value) : null })
              }
              placeholder="128"
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Audio Channels
            </label>
            <select
              value={data.audioChannels || ''}
              onChange={(e) =>
                updateData({ audioChannels: e.target.value ? parseInt(e.target.value) : null })
              }
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Original</option>
              <option value="1">Mono (1)</option>
              <option value="2">Stereo (2)</option>
              <option value="6">5.1 Surround (6)</option>
            </select>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Step 5: Review & Launch
const ReviewStep = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-success-500/10 border border-success-500/30 rounded-lg p-4 flex items-start">
        <Sparkles className="w-5 h-5 text-success-400 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-success-400 font-medium mb-1">Ready to Launch!</h4>
          <p className="text-sm text-dark-300">
            Review your configuration below and click "Create Stream" to start streaming.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Basic Info */}
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Info className="w-4 h-4 mr-2 text-primary-400" />
            Basic Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-400">Name:</span>
              <span className="text-white font-medium">{data.name}</span>
            </div>
            {data.description && (
              <div className="flex justify-between">
                <span className="text-dark-400">Description:</span>
                <span className="text-white">{data.description}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-dark-400">License:</span>
              <span className="text-white">{data.license}</span>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Video className="w-4 h-4 mr-2 text-primary-400" />
            Input Source
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-400">Type:</span>
              <span className="text-white font-medium uppercase">{data.inputType}</span>
            </div>
            {data.inputUrl && (
              <div>
                <span className="text-dark-400">URL:</span>
                <code className="block mt-1 bg-dark-800 text-primary-400 p-2 rounded font-mono text-xs break-all">
                  {data.inputUrl}
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Outputs */}
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Radio className="w-4 h-4 mr-2 text-primary-400" />
            Outputs ({data.outputs.length})
          </h4>
          {data.outputs.length > 0 ? (
            <div className="space-y-2">
              {data.outputs.map((output, index) => (
                <div key={index} className="bg-dark-800 p-3 rounded">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white font-medium">
                      {output.type.toUpperCase()}
                      {output.platform && ` - ${output.platform}`}
                    </span>
                  </div>
                  <code className="block mt-1 text-primary-400 font-mono text-xs break-all">
                    {output.url || output.path}
                  </code>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dark-400 text-sm">No outputs configured</p>
          )}
        </div>

        {/* Encoding */}
        <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            <Settings className="w
