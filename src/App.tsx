import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Code, 
  Eye, 
  Download, 
  Database, 
  AlertCircle,
  Wifi,
  WifiOff,
  FolderOpen,
  Terminal as TerminalIcon,
  Settings,
  Save,
  RefreshCw,
  Home,
  Brain,
  Cloud,
  Github,
  History,
  Wand2,
  Monitor
} from 'lucide-react';
import { FileTree } from './components/FileTree';
import { CodeEditor } from './components/CodeEditor';
import { ChatInterface } from './components/ChatInterface';
import { PreviewRenderer } from './components/PreviewRenderer';
import { DatabasePanel } from './components/DatabasePanel';
import { ExportPanel } from './components/ExportPanel';
import { ProjectsPanel } from './components/ProjectsPanel';
import { TerminalPanel } from './components/TerminalPanel';
import { ComponentBlocks } from './components/ComponentBlocks';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './components/LandingPage';
import { ModelSelector } from './components/ModelSelector';
import { AIEngineSelector } from './components/AIEngineSelector';
import { APIConfigPanel } from './components/APIConfigPanel';
import { LiveCodingPreview } from './components/LiveCodingPreview';
import { GitHubIntegration } from './components/GitHubIntegration';
import { ChatHistory } from './components/ChatHistory';
import { AIOptimizedPrompts } from './components/AIOptimizedPrompts';
import { LocalInstaller } from './components/LocalInstaller';
import { ProjectStructure, ProjectFile, AIMessage, SupabaseConfig, FirebaseConfig, AppState, ComponentBlock, FileAttachment, LocalProject, RunningProcess, TerminalOutput } from './types';
import { ollamaService, GenerationProgress } from './services/ollama';
import { apiAIService } from './services/apiAI';
import { ProjectService } from './services/project';
import { TerminalService } from './services/terminal';
import { useLocalStorage } from './hooks/useLocalStorage';

// Techarket Version Information
const TECHARKET_VERSION = '1.0.0';
const VERSION_HISTORY = [
  {
    version: '1.0.0',
    date: '2024-01-15',
    features: [
      'Initial release of Techarket AI Platform',
      'Universal AI integration (Local Ollama + 15+ Cloud APIs)',
      'Real-time code generation with progress tracking',
      'Chat and Action modes for AI interaction',
      'Multiple Ollama model support',
      'Cloud AI API integration (OpenAI, Gemini, Grok, etc.)',
      'Project management and templates',
      'Integrated terminal and process management',
      'Database integration (Supabase/Firebase)',
      'Live preview and export functionality',
      'Component library and file management',
      'Universal deployment capabilities',
      'Automatic Techarket branding integration',
      'Live coding preview with device simulation',
      'GitHub integration for repository management',
      'Chat history with project-based organization',
      'AI prompt optimization for better results',
      'Local installation with complete platform download'
    ],
    improvements: [
      'Production-ready code generation',
      '100% local and private AI processing option',
      'Cloud AI flexibility with API integration',
      'Streaming responses for better UX',
      'Comprehensive project scaffolding',
      'Advanced progress visualization',
      'Universal deployment support',
      'Real-time live preview with responsive testing',
      'Seamless GitHub workflow integration',
      'Intelligent chat history management',
      'AI-powered prompt optimization',
      'Complete local installation capabilities'
    ]
  }
];

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showInstaller, setShowInstaller] = useState(false);

  // Custom deserializer to handle Date objects in AppState
  const deserializeAppState = (value: any): AppState => {
    if (value && typeof value === 'object') {
      // Convert lastModified strings back to Date objects for localProjects
      if (value.localProjects && Array.isArray(value.localProjects)) {
        value.localProjects = value.localProjects.map((project: any) => ({
          ...project,
          lastModified: project.lastModified ? new Date(project.lastModified) : new Date()
        }));
      }
      
      // Convert lastModified string back to Date object for currentProject
      if (value.currentProject && value.currentProject.lastModified) {
        value.currentProject = {
          ...value.currentProject,
          lastModified: new Date(value.currentProject.lastModified)
        };
      }
      
      // Convert message timestamps back to Date objects
      if (value.messages && Array.isArray(value.messages)) {
        value.messages = value.messages.map((message: any) => ({
          ...message,
          timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
        }));
      }
    }
    return value;
  };

  const [appState, setAppState] = useLocalStorage<AppState>('techarket-state', {
    project: {},
    selectedFile: null,
    messages: [],
    supabaseConfig: null,
    firebaseConfig: null,
    activeTab: 'chat',
    localProjects: [],
    currentProject: null,
    runningProcesses: [],
    terminalOutput: []
  }, deserializeAppState);

  const [isLoading, setIsLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [clipboard, setClipboard] = useState<{ path: string; content: string; operation: 'copy' | 'cut' } | null>(null);
  const [currentModel, setCurrentModel] = useState<string>('mistral');
  const [aiEngine, setAiEngine] = useState<'ollama' | 'api'>('ollama');
  const [apiProvider, setApiProvider] = useState<string>('');
  const [livePreviewEnabled, setLivePreviewEnabled] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && hasUnsavedChanges) {
      const saveTimer = setTimeout(() => {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }, 2000);

      return () => clearTimeout(saveTimer);
    }
  }, [appState, autoSave, hasUnsavedChanges]);

  // Check Ollama connection on mount and periodically
  useEffect(() => {
    if (!showLanding && !showInstaller) {
      checkOllamaConnection();
      loadLocalProjects();
      
      // Set up progress callback for Ollama service
      ollamaService.setProgressCallback((progress) => {
        setGenerationProgress(progress);
      });

      // Set up streaming callback for chat responses
      ollamaService.setStreamCallback((chunk) => {
        setStreamingResponse(chunk);
      });
      
      // Subscribe to terminal output changes
      const unsubscribe = TerminalService.onOutputChange((outputs) => {
        setAppState(prev => ({
          ...prev,
          terminalOutput: outputs,
          runningProcesses: TerminalService.getRunningProcesses()
        }));
      });

      // Periodic Ollama connection check
      const connectionInterval = setInterval(checkOllamaConnection, 30000);

      return () => {
        unsubscribe();
        clearInterval(connectionInterval);
      };
    }
  }, [showLanding, showInstaller]);

  const checkOllamaConnection = async () => {
    try {
      const connected = await ollamaService.testConnection();
      setOllamaConnected(connected);
    } catch (error) {
      console.error('Failed to check Ollama connection:', error);
      setOllamaConnected(false);
    }
  };

  const loadLocalProjects = async () => {
    try {
      const projects = await ProjectService.scanLocalProjects();
      setAppState(prev => ({
        ...prev,
        localProjects: projects
      }));
    } catch (error) {
      console.error('Failed to load local projects:', error);
    }
  };

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
  };

  const handleShowInstaller = () => {
    setShowInstaller(true);
  };

  const handleBackFromInstaller = () => {
    setShowInstaller(false);
  };

  const handleModelChange = (model: string) => {
    setCurrentModel(model);
  };

  const handleEngineChange = (engine: 'ollama' | 'api', providerId?: string) => {
    setAiEngine(engine);
    if (providerId) {
      setApiProvider(providerId);
    }
  };

  const handleSendMessage = async (message: string, attachments?: FileAttachment[], mode: 'chat' | 'action' = 'action') => {
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      attachments,
      mode
    };

    setAppState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));

    setIsLoading(true);
    setGenerationProgress(null);
    setStreamingResponse('');

    try {
      let response: string;
      let engineName: string;

      if (aiEngine === 'api' && apiProvider) {
        // Use API service
        const provider = apiAIService.getProvider(apiProvider);
        engineName = provider?.name || 'API';
        
        if (mode === 'chat') {
          response = await apiAIService.chatWithAI(message, apiProvider, attachments);
        } else {
          response = await apiAIService.generateCode(message, apiProvider, attachments);
        }
      } else {
        // Use Ollama service
        engineName = currentModel;
        
        if (mode === 'chat') {
          response = await ollamaService.chatWithAI(message, attachments);
        } else {
          response = await ollamaService.generateCode(message, attachments);
        }
      }

      if (mode === 'chat') {
        // Chat mode - streaming response
        const assistantMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          mode: 'chat'
        };

        setAppState(prev => ({
          ...prev,
          messages: [...prev.messages, assistantMessage]
        }));

      } else {
        // Action mode - code generation with progress
        const generatedProject = ProjectService.parseGeneratedCode(response);

        const assistantMessage: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `🎉 **Project Generated Successfully!**

I've created a complete, production-ready application using **${engineName}** ${aiEngine === 'api' ? 'API' : 'through Ollama'}. Here's what I built for you:

${response.includes('explanation') ? '' : `
**✨ Key Features:**
- Modern React application with TypeScript
- Responsive design with Tailwind CSS
- Techarket branding integration
- Production-ready code structure
- Comprehensive documentation

**🚀 Next Steps:**
1. Check the **Code** tab to explore the generated files
2. Use the **Preview** tab to see your app in action
3. Visit the **Export** tab to download your project
4. Run commands in the **Terminal** tab to start development

**💡 Want to modify something?** Just ask me! I can add features, fix issues, or completely redesign parts of your application.
`}

---
*Generated by Techarket AI v${TECHARKET_VERSION} using ${engineName} ${aiEngine === 'api' ? 'API' : 'AI'} - ${aiEngine === 'ollama' ? 'Your code stays private! 🔒' : 'Powered by cloud AI! ☁️'}*`,
          timestamp: new Date(),
          mode: 'action'
        };

        setAppState(prev => ({
          ...prev,
          project: { ...prev.project, ...generatedProject },
          messages: [...prev.messages, assistantMessage],
          activeTab: 'code'
        }));

        setHasUnsavedChanges(true);
      }
    } catch (error) {
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ **${mode === 'chat' ? 'Chat' : 'Generation'} Failed**

I encountered an error while ${mode === 'chat' ? 'responding to your question' : 'generating your project'}: ${error instanceof Error ? error.message : 'Unknown error'}

**🔧 Troubleshooting:**
${aiEngine === 'ollama' ? `
- Ensure Ollama is running: \`ollama serve\`
- Check if ${currentModel} model is installed: \`ollama pull ${currentModel}\`
- Verify Ollama is accessible at http://localhost:11434
` : `
- Check your API key configuration in Database → API AI Engines
- Verify your internet connection
- Ensure you have sufficient API credits
- Try a different AI model
- Make sure the selected provider is properly configured
`}

**💬 Need Help?** Contact us at techarket@gmail.com for assistance with ${aiEngine === 'ollama' ? 'Ollama setup or custom AI models' : 'API configuration and troubleshooting'}.`,
        timestamp: new Date(),
        mode
      };

      setAppState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage]
      }));
    } finally {
      setIsLoading(false);
      setGenerationProgress(null);
      setStreamingResponse('');
    }
  };

  const handleStopGeneration = () => {
    setIsLoading(false);
    setGenerationProgress(null);
    setStreamingResponse('');
  };

  const handleFileSelect = (path: string) => {
    setAppState(prev => ({
      ...prev,
      selectedFile: path,
      activeTab: 'code'
    }));
  };

  const handleFileChange = (content: string) => {
    if (!appState.selectedFile) return;

    const updateProject = (structure: ProjectStructure, pathParts: string[], content: string): ProjectStructure => {
      const newStructure = { ...structure };
      let current = newStructure;

      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part] as ProjectStructure;
      }

      const filename = pathParts[pathParts.length - 1];
      current[filename] = {
        type: 'file',
        content,
        language: ProjectService.getFileLanguage(filename)
      };

      return newStructure;
    };

    const pathParts = appState.selectedFile.split('/');
    const updatedProject = updateProject(appState.project, pathParts, content);

    setAppState(prev => ({
      ...prev,
      project: updatedProject
    }));

    setHasUnsavedChanges(true);
  };

  // File management functions
  const handleFileCreate = (path: string, content: string, isFolder: boolean = false) => {
    const pathParts = path.split('/');
    
    const updateProject = (structure: ProjectStructure): ProjectStructure => {
      const newStructure = { ...structure };
      let current = newStructure;

      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part] as ProjectStructure;
      }

      const filename = pathParts[pathParts.length - 1];
      if (isFolder) {
        current[filename] = {};
      } else {
        current[filename] = {
          type: 'file',
          content,
          language: ProjectService.getFileLanguage(filename)
        };
      }

      return newStructure;
    };

    const updatedProject = updateProject(appState.project);
    setAppState(prev => ({
      ...prev,
      project: updatedProject
    }));
    setHasUnsavedChanges(true);
  };

  const handleFileDelete = (path: string) => {
    const pathParts = path.split('/');
    
    const updateProject = (structure: ProjectStructure): ProjectStructure => {
      const newStructure = { ...structure };
      let current = newStructure;

      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        current = current[part] as ProjectStructure;
      }

      const filename = pathParts[pathParts.length - 1];
      delete current[filename];

      return newStructure;
    };

    const updatedProject = updateProject(appState.project);
    setAppState(prev => ({
      ...prev,
      project: updatedProject,
      selectedFile: prev.selectedFile === path ? null : prev.selectedFile
    }));
    setHasUnsavedChanges(true);
  };

  const handleFileRename = (oldPath: string, newPath: string) => {
    const oldParts = oldPath.split('/');
    const newParts = newPath.split('/');
    
    // Get the file/folder content first
    let fileContent: ProjectFile | ProjectStructure | null = null;
    let current: ProjectStructure | ProjectFile = appState.project;
    
    for (const part of oldParts) {
      if (current.type === 'file') {
        fileContent = null;
        break;
      }
      current = (current as ProjectStructure)[part];
      if (!current) {
        fileContent = null;
        break;
      }
    }
    fileContent = current;

    if (!fileContent) return;

    // Remove old file/folder
    handleFileDelete(oldPath);
    
    // Add with new name
    setTimeout(() => {
      const updateProject = (structure: ProjectStructure): ProjectStructure => {
        const newStructure = { ...structure };
        let current = newStructure;

        for (let i = 0; i < newParts.length - 1; i++) {
          const part = newParts[i];
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part] as ProjectStructure;
        }

        const filename = newParts[newParts.length - 1];
        current[filename] = fileContent as ProjectFile | ProjectStructure;

        return newStructure;
      };

      const updatedProject = updateProject(appState.project);
      setAppState(prev => ({
        ...prev,
        project: updatedProject,
        selectedFile: prev.selectedFile === oldPath ? newPath : prev.selectedFile
      }));
    }, 100);
  };

  const handleFileCopy = (path: string) => {
    const pathParts = path.split('/');
    let current: ProjectStructure | ProjectFile = appState.project;
    
    for (const part of pathParts) {
      if (current.type === 'file') return;
      current = (current as ProjectStructure)[part];
      if (!current) return;
    }

    setClipboard({
      path,
      content: JSON.stringify(current),
      operation: 'copy'
    });
  };

  const handleFileCut = (path: string) => {
    const pathParts = path.split('/');
    let current: ProjectStructure | ProjectFile = appState.project;
    
    for (const part of pathParts) {
      if (current.type === 'file') return;
      current = (current as ProjectStructure)[part];
      if (!current) return;
    }

    setClipboard({
      path,
      content: JSON.stringify(current),
      operation: 'cut'
    });
  };

  const handleFilePaste = (targetPath: string) => {
    if (!clipboard) return;

    try {
      const content = JSON.parse(clipboard.content);
      const sourceName = clipboard.path.split('/').pop() || 'copied-item';
      const newPath = targetPath ? `${targetPath}/${sourceName}` : sourceName;
      
      const updateProject = (structure: ProjectStructure): ProjectStructure => {
        const newStructure = { ...structure };
        const pathParts = newPath.split('/');
        let current = newStructure;

        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part] as ProjectStructure;
        }

        const filename = pathParts[pathParts.length - 1];
        current[filename] = content;

        return newStructure;
      };

      const updatedProject = updateProject(appState.project);
      setAppState(prev => ({
        ...prev,
        project: updatedProject
      }));

      // If it was a cut operation, remove the original
      if (clipboard.operation === 'cut') {
        handleFileDelete(clipboard.path);
        setClipboard(null);
      }

      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('Failed to paste file:', error);
    }
  };

  const handleFileDownload = (path: string) => {
    const pathParts = path.split('/');
    let current: ProjectStructure | ProjectFile = appState.project;
    
    for (const part of pathParts) {
      if (current.type === 'file') break;
      current = (current as ProjectStructure)[part];
      if (!current) return;
    }

    if (current.type === 'file') {
      const blob = new Blob([current.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pathParts[pathParts.length - 1];
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleSupabaseConfigUpdate = (config: SupabaseConfig) => {
    setAppState(prev => ({
      ...prev,
      supabaseConfig: config
    }));
    setHasUnsavedChanges(true);
  };

  const handleFirebaseConfigUpdate = (config: FirebaseConfig) => {
    setAppState(prev => ({
      ...prev,
      firebaseConfig: config
    }));
    setHasUnsavedChanges(true);
  };

  const handleGenerateSQL = async (prompt: string, provider: 'supabase' | 'firebase') => {
    setIsLoading(true);
    try {
      let response: string;
      let engineName: string;

      if (aiEngine === 'api' && apiProvider) {
        // Use API service for SQL generation
        const apiProvider_ = apiAIService.getProvider(apiProvider);
        engineName = apiProvider_?.name || 'API';
        response = await apiAIService.generateCode(`Generate ${provider} database schema: ${prompt}`, apiProvider);
      } else {
        // Use Ollama service
        engineName = currentModel;
        response = await ollamaService.generateSQL(prompt, provider);
      }
      
      const assistantMessage: AIMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🗄️ **${provider === 'supabase' ? 'Supabase' : 'Firebase'} Schema Generated**

${response}

---
*Generated by Techarket AI v${TECHARKET_VERSION} using ${engineName} ${aiEngine === 'api' ? 'API' : 'AI'}*`,
        timestamp: new Date()
      };

      setAppState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        activeTab: 'chat'
      }));
    } catch (error) {
      console.error('Failed to generate SQL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadProject = (project: LocalProject) => {
    setAppState(prev => ({
      ...prev,
      currentProject: project,
      project: project.structure,
      selectedFile: null,
      activeTab: 'code'
    }));
    setHasUnsavedChanges(true);
  };

  const handleScanProjects = async () => {
    await loadLocalProjects();
  };

  const handleCreateProject = async (name: string, template: string) => {
    try {
      const newProject = await ProjectService.createProject(name, template);
      setAppState(prev => ({
        ...prev,
        localProjects: [...prev.localProjects, newProject],
        currentProject: newProject,
        project: newProject.structure,
        selectedFile: null,
        activeTab: 'code'
      }));
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      setAppState(prev => {
        // If deleting current project, clear it
        const newState = { ...prev };
        if (prev.currentProject?.id === projectId) {
          newState.currentProject = null;
          newState.project = {};
          newState.selectedFile = null;
        }
        
        // Remove from projects list
        newState.localProjects = prev.localProjects.filter(p => p.id !== projectId);
        
        return newState;
      });
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleUpdateProject = (updatedProject: LocalProject) => {
    setAppState(prev => {
      // Update in projects list
      const updatedProjects = prev.localProjects.map(p => 
        p.id === updatedProject.id ? updatedProject : p
      );
      
      // Update current project if it's the one being updated
      const newCurrentProject = prev.currentProject?.id === updatedProject.id 
        ? updatedProject 
        : prev.currentProject;
      
      return {
        ...prev,
        localProjects: updatedProjects,
        currentProject: newCurrentProject
      };
    });
  };

  const handleDuplicateProject = (project: LocalProject) => {
    const duplicatedProject: LocalProject = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name} (Copy)`,
      path: `${project.path}-copy`,
      lastModified: new Date(),
      isRunning: false
    };
    
    setAppState(prev => ({
      ...prev,
      localProjects: [...prev.localProjects, duplicatedProject]
    }));
  };

  const handleArchiveProject = (projectId: string) => {
    setAppState(prev => {
      const updatedProjects = prev.localProjects.map(p => 
        p.id === projectId ? { ...p, archived: true } : p
      );
      
      return {
        ...prev,
        localProjects: updatedProjects
      };
    });
  };

  const handleAddComponent = (component: ComponentBlock) => {
    const componentPath = `src/components/${component.name.replace(/\s+/g, '')}.tsx`;
    const pathParts = componentPath.split('/');
    
    const updateProject = (structure: ProjectStructure): ProjectStructure => {
      const newStructure = { ...structure };
      let current = newStructure;

      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part] as ProjectStructure;
      }

      const filename = pathParts[pathParts.length - 1];
      current[filename] = {
        type: 'file',
        content: component.code,
        language: 'typescript'
      };

      return newStructure;
    };

    const updatedProject = updateProject(appState.project);
    setAppState(prev => ({
      ...prev,
      project: updatedProject,
      selectedFile: componentPath,
      activeTab: 'code'
    }));
    setHasUnsavedChanges(true);
  };

  // Terminal handlers
  const handleRunCommand = async (command: string, projectPath?: string) => {
    await TerminalService.executeCommand(command, projectPath);
  };

  const handleStopProcess = (processId: string) => {
    TerminalService.stopProcess(processId);
  };

  const handleClearTerminal = () => {
    TerminalService.clearOutputs();
  };

  const handleInstallDependencies = async (projectPath: string) => {
    await TerminalService.installDependencies(projectPath);
  };

  const handleRunProject = async (project: LocalProject) => {
    const templates = ProjectService.getProjectTemplates();
    const template = templates.find(t => t.id === project.type || t.type === project.type);
    
    if (template) {
      await TerminalService.executeCommand(template.runCommand, project.path);
      
      // Update project status
      setAppState(prev => ({
        ...prev,
        currentProject: { ...project, isRunning: true, port: template.port },
        localProjects: prev.localProjects.map(p => 
          p.id === project.id ? { ...p, isRunning: true, port: template.port } : p
        )
      }));
    }
  };

  const handleManualSave = () => {
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
  };

  const handleOptimizedPrompt = (prompt: string) => {
    // Use the optimized prompt in the chat interface
    handleSendMessage(prompt, [], 'action');
  };

  const handleLoadChatSession = (session: any) => {
    setAppState(prev => ({
      ...prev,
      messages: session.messages,
      activeTab: 'chat'
    }));
  };

  const handleClearChatHistory = () => {
    setAppState(prev => ({
      ...prev,
      messages: []
    }));
  };

  const getSelectedFileContent = (): ProjectFile | null => {
    if (!appState.selectedFile) return null;

    const pathParts = appState.selectedFile.split('/');
    let current: ProjectStructure | ProjectFile = appState.project;

    for (const part of pathParts) {
      if (current.type === 'file') return null;
      current = (current as ProjectStructure)[part];
      if (!current) return null;
    }

    return current.type === 'file' ? current : null;
  };

  const selectedFile = getSelectedFileContent();

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'live-preview', label: 'Live Preview', icon: Monitor },
    { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
    { id: 'export', label: 'Export', icon: Download },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'github', label: 'GitHub', icon: Github },
    { id: 'history', label: 'History', icon: History },
    { id: 'prompts', label: 'AI Prompts', icon: Wand2 }
  ];

  // Check if AI is properly configured
  const isAIConfigured = () => {
    if (aiEngine === 'ollama') {
      return ollamaConnected;
    } else {
      return apiProvider && apiAIService.getConfig(apiProvider)?.enabled;
    }
  };

  if (showInstaller) {
    return <LocalInstaller onBack={handleBackFromInstaller} />;
  }

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} onShowInstaller={handleShowInstaller} />;
  }

  return (
    <ErrorBoundary>
      <div className="h-screen bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBackToLanding}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Back to home"
            >
              <Home size={18} className="text-gray-400 hover:text-white" />
            </button>
            <img 
              src="/techarket-logo.jpeg" 
              alt="Techarket Logo" 
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-xl font-bold">Techarket</h1>
              <span className="text-xs text-gray-400">v{TECHARKET_VERSION} - Universal AI Development Platform</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* AI Engine Selector */}
            <AIEngineSelector onEngineChange={handleEngineChange} />

            {/* Model Selector (only show for Ollama) */}
            {aiEngine === 'ollama' && (
              <ModelSelector onModelChange={handleModelChange} />
            )}

            {/* Save Status */}
            <div className="flex items-center space-x-2">
              {hasUnsavedChanges && (
                <button
                  onClick={handleManualSave}
                  className="flex items-center space-x-1 text-orange-400 hover:text-orange-300 text-sm"
                >
                  <Save size={14} />
                  <span>Save</span>
                </button>
              )}
              {lastSaved && (
                <span className="text-xs text-gray-500">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>

            {/* Auto-save toggle */}
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="rounded"
              />
              <span className="text-gray-400">Auto-save</span>
            </label>

            {appState.currentProject && (
              <div className="text-sm text-gray-300 flex items-center space-x-2">
                <span className="text-gray-500">Project:</span> 
                <span className="font-medium">{appState.currentProject.name}</span>
                {appState.currentProject.isRunning && (
                  <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs">
                    Running :{appState.currentProject.port}
                  </span>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 flex flex-col border-r border-gray-700">
            <div className="flex-1">
              <FileTree
                structure={appState.project}
                selectedFile={appState.selectedFile}
                onFileSelect={handleFileSelect}
                onFileCreate={handleFileCreate}
                onFileDelete={handleFileDelete}
                onFileRename={handleFileRename}
                onFileCopy={handleFileCopy}
                onFileCut={handleFileCut}
                onFilePaste={handleFilePaste}
                onFileDownload={handleFileDownload}
              />
            </div>
            
            {/* Component Blocks */}
            <div className="border-t border-gray-700 max-h-80 overflow-y-auto">
              <ComponentBlocks onAddComponent={handleAddComponent} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Tab Navigation */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
              <nav className="flex space-x-1 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setAppState(prev => ({ ...prev, activeTab: tab.id as any }))}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                        appState.activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {!isAIConfigured() && (appState.activeTab === 'chat' || appState.activeTab === 'prompts') && (
                <div className="h-full flex items-center justify-center bg-gray-900">
                  <div className="text-center max-w-md">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
                    <h3 className="text-lg font-medium mb-2">
                      {aiEngine === 'ollama' ? 'Ollama Not Connected' : 'Cloud AI Not Configured'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {aiEngine === 'ollama' 
                        ? `Please ensure Ollama is running locally on port 11434 with the ${currentModel} model installed.`
                        : 'Please configure at least one cloud AI provider to use AI services.'
                      }
                    </p>
                    {aiEngine === 'ollama' ? (
                      <div className="space-y-2 text-xs text-left bg-gray-800 p-4 rounded-lg">
                        <div>1. Install Ollama: <code className="text-blue-400">curl -fsSL https://ollama.com/install.sh | sh</code></div>
                        <div>2. Pull {currentModel}: <code className="text-blue-400">ollama pull {currentModel}</code></div>
                        <div>3. Start Ollama: <code className="text-blue-400">ollama serve</code></div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs text-left bg-gray-800 p-4 rounded-lg">
                        <div>1. Go to Database → API AI Engines</div>
                        <div>2. Configure your preferred AI provider</div>
                        <div>3. Add your API key and select a model</div>
                        <div>4. Enable the provider</div>
                      </div>
                    )}
                    <button
                      onClick={aiEngine === 'ollama' ? checkOllamaConnection : () => setAppState(prev => ({ ...prev, activeTab: 'database' }))}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      {aiEngine === 'ollama' ? 'Check Connection' : 'Configure APIs'}
                    </button>
                  </div>
                </div>
              )}

              {isAIConfigured() && appState.activeTab === 'chat' && (
                <ChatInterface
                  messages={appState.messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  generationProgress={generationProgress}
                  streamingResponse={streamingResponse}
                  onStopGeneration={handleStopGeneration}
                />
              )}

              {appState.activeTab === 'code' && (
                <div className="h-full flex">
                  <div className="flex-1">
                    {selectedFile ? (
                      <CodeEditor
                        value={selectedFile.content}
                        language={selectedFile.language}
                        onChange={handleFileChange}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-900">
                        <div className="text-center text-gray-400">
                          <Code size={48} className="mx-auto mb-4" />
                          <p>Select a file from the sidebar to start editing</p>
                          <p className="text-sm mt-2">
                            {Object.keys(appState.project).length === 0 
                              ? 'Start by chatting with AI to generate code'
                              : 'Choose from the file tree on the left'
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {appState.activeTab === 'preview' && (
                <PreviewRenderer project={appState.project} />
              )}

              {appState.activeTab === 'live-preview' && (
                <LiveCodingPreview
                  project={appState.project}
                  selectedFile={appState.selectedFile}
                  isEnabled={livePreviewEnabled}
                  onToggle={() => setLivePreviewEnabled(!livePreviewEnabled)}
                />
              )}

              {appState.activeTab === 'terminal' && (
                <TerminalPanel
                  currentProject={appState.currentProject}
                  runningProcesses={appState.runningProcesses}
                  terminalOutput={appState.terminalOutput}
                  onRunCommand={handleRunCommand}
                  onStopProcess={handleStopProcess}
                  onClearTerminal={handleClearTerminal}
                  onInstallDependencies={handleInstallDependencies}
                  onRunProject={handleRunProject}
                />
              )}

              {appState.activeTab === 'export' && (
                <ExportPanel project={appState.project} />
              )}

              {appState.activeTab === 'database' && (
                <div className="h-full flex">
                  <div className="flex-1">
                    <DatabasePanel
                      supabaseConfig={appState.supabaseConfig}
                      firebaseConfig={appState.firebaseConfig}
                      onSupabaseConfigUpdate={handleSupabaseConfigUpdate}
                      onFirebaseConfigUpdate={handleFirebaseConfigUpdate}
                      onGenerateSQL={handleGenerateSQL}
                    />
                  </div>
                  <div className="w-96 border-l border-gray-700">
                    <APIConfigPanel onConfigUpdate={() => {}} />
                  </div>
                </div>
              )}

              {appState.activeTab === 'projects' && (
                <ProjectsPanel
                  localProjects={appState.localProjects}
                  currentProject={appState.currentProject}
                  onLoadProject={handleLoadProject}
                  onScanProjects={handleScanProjects}
                  onCreateProject={handleCreateProject}
                  onDeleteProject={handleDeleteProject}
                  onUpdateProject={handleUpdateProject}
                  onDuplicateProject={handleDuplicateProject}
                  onArchiveProject={handleArchiveProject}
                />
              )}

              {appState.activeTab === 'github' && (
                <GitHubIntegration
                  currentProject={appState.currentProject}
                  onProjectUpdate={(project) => setAppState(prev => ({ ...prev, project }))}
                  onCreateProject={(name, structure) => {
                    const newProject: LocalProject = {
                      id: Date.now().toString(),
                      name,
                      path: `/imported/${name}`,
                      lastModified: new Date(),
                      type: 'react',
                      structure
                    };
                    setAppState(prev => ({
                      ...prev,
                      localProjects: [...prev.localProjects, newProject],
                      currentProject: newProject,
                      project: structure,
                      activeTab: 'code'
                    }));
                  }}
                />
              )}

              {appState.activeTab === 'history' && (
                <ChatHistory
                  currentProject={appState.currentProject}
                  messages={appState.messages}
                  onLoadSession={handleLoadChatSession}
                  onClearHistory={handleClearChatHistory}
                />
              )}

              {isAIConfigured() && appState.activeTab === 'prompts' && (
                <div className="h-full overflow-y-auto p-6">
                  <AIOptimizedPrompts onOptimizedPrompt={handleOptimizedPrompt} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;