import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, Square, Trash2, Package, Server, Code } from 'lucide-react';
import { RunningProcess, TerminalOutput, LocalProject } from '../types';

interface TerminalPanelProps {
  currentProject: LocalProject | null;
  runningProcesses: RunningProcess[];
  terminalOutput: TerminalOutput[];
  onRunCommand: (command: string, projectPath?: string) => void;
  onStopProcess: (processId: string) => void;
  onClearTerminal: () => void;
  onInstallDependencies: (projectPath: string) => void;
  onRunProject: (project: LocalProject) => void;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  currentProject,
  runningProcesses,
  terminalOutput,
  onRunCommand,
  onStopProcess,
  onClearTerminal,
  onInstallDependencies,
  onRunProject
}) => {
  const [command, setCommand] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleSubmitCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      onRunCommand(command.trim(), currentProject?.path);
      setCommand('');
    }
  };

  const quickCommands = [
    { label: 'Install Dependencies', command: 'npm install', icon: Package },
    { label: 'Start Dev Server', command: 'npm run dev', icon: Play },
    { label: 'Build Project', command: 'npm run build', icon: Code },
    { label: 'Run Tests', command: 'npm test', icon: Terminal },
  ];

  const getProcessStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'stopped': return 'text-gray-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full bg-gray-900 text-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center">
            <Terminal size={16} className="mr-2" />
            Terminal & Process Manager
          </h3>
          <div className="flex space-x-2">
            {currentProject && (
              <>
                <button
                  onClick={() => onInstallDependencies(currentProject.path)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm flex items-center space-x-1"
                >
                  <Package size={14} />
                  <span>Install</span>
                </button>
                <button
                  onClick={() => onRunProject(currentProject)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm flex items-center space-x-1"
                >
                  <Play size={14} />
                  <span>Run</span>
                </button>
              </>
            )}
            <button
              onClick={onClearTerminal}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-sm flex items-center space-x-1"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Quick Commands */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {quickCommands.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.command}
                onClick={() => onRunCommand(cmd.command, currentProject?.path)}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded p-2 text-xs flex items-center space-x-1"
                disabled={!currentProject}
              >
                <Icon size={12} />
                <span>{cmd.label}</span>
              </button>
            );
          })}
        </div>

        {/* Running Processes */}
        {runningProcesses.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Running Processes</h4>
            <div className="space-y-2">
              {runningProcesses.map((process) => (
                <div
                  key={process.id}
                  className="flex items-center justify-between bg-gray-800 rounded p-2"
                >
                  <div className="flex items-center space-x-2">
                    <Server size={14} className={getProcessStatusColor(process.status)} />
                    <span className="text-sm font-medium">{process.name}</span>
                    <span className="text-xs text-gray-400">{process.command}</span>
                    {process.port && (
                      <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
                        :{process.port}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${getProcessStatusColor(process.status)}`}>
                      {process.status}
                    </span>
                    <button
                      onClick={() => onStopProcess(process.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Square size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="flex-1 p-4 font-mono text-sm overflow-y-auto bg-black"
      >
        {terminalOutput.length === 0 ? (
          <div className="text-gray-500 text-center mt-8">
            <Terminal size={48} className="mx-auto mb-4 opacity-50" />
            <p>Terminal ready. Run commands to see output here.</p>
            {currentProject && (
              <p className="text-xs mt-2">Working directory: {currentProject.path}</p>
            )}
          </div>
        ) : (
          terminalOutput.map((output) => (
            <div
              key={output.id}
              className={`mb-1 ${
                output.type === 'command'
                  ? 'text-green-400'
                  : output.type === 'error'
                  ? 'text-red-400'
                  : 'text-gray-300'
              }`}
            >
              {output.type === 'command' && <span className="text-blue-400">$ </span>}
              <span className="whitespace-pre-wrap">{output.content}</span>
            </div>
          ))
        )}
      </div>

      {/* Command Input */}
      <form onSubmit={handleSubmitCommand} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 font-mono">
              $
            </span>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command..."
              className="w-full bg-gray-800 border border-gray-600 rounded px-8 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!currentProject}
            />
          </div>
          <button
            type="submit"
            disabled={!command.trim() || !currentProject}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded font-medium"
          >
            Run
          </button>
        </div>
        {!currentProject && (
          <p className="text-xs text-gray-500 mt-2">
            Select or create a project to run commands
          </p>
        )}
      </form>
    </div>
  );
};