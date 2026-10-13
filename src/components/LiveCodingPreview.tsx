import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Monitor, Smartphone, Tablet, Eye, EyeOff, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { ProjectStructure } from '../types';

interface LiveCodingPreviewProps {
  project: ProjectStructure;
  selectedFile: string | null;
  isEnabled: boolean;
  onToggle: () => void;
}

export const LiveCodingPreview: React.FC<LiveCodingPreviewProps> = ({
  project,
  selectedFile,
  isEnabled,
  onToggle
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isEnabled && selectedFile) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setRefreshKey(prev => prev + 1);
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [project, selectedFile, isEnabled]);

  const generateLivePreview = (): string => {
    let html = '';
    let css = '';
    let js = '';

    const processStructure = (structure: ProjectStructure | any, path: string = '') => {
      if (structure?.type === 'file') {
        const file = structure;
        if (file.language === 'html' || path.endsWith('.html')) {
          html += file.content + '\n';
        } else if (file.language === 'css' || path.endsWith('.css')) {
          css += file.content + '\n';
        } else if (file.language === 'typescript' || file.language === 'javascript') {
          // Enhanced JSX/TSX to HTML conversion
          if (file.content.includes('export') && (file.content.includes('React') || file.content.includes('function'))) {
            const componentMatch = file.content.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
            if (componentMatch) {
              let jsx = componentMatch[1];
              // Advanced JSX to HTML conversion
              jsx = jsx
                .replace(/className=/g, 'class=')
                .replace(/\{[^}]*\}/g, '')
                .replace(/<(\w+)([^>]*?)\/>/g, '<$1$2></$1>')
                .replace(/onClick=\{[^}]*\}/g, 'onclick="void(0)"')
                .replace(/onChange=\{[^}]*\}/g, 'onchange="void(0)"')
                .replace(/onSubmit=\{[^}]*\}/g, 'onsubmit="void(0)"');
              html += jsx;
            }
          }
        }
      } else if (structure && typeof structure === 'object') {
        Object.entries(structure).forEach(([key, value]) => {
          processStructure(value, `${path}/${key}`);
        });
      }
    };

    processStructure(project);

    // Enhanced HTML structure with better styling
    if (!html.trim()) {
      html = `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
          <div class="text-center max-w-2xl">
            <div class="mb-8">
              <img src="/techarket-logo.jpeg" alt="Techarket" class="w-16 h-16 mx-auto mb-4 rounded-lg shadow-lg">
              <h1 class="text-4xl font-bold text-gray-900 mb-4">Live Preview</h1>
              <p class="text-lg text-gray-600 mb-6">Your code changes will appear here in real-time</p>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6 text-left">
              <h3 class="text-lg font-semibold mb-4 text-gray-800">Getting Started:</h3>
              <ul class="space-y-2 text-gray-600">
                <li>• Edit files in the code editor</li>
                <li>• See changes instantly in this preview</li>
                <li>• Use different device views (desktop, tablet, mobile)</li>
                <li>• Toggle live preview on/off as needed</li>
              </ul>
            </div>
            <div class="mt-6 text-sm text-gray-500">
              Powered by Techarket AI - Real-time Development Platform
            </div>
          </div>
        </div>
      `;
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Live Preview - Techarket</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            ${css}
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .live-preview-indicator {
              position: fixed;
              top: 10px;
              right: 10px;
              background: rgba(59, 130, 246, 0.9);
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              z-index: 9999;
              backdrop-filter: blur(4px);
            }
          </style>
        </head>
        <body>
          <div class="live-preview-indicator">🔴 LIVE</div>
          ${html}
          <script>
            ${js}
            // Live preview enhancements
            document.addEventListener('DOMContentLoaded', function() {
              // Add smooth transitions
              document.body.style.transition = 'all 0.3s ease';
              
              // Prevent form submissions in preview
              document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', e => {
                  e.preventDefault();
                  console.log('Form submission prevented in live preview');
                });
              });
              
              // Add click feedback
              document.addEventListener('click', function(e) {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                  e.target.style.transform = 'scale(0.95)';
                  setTimeout(() => {
                    e.target.style.transform = 'scale(1)';
                  }, 150);
                }
              });
            });
          </script>
        </body>
      </html>
    `;
  };

  const getViewportStyles = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className={`h-full flex flex-col bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggle}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isEnabled 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-600 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
              <span>{isEnabled ? 'Live' : 'Disabled'}</span>
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={!isEnabled || isLoading}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Device View Selector */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            {[
              { mode: 'desktop', icon: Monitor, label: 'Desktop' },
              { mode: 'tablet', icon: Tablet, label: 'Tablet' },
              { mode: 'mobile', icon: Smartphone, label: 'Mobile' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`flex items-center space-x-1 px-3 py-2 rounded text-sm transition-colors ${
                  viewMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-400">
            {selectedFile && (
              <span>Previewing: {selectedFile.split('/').pop()}</span>
            )}
          </div>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 p-4 bg-gray-900">
        {isEnabled ? (
          <div className="h-full flex items-center justify-center">
            <div 
              className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
              style={getViewportStyles()}
            >
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <RefreshCw size={20} className="animate-spin" />
                    <span>Updating preview...</span>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                key={refreshKey}
                srcDoc={generateLivePreview()}
                className="w-full h-full border-0"
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Eye size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Live Preview Disabled</h3>
              <p className="text-sm mb-4">Enable live preview to see your changes in real-time</p>
              <button
                onClick={onToggle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Enable Live Preview
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`flex items-center space-x-1 ${isEnabled ? 'text-green-400' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-400' : 'bg-gray-500'}`}></div>
            <span>{isEnabled ? 'Live preview active' : 'Live preview disabled'}</span>
          </span>
          <span>View: {viewMode}</span>
          {selectedFile && <span>File: {selectedFile}</span>}
        </div>
        <div>
          Powered by Techarket AI
        </div>
      </div>
    </div>
  );
};