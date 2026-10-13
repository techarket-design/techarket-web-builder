import React, { useState, useEffect } from 'react';
import { Brain, Cloud, Server, Settings, Check, AlertCircle, Zap, RefreshCw, Info } from 'lucide-react';
import { ollamaService } from '../services/ollama';
import { apiAIService, APIConfig } from '../services/apiAI';

interface AIEngineSelectorProps {
  onEngineChange?: (engine: 'ollama' | 'api', providerId?: string) => void;
}

export const AIEngineSelector: React.FC<AIEngineSelectorProps> = ({ onEngineChange }) => {
  const [selectedEngine, setSelectedEngine] = useState<'ollama' | 'api'>('ollama');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [apiConfigs, setApiConfigs] = useState<APIConfig[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  useEffect(() => {
    checkOllamaConnection();
    loadAPIConfigs();
    loadSavedPreferences();
    
    // Set up periodic refresh
    const interval = setInterval(() => {
      loadAPIConfigs();
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-select first available API provider if none selected
    if (selectedEngine === 'api' && !selectedProvider && apiConfigs.length > 0) {
      const firstProvider = apiConfigs[0];
      setSelectedProvider(firstProvider.providerId);
      onEngineChange?.('api', firstProvider.providerId);
      savePreferences('api', firstProvider.providerId);
    }
  }, [apiConfigs, selectedEngine, selectedProvider]);

  const addDebugLog = (message: string) => {
    setDebugLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const checkOllamaConnection = async () => {
    try {
      addDebugLog('Checking Ollama connection...');
      const connected = await ollamaService.testConnection();
      setOllamaConnected(connected);
      addDebugLog(`Ollama connection: ${connected ? 'Connected' : 'Disconnected'}`);
    } catch (error) {
      setOllamaConnected(false);
      addDebugLog(`Ollama connection error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const loadAPIConfigs = () => {
    try {
      addDebugLog('Loading API configurations...');
      const configs = apiAIService.getEnabledConfigs();
      setApiConfigs(configs);
      addDebugLog(`Loaded ${configs.length} enabled API configurations`);
    } catch (error) {
      console.error('Failed to load API configs:', error);
      addDebugLog(`Failed to load API configs: ${error instanceof Error ? error.message : String(error)}`);
      setApiConfigs([]);
    }
  };

  const loadSavedPreferences = () => {
    try {
      const savedEngine = localStorage.getItem('techarket-ai-engine') as 'ollama' | 'api';
      const savedProvider = localStorage.getItem('techarket-ai-provider');
      
      addDebugLog(`Loading saved preferences: engine=${savedEngine}, provider=${savedProvider}`);
      
      if (savedEngine) {
        setSelectedEngine(savedEngine);
        if (savedEngine === 'api' && savedProvider) {
          setSelectedProvider(savedProvider);
        }
      }
    } catch (error) {
      console.error('Failed to load saved preferences:', error);
      addDebugLog(`Failed to load saved preferences: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const savePreferences = (engine: 'ollama' | 'api', providerId?: string) => {
    try {
      localStorage.setItem('techarket-ai-engine', engine);
      if (providerId) {
        localStorage.setItem('techarket-ai-provider', providerId);
      }
      addDebugLog(`Saved preferences: engine=${engine}, provider=${providerId || 'none'}`);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      addDebugLog(`Failed to save preferences: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleEngineSelect = (engine: 'ollama' | 'api', providerId?: string) => {
    setSelectedEngine(engine);
    if (providerId) {
      setSelectedProvider(providerId);
    }
    
    savePreferences(engine, providerId);
    onEngineChange?.(engine, providerId);
    setShowSelector(false);
    
    addDebugLog(`Selected engine: ${engine}, provider: ${providerId || 'none'}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    addDebugLog('Manually refreshing connections...');
    await checkOllamaConnection();
    loadAPIConfigs();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getCurrentEngineInfo = () => {
    if (selectedEngine === 'ollama') {
      return {
        name: `Ollama (${ollamaService.getCurrentModel()})`,
        status: ollamaConnected,
        type: 'local' as const,
        icon: Server,
        description: '100% Private & Local'
      };
    } else {
      const provider = apiAIService.getProvider(selectedProvider);
      const config = apiAIService.getConfig(selectedProvider);
      return {
        name: provider ? `${provider.name}` : 'Cloud AI',
        model: config?.model || 'No model selected',
        status: config?.enabled && config?.apiKey ? true : false,
        type: 'cloud' as const,
        icon: Cloud,
        description: provider?.description || 'Cloud AI Service'
      };
    }
  };

  const engineInfo = getCurrentEngineInfo();
  const Icon = engineInfo.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setShowSelector(!showSelector)}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm transition-colors min-w-48"
        title="Select AI Engine"
      >
        <Icon size={16} className={engineInfo.type === 'local' ? 'text-green-400' : 'text-blue-400'} />
        <div className="flex-1 text-left">
          <div className="text-gray-200 font-medium truncate">
            {engineInfo.name}
          </div>
          {engineInfo.type === 'cloud' && engineInfo.model && (
            <div className="text-xs text-gray-400 truncate">
              {engineInfo.model}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {engineInfo.status ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <AlertCircle size={14} className="text-red-400" />
          )}
          <Settings size={14} className="text-gray-400" />
        </div>
      </button>

      {showSelector && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSelector(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-96 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-200">Select AI Engine</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
                    title="Refresh connections"
                  >
                    <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                  </button>
                  <button
                    onClick={() => setDebugMode(!debugMode)}
                    className={`text-xs p-1 rounded ${debugMode ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-gray-300'}`}
                    title="Toggle debug mode"
                  >
                    <Info size={12} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Choose between local Ollama models or cloud AI services
              </p>
            </div>

            {debugMode && (
              <div className="p-3 bg-gray-900 border-b border-gray-700 max-h-32 overflow-y-auto">
                <div className="text-xs font-mono text-gray-400">
                  {debugLogs.length === 0 ? (
                    <div className="text-gray-500 italic">No debug logs yet</div>
                  ) : (
                    debugLogs.map((log, index) => (
                      <div key={index} className="mb-1">{log}</div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="p-2 space-y-2">
              {/* Ollama Section */}
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-300 px-2 py-1 flex items-center space-x-2">
                  <Server size={14} className="text-green-400" />
                  <span>Local AI (Ollama)</span>
                </h4>
                
                <button
                  onClick={() => handleEngineSelect('ollama')}
                  className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                    selectedEngine === 'ollama'
                      ? 'bg-green-900/30 border-green-600'
                      : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-200 text-sm">
                          Ollama + {ollamaService.getCurrentModel()}
                        </span>
                        {selectedEngine === 'ollama' && (
                          <Check size={14} className="text-green-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        100% private, no API costs, offline capable
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {ollamaConnected ? (
                          <span className="text-xs text-green-400 flex items-center space-x-1">
                            <Check size={10} />
                            <span>Connected</span>
                          </span>
                        ) : (
                          <span className="text-xs text-red-400 flex items-center space-x-1">
                            <AlertCircle size={10} />
                            <span>Disconnected</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Cloud AI Services Section */}
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-gray-300 px-2 py-1 flex items-center space-x-2">
                  <Cloud size={14} className="text-blue-400" />
                  <span>Cloud AI Services ({apiConfigs.length})</span>
                </h4>
                
                {apiConfigs.length === 0 ? (
                  <div className="p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
                    <p className="text-xs text-gray-400 text-center mb-2">
                      No cloud AI services configured
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      Configure in Database → API AI Engines
                    </p>
                  </div>
                ) : (
                  apiConfigs.map((config) => {
                    const provider = apiAIService.getProvider(config.providerId);
                    if (!provider) return null;

                    const isSelected = selectedEngine === 'api' && selectedProvider === config.providerId;
                    
                    return (
                      <button
                        key={config.providerId}
                        onClick={() => handleEngineSelect('api', config.providerId)}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                          isSelected
                            ? 'bg-blue-900/30 border-blue-600'
                            : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">
                                {provider.id === 'openai' ? '🤖' : 
                                 provider.id === 'anthropic' ? '🧠' : 
                                 provider.id === 'google' ? '🔍' : 
                                 provider.id === 'xai' ? '🚀' : 
                                 provider.id === 'cohere' ? '🏢' :
                                 provider.id === 'mistral' ? '🌟' :
                                 provider.id === 'perplexity' ? '🔎' :
                                 provider.id === 'huggingface' ? '🤗' :
                                 provider.id === 'replicate' ? '🔄' :
                                 '⚙️'}
                              </span>
                              <span className="font-medium text-gray-200 text-sm">
                                {provider.name}
                              </span>
                              {isSelected && (
                                <Check size={14} className="text-blue-400" />
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mb-1">
                              Model: {config.model || 'Not selected'}
                            </p>
                            <div className="flex items-center space-x-2">
                              {config.enabled && config.apiKey ? (
                                <span className="text-xs text-green-400 flex items-center space-x-1">
                                  <Check size={10} />
                                  <span>Ready</span>
                                </span>
                              ) : (
                                <span className="text-xs text-red-400 flex items-center space-x-1">
                                  <AlertCircle size={10} />
                                  <span>Not configured</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
              <div className="flex items-start space-x-2 text-xs text-gray-400">
                <Zap size={12} className="mt-0.5 flex-shrink-0 text-yellow-400" />
                <div>
                  <p className="mb-1">
                    <strong>Local AI:</strong> Private, no costs, works offline
                  </p>
                  <p>
                    <strong>Cloud AI:</strong> Latest models, requires API keys and internet
                  </p>
                  {apiConfigs.length === 0 && (
                    <p className="mt-2 text-blue-300">
                      💡 Configure cloud AI in Database → API AI Engines
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};