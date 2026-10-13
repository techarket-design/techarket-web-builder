import React, { useState, useEffect } from 'react';
import { Folder, FolderOpen, RefreshCw, Plus, Search, Calendar, Code, ExternalLink, Play, Square, Globe, Trash2, Edit3, Save, X, AlertCircle, CheckCircle, Archive, Star, StarOff, Filter, SortAsc, Download, Upload, Copy, Settings, MoreVertical } from 'lucide-react';
import { LocalProject, ProjectTemplate } from '../types';
import { ProjectTemplates } from './ProjectTemplates';

interface ProjectsPanelProps {
  localProjects: LocalProject[];
  currentProject: LocalProject | null;
  onLoadProject: (project: LocalProject) => void;
  onScanProjects: () => void;
  onCreateProject: (name: string, template: string) => void;
  onDeleteProject?: (projectId: string) => void;
  onUpdateProject?: (project: LocalProject) => void;
  onDuplicateProject?: (project: LocalProject) => void;
  onArchiveProject?: (projectId: string) => void;
}

export const ProjectsPanel: React.FC<ProjectsPanelProps> = ({
  localProjects,
  currentProject,
  onLoadProject,
  onScanProjects,
  onCreateProject,
  onDeleteProject,
  onUpdateProject,
  onDuplicateProject,
  onArchiveProject
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeView, setActiveView] = useState<'projects' | 'templates' | 'archived'>('projects');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'type'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'running' | 'starred'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<LocalProject | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filter and sort projects
  const filteredProjects = localProjects
    .filter(project => {
      // Search filter
      if (searchTerm && !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !project.path.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !project.type.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filterBy === 'running' && !project.isRunning) return false;
      if (filterBy === 'starred' && !project.starred) return false;

      // View filter
      if (activeView === 'archived' && !project.archived) return false;
      if (activeView === 'projects' && project.archived) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

  const handleScanProjects = async () => {
    setIsScanning(true);
    try {
      await onScanProjects();
    } finally {
      setIsScanning(false);
    }
  };

  const handleCreateProject = () => {
    if (newProjectName.trim() && selectedTemplate) {
      onCreateProject(newProjectName.trim(), selectedTemplate.id);
      setNewProjectName('');
      setSelectedTemplate(null);
      setShowCreateModal(false);
    }
  };

  const handleSelectTemplate = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
  };

  const handleDeleteProject = (project: LocalProject) => {
    setProjectToDelete(project);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete && onDeleteProject) {
      onDeleteProject(projectToDelete.id);
      setProjectToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleRenameProject = (project: LocalProject) => {
    setEditingProject(project.id);
    setEditName(project.name);
  };

  const saveProjectName = () => {
    if (editingProject && editName.trim() && onUpdateProject) {
      const project = localProjects.find(p => p.id === editingProject);
      if (project) {
        onUpdateProject({
          ...project,
          name: editName.trim(),
          lastModified: new Date()
        });
      }
    }
    setEditingProject(null);
    setEditName('');
  };

  const toggleProjectStar = (project: LocalProject) => {
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        starred: !project.starred,
        lastModified: new Date()
      });
    }
  };

  const handleDuplicateProject = (project: LocalProject) => {
    if (onDuplicateProject) {
      onDuplicateProject(project);
    }
  };

  const handleArchiveProject = (project: LocalProject) => {
    if (onArchiveProject) {
      onArchiveProject(project.id);
    }
  };

  const toggleProjectSelection = (projectId: string) => {
    const newSelection = new Set(selectedProjects);
    if (newSelection.has(projectId)) {
      newSelection.delete(projectId);
    } else {
      newSelection.add(projectId);
    }
    setSelectedProjects(newSelection);
    setShowBulkActions(newSelection.size > 0);
  };

  const handleBulkDelete = () => {
    if (onDeleteProject) {
      selectedProjects.forEach(projectId => {
        onDeleteProject(projectId);
      });
      setSelectedProjects(new Set());
      setShowBulkActions(false);
    }
  };

  const handleBulkArchive = () => {
    if (onArchiveProject) {
      selectedProjects.forEach(projectId => {
        onArchiveProject(projectId);
      });
      setSelectedProjects(new Set());
      setShowBulkActions(false);
    }
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'react': return '⚛️';
      case 'next': return '▲';
      case 'vue': return '💚';
      case 'vanilla': return '🌐';
      case 'express': return '🚀';
      case 'python': return '🐍';
      case 'flask': return '🌶️';
      case 'django': return '🎸';
      default: return '📁';
    }
  };

  const getStatusColor = (project: LocalProject) => {
    if (project.isRunning) return 'text-green-400';
    if (project.archived) return 'text-gray-500';
    return 'text-gray-400';
  };

  const getProjectStats = () => {
    const total = localProjects.length;
    const running = localProjects.filter(p => p.isRunning).length;
    const starred = localProjects.filter(p => p.starred).length;
    const archived = localProjects.filter(p => p.archived).length;
    
    return { total, running, starred, archived };
  };

  const stats = getProjectStats();

  return (
    <div className="h-full bg-gray-900 text-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center">
            <Folder size={16} className="mr-2" />
            Project Manager
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handleScanProjects}
              disabled={isScanning}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-2 rounded transition-colors"
              title="Scan for projects"
            >
              <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors"
              title="Create new project"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded transition-colors ${showFilters ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              title="Filters"
            >
              <Filter size={14} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-xs">
          <div className="bg-gray-800 rounded p-2 text-center">
            <div className="text-blue-400 font-semibold">{stats.total}</div>
            <div className="text-gray-500">Total</div>
          </div>
          <div className="bg-gray-800 rounded p-2 text-center">
            <div className="text-green-400 font-semibold">{stats.running}</div>
            <div className="text-gray-500">Running</div>
          </div>
          <div className="bg-gray-800 rounded p-2 text-center">
            <div className="text-yellow-400 font-semibold">{stats.starred}</div>
            <div className="text-gray-500">Starred</div>
          </div>
          <div className="bg-gray-800 rounded p-2 text-center">
            <div className="text-gray-400 font-semibold">{stats.archived}</div>
            <div className="text-gray-500">Archived</div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveView('projects')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeView === 'projects'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Active ({localProjects.filter(p => !p.archived).length})
          </button>
          <button
            onClick={() => setActiveView('templates')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeView === 'templates'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveView('archived')}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              activeView === 'archived'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Archived ({stats.archived})
          </button>
        </div>

        {/* Search and Filters */}
        {activeView !== 'templates' && (
          <>
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {showFilters && (
              <div className="space-y-3 mb-4 p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                  >
                    <option value="date">Last Modified</option>
                    <option value="name">Name</option>
                    <option value="type">Type</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Filter:</label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as any)}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                  >
                    <option value="all">All Projects</option>
                    <option value="running">Running Only</option>
                    <option value="starred">Starred Only</option>
                  </select>
                </div>
              </div>
            )}
          </>
        )}

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="mb-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-300">
                {selectedProjects.size} project{selectedProjects.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkArchive}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                >
                  Archive
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setSelectedProjects(new Set());
                    setShowBulkActions(false);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeView === 'templates' ? (
          <ProjectTemplates onSelectTemplate={handleSelectTemplate} />
        ) : (
          <>
            {/* Current Project */}
            {currentProject && activeView === 'projects' && (
              <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <FolderOpen size={16} className="mr-2 text-blue-400" />
                  Current Project
                </h4>
                <div className="text-sm text-gray-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span>{getProjectTypeIcon(currentProject.type)}</span>
                      <span className="font-medium">{currentProject.name}</span>
                      <span className={`text-xs ${getStatusColor(currentProject)}`}>
                        {currentProject.isRunning ? '● Running' : '○ Stopped'}
                      </span>
                      {currentProject.starred && (
                        <Star size={12} className="text-yellow-400 fill-current" />
                      )}
                    </div>
                    {currentProject.isRunning && currentProject.port && (
                      <button
                        onClick={() => window.open(`http://localhost:${currentProject.port}`, '_blank')}
                        className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-xs"
                      >
                        <Globe size={12} />
                        <span>:{currentProject.port}</span>
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">{currentProject.path}</div>
                </div>
              </div>
            )}

            {/* Projects List */}
            <div className="space-y-3">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Folder size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="mb-2">
                    {activeView === 'archived' ? 'No archived projects' : 'No projects found'}
                  </p>
                  <p className="text-sm">
                    {searchTerm ? 'Try a different search term' : 
                     activeView === 'archived' ? 'Archive projects to see them here' :
                     'Scan for projects or create a new one'}
                  </p>
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 group ${
                      currentProject?.id === project.id
                        ? 'bg-blue-900/30 border-blue-600 shadow-lg'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:shadow-md'
                    } ${selectedProjects.has(project.id) ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {/* Selection Checkbox */}
                        <input
                          type="checkbox"
                          checked={selectedProjects.has(project.id)}
                          onChange={() => toggleProjectSelection(project.id)}
                          className="mt-1 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />

                        <div className="flex-1" onClick={() => onLoadProject(project)}>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{getProjectTypeIcon(project.type)}</span>
                            
                            {editingProject === project.id ? (
                              <div className="flex items-center space-x-2 flex-1">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onBlur={saveProjectName}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveProjectName();
                                    if (e.key === 'Escape') {
                                      setEditingProject(null);
                                      setEditName('');
                                    }
                                  }}
                                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm flex-1"
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    saveProjectName();
                                  }}
                                  className="text-green-400 hover:text-green-300"
                                >
                                  <Save size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingProject(null);
                                    setEditName('');
                                  }}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <h4 className="font-medium">{project.name}</h4>
                                <span className="text-xs bg-gray-700 px-2 py-1 rounded">{project.type}</span>
                                <span className={`text-xs ${getStatusColor(project)}`}>
                                  {project.isRunning ? '● Running' : project.archived ? '📦 Archived' : '○ Stopped'}
                                </span>
                                {project.starred && (
                                  <Star size={12} className="text-yellow-400 fill-current" />
                                )}
                              </>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-400 mb-2">{project.path}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar size={12} />
                              <span>{project.lastModified.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Code size={12} />
                              <span>{Object.keys(project.structure).length} files</span>
                            </div>
                            {project.dependencies && (
                              <div className="flex items-center space-x-1">
                                <span>📦</span>
                                <span>{project.dependencies.length} deps</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProjectStar(project);
                          }}
                          className={`p-1 rounded transition-colors ${
                            project.starred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                          }`}
                          title={project.starred ? 'Unstar' : 'Star'}
                        >
                          {project.starred ? <Star size={14} className="fill-current" /> : <StarOff size={14} />}
                        </button>

                        {project.isRunning && project.port && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`http://localhost:${project.port}`, '_blank');
                            }}
                            className="text-blue-400 hover:text-blue-300 p-1"
                            title="Open in browser"
                          >
                            <Globe size={14} />
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameProject(project);
                          }}
                          className="text-gray-400 hover:text-gray-200 p-1"
                          title="Rename"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateProject(project);
                          }}
                          className="text-gray-400 hover:text-gray-200 p-1"
                          title="Duplicate"
                        >
                          <Copy size={14} />
                        </button>

                        {!project.archived ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveProject(project);
                            }}
                            className="text-yellow-400 hover:text-yellow-300 p-1"
                            title="Archive"
                          >
                            <Archive size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onUpdateProject) {
                                onUpdateProject({ ...project, archived: false });
                              }
                            }}
                            className="text-green-400 hover:text-green-300 p-1"
                            title="Restore"
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project);
                          }}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`file://${project.path}`, '_blank');
                          }}
                          className="text-gray-400 hover:text-gray-200 p-1"
                          title="Open in file explorer"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Create New Project</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="my-awesome-project"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>

                {selectedTemplate && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Selected Template</h4>
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{getProjectTypeIcon(selectedTemplate.type)}</span>
                      <div>
                        <div className="font-medium">{selectedTemplate.name}</div>
                        <div className="text-sm text-gray-400">{selectedTemplate.description}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      <div>Port: {selectedTemplate.port}</div>
                      <div>Dependencies: {selectedTemplate.dependencies.length + selectedTemplate.devDependencies.length}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Template Selection */}
              <div>
                <h4 className="font-medium mb-4">Choose Template</h4>
                <div className="max-h-96 overflow-y-auto">
                  <ProjectTemplates onSelectTemplate={handleSelectTemplate} />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6 border-t border-gray-700 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedTemplate(null);
                  setNewProjectName('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim() || !selectedTemplate}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-start space-x-4">
              <div className="bg-red-900/30 p-3 rounded-full">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">Delete Project</h3>
                <p className="text-gray-400 mb-4">
                  Are you sure you want to delete <span className="text-white font-medium">{projectToDelete?.name}</span>?
                  This action cannot be undone.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-400 hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteProject}
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