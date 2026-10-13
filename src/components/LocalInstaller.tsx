import React, { useState } from 'react';
import { Download, Package, Terminal, CheckCircle, AlertCircle, ExternalLink, Copy, Folder, Settings, Zap, Shield, Globe, Monitor, ArrowLeft } from 'lucide-react';

interface LocalInstallerProps {
  onBack: () => void;
}

export const LocalInstaller: React.FC<LocalInstallerProps> = ({ onBack }) => {
  const [selectedOS, setSelectedOS] = useState<'windows' | 'macos' | 'linux'>('windows');
  const [installMethod, setInstallMethod] = useState<'installer' | 'manual' | 'docker'>('installer');
  const [copied, setCopied] = useState<string | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [customInstallPath, setCustomInstallPath] = useState('');
  const [installAIModels, setInstallAIModels] = useState(true);
  const [selectedModels, setSelectedModels] = useState<string[]>(['mistral']);
  const [autoStartOllama, setAutoStartOllama] = useState(true);
  const [createDesktopShortcut, setCreateDesktopShortcut] = useState(true);
  const [addToStartMenu, setAddToStartMenu] = useState(true);
  const [installProgress, setInstallProgress] = useState(0);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installStep, setInstallStep] = useState('');
  const [installComplete, setInstallComplete] = useState(false);
  const [installError, setInstallError] = useState<string | null>(null);
  const [showSystemRequirements, setShowSystemRequirements] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const installCommands = {
    windows: {
      installer: {
        title: 'Windows Installer (Recommended)',
        steps: [
          'Download Techarket-Setup.exe',
          'Run the installer as Administrator',
          'Follow the installation wizard',
          'Launch Techarket from Desktop or Start Menu'
        ],
        downloadUrl: 'https://releases.techarket.com/v1.0.0/Techarket-Setup.exe'
      },
      manual: {
        title: 'Manual Installation',
        commands: [
          'winget install nodejs',
          'winget install ollama',
          'git clone https://github.com/techarket/ai-platform.git',
          'cd ai-platform',
          'npm install',
          'npm run build',
          'npm run start'
        ]
      },
      docker: {
        title: 'Docker Installation',
        commands: [
          'docker pull techarket/ai-platform:latest',
          'docker run -d -p 5173:5173 -v techarket-data:/app/data techarket/ai-platform:latest'
        ]
      }
    },
    macos: {
      installer: {
        title: 'macOS Installer (Recommended)',
        steps: [
          'Download Techarket.dmg',
          'Open the DMG file',
          'Drag Techarket to Applications folder',
          'Launch Techarket from Applications'
        ],
        downloadUrl: 'https://releases.techarket.com/v1.0.0/Techarket.dmg'
      },
      manual: {
        title: 'Manual Installation via Homebrew',
        commands: [
          'brew install node',
          'brew install ollama',
          'git clone https://github.com/techarket/ai-platform.git',
          'cd ai-platform',
          'npm install',
          'npm run build',
          'npm run start'
        ]
      },
      docker: {
        title: 'Docker Installation',
        commands: [
          'docker pull techarket/ai-platform:latest',
          'docker run -d -p 5173:5173 -v techarket-data:/app/data techarket/ai-platform:latest'
        ]
      }
    },
    linux: {
      installer: {
        title: 'Linux AppImage (Recommended)',
        steps: [
          'Download Techarket.AppImage',
          'Make it executable: chmod +x Techarket.AppImage',
          'Run: ./Techarket.AppImage',
          'Optional: Integrate with system using AppImageLauncher'
        ],
        downloadUrl: 'https://releases.techarket.com/v1.0.0/Techarket.AppImage'
      },
      manual: {
        title: 'Manual Installation',
        commands: [
          'curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -',
          'sudo apt-get install -y nodejs',
          'curl -fsSL https://ollama.com/install.sh | sh',
          'git clone https://github.com/techarket/ai-platform.git',
          'cd ai-platform',
          'npm install',
          'npm run build',
          'npm run start'
        ]
      },
      docker: {
        title: 'Docker Installation',
        commands: [
          'docker pull techarket/ai-platform:latest',
          'docker run -d -p 5173:5173 -v techarket-data:/app/data techarket/ai-platform:latest'
        ]
      }
    }
  };

  const currentInstall = installCommands[selectedOS][installMethod];

  const availableModels = [
    { id: 'mistral', name: 'Mistral 7B', size: '4.1GB', recommended: true },
    { id: 'codellama', name: 'Code Llama 7B', size: '3.8GB', recommended: false },
    { id: 'llama2', name: 'Llama 2 7B', size: '3.8GB', recommended: false },
    { id: 'neural-chat', name: 'Neural Chat 7B', size: '4.1GB', recommended: false },
    { id: 'deepseek-coder', name: 'DeepSeek Coder 6.7B', size: '3.8GB', recommended: true },
    { id: 'phi', name: 'Phi 2.7B', size: '1.7GB', recommended: false },
    { id: 'gemma', name: 'Gemma 7B', size: '5.0GB', recommended: false }
  ];

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const simulateInstallation = () => {
    setIsInstalling(true);
    setInstallProgress(0);
    setInstallStep('Preparing installation...');
    
    const steps = [
      { progress: 10, message: 'Downloading Techarket platform...' },
      { progress: 25, message: 'Installing dependencies...' },
      { progress: 40, message: 'Configuring environment...' },
      { progress: 60, message: 'Setting up Ollama integration...' },
      { progress: 75, message: 'Downloading AI models...' },
      { progress: 90, message: 'Finalizing installation...' },
      { progress: 100, message: 'Installation complete!' }
    ];
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setInstallProgress(steps[currentStep].progress);
        setInstallStep(steps[currentStep].message);
        currentStep++;
      } else {
        clearInterval(interval);
        setInstallComplete(true);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors"
              title="Back"
            >
              <ArrowLeft size={20} className="text-gray-300" />
            </button>
            <img 
              src="/techarket-logo.jpeg" 
              alt="Techarket Logo" 
              className="w-12 h-12 rounded-lg object-cover"
            />
            <h1 className="text-3xl font-bold">Install Techarket Locally</h1>
          </div>
          
          <button
            onClick={() => setShowSystemRequirements(!showSystemRequirements)}
            className="flex items-center space-x-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 rounded-lg px-4 py-2 transition-colors"
          >
            <Cpu size={16} />
            <span>System Requirements</span>
          </button>
        </div>

        {showSystemRequirements && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="w-6 h-6 mr-2 text-blue-400" />
              System Requirements
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-3 text-green-400">Minimum Requirements</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start space-x-2">
                    <Cpu size={16} className="mt-0.5 text-blue-400 flex-shrink-0" />
                    <div>
                      <span className="font-medium">CPU:</span> 4-core processor (Intel i5/AMD Ryzen 5 or better)
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Memory size={16} className="mt-0.5 text-blue-400 flex-shrink-0" />
                    <div>
                      <span className="font-medium">RAM:</span> 8GB (16GB recommended for larger models)
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <HardDrive size={16} className="mt-0.5 text-blue-400 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Storage:</span> 10GB free space (20GB+ recommended)
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Globe size={16} className="mt-0.5 text-blue-400 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Internet:</span> Required for initial setup and model download
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Monitor size={16} className="mt-0.5 text-blue-400 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Display:</span> 1280x720 or higher resolution
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 text-purple-400">Recommended Specifications</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start space-x-2">
                    <Cpu size={16} className="mt-0.5 text-purple-400 flex-shrink-0" />
                    <div>
                      <span className="font-medium">CPU:</span> 8-core processor (Intel i7/AMD Ryzen 7 or better)
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Memory size={16} className="mt-0.5 text-purple-400 flex-shrink-0" />
                    <div>
                      <span className="font-medium">RAM:</span> 16GB+ (32GB for multiple large models)
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <HardDrive size={16} className="mt-0.5 text-purple-400 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Storage:</span> 50GB+ SSD storage
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Zap size={16} className="mt-0.5 text-purple-400 flex-shrink-0" />
                    <div>
                      <span className="font-medium">GPU:</span> NVIDIA GPU with 6GB+ VRAM (optional, for acceleration)
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Globe size={16} className="mt-0.5 text-purple-400 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Internet:</span> High-speed connection for faster model downloads
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <h5 className="font-medium mb-2 text-blue-300 flex items-center">
                <Info size={16} className="mr-2" />
                Important Notes
              </h5>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• AI model sizes vary from 1.7GB to 5GB each</li>
                <li>• Performance depends on your hardware capabilities</li>
                <li>• GPU acceleration significantly improves performance</li>
                <li>• Models are downloaded once and stored locally</li>
                <li>• All processing happens on your device - no cloud dependency</li>
              </ul>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Shield,
              title: '100% Private',
              description: 'All AI processing happens locally. Your code never leaves your machine.'
            },
            {
              icon: Zap,
              title: 'No API Costs',
              description: 'Unlimited usage with local AI models. No subscription fees or usage limits.'
            },
            {
              icon: Monitor,
              title: 'Offline Capable',
              description: 'Work completely offline once installed. No internet connection required.'
            },
            {
              icon: Globe,
              title: 'Universal Access',
              description: 'Run locally or deploy to your own servers. Complete control and flexibility.'
            }
          ].map((benefit, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
              <benefit.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-300">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Installation Options */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Installation Method</h2>
          
          {/* OS Selection */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-800 rounded-lg p-1">
              {[
                { id: 'windows', label: 'Windows', icon: '🪟' },
                { id: 'macos', label: 'macOS', icon: '🍎' },
                { id: 'linux', label: 'Linux', icon: '🐧' }
              ].map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setSelectedOS(id as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded text-sm font-medium transition-colors ${
                    selectedOS === id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Installation Method Selection */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-800 rounded-lg p-1">
              {[
                { id: 'installer', label: 'Easy Installer', icon: Package },
                { id: 'manual', label: 'Manual Setup', icon: Terminal },
                { id: 'docker', label: 'Docker', icon: Settings }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setInstallMethod(id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    installMethod === id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Installation Instructions */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="w-6 h-6 mr-2 text-blue-400" />
              {currentInstall.title}
            </h3>

            {installMethod === 'installer' && 'downloadUrl' in currentInstall ? (
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-blue-300">Quick Download</h4>
                  <p className="text-sm text-blue-200 mb-4">
                    Get the official Techarket installer for {selectedOS}. Includes everything you need.
                  </p>
                  
                  {isInstalling ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>{installStep}</span>
                        <span>{installProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${installProgress}%` }}
                        />
                      </div>
                      
                      {installComplete && (
                        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mt-4">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="text-green-400 w-6 h-6" />
                            <div>
                              <h5 className="font-medium text-green-300">Installation Complete!</h5>
                              <p className="text-sm text-green-200 mt-1">
                                Techarket has been successfully installed on your system.
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={onBack}
                            className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium w-full"
                          >
                            Return to Techarket
                          </button>
                        </div>
                      )}
                      
                      {installError && (
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mt-4">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="text-red-400 w-6 h-6 flex-shrink-0" />
                            <div>
                              <h5 className="font-medium text-red-300">Installation Error</h5>
                              <p className="text-sm text-red-200 mt-1">
                                {installError}
                              </p>
                              <button
                                onClick={() => {
                                  setIsInstalling(false);
                                  setInstallError(null);
                                }}
                                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                              >
                                Try Again
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <a
                          href={currentInstall.downloadUrl}
                          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          <Download size={20} />
                          <span>Download Installer</span>
                          <ExternalLink size={16} />
                        </a>
                        
                        <button
                          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                          className="inline-flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          <Settings size={16} />
                          <span>Advanced Options</span>
                        </button>
                      </div>
                      
                      {showAdvancedOptions && (
                        <div className="mt-4 bg-gray-700 rounded-lg p-4 space-y-4">
                          <h5 className="font-medium text-gray-200">Installation Options</h5>
                          
                          <div>
                            <label className="block text-sm text-gray-300 mb-1">
                              Custom Install Location
                            </label>
                            <div className="flex">
                              <input
                                type="text"
                                value={customInstallPath}
                                onChange={(e) => setCustomInstallPath(e.target.value)}
                                placeholder={selectedOS === 'windows' ? 'C:\\Program Files\\Techarket' : '/Applications/Techarket'}
                                className="flex-1 bg-gray-600 border border-gray-500 rounded-l px-3 py-2 text-sm"
                              />
                              <button
                                className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-r border-t border-r border-b border-gray-500"
                              >
                                <Folder size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={installAIModels}
                                onChange={(e) => setInstallAIModels(e.target.checked)}
                                className="rounded"
                              />
                              <span className="text-sm text-gray-300">Install AI models</span>
                            </label>
                            
                            {installAIModels && (
                              <div className="ml-6 space-y-2">
                                <p className="text-xs text-gray-400 mb-2">Select models to install:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {availableModels.map(model => (
                                    <label key={model.id} className="flex items-center space-x-2 text-xs bg-gray-600 p-2 rounded">
                                      <input
                                        type="checkbox"
                                        checked={selectedModels.includes(model.id)}
                                        onChange={() => toggleModelSelection(model.id)}
                                        className="rounded"
                                      />
                                      <div>
                                        <span className="text-gray-200">{model.name}</span>
                                        <div className="flex items-center space-x-2">
                                          <span className="text-gray-400">{model.size}</span>
                                          {model.recommended && (
                                            <span className="bg-green-600 text-white px-1.5 py-0.5 rounded text-xs">
                                              Recommended
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={autoStartOllama}
                                onChange={(e) => setAutoStartOllama(e.target.checked)}
                                className="rounded"
                              />
                              <span className="text-sm text-gray-300">Auto-start Ollama on system startup</span>
                            </label>
                            
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={createDesktopShortcut}
                                onChange={(e) => setCreateDesktopShortcut(e.target.checked)}
                                className="rounded"
                              />
                              <span className="text-sm text-gray-300">Create desktop shortcut</span>
                            </label>
                            
                            {selectedOS === 'windows' && (
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={addToStartMenu}
                                  onChange={(e) => setAddToStartMenu(e.target.checked)}
                                  className="rounded"
                                />
                                <span className="text-sm text-gray-300">Add to Start Menu</span>
                              </label>
                            )}
                          </div>
                          
                          <button
                            onClick={simulateInstallation}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                          >
                            Start Installation
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-3">Installation Steps:</h4>
                  <ol className="space-y-2">
                    {currentInstall.steps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-300 mb-4">
                  Run these commands in your terminal:
                </p>
                <div className="space-y-3">
                  {currentInstall.commands.map((command, index) => (
                    <div key={index} className="bg-black rounded-lg p-4 font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-green-400">$ {command}</span>
                        <button
                          onClick={() => copyToClipboard(command, `cmd-${index}`)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {copied === `cmd-${index}` ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={() => copyToClipboard(currentInstall.commands.join(' && '), 'all-commands')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                  >
                    {copied === 'all-commands' ? (
                      <>
                        <CheckCircle size={16} />
                        <span>Copied All Commands</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy All Commands</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Post-Installation */}
          <div className="mt-8 bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-400" />
              After Installation
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Install AI Models</h4>
                  <p className="text-sm text-gray-300">
                    Run <code className="bg-gray-700 px-2 py-1 rounded">ollama pull mistral</code> to download the recommended AI model.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Start Building</h4>
                  <p className="text-sm text-gray-300">
                    Launch Techarket and start building amazing applications with AI assistance.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Join Community</h4>
                  <p className="text-sm text-gray-300">
                    Connect with other developers and get support at{' '}
                    <a href="https://community.techarket.com" className="text-blue-400 hover:text-blue-300">
                      community.techarket.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="mailto:techarket@gmail.com"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <ExternalLink size={16} />
                <span>Email Support</span>
              </a>
              <a
                href="https://docs.techarket.com"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <ExternalLink size={16} />
                <span>Documentation</span>
              </a>
              <a
                href="https://community.techarket.com"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
              >
                <ExternalLink size={16} />
                <span>Community</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};