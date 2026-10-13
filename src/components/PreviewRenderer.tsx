import React, { useEffect, useRef } from 'react';
import { ProjectStructure, ProjectFile } from '../types';

interface PreviewRendererProps {
  project: ProjectStructure;
}

export const PreviewRenderer: React.FC<PreviewRendererProps> = ({ project }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generatePreviewHTML = (project: ProjectStructure): string => {
    let html = '';
    let css = '';
    let js = '';

    const processStructure = (structure: ProjectStructure | ProjectFile, path: string = '') => {
      if (structure.type === 'file') {
        const file = structure as ProjectFile;
        if (file.language === 'html' || path.endsWith('.html')) {
          html += file.content + '\n';
        } else if (file.language === 'css' || path.endsWith('.css')) {
          css += file.content + '\n';
        } else if (file.language === 'javascript' || file.language === 'typescript') {
          // Convert JSX/TSX to basic HTML for preview
          if (file.content.includes('function App')) {
            const componentMatch = file.content.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
            if (componentMatch) {
              let jsx = componentMatch[1];
              // Basic JSX to HTML conversion
              jsx = jsx
                .replace(/className=/g, 'class=')
                .replace(/\{[^}]*\}/g, '')
                .replace(/<(\w+)([^>]*?)\/>/g, '<$1$2></$1>');
              html += jsx;
            }
          }
        }
      } else {
        Object.entries(structure).forEach(([key, value]) => {
          processStructure(value, `${path}/${key}`);
        });
      }
    };

    processStructure(project);

    // If no HTML found, create a basic structure
    if (!html.trim()) {
      html = `
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">Preview</h1>
            <p class="text-lg text-gray-600">Your generated website will appear here</p>
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
          <title>Preview</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
  };

  useEffect(() => {
    if (iframeRef.current) {
      const previewHTML = generatePreviewHTML(project);
      const blob = new Blob([previewHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [project]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-200">Live Preview</h3>
      </div>
      <div className="flex-1 p-4">
        <iframe
          ref={iframeRef}
          className="w-full h-full rounded-lg border border-gray-700 bg-white"
          title="Website Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};