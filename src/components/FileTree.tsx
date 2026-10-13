import React, { useState } from 'react';
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
  Download
} from 'lucide-react';
import { ProjectStructure, ProjectFile } from '../types';

interface FileTreeProps {
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
  path?: string;
}

interface FileTreeItemProps {
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
  level: number;
  clipboard?: { path: string; operation: 'copy' | 'cut' } | null;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
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
  level,
  clipboard
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [newItemName, setNewItemName] = useState('');

  const isFile = item.type === 'file';
  const isSelected = selectedFile === path;
  const isCut = clipboard?.path === path && clipboard?.operation === 'cut';

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

  const handleRename = () => {
    if (editName.trim() && editName !== name && onFileRename) {
      const newPath = path.replace(name, editName.trim());
      onFileRename(path, newPath);
    }
    setIsEditing(false);
    setEditName(name);
    setShowContextMenu(false);
  };

  const handleDelete = () => {
    if (onFileDelete && window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onFileDelete(path);
    }
    setShowContextMenu(false);
  };

  const handleCreateItem = () => {
    if (newItemName.trim() && onFileCreate) {
      const newPath = isFile ? 
        path.replace(name, newItemName.trim()) : 
        `${path}/${newItemName.trim()}`;
      
      const content = createType === 'file' ? 
        getDefaultFileContent(newItemName.trim()) : '';
      
      onFileCreate(newPath, content, createType === 'folder');
    }
    setShowCreateModal(false);
    setNewItemName('');
    setShowContextMenu(false);
  };

  const getDefaultFileContent = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'tsx':
        const componentName = fileName.replace('.tsx', '').replace(/[^a-zA-Z0-9]/g, '');
        return `import React from 'react';

interface ${componentName}Props {
  // Add props here
}

export const ${componentName}: React.FC<${componentName}Props> = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">${componentName}</h1>
      {/* Add your component content here */}
    </div>
  );
};

export default ${componentName};`;
      
      case 'ts':
        return `// ${fileName}
export {};`;
      
      case 'css':
        return `/* ${fileName} */
`;
      
      case 'json':
        return '{}';
      
      case 'md':
        return `# ${fileName.replace('.md', '')}

Add your content here.`;
      
      default:
        return '';
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const iconClass = isSelected ? 'text-white' : 'text-blue-400';
    
    switch (ext) {
      case 'tsx':
      case 'jsx':
        return <File size={16} className={`${iconClass} bg-blue-500 rounded p-0.5`} />;
      case 'ts':
      case 'js':
        return <File size={16} className={`${iconClass} bg-yellow-500 rounded p-0.5`} />;
      case 'css':
      case 'scss':
        return <File size={16} className={`${iconClass} bg-pink-500 rounded p-0.5`} />;
      case 'json':
        return <File size={16} className={`${iconClass} bg-green-500 rounded p-0.5`} />;
      case 'md':
        return <File size={16} className={`${iconClass} bg-gray-500 rounded p-0.5`} />;
      default:
        return <File size={16} className={iconClass} />;
    }
  };

  return (
    <>
      <div className="select-none">
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-700 rounded transition-colors duration-150 group ${
            isSelected ? 'bg-blue-600 text-white' : 'text-gray-300'
          } ${isCut ? 'opacity-50' : ''}`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          {!isFile && (
            <span className="mr-1">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </span>
          )}
          
          <span className="mr-2">
            {isFile ? getFileIcon(name) : <Folder size={16} className={isSelected ? 'text-white' : 'text-yellow-400'} />}
          </span>
          
          {isEditing ? (
            <div className="flex items-center flex-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
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
            <span className="text-sm font-medium flex-1">{name}</span>
          )}

          {/* Action buttons - show on hover */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 ml-2">
            {!isFile && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreateType('file');
                    setShowCreateModal(true);
                  }}
                  className="p-1 hover:bg-gray-600 rounded"
                  title="New file"
                >
                  <Plus size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreateType('folder');
                    setShowCreateModal(true);
                  }}
                  className="p-1 hover:bg-gray-600 rounded"
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
              <FileTreeItem
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
                level={level + 1}
                clipboard={clipboard}
              />
            ))}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowContextMenu(false)}
          />
          <div
            className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg py-2 min-w-48"
            style={{
              left: contextMenuPos.x,
              top: contextMenuPos.y,
            }}
          >
            {!isFile && (
              <>
                <button
                  onClick={() => {
                    setCreateType('file');
                    setShowCreateModal(true);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Plus size={14} />
                  <span>New File</span>
                </button>
                <button
                  onClick={() => {
                    setCreateType('folder');
                    setShowCreateModal(true);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <FolderPlus size={14} />
                  <span>New Folder</span>
                </button>
                <hr className="border-gray-600 my-1" />
              </>
            )}
            
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
            
            <button
              onClick={() => {
                onFileCut?.(path);
                setShowContextMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-2"
            >
              <Scissors size={14} />
              <span>Cut</span>
            </button>
            
            {clipboard && !isFile && (
              <button
                onClick={() => {
                  onFilePaste?.(path);
                  setShowContextMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center space-x-2"
              >
                <Copy size={14} />
                <span>Paste</span>
              </button>
            )}
            
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
              onClick={handleDelete}
              className="w-full text-left px-4 py-2 hover:bg-red-600 text-red-400 hover:text-white flex items-center space-x-2"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}

      {/* Create Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">
              Create New {createType === 'file' ? 'File' : 'Folder'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {createType === 'file' ? 'File' : 'Folder'} Name
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={createType === 'file' ? 'component.tsx' : 'folder-name'}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateItem();
                    if (e.key === 'Escape') setShowCreateModal(false);
                  }}
                />
              </div>

              {createType === 'file' && (
                <div className="text-sm text-gray-400">
                  <p>Supported file types:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>.tsx - React TypeScript component</li>
                    <li>.ts - TypeScript file</li>
                    <li>.css - Stylesheet</li>
                    <li>.json - JSON data</li>
                    <li>.md - Markdown documentation</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateItem}
                disabled={!newItemName.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({
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
  path = ''
}) => {
  const [clipboard, setClipboard] = useState<{ path: string; operation: 'copy' | 'cut' } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [newItemName, setNewItemName] = useState('');

  const handleFileCopy = (filePath: string) => {
    setClipboard({ path: filePath, operation: 'copy' });
    onFileCopy?.(filePath);
  };

  const handleFileCut = (filePath: string) => {
    setClipboard({ path: filePath, operation: 'cut' });
    onFileCut?.(filePath);
  };

  const handleFilePaste = (targetPath: string) => {
    if (clipboard) {
      onFilePaste?.(targetPath);
      if (clipboard.operation === 'cut') {
        setClipboard(null);
      }
    }
  };

  const handleCreateRootItem = () => {
    if (newItemName.trim() && onFileCreate) {
      const content = createType === 'file' ? 
        getDefaultFileContent(newItemName.trim()) : '';
      
      onFileCreate(newItemName.trim(), content, createType === 'folder');
    }
    setShowCreateModal(false);
    setNewItemName('');
  };

  const getDefaultFileContent = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'tsx':
        const componentName = fileName.replace('.tsx', '').replace(/[^a-zA-Z0-9]/g, '');
        return `import React from 'react';

interface ${componentName}Props {
  // Add props here
}

export const ${componentName}: React.FC<${componentName}Props> = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">${componentName}</h1>
      {/* Add your component content here */}
    </div>
  );
};

export default ${componentName};`;
      
      case 'ts':
        return `// ${fileName}
export {};`;
      
      case 'css':
        return `/* ${fileName} */
`;
      
      case 'json':
        return '{}';
      
      case 'md':
        return `# ${fileName.replace('.md', '')}

Add your content here.`;
      
      default:
        return '';
    }
  };

  return (
    <div className="h-full bg-gray-800 border-r border-gray-700 overflow-y-auto">
      <div className="p-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-200 flex items-center">
            <Folder size={16} className="mr-2" />
            Project Files
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => {
                setCreateType('file');
                setShowCreateModal(true);
              }}
              className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
              title="New file"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => {
                setCreateType('folder');
                setShowCreateModal(true);
              }}
              className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-gray-200"
              title="New folder"
            >
              <FolderPlus size={14} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-2">
        {Object.keys(structure).length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Folder size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm mb-2">No files yet</p>
            <p className="text-xs">Create files or chat with AI to generate code</p>
          </div>
        ) : (
          Object.entries(structure).map(([name, item]) => (
            <FileTreeItem
              key={name}
              name={name}
              item={item}
              path={name}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              onFileCreate={onFileCreate}
              onFileDelete={onFileDelete}
              onFileRename={onFileRename}
              onFileCopy={handleFileCopy}
              onFileCut={handleFileCut}
              onFilePaste={handleFilePaste}
              onFileDownload={onFileDownload}
              level={0}
              clipboard={clipboard}
            />
          ))
        )}
      </div>

      {/* Create Root Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">
              Create New {createType === 'file' ? 'File' : 'Folder'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {createType === 'file' ? 'File' : 'Folder'} Name
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={createType === 'file' ? 'component.tsx' : 'folder-name'}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateRootItem();
                    if (e.key === 'Escape') setShowCreateModal(false);
                  }}
                />
              </div>

              {createType === 'file' && (
                <div className="text-sm text-gray-400">
                  <p>Supported file types:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>.tsx - React TypeScript component</li>
                    <li>.ts - TypeScript file</li>
                    <li>.css - Stylesheet</li>
                    <li>.json - JSON data</li>
                    <li>.md - Markdown documentation</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRootItem}
                disabled={!newItemName.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};