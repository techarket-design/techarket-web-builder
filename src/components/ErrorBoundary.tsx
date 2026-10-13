import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle size={24} className="text-red-400" />
                <h1 className="text-xl font-bold text-red-400">Something went wrong</h1>
              </div>
              
              <p className="text-gray-300 mb-4">
                Techarket encountered an unexpected error. This might be due to corrupted data or a bug in the application.
              </p>

              {this.state.error && (
                <div className="bg-gray-800 rounded p-4 mb-4">
                  <h3 className="font-medium text-red-400 mb-2 flex items-center">
                    <Bug size={16} className="mr-2" />
                    Error Details
                  </h3>
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={this.handleReset}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <RefreshCw size={16} />
                  <span>Try Again</span>
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Reload Page
                </button>
                
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Reset All Data
                </button>
              </div>

              <div className="mt-4 p-3 bg-gray-800 rounded text-sm text-gray-400">
                <p className="mb-2">
                  <strong>Troubleshooting tips:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Check if Ollama is running and accessible</li>
                  <li>Verify your project files are not corrupted</li>
                  <li>Try clearing browser cache and localStorage</li>
                  <li>Restart Ollama service if connection issues persist</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}