import { RunningProcess, TerminalOutput } from '../types';

export class TerminalService {
  private static processes: Map<string, RunningProcess> = new Map();
  private static outputs: TerminalOutput[] = [];
  private static listeners: ((outputs: TerminalOutput[]) => void)[] = [];

  static addOutput(output: TerminalOutput) {
    this.outputs.push(output);
    this.notifyListeners();
  }

  static clearOutputs() {
    this.outputs = [];
    this.notifyListeners();
  }

  static getOutputs(): TerminalOutput[] {
    return this.outputs;
  }

  static onOutputChange(listener: (outputs: TerminalOutput[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners() {
    this.listeners.forEach(listener => listener(this.outputs));
  }

  static async executeCommand(command: string, projectPath?: string): Promise<void> {
    const commandId = Date.now().toString();
    
    // Add command to output
    this.addOutput({
      id: commandId,
      type: 'command',
      content: command,
      timestamp: new Date()
    });

    try {
      // Simulate command execution for different types
      if (command.includes('npm install') || command.includes('yarn install')) {
        await this.simulateInstall(command);
      } else if (command.includes('npm run dev') || command.includes('yarn dev')) {
        await this.simulateDevServer(command, projectPath);
      } else if (command.includes('npm run build') || command.includes('yarn build')) {
        await this.simulateBuild(command);
      } else if (command.includes('python')) {
        await this.simulatePython(command, projectPath);
      } else {
        await this.simulateGenericCommand(command);
      }
    } catch (error) {
      this.addOutput({
        id: Date.now().toString(),
        type: 'error',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      });
    }
  }

  private static async simulateInstall(command: string): Promise<void> {
    const packages = ['react', 'typescript', 'vite', 'tailwindcss', 'lucide-react'];
    
    this.addOutput({
      id: Date.now().toString(),
      type: 'output',
      content: 'Installing dependencies...',
      timestamp: new Date()
    });

    for (let i = 0; i < packages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      this.addOutput({
        id: Date.now().toString(),
        type: 'output',
        content: `✓ ${packages[i]}`,
        timestamp: new Date()
      });
    }

    this.addOutput({
      id: Date.now().toString(),
      type: 'output',
      content: '\n✅ Dependencies installed successfully!',
      timestamp: new Date()
    });
  }

  private static async simulateDevServer(command: string, projectPath?: string): Promise<void> {
    const processId = Date.now().toString();
    const port = this.getPortFromCommand(command) || 3000;

    // Create running process
    const process: RunningProcess = {
      id: processId,
      name: 'Dev Server',
      command,
      port,
      status: 'running',
      projectPath: projectPath || ''
    };

    this.processes.set(processId, process);

    this.addOutput({
      id: Date.now().toString(),
      type: 'output',
      content: 'Starting development server...',
      timestamp: new Date()
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    this.addOutput({
      id: Date.now().toString(),
      type: 'output',
      content: `🚀 Server running at http://localhost:${port}`,
      timestamp: new Date()
    });

    this.addOutput({
      id: Date.now().toString(),
      type: 'output',
      content: '📦 Built in 1.2s',
      timestamp: new Date()
    });
  }

  private static async simulateBuild(command: string): Promise<void> {
    this.addOutput({
      id: Date.now().toString(),
      type: 'output',
      content: 'Building for production...',
      timestamp: new Date()
    });

    const steps = [
      'Analyzing bundle',
      'Optimizing assets',
      'Generating static files',
      'Compressing files'
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      this.addOutput({
        id: Date.now().toString(),
        type: 'output',
        content: `✓ ${step}`,
        timestamp: new Date()
      });
    }

    this.addOutput({
      id: Date.now().toString(),
      type: 'output',
      content: '\n🎉 Build completed successfully!\n📁 Output: dist/',
      timestamp: new Date()
    });
  }

  private static async simulatePython(command: string, projectPath?: string): Promise<void> {
    if (command.includes('app.py') || command.includes('main.py')) {
      const processId = Date.now().toString();
      const process: RunningProcess = {
        id: processId,
        name: 'Python Server',
        command,
        port: 5000,
        status: 'running',
        projectPath: projectPath || ''
      };

      this.processes.set(processId, process);

      this.addOutput({
        id: Date.now().toString(),
        type: 'output',
        content: '🐍 Starting Python server...',
        timestamp: new Date()
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      this.addOutput({
        id: Date.now().toString(),
        type: 'output',
        content: '* Running on http://127.0.0.1:5000\n* Debug mode: on',
        timestamp: new Date()
      });
    } else {
      await this.simulateGenericCommand(command);
    }
  }

  private static async simulateGenericCommand(command: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    this.addOutput({
      id: Date.now().toString(),
      type: 'output',
      content: `Command executed: ${command}`,
      timestamp: new Date()
    });
  }

  private static getPortFromCommand(command: string): number | null {
    const portMatch = command.match(/--port\s+(\d+)/);
    if (portMatch) return parseInt(portMatch[1]);
    
    if (command.includes('next')) return 3000;
    if (command.includes('vite')) return 5173;
    if (command.includes('python')) return 5000;
    
    return null;
  }

  static getRunningProcesses(): RunningProcess[] {
    return Array.from(this.processes.values());
  }

  static stopProcess(processId: string): void {
    const process = this.processes.get(processId);
    if (process) {
      process.status = 'stopped';
      this.addOutput({
        id: Date.now().toString(),
        type: 'output',
        content: `🛑 Stopped process: ${process.name}`,
        timestamp: new Date()
      });
    }
  }

  static async installDependencies(projectPath: string): Promise<void> {
    await this.executeCommand('npm install', projectPath);
  }
}