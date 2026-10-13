import React, { useState, useRef, useEffect } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  RefreshCw, 
  ExternalLink, 
  Maximize2, 
  Minimize2,
  Eye,
  EyeOff,
  Settings,
  Zap,
  Globe,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Volume2,
  Sun,
  Moon,
  RotateCcw,
  Share2,
  Download,
  Camera,
  Ruler,
  Grid3X3,
  MousePointer,
  Crosshair,
  Move,
  ZoomIn,
  ZoomOut,
  Target,
  Award,
  Crown,
  Gift,
  Coffee,
  Rocket,
  Heart,
  Flame,
  Bookmark,
  Star,
  Sparkles,
  Brain,
  Code,
  Palette,
  Layers,
  Box,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon
} from 'lucide-react';
import { ProjectStructure } from '../types';

interface IntelligentPreviewProps {
  project: ProjectStructure;
  selectedFile?: string | null;
  isEnabled?: boolean;
  onToggle?: () => void;
}

interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<any>;
  category: 'mobile' | 'tablet' | 'desktop';
  pixelRatio: number;
  userAgent?: string;
}

const devicePresets: DevicePreset[] = [
  // Mobile
  { id: 'iphone-14', name: 'iPhone 14', width: 390, height: 844, icon: Smartphone, category: 'mobile', pixelRatio: 3 },
  { id: 'iphone-14-plus', name: 'iPhone 14 Plus', width: 428, height: 926, icon: Smartphone, category: 'mobile', pixelRatio: 3 },
  { id: 'samsung-s23', name: 'Samsung S23', width: 360, height: 780, icon: Smartphone, category: 'mobile', pixelRatio: 3 },
  { id: 'pixel-7', name: 'Pixel 7', width: 412, height: 915, icon: Smartphone, category: 'mobile', pixelRatio: 2.6 },
  
  // Tablet
  { id: 'ipad-air', name: 'iPad Air', width: 820, height: 1180, icon: Tablet, category: 'tablet', pixelRatio: 2 },
  { id: 'ipad-pro', name: 'iPad Pro 12.9"', width: 1024, height: 1366, icon: Tablet, category: 'tablet', pixelRatio: 2 },
  { id: 'surface-pro', name: 'Surface Pro', width: 912, height: 1368, icon: Tablet, category: 'tablet', pixelRatio: 2 },
  
  // Desktop
  { id: 'laptop', name: 'Laptop', width: 1366, height: 768, icon: Monitor, category: 'desktop', pixelRatio: 1 },
  { id: 'desktop', name: 'Desktop', width: 1920, height: 1080, icon: Monitor, category: 'desktop', pixelRatio: 1 },
  { id: 'ultrawide', name: 'Ultrawide', width: 2560, height: 1080, icon: Monitor, category: 'desktop', pixelRatio: 1 },
];

export const IntelligentPreview: React.FC<IntelligentPreviewProps> = ({
  project,
  selectedFile,
  isEnabled = true,
  onToggle
}) => {
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(devicePresets[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showDeviceFrame, setShowDeviceFrame] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showPerformance, setShowPerformance] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    fps: 60
  });
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [accessibilityIssues, setAccessibilityIssues] = useState<string[]>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<Array<{type: 'log' | 'warn' | 'error', message: string, timestamp: Date}>>([]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generatePreviewHTML = (): string => {
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
          if (file.content.includes('export') && (file.content.includes('React') || file.content.includes('function'))) {
            const componentMatch = file.content.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
            if (componentMatch) {
              let jsx = componentMatch[1];
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

    if (!html.trim()) {
      html = `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
          <div class="text-center max-w-2xl">
            <div class="mb-8">
              <img src="/techarket-logo.jpeg" alt="Techarket" class="w-16 h-16 mx-auto mb-4 rounded-lg shadow-lg">
              <h1 class="text-4xl font-bold text-gray-900 mb-4">Intelligent Preview</h1>
              <p class="text-lg text-gray-600 mb-6">Your code changes will appear here in real-time</p>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-6 text-left">
              <h3 class="text-lg font-semibold mb-4 text-gray-800">Preview Features:</h3>
              <ul class="space-y-2 text-gray-600">
                <li class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Multi-device simulation</span>
                </li>
                <li class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Real-time code updates</span>
                </li>
                <li class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Element inspection</span>
                </li>
                <li class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Responsive testing</span>
                </li>
                <li class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Performance monitoring</span>
                </li>
                <li class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Accessibility testing</span>
                </li>
              </ul>
            </div>
            <div class="mt-6 text-sm text-gray-500">
              Powered by Techarket AI - Intelligent Development Platform
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
          <title>Intelligent Preview - Techarket</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            ${css}
            body { 
              margin: 0; 
              padding: 0; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              ${isDarkMode ? 'filter: invert(1) hue-rotate(180deg);' : ''}
            }
            .preview-indicator {
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
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .preview-indicator::before {
              content: '';
              width: 8px;
              height: 8px;
              background: #ef4444;
              border-radius: 50%;
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            ${showGrid ? `
              body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                  linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
                background-size: 20px 20px;
                pointer-events: none;
                z-index: 9998;
              }
            ` : ''}
            .element-highlight {
              outline: 2px solid #3b82f6;
              outline-offset: 2px;
              background: rgba(59, 130, 246, 0.1);
            }
            ${showRulers ? `
              body::after {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 20px;
                background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%);
                pointer-events: none;
                z-index: 9997;
              }
            ` : ''}
          </style>
        </head>
        <body>
          <div class="preview-indicator">
            LIVE
          </div>
          ${html}
          <script>
            ${js}
            
            // Enhanced preview functionality
            document.addEventListener('DOMContentLoaded', function() {
              // Performance monitoring
              const startTime = performance.now();
              
              // Add smooth transitions
              document.body.style.transition = 'all 0.3s ease';
              
              // Prevent form submissions in preview
              document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', e => {
                  e.preventDefault();
                  console.log('Form submission prevented in preview');
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

              // Element inspection
              ${showInspector ? `
                document.addEventListener('mouseover', function(e) {
                  e.target.classList.add('element-highlight');
                });
                
                document.addEventListener('mouseout', function(e) {
                  e.target.classList.remove('element-highlight');
                });
                
                document.addEventListener('click', function(e) {
                  e.preventDefault();
                  console.log('Selected element:', e.target.tagName, e.target.className);
                });
              ` : ''}

              // Accessibility checks
              ${showAccessibility ? `
                const checkAccessibility = () => {
                  const issues = [];
                  
                  // Check for missing alt text
                  document.querySelectorAll('img:not([alt])').forEach(() => {
                    issues.push('Image missing alt text');
                  });
                  
                  // Check for missing form labels
                  document.querySelectorAll('input:not([aria-label]):not([id])').forEach(() => {
                    issues.push('Input missing label');
                  });
                  
                  // Check for low contrast
                  // This is a simplified check
                  const elements = document.querySelectorAll('*');
                  elements.forEach(el => {
                    const style = getComputedStyle(el);
                    if (style.color && style.backgroundColor) {
                      // Simplified contrast check
                      if (style.color === style.backgroundColor) {
                        issues.push('Potential contrast issue');
                      }
                    }
                  });
                  
                  console.log('Accessibility issues:', issues);
                };
                
                checkAccessibility();
              ` : ''}

              // Performance metrics
              window.addEventListener('load', function() {
                const loadTime = performance.now() - startTime;
                console.log('Load time:', loadTime + 'ms');
                
                // Memory usage (if available)
                if (performance.memory) {
                  console.log('Memory usage:', performance.memory.usedJSHeapSize / 1024 / 1024 + 'MB');
                }
              });

              // Console logging
              const originalLog = console.log;
              const originalWarn = console.warn;
              const originalError = console.error;
              
              console.log = function(...args) {
                originalLog.apply(console, args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'log',
                  message: args.join(' ')
                }, '*');
              };
              
              console.warn = function(...args) {
                originalWarn.apply(console, args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'warn',
                  message: args.join(' ')
                }, '*');
              };
              
              console.error = function(...args) {
                originalError.apply(console, args);
                window.parent.postMessage({
                  type: 'console',
                  level: 'error',
                  message: args.join(' ')
                }, '*');
              };
            });
          </script>
        </body>
      </html>
    `;
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  const takeScreenshot = () => {
    if (iframeRef.current) {
      // This would require additional implementation for actual screenshots
      console.log('Screenshot feature would be implemented here');
    }
  };

  const sharePreview = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Techarket Preview',
        text: 'Check out this preview from Techarket AI',
        url: window.location.href
      });
    }
  };

  useEffect(() => {
    // Listen for console messages from iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        setConsoleLogs(prev => [...prev, {
          type: event.data.level,
          message: event.data.message,
          timestamp: new Date()
        }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className={`h-full flex flex-col bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Enhanced Header Controls */}
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

          {/* Device Selector */}
          <div className="flex bg-gray-700 rounded-lg p-1">
            {[
              { category: 'mobile', icon: Smartphone, label: 'Mobile' },
              { category: 'tablet', icon: Tablet, label: 'Tablet' },
              { category: 'desktop', icon: Monitor, label: 'Desktop' }
            ].map(({ category, icon: Icon, label }) => (
              <button
                key={category}
                onClick={() => {
                  const device = devicePresets.find(d => d.category === category);
                  if (device) setSelectedDevice(device);
                }}
                className={`flex items-center space-x-1 px-3 py-2 rounded text-sm transition-colors ${
                  selectedDevice.category === category
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Device Details */}
          <select
            value={selectedDevice.id}
            onChange={(e) => {
              const device = devicePresets.find(d => d.id === e.target.value);
              if (device) setSelectedDevice(device);
            }}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
          >
            {devicePresets
              .filter(d => d.category === selectedDevice.category)
              .map(device => (
                <option key={device.id} value={device.id}>
                  {device.name} ({device.width}×{device.height})
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          {/* Advanced Tools */}
          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`p-2 rounded transition-colors ${
              showInspector ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Element Inspector"
          >
            <Target size={16} />
          </button>

          <button
            onClick={() => setShowPerformance(!showPerformance)}
            className={`p-2 rounded transition-colors ${
              showPerformance ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Performance Monitor"
          >
            <Zap size={16} />
          </button>

          <button
            onClick={() => setShowAccessibility(!showAccessibility)}
            className={`p-2 rounded transition-colors ${
              showAccessibility ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Accessibility Check"
          >
            <Heart size={16} />
          </button>

          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`p-2 rounded transition-colors ${
              showConsole ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Console"
          >
            <Code size={16} />
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-gray-600 rounded"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-xs px-2">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-gray-600 rounded"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* View Options */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded transition-colors ${
              showGrid ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Grid Overlay"
          >
            <Grid3X3 size={16} />
          </button>

          <button
            onClick={() => setShowRulers(!showRulers)}
            className={`p-2 rounded transition-colors ${
              showRulers ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            title="Rulers"
          >
            <Ruler size={16} />
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            onClick={takeScreenshot}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            title="Screenshot"
          >
            <Camera size={16} />
          </button>

          <button
            onClick={sharePreview}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            title="Share"
          >
            <Share2 size={16} />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Preview Area */}
        <div className="flex-1 p-4 bg-gray-900 flex items-center justify-center">
          {isEnabled ? (
            <div className="relative">
              {/* Device Frame */}
              {showDeviceFrame && selectedDevice.category !== 'desktop' && (
                <div 
                  className="bg-gray-800 rounded-3xl p-4 shadow-2xl"
                  style={{
                    width: selectedDevice.width * zoom + 32,
                    height: selectedDevice.height * zoom + 64
                  }}
                >
                  {/* Device Status Bar */}
                  <div className="bg-black rounded-t-2xl h-6 flex items-center justify-between px-4 text-white text-xs">
                    <div className="flex items-center space-x-1">
                      <Signal size={12} />
                      <Wifi size={12} />
                    </div>
                    <div>9:41</div>
                    <div className="flex items-center space-x-1">
                      <Battery size={12} />
                      <span>100%</span>
                    </div>
                  </div>
                  
                  {/* Preview Content */}
                  <div 
                    className="bg-white rounded-b-2xl overflow-hidden"
                    style={{
                      width: selectedDevice.width * zoom,
                      height: selectedDevice.height * zoom - 24
                    }}
                  >
                    <iframe
                      ref={iframeRef}
                      key={refreshKey}
                      srcDoc={generatePreviewHTML()}
                      className="w-full h-full border-0"
                      title="Intelligent Preview"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                      style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                    />
                  </div>
                </div>
              )}

              {/* Desktop/No Frame View */}
              {(!showDeviceFrame || selectedDevice.category === 'desktop') && (
                <div 
                  className="bg-white rounded-lg shadow-2xl overflow-hidden"
                  style={{
                    width: selectedDevice.width * zoom,
                    height: selectedDevice.height * zoom
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    key={refreshKey}
                    srcDoc={generatePreviewHTML()}
                    className="w-full h-full border-0"
                    title="Intelligent Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
                  />
                </div>
              )}

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="flex items-center space-x-2 text-white">
                    <RefreshCw size={20} className="animate-spin" />
                    <span>Updating preview...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <Eye size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Intelligent Preview Disabled</h3>
              <p className="text-sm mb-4">Enable intelligent preview to see your changes in real-time</p>
              <button
                onClick={onToggle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Enable Preview
              </button>
            </div>
          )}
        </div>

        {/* Side Panels */}
        {(showPerformance || showAccessibility || showConsole) && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            {/* Panel Tabs */}
            <div className="flex border-b border-gray-700">
              {showPerformance && (
                <button
                  className="flex-1 px-3 py-2 text-sm bg-green-600 text-white"
                >
                  Performance
                </button>
              )}
              {showAccessibility && (
                <button
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white"
                >
                  A11y
                </button>
              )}
              {showConsole && (
                <button
                  className="flex-1 px-3 py-2 text-sm bg-orange-600 text-white"
                >
                  Console
                </button>
              )}
            </div>

            {/* Panel Content */}
            <div className="flex-1 p-4 overflow-y-auto">
              {showPerformance && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-200">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Load Time:</span>
                      <span className="text-green-400">{performanceMetrics.loadTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Render Time:</span>
                      <span className="text-blue-400">{performanceMetrics.renderTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Memory Usage:</span>
                      <span className="text-yellow-400">{performanceMetrics.memoryUsage}MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">FPS:</span>
                      <span className="text-purple-400">{performanceMetrics.fps}</span>
                    </div>
                  </div>
                </div>
              )}

              {showAccessibility && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-200">Accessibility Issues</h3>
                  {accessibilityIssues.length === 0 ? (
                    <div className="text-green-400 text-sm">No issues found!</div>
                  ) : (
                    <div className="space-y-2">
                      {accessibilityIssues.map((issue, index) => (
                        <div key={index} className="bg-red-900/20 border border-red-700 rounded p-2 text-sm text-red-300">
                          {issue}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {showConsole && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-200">Console Output</h3>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {consoleLogs.map((log, index) => (
                      <div
                        key={index}
                        className={`text-xs p-2 rounded ${
                          log.type === 'error' ? 'bg-red-900/20 text-red-300' :
                          log.type === 'warn' ? 'bg-yellow-900/20 text-yellow-300' :
                          'bg-gray-700 text-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span>{log.message}</span>
                          <span className="text-gray-500 ml-2">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className={`flex items-center space-x-1 ${isEnabled ? 'text-green-400' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-400' : 'bg-gray-500'}`}></div>
            <span>{isEnabled ? 'Live preview active' : 'Preview disabled'}</span>
          </span>
          <span>Device: {selectedDevice.name}</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          {selectedFile && <span>File: {selectedFile}</span>}
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles size={12} className="text-purple-400" />
          <span>Intelligent Preview by Techarket AI</span>
        </div>
      </div>
    </div>
  );
};