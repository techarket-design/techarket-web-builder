import React, { useState, useEffect } from 'react';
import { Github, GitBranch, GitCommit, GitPullRequest, Download, Upload, RefreshCw, Folder, File, Check, X, AlertCircle, Plus, Search, Star, Eye, GitFork } from 'lucide-react';
import { ProjectStructure, LocalProject } from '../types';

interface GitHubIntegrationProps {
  currentProject: LocalProject | null;
  onProjectUpdate: (project: ProjectStructure) => void;
  onCreateProject: (name: string, structure: ProjectStructure) => void;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  clone_url: string;
  default_branch: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  updated_at: string;
  private: boolean;
}

interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  content?: string;
  download_url?: string;
}

export const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({
  currentProject,
  onProjectUpdate,
  onCreateProject
}) => {
  const [githubToken, setGithubToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [repoFiles, setRepoFiles] = useState<GitHubFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'pull' | 'push' | 'browse'>('pull');
  const [commitMessage, setCommitMessage] = useState('');
  const [branchName, setBranchName] = useState('main');

  useEffect(() => {
    const savedToken = localStorage.getItem('github-token');
    if (savedToken) {
      setGithubToken(savedToken);
      setIsConnected(true);
      loadRepositories(savedToken);
    }
  }, []);

  const connectToGitHub = async () => {
    if (!githubToken.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        localStorage.setItem('github-token', githubToken);
        setIsConnected(true);
        await loadRepositories(githubToken);
      } else {
        throw new Error('Invalid GitHub token');
      }
    } catch (error) {
      console.error('GitHub connection failed:', error);
      alert('Failed to connect to GitHub. Please check your token.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRepositories = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const repos = await response.json();
        setRepositories(repos);
      }
    } catch (error) {
      console.error('Failed to load repositories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRepositoryFiles = async (repo: GitHubRepo, path: string = '') => {
    if (!githubToken) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo.full_name}/contents/${path}`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (response.ok) {
        const files = await response.json();
        setRepoFiles(Array.isArray(files) ? files : [files]);
      }
    } catch (error) {
      console.error('Failed to load repository files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadRepository = async (repo: GitHubRepo) => {
    if (!githubToken) return;

    setIsLoading(true);
    try {
      const projectStructure = await downloadRepoStructure(repo, '');
      onCreateProject(repo.name, projectStructure);
      alert(`Repository "${repo.name}" has been imported successfully!`);
    } catch (error) {
      console.error('Failed to download repository:', error);
      alert('Failed to download repository. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadRepoStructure = async (repo: GitHubRepo, path: string = ''): Promise<ProjectStructure> => {
    const response = await fetch(
      `https://api.github.com/repos/${repo.full_name}/contents/${path}`,
      {
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) throw new Error('Failed to fetch repository contents');

    const contents = await response.json();
    const structure: ProjectStructure = {};

    for (const item of Array.isArray(contents) ? contents : [contents]) {
      if (item.type === 'file') {
        // Download file content
        const fileResponse = await fetch(item.download_url);
        const content = await fileResponse.text();
        
        structure[item.name] = {
          type: 'file',
          content,
          language: getLanguageFromExtension(item.name)
        };
      } else if (item.type === 'dir') {
        // Recursively download directory
        structure[item.name] = await downloadRepoStructure(repo, item.path);
      }
    }

    return structure;
  };

  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'yml': 'yaml',
      'yaml': 'yaml'
    };
    return languageMap[ext || ''] || 'plaintext';
  };

  const pushToGitHub = async () => {
    if (!currentProject || !selectedRepo || !githubToken) return;

    setIsLoading(true);
    try {
      // This is a simplified push - in a real implementation, you'd need to:
      // 1. Get the current SHA of files
      // 2. Create/update files via GitHub API
      // 3. Handle conflicts and merges
      
      const filesToUpdate = await prepareFilesForPush(currentProject.structure);
      
      for (const file of filesToUpdate) {
        await updateFileOnGitHub(selectedRepo, file.path, file.content, commitMessage);
      }
      
      alert('Successfully pushed changes to GitHub!');
    } catch (error) {
      console.error('Failed to push to GitHub:', error);
      alert('Failed to push changes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const prepareFilesForPush = async (structure: ProjectStructure, basePath: string = ''): Promise<Array<{path: string, content: string}>> => {
    const files: Array<{path: string, content: string}> = [];
    
    for (const [name, item] of Object.entries(structure)) {
      const fullPath = basePath ? `${basePath}/${name}` : name;
      
      if (item.type === 'file') {
        files.push({
          path: fullPath,
          content: item.content
        });
      } else {
        const subFiles = await prepareFilesForPush(item, fullPath);
        files.push(...subFiles);
      }
    }
    
    return files;
  };

  const updateFileOnGitHub = async (repo: GitHubRepo, path: string, content: string, message: string) => {
    // Get current file SHA if it exists
    let sha: string | undefined;
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo.full_name}/contents/${path}`,
        {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (response.ok) {
        const fileData = await response.json();
        sha = fileData.sha;
      }
    } catch (error) {
      // File doesn't exist, will create new
    }

    // Update or create file
    const updateResponse = await fetch(
      `https://api.github.com/repos/${repo.full_name}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message || `Update ${path}`,
          content: btoa(content), // Base64 encode
          branch: branchName,
          ...(sha && { sha })
        })
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Failed to update ${path}`);
    }
  };

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isConnected) {
    return (
      <div className="h-full bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="max-w-md w-full p-6">
          <div className="text-center mb-6">
            <Github size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">Connect to GitHub</h3>
            <p className="text-gray-400 text-sm">
              Connect your GitHub account to pull repositories and push changes
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Create a token at GitHub Settings → Developer settings → Personal access tokens
              </p>
            </div>

            <button
              onClick={connectToGitHub}
              disabled={!githubToken.trim() || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-medium flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Github size={16} />
              )}
              <span>{isLoading ? 'Connecting...' : 'Connect to GitHub'}</span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700 rounded">
            <h4 className="font-medium mb-2 text-blue-300">Required Permissions:</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• repo (Full control of private repositories)</li>
              <li>• user (Read user profile data)</li>
              <li>• workflow (Update GitHub Action workflows)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 text-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center">
            <Github size={16} className="mr-2" />
            GitHub Integration
          </h3>
          <button
            onClick={() => {
              setIsConnected(false);
              setGithubToken('');
              localStorage.removeItem('github-token');
            }}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Disconnect
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          {[
            { id: 'pull', label: 'Pull Repos', icon: Download },
            { id: 'push', label: 'Push Changes', icon: Upload },
            { id: 'browse', label: 'Browse', icon: Folder }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'pull' && (
          <div className="h-full flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-700">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search repositories..."
                  className="w-full bg-gray-800 border border-gray-600 rounded pl-10 pr-4 py-2 text-sm"
                />
              </div>
            </div>

            {/* Repository List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw size={24} className="animate-spin text-blue-400" />
                </div>
              ) : (
                filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-200 mb-1">{repo.name}</h4>
                        <p className="text-sm text-gray-400 mb-2">{repo.description || 'No description'}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${
                              repo.language === 'JavaScript' ? 'bg-yellow-400' :
                              repo.language === 'TypeScript' ? 'bg-blue-400' :
                              repo.language === 'Python' ? 'bg-green-400' :
                              'bg-gray-400'
                            }`}></div>
                            <span>{repo.language || 'Unknown'}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Star size={12} />
                            <span>{repo.stargazers_count}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <GitFork size={12} />
                            <span>{repo.forks_count}</span>
                          </span>
                          <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRepo(repo);
                            loadRepositoryFiles(repo);
                          }}
                          className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Browse
                        </button>
                        <button
                          onClick={() => downloadRepository(repo)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                        >
                          <Download size={12} />
                          <span>Import</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'push' && (
          <div className="p-4 space-y-4">
            {currentProject ? (
              <>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Current Project: {currentProject.name}</h4>
                  <p className="text-sm text-gray-400">Ready to push changes to GitHub</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select Repository</label>
                  <select
                    value={selectedRepo?.id || ''}
                    onChange={(e) => {
                      const repo = repositories.find(r => r.id === parseInt(e.target.value));
                      setSelectedRepo(repo || null);
                    }}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
                  >
                    <option value="">Select a repository...</option>
                    {repositories.map((repo) => (
                      <option key={repo.id} value={repo.id}>{repo.full_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Branch</label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Commit Message</label>
                  <textarea
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="Update project files"
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 h-24 resize-none"
                  />
                </div>

                <button
                  onClick={pushToGitHub}
                  disabled={!selectedRepo || !commitMessage.trim() || isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-medium flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Upload size={16} />
                  )}
                  <span>{isLoading ? 'Pushing...' : 'Push to GitHub'}</span>
                </button>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <GitCommit size={48} className="mx-auto mb-4 opacity-50" />
                <p>No project selected. Create or open a project to push changes.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'browse' && selectedRepo && (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h4 className="font-medium">{selectedRepo.full_name}</h4>
              <p className="text-sm text-gray-400">{selectedRepo.description}</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw size={24} className="animate-spin text-blue-400" />
                </div>
              ) : (
                <div className="space-y-2">
                  {repoFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded"
                    >
                      {file.type === 'dir' ? (
                        <Folder size={16} className="text-blue-400" />
                      ) : (
                        <File size={16} className="text-gray-400" />
                      )}
                      <span className="text-sm">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};