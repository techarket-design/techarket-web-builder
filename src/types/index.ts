export interface ProjectStructure {
  [key: string]: ProjectFile | ProjectStructure;
}

export interface ProjectFile {
  type: 'file';
  content: string;
  language: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: FileAttachment[];
  mode?: 'chat' | 'action';
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string | ArrayBuffer;
  preview?: string;
}

export interface ComponentBlock {
  id: string;
  name: string;
  category: string;
  description: string;
  code: string;
  preview: string;
}

export interface SupabaseConfig {
  projectUrl: string;
  anonKey: string;
  serviceKey?: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface LocalProject {
  id: string;
  name: string;
  path: string;
  lastModified: Date;
  type: 'react' | 'next' | 'vue' | 'vanilla' | 'node' | 'express' | 'fastify' | 'python' | 'django' | 'flask' | 'other';
  structure: ProjectStructure;
  packageJson?: any;
  isRunning?: boolean;
  port?: number;
  dependencies?: string[];
  devDependencies?: string[];
  starred?: boolean;
  archived?: boolean;
}

export interface AppState {
  project: ProjectStructure;
  selectedFile: string | null;
  messages: AIMessage[];
  supabaseConfig: SupabaseConfig | null;
  firebaseConfig: FirebaseConfig | null;
  activeTab: 'chat' | 'code' | 'preview' | 'live-preview' | 'export' | 'database' | 'projects' | 'terminal' | 'github' | 'history' | 'prompts';
  localProjects: LocalProject[];
  currentProject: LocalProject | null;
  runningProcesses: RunningProcess[];
  terminalOutput: TerminalOutput[];
}

export interface DatabaseSchema {
  tables: DatabaseTable[];
}

export interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
  relationships: DatabaseRelationship[];
}

export interface DatabaseColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey?: string;
  defaultValue?: string;
}

export interface DatabaseRelationship {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  targetTable: string;
  foreignKey: string;
}

export interface RunningProcess {
  id: string;
  name: string;
  command: string;
  port?: number;
  status: 'running' | 'stopped' | 'error';
  pid?: number;
  projectPath: string;
}

export interface TerminalOutput {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
  projectId?: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  files: ProjectStructure;
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
  installCommand: string;
  runCommand: string;
  buildCommand?: string;
  port?: number;
}