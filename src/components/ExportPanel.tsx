import React from 'react';
import { Download, Package, FileText, Code } from 'lucide-react';
import { ProjectStructure } from '../types';
import { ProjectService } from '../services/project';

interface ExportPanelProps {
  project: ProjectStructure;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ project }) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await ProjectService.exportProject(project, 'techarket-project');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const countFiles = (structure: ProjectStructure): number => {
    let count = 0;
    Object.values(structure).forEach(item => {
      if (item.type === 'file') {
        count++;
      } else {
        count += countFiles(item);
      }
    });
    return count;
  };

  const fileCount = countFiles(project);

  return (
    <div className="h-full bg-gray-900 text-gray-200">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold flex items-center">
          <Package size={16} className="mr-2" />
          Export Project
        </h3>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download size={24} />
          </div>
          <h4 className="text-lg font-medium mb-2">Download Your Project</h4>
          <p className="text-gray-400 text-sm">
            Export your generated website as a complete, ready-to-deploy project
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 space-y-3">
          <h5 className="font-medium">Project Stats</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <FileText size={16} className="text-blue-400" />
              <span>{fileCount} files</span>
            </div>
            <div className="flex items-center space-x-2">
              <Code size={16} className="text-green-400" />
              <span>React + TypeScript</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h5 className="font-medium">What's included:</h5>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Complete React project structure</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>TypeScript configuration</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Tailwind CSS setup</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Vite build configuration</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Package.json with dependencies</span>
            </li>
          </ul>
        </div>

        <button
          onClick={handleExport}
          disabled={isExporting || fileCount === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span>Download Project</span>
            </>
          )}
        </button>

        <div className="bg-gray-800 rounded-lg p-4">
          <h5 className="font-medium mb-2">Next Steps</h5>
          <ol className="text-sm text-gray-300 space-y-1">
            <li>1. Extract the downloaded ZIP file</li>
            <li>2. Run <code className="bg-gray-700 px-1 rounded">npm install</code></li>
            <li>3. Start development with <code className="bg-gray-700 px-1 rounded">npm run dev</code></li>
            <li>4. Build for production with <code className="bg-gray-700 px-1 rounded">npm run build</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
};