import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Trash2, Download, Calendar, Filter, Archive, Star, Clock, User, Bot, FileText, Code, X, AlertCircle, CheckCircle, RefreshCw, Save, Copy } from 'lucide-react';
import { AIMessage, LocalProject } from '../types';

interface ChatSession {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
  starred: boolean;
  tags: string[];
  archived?: boolean;
}

interface ChatHistoryProps {
  currentProject: LocalProject | null;
  messages: AIMessage[];
  onLoadSession: (session: ChatSession) => void;
  onClearHistory: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  currentProject,
  messages,
  onLoadSession,
  onClearHistory
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'starred' | 'recent' | 'project' | 'archived'>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    // Auto-save current session when messages change
    if (currentProject && messages.length > 0) {
      saveCurrentSession();
    }
  }, [messages, currentProject]);

  const loadChatHistory = () => {
    try {
      const saved = localStorage.getItem('techarket-chat-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        const sessions = parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setSessions(sessions);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveChatHistory = (updatedSessions: ChatSession[]) => {
    try {
      localStorage.setItem('techarket-chat-history', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const saveCurrentSession = () => {
    if (!currentProject || messages.length === 0) return;

    const sessionId = `${currentProject.id}-${Date.now()}`;
    const title = generateSessionTitle(messages);
    
    const newSession: ChatSession = {
      id: sessionId,
      projectId: currentProject.id,
      projectName: currentProject.name,
      title,
      messages: [...messages],
      createdAt: new Date(),
      updatedAt: new Date(),
      starred: false,
      tags: extractTags(messages)
    };

    // Check if session already exists (same project, similar time)
    const existingIndex = sessions.findIndex(s => 
      s.projectId === currentProject.id && 
      Math.abs(s.updatedAt.getTime() - new Date().getTime()) < 60000 // Within 1 minute
    );

    let updatedSessions;
    if (existingIndex >= 0) {
      // Update existing session
      updatedSessions = [...sessions];
      updatedSessions[existingIndex] = {
        ...updatedSessions[existingIndex],
        messages: [...messages],
        updatedAt: new Date(),
        title
      };
    } else {
      // Create new session
      updatedSessions = [newSession, ...sessions];
    }

    saveChatHistory(updatedSessions);
  };

  const generateSessionTitle = (messages: AIMessage[]): string => {
    const userMessages = messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return 'New Chat Session';

    const firstMessage = userMessages[0].content;
    // Extract meaningful title from first message
    const title = firstMessage.length > 50 
      ? firstMessage.substring(0, 47) + '...'
      : firstMessage;
    
    return title || 'New Chat Session';
  };

  const extractTags = (messages: AIMessage[]): string[] => {
    const tags: Set<string> = new Set();
    
    messages.forEach(message => {
      const content = message.content.toLowerCase();
      
      // Extract technology tags
      const techKeywords = [
        'react', 'vue', 'angular', 'typescript', 'javascript', 'python', 
        'node', 'express', 'next', 'tailwind', 'css', 'html', 'api',
        'database', 'supabase', 'firebase', 'mongodb', 'sql'
      ];
      
      techKeywords.forEach(keyword => {
        if (content.includes(keyword)) {
          tags.add(keyword);
        }
      });

      // Extract action tags
      if (content.includes('build') || content.includes('create')) tags.add('build');
      if (content.includes('fix') || content.includes('debug')) tags.add('debug');
      if (content.includes('explain') || content.includes('how')) tags.add('help');
      if (message.mode === 'action') tags.add('generation');
      if (message.mode === 'chat') tags.add('chat');
    });

    return Array.from(tags);
  };

  const toggleStar = (sessionId: string) => {
    const updatedSessions = sessions.map(session =>
      session.id === sessionId 
        ? { ...session, starred: !session.starred }
        : session
    );
    saveChatHistory(updatedSessions);
  };

  const toggleArchive = (sessionId: string) => {
    const updatedSessions = sessions.map(session =>
      session.id === sessionId 
        ? { ...session, archived: !session.archived }
        : session
    );
    saveChatHistory(updatedSessions);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSession = () => {
    if (sessionToDelete) {
      const updatedSessions = sessions.filter(session => session.id !== sessionToDelete);
      saveChatHistory(updatedSessions);
      setShowDeleteConfirm(false);
      setSessionToDelete(null);
    }
  };

  const exportSession = async (session: ChatSession) => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 20) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const exportData = {
        title: session.title,
        project: session.projectName,
        createdAt: session.createdAt,
        messages: session.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          mode: msg.mode
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-session-${session.title.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export session:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const clearAllHistory = () => {
    if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      localStorage.removeItem('techarket-chat-history');
      setSessions([]);
      onClearHistory();
    }
  };

  const toggleSessionSelection = (sessionId: string) => {
    const newSelection = new Set(selectedSessions);
    if (newSelection.has(sessionId)) {
      newSelection.delete(sessionId);
    } else {
      newSelection.add(sessionId);
    }
    setSelectedSessions(newSelection);
    setShowBulkActions(newSelection.size > 0);
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedSessions.size} selected sessions?`)) {
      const updatedSessions = sessions.filter(session => !selectedSessions.has(session.id));
      saveChatHistory(updatedSessions);
      setSelectedSessions(new Set());
      setShowBulkActions(false);
    }
  };

  const handleBulkArchive = () => {
    const updatedSessions = sessions.map(session => 
      selectedSessions.has(session.id) 
        ? { ...session, archived: true }
        : session
    );
    saveChatHistory(updatedSessions);
    setSelectedSessions(new Set());
    setShowBulkActions(false);
  };

  const handleBulkStar = () => {
    const updatedSessions = sessions.map(session => 
      selectedSessions.has(session.id) 
        ? { ...session, starred: true }
        : session
    );
    saveChatHistory(updatedSessions);
    setSelectedSessions(new Set());
    setShowBulkActions(false);
  };

  const handleBulkExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Get selected sessions
      const sessionsToExport = sessions.filter(session => selectedSessions.has(session.id));
      
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const exportData = {
        exportDate: new Date().toISOString(),
        sessions: sessionsToExport.map(session => ({
          title: session.title,
          project: session.projectName,
          createdAt: session.createdAt,
          messages: session.messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
            mode: msg.mode
          }))
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `techarket-chat-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSelectedSessions(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Failed to export sessions:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleEditSession = (session: ChatSession) => {
    setEditingSession(session.id);
    setEditTitle(session.title);
  };

  const saveSessionTitle = () => {
    if (editingSession && editTitle.trim()) {
      const updatedSessions = sessions.map(session =>
        session.id === editingSession
          ? { ...session, title: editTitle.trim() }
          : session
      );
      saveChatHistory(updatedSessions);
      setEditingSession(null);
      setEditTitle('');
    }
  };

  // Filter sessions based on search and filters
  const filteredSessions = sessions.filter(session => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        session.title.toLowerCase().includes(searchLower) ||
        session.projectName.toLowerCase().includes(searchLower) ||
        session.tags.some(tag => tag.includes(searchLower)) ||
        session.messages.some(msg => msg.content.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Filter by type
    switch (filterBy) {
      case 'starred':
        return session.starred;
      case 'recent':
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return session.updatedAt > oneDayAgo;
      case 'project':
        return selectedProject === 'all' || session.projectId === selectedProject;
      case 'archived':
        return session.archived;
      default:
        return !session.archived; // By default, show non-archived
    }
  });

  // Group sessions by date
  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const date = session.updatedAt.toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(session);
    return groups;
  }, {} as Record<string, ChatSession[]>);

  // Get unique projects for filter dropdown
  const uniqueProjects = Array.from(new Set(sessions.map(s => s.projectId)))
    .map(id => sessions.find(s => s.projectId === id))
    .filter(Boolean) as ChatSession[];

  return (
    <div className="h-full bg-gray-900 text-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center">
            <MessageSquare size={16} className="mr-2" />
            Chat History ({sessions.length} sessions)
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded transition-colors ${
                showFilters ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title="Filters"
            >
              <Filter size={14} />
            </button>
            <button
              onClick={clearAllHistory}
              className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1"
            >
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search chat history..."
            className="w-full bg-gray-800 border border-gray-600 rounded pl-10 pr-4 py-2 text-sm"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-800 rounded-lg p-3 mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">View:</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm"
              >
                <option value="all">All Sessions</option>
                <option value="starred">Starred</option>
                <option value="recent">Recent (24h)</option>
                <option value="project">By Project</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {filterBy === 'project' && (
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Project:</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm"
                >
                  <option value="all">All Projects</option>
                  {uniqueProjects.map((session) => (
                    <option key={session.projectId} value={session.projectId}>
                      {session.projectName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-300">
                {selectedSessions.size} session{selectedSessions.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkStar}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
                >
                  <Star size={12} />
                  <span>Star</span>
                </button>
                <button
                  onClick={handleBulkArchive}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
                >
                  <Archive size={12} />
                  <span>Archive</span>
                </button>
                <button
                  onClick={handleBulkExport}
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
                >
                  <Download size={12} />
                  <span>Export</span>
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
                >
                  <Trash2 size={12} />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedSessions(new Set());
                    setShowBulkActions(false);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            {isExporting && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                  <span>Exporting sessions...</span>
                  <span>{exportProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedSessions).length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p className="mb-2">No chat sessions found</p>
              <p className="text-sm">Start chatting with AI to create history</p>
            </div>
          </div>
        ) : (
          Object.entries(groupedSessions).map(([date, dateSessions]) => (
            <div key={date} className="mb-6">
              <div className="sticky top-0 bg-gray-800 px-4 py-2 border-b border-gray-700 z-10">
                <h4 className="text-sm font-medium text-gray-300 flex items-center">
                  <Calendar size={14} className="mr-2" />
                  {date}
                </h4>
              </div>
              
              <div className="p-4 space-y-3">
                {dateSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer group ${
                      selectedSessions.has(session.id) ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      {/* Selection checkbox */}
                      <div className="mr-3 mt-1">
                        <input
                          type="checkbox"
                          checked={selectedSessions.has(session.id)}
                          onChange={() => toggleSessionSelection(session.id)}
                          className="rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      {/* Session content */}
                      <div 
                        className="flex-1"
                        onClick={() => onLoadSession(session)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            {editingSession === session.id ? (
                              <div className="flex items-center space-x-2 mb-2">
                                <input
                                  type="text"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm flex-1"
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveSessionTitle();
                                    if (e.key === 'Escape') {
                                      setEditingSession(null);
                                      setEditTitle('');
                                    }
                                  }}
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    saveSessionTitle();
                                  }}
                                  className="text-green-400 hover:text-green-300 p-1"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingSession(null);
                                    setEditTitle('');
                                  }}
                                  className="text-red-400 hover:text-red-300 p-1"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <h5 className="font-medium text-gray-200 mb-1 line-clamp-2 pr-20">
                                {session.title}
                                {session.archived && (
                                  <span className="ml-2 bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded text-xs">
                                    Archived
                                  </span>
                                )}
                              </h5>
                            )}
                            <div className="flex items-center space-x-3 text-xs text-gray-400 mb-2">
                              <span className="flex items-center space-x-1">
                                <FileText size={12} />
                                <span>{session.projectName}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MessageSquare size={12} />
                                <span>{session.messages.length} messages</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock size={12} />
                                <span>{session.updatedAt.toLocaleTimeString()}</span>
                              </span>
                            </div>
                            
                            {/* Tags */}
                            {session.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {session.tags.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="bg-blue-600/20 text-blue-300 px-2 py-0.5 rounded text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {session.tags.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{session.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Preview of last message */}
                            <div className="text-xs text-gray-500 line-clamp-2">
                              {session.messages[session.messages.length - 1]?.content.substring(0, 100)}...
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 absolute top-4 right-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStar(session.id);
                              }}
                              className={`p-1 rounded hover:bg-gray-600 ${
                                session.starred ? 'text-yellow-400' : 'text-gray-400'
                              }`}
                            >
                              <Star size={14} className={session.starred ? 'fill-current' : ''} />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSession(session);
                              }}
                              className="p-1 rounded hover:bg-gray-600 text-gray-400"
                            >
                              <Edit3 size={14} />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                exportSession(session);
                              }}
                              className="p-1 rounded hover:bg-gray-600 text-gray-400"
                              disabled={isExporting}
                            >
                              {isExporting ? (
                                <RefreshCw size={14} className="animate-spin" />
                              ) : (
                                <Download size={14} />
                              )}
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleArchive(session.id);
                              }}
                              className="p-1 rounded hover:bg-gray-600 text-gray-400"
                            >
                              <Archive size={14} />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSession(session.id);
                              }}
                              className="p-1 rounded hover:bg-gray-600 text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Message type indicators */}
                        <div className="flex items-center space-x-4 text-xs">
                          <div className="flex items-center space-x-1 text-blue-400">
                            <User size={12} />
                            <span>{session.messages.filter(m => m.role === 'user').length} user</span>
                          </div>
                          <div className="flex items-center space-x-1 text-green-400">
                            <Bot size={12} />
                            <span>{session.messages.filter(m => m.role === 'assistant').length} AI</span>
                          </div>
                          <div className="flex items-center space-x-1 text-purple-400">
                            <Code size={12} />
                            <span>{session.messages.filter(m => m.mode === 'action').length} actions</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-700 bg-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <span>{sessions.length} total sessions</span>
            <span>{sessions.filter(s => s.starred).length} starred</span>
            <span>{sessions.filter(s => s.archived).length} archived</span>
            <span>{sessions.reduce((acc, s) => acc + s.messages.length, 0)} total messages</span>
          </div>
          <div>
            Powered by Techarket AI
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-start space-x-4">
              <div className="bg-red-900/30 p-3 rounded-full">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Delete Session</h3>
                <p className="text-gray-400 mb-4">
                  Are you sure you want to delete this chat session? This action cannot be undone.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-400 hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteSession}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};