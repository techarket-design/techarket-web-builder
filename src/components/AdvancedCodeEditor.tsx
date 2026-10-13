import React, { useState, useRef, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { 
  Search, 
  Replace, 
  Settings, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Download,
  Zap,
  Brain,
  Eye,
  EyeOff,
  RotateCcw,
  RotateCw,
  Save,
  FileText,
  Code,
  Palette,
  Grid3X3,
  MousePointer,
  Lightbulb,
  Sparkles,
  Wand2,
  GitBranch,
  GitCommit,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Info,
  Bookmark,
  Star,
  Heart,
  Flame,
  Target,
  Award,
  Crown,
  Gift,
  Coffee,
  Rocket,
  Zap as ZapIcon
} from 'lucide-react';

interface AdvancedCodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  selectedFile?: string;
  onAIAssist?: (prompt: string, selection?: string) => void;
}

interface AIAssistSuggestion {
  id: string;
  type: 'optimization' | 'bug-fix' | 'enhancement' | 'refactor';
  title: string;
  description: string;
  code: string;
  confidence: number;
  icon: React.ComponentType<any>;
}

export const AdvancedCodeEditor: React.FC<AdvancedCodeEditorProps> = ({
  value,
  language,
  onChange,
  readOnly = false,
  selectedFile,
  onAIAssist
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState<'vs-dark' | 'light' | 'hc-black'>('vs-dark');
  const [showAIAssist, setShowAIAssist] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIAssistSuggestion[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');
  const [lineNumbers, setLineNumbers] = useState<'on' | 'off' | 'relative'>('on');
  const [showIntelliSense, setShowIntelliSense] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [codeMetrics, setCodeMetrics] = useState({
    lines: 0,
    characters: 0,
    words: 0,
    complexity: 0
  });

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    if (autoSave && hasUnsavedChanges) {
      const timer = setTimeout(() => {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [value, autoSave, hasUnsavedChanges]);

  useEffect(() => {
    // Calculate code metrics
    const lines = value.split('\n').length;
    const characters = value.length;
    const words = value.split(/\s+/).filter(word => word.length > 0).length;
    const complexity = calculateComplexity(value);
    
    setCodeMetrics({ lines, characters, words, complexity });
  }, [value]);

  const calculateComplexity = (code: string): number => {
    // Simple complexity calculation based on control structures
    const complexityKeywords = ['if', 'else', 'for', 'while', 'switch', 'case', 'try', 'catch'];
    let complexity = 1; // Base complexity
    
    complexityKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = code.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    });
    
    return complexity;
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Enhanced editor configuration
    editor.updateOptions({
      fontSize,
      fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
      fontLigatures: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: true,
      smoothScrolling: true,
      mouseWheelZoom: true,
      multiCursorModifier: 'ctrlCmd',
      formatOnPaste: true,
      formatOnType: true,
      autoIndent: 'full',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
        bracketPairsHorizontal: true
      },
      suggest: {
        showKeywords: showIntelliSense,
        showSnippets: showIntelliSense,
        showFunctions: showIntelliSense,
        showConstructors: showIntelliSense,
        showFields: showIntelliSense,
        showVariables: showIntelliSense,
        showClasses: showIntelliSense,
        showModules: showIntelliSense,
        showProperties: showIntelliSense,
        showMethods: showIntelliSense
      }
    });

    // Add custom commands
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      setShowAIAssist(true);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      setShowSearch(true);
    });

    // Track cursor position
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({ line: e.position.lineNumber, column: e.position.column });
    });

    // Track selection
    editor.onDidChangeCursorSelection((e: any) => {
      const selection = editor.getModel()?.getValueInRange(e.selection);
      setSelectedText(selection || '');
    });

    // Generate AI suggestions based on code
    generateAISuggestions(value);
  };

  const generateAISuggestions = (code: string) => {
    // Simulate AI-powered suggestions
    const suggestions: AIAssistSuggestion[] = [];

    // Performance optimization suggestions
    if (code.includes('useState') && code.includes('useEffect')) {
      suggestions.push({
        id: '1',
        type: 'optimization',
        title: 'Optimize React Hooks',
        description: 'Consider using useMemo or useCallback to optimize performance',
        code: 'const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);',
        confidence: 85,
        icon: Zap
      });
    }

    // Code quality suggestions
    if (code.includes('any') && language === 'typescript') {
      suggestions.push({
        id: '2',
        type: 'enhancement',
        title: 'Improve Type Safety',
        description: 'Replace "any" types with specific interfaces for better type safety',
        code: 'interface Props {\n  data: string[];\n  onSelect: (item: string) => void;\n}',
        confidence: 90,
        icon: CheckCircle
      });
    }

    // Accessibility improvements
    if (code.includes('<button') && !code.includes('aria-label')) {
      suggestions.push({
        id: '3',
        type: 'enhancement',
        title: 'Add Accessibility',
        description: 'Add ARIA labels for better accessibility',
        code: '<button aria-label="Close dialog" onClick={handleClose}>',
        confidence: 80,
        icon: Heart
      });
    }

    // Security improvements
    if (code.includes('innerHTML')) {
      suggestions.push({
        id: '4',
        type: 'bug-fix',
        title: 'Security Risk',
        description: 'Using innerHTML can lead to XSS vulnerabilities',
        code: 'Use textContent or a sanitization library instead',
        confidence: 95,
        icon: AlertCircle
      });
    }

    setAiSuggestions(suggestions);
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
      setHasUnsavedChanges(true);
      generateAISuggestions(newValue);
    }
  };

  const handleAIAssistPrompt = (prompt: string) => {
    if (onAIAssist) {
      onAIAssist(prompt, selectedText);
    }
    setShowAIAssist(false);
  };

  const applySuggestion = (suggestion: AIAssistSuggestion) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      
      if (selection && selectedText) {
        editor.executeEdits('ai-suggestion', [{
          range: selection,
          text: suggestion.code
        }]);
      } else {
        // Insert at cursor position
        const position = editor.getPosition();
        editor.executeEdits('ai-suggestion', [{
          range: new monacoRef.current.Range(position.lineNumber, position.column, position.lineNumber, position.column),
          text: suggestion.code
        }]);
      }
    }
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  const downloadFile = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile || 'code.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getComplexityColor = (complexity: number) => {
    if (complexity <= 5) return 'text-green-400';
    if (complexity <= 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLanguageIcon = (lang: string) => {
    switch (lang) {
      case 'typescript':
      case 'javascript':
        return '🟨';
      case 'html':
        return '🟧';
      case 'css':
        return '🟦';
      case 'json':
        return '🟩';
      case 'python':
        return '🐍';
      default:
        return '📄';
    }
  };

  return (
    <div className={`h-full flex flex-col bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Enhanced Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getLanguageIcon(language)}</span>
            <span className="text-sm font-medium text-gray-300">
              {selectedFile || 'Untitled'}
            </span>
            {hasUnsavedChanges && (
              <div className="w-2 h-2 bg-orange-400 rounded-full" title="Unsaved changes" />
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
            <span>•</span>
            <span>{codeMetrics.lines} lines</span>
            <span>•</span>
            <span className={getComplexityColor(codeMetrics.complexity)}>
              Complexity: {codeMetrics.complexity}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* AI Assist Button */}
          <button
            onClick={() => setShowAIAssist(true)}
            className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
            title="AI Assistant (Ctrl+K)"
          >
            <Brain size={14} />
            <span>AI</span>
          </button>

          {/* Quick Actions */}
          <button
            onClick={() => setShowSearch(true)}
            className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
            title="Search (Ctrl+F)"
          >
            <Search size={16} />
          </button>

          <button
            onClick={formatCode}
            className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
            title="Format Code"
          >
            <Wand2 size={16} />
          </button>

          <button
            onClick={copyToClipboard}
            className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
            title="Copy to Clipboard"
          >
            <Copy size={16} />
          </button>

          <button
            onClick={downloadFile}
            className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
            title="Download File"
          >
            <Download size={16} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
            title="Settings"
          >
            <Settings size={16} />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Search Panel */}
      {showSearch && (
        <div className="bg-gray-800 border-b border-gray-700 p-3">
          <div className="flex items-center space-x-2">
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
                autoFocus
              />
              <input
                type="text"
                value={replaceTerm}
                onChange={(e) => setReplaceTerm(e.target.value)}
                placeholder="Replace..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
              />
            </div>
            <button
              onClick={() => setShowSearch(false)}
              className="p-1 hover:bg-gray-700 rounded text-gray-400"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Font Size</label>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{fontSize}px</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Line Numbers</label>
              <select
                value={lineNumbers}
                onChange={(e) => setLineNumbers(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
              >
                <option value="on">On</option>
                <option value="off">Off</option>
                <option value="relative">Relative</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={showMinimap}
                  onChange={(e) => setShowMinimap(e.target.checked)}
                  className="rounded"
                />
                <span className="text-gray-400">Minimap</span>
              </label>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={wordWrap === 'on'}
                  onChange={(e) => setWordWrap(e.target.checked ? 'on' : 'off')}
                  className="rounded"
                />
                <span className="text-gray-400">Word Wrap</span>
              </label>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={showIntelliSense}
                  onChange={(e) => setShowIntelliSense(e.target.checked)}
                  className="rounded"
                />
                <span className="text-gray-400">IntelliSense</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex">
        {/* Main Editor */}
        <div className="flex-1">
          <MonacoEditor
            height="100%"
            language={language}
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme={theme}
            options={{
              readOnly,
              minimap: { enabled: showMinimap },
              fontSize,
              lineNumbers,
              wordWrap,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: 'smooth',
              renderWhitespace: 'selection',
              bracketPairColorization: { enabled: true },
              guides: {
                bracketPairs: true,
                indentation: true
              },
              suggest: {
                showKeywords: showIntelliSense,
                showSnippets: showIntelliSense
              }
            }}
          />
        </div>

        {/* AI Suggestions Sidebar */}
        {aiSuggestions.length > 0 && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-200 mb-3 flex items-center">
              <Lightbulb size={16} className="mr-2 text-yellow-400" />
              AI Suggestions
            </h3>
            
            <div className="space-y-3">
              {aiSuggestions.map((suggestion) => {
                const Icon = suggestion.icon;
                return (
                  <div
                    key={suggestion.id}
                    className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <div className="flex items-start space-x-2 mb-2">
                      <Icon size={16} className={`mt-0.5 ${
                        suggestion.type === 'optimization' ? 'text-blue-400' :
                        suggestion.type === 'bug-fix' ? 'text-red-400' :
                        suggestion.type === 'enhancement' ? 'text-green-400' :
                        'text-purple-400'
                      }`} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-200">
                          {suggestion.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {suggestion.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {suggestion.confidence}%
                      </span>
                    </div>
                    
                    <div className="bg-gray-800 rounded p-2 text-xs font-mono text-gray-300 overflow-x-auto">
                      {suggestion.code}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* AI Assistant Modal */}
      {showAIAssist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center">
                <Brain size={20} className="mr-2 text-purple-400" />
                AI Code Assistant
              </h3>
              <button
                onClick={() => setShowAIAssist(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {selectedText && (
                <div className="bg-gray-700 rounded p-3">
                  <p className="text-sm text-gray-400 mb-2">Selected Code:</p>
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    {selectedText}
                  </pre>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {[
                  { prompt: 'Explain this code', icon: MessageSquare },
                  { prompt: 'Optimize performance', icon: Zap },
                  { prompt: 'Add error handling', icon: CheckCircle },
                  { prompt: 'Improve accessibility', icon: Heart },
                  { prompt: 'Add TypeScript types', icon: Code },
                  { prompt: 'Refactor for clarity', icon: Wand2 }
                ].map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAIAssistPrompt(action.prompt)}
                      className="flex items-center space-x-2 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <Icon size={16} className="text-blue-400" />
                      <span className="text-sm">{action.prompt}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Ask AI anything about your code..."
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAIAssistPrompt(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>{language.toUpperCase()}</span>
          <span>{codeMetrics.characters} chars</span>
          <span>{codeMetrics.words} words</span>
          {lastSaved && (
            <span>Saved {lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span>Powered by Techarket AI</span>
          <Sparkles size={12} className="text-purple-400" />
        </div>
      </div>
    </div>
  );
};