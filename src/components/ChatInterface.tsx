import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Paperclip, X, Image, FileText, Database, Code2, CheckCircle, AlertCircle, Zap, MessageSquare, Wrench, Brain, Eye, Monitor, Square } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { AIMessage, FileAttachment } from '../types';

interface GenerationProgress {
  stage: string;
  progress: number;
  currentFile?: string;
  totalFiles?: number;
  completedFiles?: number;
}

interface ChatInterfaceProps {
  messages: AIMessage[];
  onSendMessage: (message: string, attachments?: FileAttachment[], mode?: 'chat' | 'action') => void;
  isLoading: boolean;
  generationProgress?: GenerationProgress | null;
  streamingResponse?: string;
  onStopGeneration?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  generationProgress,
  streamingResponse,
  onStopGeneration
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [chatMode, setChatMode] = useState<'chat' | 'action'>('action');
  const [showLivePreview, setShowLivePreview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, generationProgress, streamingResponse]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const attachment: FileAttachment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          content: reader.result!,
          preview: file.type.startsWith('image/') ? reader.result as string : undefined
        };
        setAttachments(prev => [...prev, attachment]);
      };
      
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
      'text/*': ['.txt', '.md', '.json', '.js', '.ts', '.tsx', '.jsx', '.css', '.html'],
      'application/json': ['.json']
    }
  });

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(input.trim(), attachments, chatMode);
      setInput('');
      setAttachments([]);
      setShowSuggestions(false);
    }
  };

  const chatSuggestions = [
    {
      icon: MessageSquare,
      text: "Explain the difference between React hooks and class components",
      category: "Learning"
    },
    {
      icon: Database,
      text: "What are the best practices for database design?",
      category: "Database"
    },
    {
      icon: Code2,
      text: "How do I optimize my React app for performance?",
      category: "Optimization"
    },
    {
      icon: Brain,
      text: "Explain how authentication works in modern web apps",
      category: "Security"
    }
  ];

  const actionSuggestions = [
    {
      icon: Code2,
      text: "Build me a modern e-commerce website with React and Tailwind",
      category: "Full Stack"
    },
    {
      icon: Database,
      text: "Create a blog platform with user authentication and comments",
      category: "Web App"
    },
    {
      icon: Image,
      text: "Build a portfolio website with dark mode and animations",
      category: "Frontend"
    },
    {
      icon: FileText,
      text: "Create a task management app with drag and drop",
      category: "Productivity"
    }
  ];

  const suggestions = chatMode === 'chat' ? chatSuggestions : actionSuggestions;

  const getProgressIcon = (stage: string) => {
    switch (stage) {
      case 'analyzing': return <Zap className="animate-pulse" />;
      case 'generating': return <Code2 className="animate-spin" />;
      case 'structuring': return <FileText className="animate-bounce" />;
      case 'optimizing': return <CheckCircle className="animate-pulse" />;
      default: return <Loader className="animate-spin" />;
    }
  };

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case 'analyzing': return 'Analyzing your request with AI...';
      case 'generating': return 'Generating code with advanced AI models...';
      case 'structuring': return 'Structuring project files and components...';
      case 'optimizing': return 'Optimizing code and adding Techarket branding...';
      case 'finalizing': return 'Finalizing project structure...';
      default: return 'Processing your request...';
    }
  };

  const renderLivePreview = () => {
    if (!showLivePreview || chatMode !== 'action' || !isLoading) return null;

    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-200 flex items-center space-x-2">
            <Monitor size={16} className="text-blue-400" />
            <span>Live Preview - AI Building Your App</span>
          </h4>
          <button
            onClick={() => setShowLivePreview(false)}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>

        {generationProgress && (
          <div className="space-y-3">
            {/* Current Stage */}
            <div className="flex items-center space-x-2">
              {getProgressIcon(generationProgress.stage)}
              <span className="text-sm font-medium text-gray-200">
                {getStageDescription(generationProgress.stage)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress.progress}%` }}
              />
            </div>

            {/* File Progress */}
            {generationProgress.currentFile && (
              <div className="bg-gray-900 rounded p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-300">Creating: {generationProgress.currentFile}</span>
                  {generationProgress.totalFiles && (
                    <span className="text-gray-400">
                      {generationProgress.completedFiles || 0} / {generationProgress.totalFiles} files
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Stage-specific preview */}
            <div className="bg-gray-900 rounded p-3 text-xs">
              {generationProgress.stage === 'analyzing' && (
                <div className="text-blue-300">
                  🧠 AI is understanding your requirements and planning the application structure...
                </div>
              )}
              {generationProgress.stage === 'generating' && (
                <div className="text-green-300">
                  ⚡ Creating React components, pages, and utility functions with modern best practices...
                </div>
              )}
              {generationProgress.stage === 'structuring' && (
                <div className="text-yellow-300">
                  📁 Organizing project files, setting up configurations, and preparing build tools...
                </div>
              )}
              {generationProgress.stage === 'optimizing' && (
                <div className="text-purple-300">
                  🎨 Adding Techarket branding, optimizing performance, and finalizing documentation...
                </div>
              )}
              {generationProgress.stage === 'finalizing' && (
                <div className="text-green-300">
                  ✨ Almost ready! Applying final touches and preparing your production-ready application...
                </div>
              )}
            </div>

            {/* Simulated file creation preview */}
            {generationProgress.stage === 'generating' && (
              <div className="bg-gray-900 rounded p-3">
                <div className="text-xs text-gray-400 mb-2">Recently created files:</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle size={12} />
                    <span>src/App.tsx - Main application component</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle size={12} />
                    <span>src/components/Header.tsx - Navigation header</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-400">
                    <Loader size={12} className="animate-spin" />
                    <span>src/components/Footer.tsx - Creating...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-900" {...getRootProps()}>
      <input {...getInputProps()} />
      
      {isDragActive && (
        <div className="absolute inset-0 bg-blue-600/20 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center z-50">
          <div className="text-center">
            <Paperclip size={48} className="mx-auto mb-4 text-blue-400" />
            <p className="text-blue-400 font-medium">Drop files here to analyze</p>
          </div>
        </div>
      )}

      {/* Enhanced Chat Mode Toggle */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex bg-gray-700 rounded-xl p-1">
            <button
              onClick={() => setChatMode('chat')}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                chatMode === 'chat'
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600'
              }`}
            >
              <MessageSquare size={16} />
              <span>Chat Mode</span>
            </button>
            <button
              onClick={() => setChatMode('action')}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                chatMode === 'action'
                  ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600'
              }`}
            >
              <Wrench size={16} />
              <span>Action Mode</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live Preview Toggle for Action Mode */}
            {chatMode === 'action' && (
              <button
                onClick={() => setShowLivePreview(!showLivePreview)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  showLivePreview
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                <Eye size={16} />
                <span>Live Preview</span>
              </button>
            )}

            {/* Stop Generation Button */}
            {isLoading && onStopGeneration && (
              <button
                onClick={onStopGeneration}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Square size={16} />
                <span>Stop</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-400">
            {chatMode === 'chat' 
              ? '💬 Ask questions, get explanations, and learn from AI'
              : '🚀 Generate code, build apps, and edit your project with AI assistance'
            }
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img 
                src="/techarket-logo.jpeg" 
                alt="Techarket AI" 
                className="w-16 h-16 rounded-xl object-cover shadow-lg"
              />
              <Bot size={64} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {chatMode === 'chat' ? 'Chat with Techarket AI' : 'Build with Techarket AI'}
            </h3>
            <p className="text-lg mb-8 text-gray-300">
              {chatMode === 'chat' 
                ? 'Ask questions, get explanations, and learn about web development'
                : 'Generate complete applications using universal AI integration'
              }
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion.text)}
                    className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 hover:bg-gray-750 transition-all duration-200 text-left group transform hover:scale-105"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors">
                        <Icon size={24} className="text-blue-400 group-hover:text-blue-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-200 group-hover:text-white mb-2">
                          {suggestion.text}
                        </p>
                        <p className="text-sm text-gray-500 group-hover:text-gray-400">{suggestion.category}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Live Preview Panel */}
            {renderLivePreview()}

            {/* Enhanced Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-4xl p-6 rounded-2xl shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                      : 'bg-gray-800 text-gray-200 border border-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {message.role === 'user' ? (
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <User size={20} />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <img 
                            src="/techarket-logo.jpeg" 
                            alt="Techarket AI" 
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mb-4 space-y-2">
                          {message.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center space-x-2 text-sm opacity-80">
                              {attachment.type.startsWith('image/') ? (
                                <Image size={16} />
                              ) : (
                                <FileText size={16} />
                              )}
                              <span>{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                        {message.content}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-xs opacity-70 flex items-center space-x-3">
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          {message.mode && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              message.mode === 'chat' 
                                ? 'bg-blue-600/20 text-blue-300' 
                                : 'bg-purple-600/20 text-purple-300'
                            }`}>
                              {message.mode === 'chat' ? '💬 Chat' : '🚀 Action'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Enhanced Streaming Response */}
        {streamingResponse && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-200 p-6 rounded-2xl border border-gray-700 max-w-4xl shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/techarket-logo.jpeg" 
                    alt="Techarket AI" 
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                    {streamingResponse}
                    <span className="inline-block w-3 h-6 bg-blue-400 ml-1 animate-pulse"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Loading State with Progress */}
        {isLoading && chatMode === 'action' && !showLivePreview && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-200 p-6 rounded-2xl border border-gray-700 max-w-4xl shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/techarket-logo.jpeg" 
                    alt="Techarket AI" 
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  {generationProgress ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        {getProgressIcon(generationProgress.stage)}
                        <span className="text-lg font-medium">
                          {getStageDescription(generationProgress.stage)}
                        </span>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                          style={{ width: `${generationProgress.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                      
                      {/* File Progress */}
                      {generationProgress.currentFile && (
                        <div className="text-sm text-gray-400">
                          <div className="flex items-center justify-between">
                            <span className="text-blue-300">✨ Creating: {generationProgress.currentFile}</span>
                            {generationProgress.totalFiles && (
                              <span>
                                {generationProgress.completedFiles || 0} / {generationProgress.totalFiles} files
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Stage-specific messages */}
                      <div className="text-sm text-blue-300 bg-blue-900/20 rounded-lg p-3">
                        {generationProgress.stage === 'analyzing' && "🧠 AI is understanding your requirements..."}
                        {generationProgress.stage === 'generating' && "⚡ Creating components and pages with AI..."}
                        {generationProgress.stage === 'structuring' && "📁 Organizing project structure..."}
                        {generationProgress.stage === 'optimizing' && "🎨 Adding Techarket branding and optimizations..."}
                        {generationProgress.stage === 'finalizing' && "✨ Almost ready! Finalizing your project..."}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Loader size={20} className="animate-spin" />
                      <span className="text-lg">Connecting to AI...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simple loading for chat mode */}
        {isLoading && chatMode === 'chat' && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-200 p-6 rounded-2xl border border-gray-700 max-w-4xl shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="flex items-center space-x-2">
                  <img 
                    src="/techarket-logo.jpeg" 
                    alt="Techarket AI" 
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Brain size={20} className="animate-pulse text-purple-400" />
                    <span className="text-lg">Thinking with AI...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Attachments Preview */}
      {attachments.length > 0 && (
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex flex-wrap gap-3">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="relative bg-gray-700 rounded-xl p-3 flex items-center space-x-3 group">
                {attachment.preview ? (
                  <img src={attachment.preview} alt={attachment.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-blue-400" />
                  </div>
                )}
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-300 block truncate max-w-32">{attachment.name}</span>
                  <span className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(1)} KB</span>
                </div>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Input Form */}
      <form onSubmit={handleSubmit} className="p-6 border-t border-gray-700 bg-gray-800">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={
                chatMode === 'chat' 
                  ? "Ask me anything about web development..."
                  : "Describe your app idea - I'll build it with AI..."
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-xl px-6 py-4 pr-16 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
              rows={input.split('\n').length || 1}
              style={{ minHeight: '60px', maxHeight: '200px' }}
            />
            <label className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-300">
              <Paperclip size={20} />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  onDrop(files);
                }}
                accept="image/*,.txt,.md,.json,.js,.ts,.tsx,.jsx,.css,.html"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
            className={`px-8 py-4 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 ${
              chatMode === 'chat'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
            } disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white shadow-lg transform hover:scale-105`}
          >
            {isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                <span>{chatMode === 'chat' ? 'Thinking...' : 'Building...'}</span>
              </>
            ) : (
              <>
                <Send size={20} />
                <span>{chatMode === 'chat' ? 'Ask' : 'Build'}</span>
              </>
            )}
          </button>
        </div>
        
        {/* Enhanced Quick tip */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Zap size={12} className="text-blue-400" />
            <span>
              {chatMode === 'chat' 
                ? 'Chat mode: Get explanations and learn from AI'
                : 'Action mode: Generate and edit code with AI - Enable Live Preview to see the building process!'
              }
            </span>
          </div>
          <div className="text-gray-600">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </form>
    </div>
  );
};