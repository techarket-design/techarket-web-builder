import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  Plus, 
  Trash2, 
  Edit3, 
  FolderPlus,
  Save,
  X,
  Copy,
  Scissors,
  Download,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Star,
  StarOff,
  GitBranch,
  GitCommit,
  Clock,
  FileText,
  Image,
  Code,
  Database,
  Settings,
  Zap,
  Brain,
  Sparkles,
  Target,
  Award,
  Crown,
  Gift,
  Coffee,
  Rocket,
  Heart,
  Flame,
  Bookmark,
  Tag,
  Hash,
  AtSign,
  Percent,
  DollarSign,
  Ampersand,
  Asterisk
} from 'lucide-react';
import { ProjectStructure, ProjectFile } from '../types';

interface SmartFileTreeProps {
  structure: ProjectStructure;
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
  onFileCreate?: (path: string, content: string, isFolder?: boolean) => void;
  onFileDelete?: (path: string) => void;
  onFileRename?: (oldPath: string, newPath: string) => void;
  onFileCopy?: (path: string) => void;
  onFileCut?: (path: string) => void;
  onFilePaste?: (targetPath: string) => void;
  onFileDownload?: (path: string) => void;
  onAIAssist?: (prompt: string, filePath?: string) => void;
}

interface FileMetadata {
  size: number;
  lastModified: Date;
  type: string;
  starred: boolean;
  tags: string[];
  complexity?: number;
}

interface SmartFileItemProps {
  name: string;
  item: ProjectStructure | ProjectFile;
  path: string;
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
  onFileCreate?: (path: string, content: string, isFolder?: boolean) => void;
  onFileDelete?: (path: string) => void;
  onFileRename?: (oldPath: string, newPath: string) => void;
  onFileCopy?: (path: string) => void;
  onFileCut?: (path: string) => void;
  onFilePaste?: (targetPath: string) => void;
  onFileDownload?: (path: string) => void;
  onAIAssist?: (prompt: string, filePath?: string) => void;
  level: number;
  searchTerm: string;
  showHidden: boolean;
  sortBy: 'name' | 'type' | 'modified' | 'size';
  metadata: Map<string, FileMetadata>;
  onMetadataUpdate: (path: string, metadata: FileMetadata) => void;
}

const SmartFileItem: React.FC<SmartFileItemProps> = ({
  name,
  item,
  path,
  selectedFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileCopy,
  onFileCut,
  onFilePaste,
  onFileDownload,
  onAIAssist,
  level,
  searchTerm,
  showHidden,
  metadata,
  onMetadataUpdate
}) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);

  const isFile = item.type === 'file';
  const isSelected = selectedFile === path;
  const isHidden = name.startsWith('.');
  const fileMetadata = metadata.get(path);

  // Filter hidden files
  if (isHidden && !showHidden) return null;

  // Search filter
  if (searchTerm && !name.toLowerCase().includes(searchTerm.toLowerCase())) {
    return null;
  }

  const getFileIcon = (fileName: string, isStarred: boolean = false) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const baseClass = isSelected ? 'text-white' : '';
    
    if (isStarred) {
      return <Star size={16} className={`${baseClass} text-yellow-400 fill-current`} />;
    }
    
    switch (ext) {
      case 'tsx':
      case 'jsx':
        return <span className={`${baseClass} text-blue-400 text-sm font-bold`}>⚛️</span>;
      case 'ts':
      case 'js':
        return <span className={`${baseClass} text-yellow-400 text-sm`}>🟨</span>;
      case 'css':
      case 'scss':
        return <span className={`${baseClass} text-pink-400 text-sm`}>🎨</span>;
      case 'html':
        return <span className={`${baseClass} text-orange-400 text-sm`}>🌐</span>;
      case 'json':
        return <span className={`${baseClass} text-green-400 text-sm`}>📋</span>;
      case 'md':
        return <span className={`${baseClass} text-blue-300 text-sm`}>📝</span>;
      case 'py':
        return <span className={`${baseClass} text-green-500 text-sm`}>🐍</span>;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <Image size={16} className={`${baseClass} text-purple-400`} />;
      default:
        return <File size={16} className={baseClass} />;
    }
  };

  const getComplexityColor = (complexity: number) => {
    if (complexity <= 5) return 'text-green-400';
    if (complexity <= 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleClick = () => {
    if (isFile) {
      onFileSelect(path);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleStarToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentMetadata = metadata.get(path) || {
      size: isFile ? (item as ProjectFile).content.length : 0,
      lastModified: new Date(),
      type: isFile ? 'file' : 'folder',
      starred: false,
      tags: []
    };
    
    onMetadataUpdate(path, {
      ...currentMetadata,
      starred: !currentMetadata.starred
    });
  };

  const handleAIAction = (action: string) => {
    if (onAIAssist) {
      onAIAssist(`${action} for file: ${path}`, path);
    }
    setShowAIMenu(false);
    setShowContextMenu(false);
  };

  return (
    <>
      <div className="select-none">
        <div
          className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-gray-700 rounded transition-all duration-200 group ${
            isSelected ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          {!isFile && (
            <span className="mr-1 transition-transform duration-200">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </span>
          )}
          
          <span className="mr-2">
            {isFile ? 
              getFileIcon(name, fileMetadata?.starred) : 
              <Folder size={16} className={`${isSelected ? 'text-white' : 'text-yellow-400'} ${isExpanded ? 'text-yellow-300' : ''}`} />
            }
          </span>
          
          {isEditing ? (
            <div className="flex items-center flex-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => {
                  if (editName.trim() && editName !== name && onFileRename) {
                    const newPath = path.replace(name, editName.trim());
                    onFileRename(path, newPath);
                  }
                  setIsEditing(false);
                  setEditName(name);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                  if (e.key === 'Escape') {
                    setIsEditing(false);
                    setEditName(name);
                  }
                }}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
            </div>
          ) : (
            <div className="flex items-center flex-1 min-w-0">
              <span className="text-sm font-medium flex-1 truncate">{name}</span>
              
              {/* File metadata */}
              {isFile && fileMetadata && (
                <div className="flex items-center space-x-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {fileMetadata.complexity && (
                    <span className={`text-xs ${getComplexityColor(fileMetadata.complexity)}`}>
                      {fileMetadata.complexity}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatFileSize(fileMetadata.size)}
                  </span>
                </div>
              )}

              {/* Tags */}
              {fileMetadata?.tags && fileMetadata.tags.length > 0 && (
                <div className="flex items-center space-x-1 ml-2">
                  {fileMetadata.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-600/20 text-blue-300 px-1.5 py-0.5 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 ml-2 transition-opacity">
            <button
              onClick={handleStarToggle}
              className="p-1 hover:bg-gray-600 rounded transition-colors"
              title={fileMetadata?.starred ? 'Unstar' : 'Star'}
            >
              {fileMetadata?.starred ? (
                <Star size={12} className="text-yellow-400 fill-current" />
              ) : (
                <StarOff size={12} className="text-gray-400" />
              )}
            </button>

            {isFile && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAIMenu(true);
                }}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
                title="AI Actions"
              >
                <Brain size={12} className="text-purple-400" />
              </button>
            )}

            {!isFile && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileCreate?.(path + '/new-file.tsx', '', false);
                  }}
                  className="p-1 hover:bg-gray-600 rounded transition-colors"
                  title="New file"
                >
                  <Plus size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileCreate?.(path + '/new-folder', '', true);
                  }}
                  className="p-1 hover:bg-gray-600 rounded transition-colors"
                  title="New folder"
                >
                  <FolderPlus size={12} />
                </button>
              </>
            )}
          </div>
        </div>
        
        {!isFile && isExpanded && (
          <div>
            {Object.entries(item).map(([childName, childItem]) => (
              <SmartFileItem
                key={childName}
                name={childName}
                item={childItem}
                path={`${path}/${childName}`}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
                onFileCreate={onFileCreate}
                onFileDelete={onFileDelete}
                onFileRename={onFileRename}
                onFileCopy={onFileCopy}
                onFileCut={onFileCut}
                onFilePaste={onFilePaste}
                onFileDownload={onFileDownload}
                onAIAssist={onAIAssist}
                level={level + 1}
                searchTerm={searchTerm}
                showHidden={showHidden}
                sortBy="name"
                metadata={metadata}
                onMetadataUpdate={onMetadataUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Actions Menu */}
      {showAIMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowAIMenu(false)}
          />
          <div className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 min-w-48"
            style={{
              left: contextMenuPos.x,
              top: contextMenuPos.y,
            }}
          >
            {[
              { action: 'Explain code', icon: Brain },
              { action: 'Optimize performance', icon: Zap },
              { action: 'Add documentation', icon: FileText },
              { action: 'Refactor code', icon: Settings },
              { action: 'Add tests', icon: Target },
              { action: 'Fix bugs', icon: Award }
            ].map(({ action, icon: Icon }) => (
              <button
                key={action}
                onClick={() => handleAIAction(action)}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-2"
              >
                <Icon size={14} className="text-purple-400" />
                <span>{action}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Context Menu */}
      {showContextMenu && !showAIMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowContextMenu(false)}
          />
          <div
            className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl py-2 min-w-48"
            style={{
              left: contextMenuPos.x,
              top: contextMenuPos.y,
            }}
          >
            <button
              onClick={() => {
                setIsEditing(true);
                setShowContextMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-2"
            >
              <Edit3 size={14} />
              <span>Rename</span>
            </button>
            
            <button
              onClick={() => {
                onFileCopy?.(path);
                setShowContextMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-2"
            >
              <Copy size={14} />
              <span>Copy</span>
            </button>
            
            {isFile && (
              <button
                onClick={() => {
                  onFileDownload?.(path);
                  setShowContextMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-2"
              >
                <Download size={14} />
                <span>Download</span>
              </button>
            )}
            
            <hr className="border-gray-600 my-1" />
            
            <button
              onClick={() => {
                if (onFileDelete && window.confirm(`Delete "${name}"?`)) {
                  onFileDelete(path);
                }
                setShowContextMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-red-600 text-red-400 hover:text-white flex items-center space-x-2"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export const SmartFileTree: React.FC<SmartFileTreeProps> = ({
  structure,
  selectedFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileCopy,
  onFileCut,
  onFilePaste,
  onFileDownload,
  onAIAssist
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'modified' | 'size'>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [metadata, setMetadata] = useState<Map<string, FileMetadata>>(new Map());
  const [showStats, setShowStats] = useState(false);

  const updateMetadata = (path: string, newMetadata: FileMetadata) => {
    setMetadata(prev => new Map(prev.set(path, newMetadata)));
  };

  const getProjectStats = () => {
    let totalFiles = 0;
    let totalSize = 0;
    let fileTypes: Record<string, number> = {};

    const countFiles = (structure: ProjectStructure | ProjectFile, path: string = '') => {
      if (structure.type === 'file') {
        totalFiles++;
        totalSize += structure.content.length;
        const ext = path.split('.').pop()?.toLowerCase() || 'unknown';
        fileTypes[ext] = (fileTypes[ext] || 0) + 1;
      } else {
        Object.entries(structure).forEach(([key, value]) => {
          countFiles(value, `${path}/${key}`);
        });
      }
    };

    countFiles(structure);

    return { totalFiles, totalSize, fileTypes };
  };

  const stats = getProjectStats();

  return (
    <div className="h-full bg-gray-800 border-r border-gray-700 overflow-hidden flex flex-col">
      {/* Enhanced Header */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center">
            <Folder size={16} className="mr-2" />
            Smart Explorer
          </h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200 transition-colors"
              title="Project Stats"
            >
              <Target size={14} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200 transition-colors"
              title="Filters"
            >
              <Filter size={14} />
            </button>
            <button
              onClick={() => onFileCreate?.('new-file.tsx', '', false)}
              className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200 transition-colors"
              title="New file"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-gray-700 border border-gray-600 rounded pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={showHidden}
                  onChange={(e) => setShowHidden(e.target.checked)}
                  className="rounded"
                />
                <span className="text-gray-400">Show hidden files</span>
              </label>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs"
              >
                <option value="name">Sort by name</option>
                <option value="type">Sort by type</option>
                <option value="modified">Sort by modified</option>
                <option value="size">Sort by size</option>
              </select>
            </div>
          </div>
        )}

        {/* Project Stats */}
        {showStats && (
          <div className="mt-3 bg-gray-700 rounded-lg p-3">
            <h4 className="text-xs font-medium text-gray-300 mb-2">Project Stats</h4>
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Files:</span>
                <span className="text-blue-400">{stats.totalFiles}</span>
              </div>
              <div className="flex justify-between">
                <span>Size:</span>
                <span className="text-green-400">
                  {(stats.totalSize / 1024).toFixed(1)} KB
                </span>
              </div>
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">File Types:</div>
                {Object.entries(stats.fileTypes).slice(0, 3).map(([ext, count]) => (
                  <div key={ext} className="flex justify-between">
                    <span>.{ext}:</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {Object.keys(structure).length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Folder size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm mb-2">No files yet</p>
            <p className="text-xs">Create files or generate with AI</p>
            <button
              onClick={() => onAIAssist?.('Create a new React project structure')}
              className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs flex items-center space-x-1 mx-auto"
            >
              <Brain size={12} />
              <span>Generate with AI</span>
            </button>
          </div>
        ) : (
          Object.entries(structure).map(([name, item]) => (
            <SmartFileItem
              key={name}
              name={name}
              item={item}
              path={name}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onFileCreate={onFileCreate}
              onFileDelete={onFileDelete}
              onFileRename={onFileRename}
              onFileCopy={onFileCopy}
              onFileCut={onFileCut}
              onFilePaste={onFilePaste}
              onFileDownload={onFileDownload}
              onAIAssist={onAIAssist}
              level={0}
              searchTerm={searchTerm}
              showHidden={showHidden}
              sortBy={sortBy}
              metadata={metadata}
              onMetadataUpdate={updateMetadata}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-700 bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{stats.totalFiles} files</span>
          <div className="flex items-center space-x-1">
            <Sparkles size={10} className="text-purple-400" />
            <span>Smart Explorer</span>
          </div>
        </div>
      </div>
    </div>
  );
};