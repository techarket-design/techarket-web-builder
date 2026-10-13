import React, { useState, useEffect } from 'react';
import { Brain, Download, Check, Loader, AlertCircle, Info, Zap, Settings } from 'lucide-react';
import { ollamaService, OllamaModel } from '../services/ollama';

interface ModelSelectorProps {
  onModelChange?: (model: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ onModelChange }) => {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [showSelector, setShowSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadModels();
    setCurrentModel(ollamaService.getCurrentModel());
  }, []);

  const loadModels = async () => {
    setIsLoading(true);
    try {
      await ollamaService.updateAvailableModels();
      setModels(ollamaService.getAvailableModels());
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelSelect = (modelName: string) => {
    setCurrentModel(modelName);
    ollamaService.setModel(modelName);
    onModelChange?.(modelName);
    setShowSelector(false);
  };

  const handlePullModel = async (modelName: string) => {
    try {
      const success = await ollamaService.pullModel(modelName);
      if (success) {
        await loadModels();
      }
    } catch (error) {
      console.error('Failed to pull model:', error);
    }
  };

  const getCurrentModelInfo = () => {
    return models.find(model => model.name === currentModel) || models.find(model => model.recommended);
  };

  const currentModelInfo = getCurrentModelInfo();

  return (
    <div className="relative">
      <button
        onClick={() => setShowSelector(!showSelector)}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm transition-colors"
        title="Select AI Model"
      >
        <Brain size={16} className="text-purple-400" />
        <span className="text-gray-200">
          {currentModelInfo?.displayName || 'Select Model'}
        </span>
        <Settings size={14} className="text-gray-400" />
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
                <h3 className="font-medium text-gray-200">Select AI Model</h3>
                <button
                  onClick={loadModels}
                  disabled={isLoading}
                  className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
                >
                  <Loader size={16} className={isLoading ? 'animate-spin' : ''} />
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Choose the Ollama model for AI interactions
              </p>
            </div>

            <div className="p-2 space-y-1">
              {models.map((model) => (
                <div
                  key={model.name}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    currentModel === model.name
                      ? 'bg-blue-900/30 border-blue-600'
                      : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-200 text-sm">
                          {model.displayName}
                        </h4>
                        {model.recommended && (
                          <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs">
                            Recommended
                          </span>
                        )}
                        {currentModel === model.name && (
                          <Check size={14} className="text-green-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        {model.description}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>Size: {model.size}</span>
                        <span>•</span>
                        <span>{model.capabilities.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      {model.installed ? (
                        <button
                          onClick={() => handleModelSelect(model.name)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            currentModel === model.name
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                          }`}
                        >
                          {currentModel === model.name ? 'Selected' : 'Select'}
                        </button>
                      ) : model.pulling ? (
                        <div className="flex items-center space-x-1 text-xs text-blue-400">
                          <Loader size={12} className="animate-spin" />
                          <span>Pulling...</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePullModel(model.name)}
                          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          <Download size={12} />
                          <span>Pull</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {model.capabilities.map((capability, index) => (
                      <span
                        key={index}
                        className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded text-xs"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
              <div className="flex items-start space-x-2 text-xs text-gray-400">
                <Info size={12} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="mb-1">
                    Models are downloaded and run locally via Ollama. No data leaves your machine.
                  </p>
                  <p>
                    Install Ollama: <code className="bg-gray-700 px-1 rounded">curl -fsSL https://ollama.com/install.sh | sh</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};