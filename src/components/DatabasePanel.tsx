import React, { useState } from 'react';
import { Database, Plus, Table, Code, Save, Trash2, Key, Link } from 'lucide-react';
import { SupabaseConfig, FirebaseConfig, DatabaseSchema, DatabaseTable, DatabaseColumn } from '../types';

interface DatabasePanelProps {
  supabaseConfig: SupabaseConfig | null;
  firebaseConfig: FirebaseConfig | null;
  onSupabaseConfigUpdate: (config: SupabaseConfig) => void;
  onFirebaseConfigUpdate: (config: FirebaseConfig) => void;
  onGenerateSQL: (prompt: string, provider: 'supabase' | 'firebase') => void;
}

export const DatabasePanel: React.FC<DatabasePanelProps> = ({
  supabaseConfig,
  firebaseConfig,
  onSupabaseConfigUpdate,
  onFirebaseConfigUpdate,
  onGenerateSQL
}) => {
  const [activeProvider, setActiveProvider] = useState<'supabase' | 'firebase'>('supabase');
  const [schema, setSchema] = useState<DatabaseSchema>({ tables: [] });
  const [sqlPrompt, setSqlPrompt] = useState('');
  const [newTable, setNewTable] = useState<Partial<DatabaseTable>>({ name: '', columns: [], relationships: [] });
  const [showTableBuilder, setShowTableBuilder] = useState(false);

  // Supabase Config
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseConfig?.projectUrl || '');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(supabaseConfig?.anonKey || '');
  const [supabaseServiceKey, setSupabaseServiceKey] = useState(supabaseConfig?.serviceKey || '');

  // Firebase Config
  const [firebaseApiKey, setFirebaseApiKey] = useState(firebaseConfig?.apiKey || '');
  const [firebaseAuthDomain, setFirebaseAuthDomain] = useState(firebaseConfig?.authDomain || '');
  const [firebaseProjectId, setFirebaseProjectId] = useState(firebaseConfig?.projectId || '');

  const handleSaveSupabase = () => {
    if (supabaseUrl && supabaseAnonKey) {
      onSupabaseConfigUpdate({
        projectUrl: supabaseUrl,
        anonKey: supabaseAnonKey,
        serviceKey: supabaseServiceKey || undefined
      });
    }
  };

  const handleSaveFirebase = () => {
    if (firebaseApiKey && firebaseAuthDomain && firebaseProjectId) {
      onFirebaseConfigUpdate({
        apiKey: firebaseApiKey,
        authDomain: firebaseAuthDomain,
        projectId: firebaseProjectId,
        storageBucket: `${firebaseProjectId}.appspot.com`,
        messagingSenderId: '',
        appId: ''
      });
    }
  };

  const addColumn = () => {
    setNewTable(prev => ({
      ...prev,
      columns: [
        ...(prev.columns || []),
        { name: '', type: 'text', nullable: true, primaryKey: false }
      ]
    }));
  };

  const updateColumn = (index: number, field: keyof DatabaseColumn, value: any) => {
    setNewTable(prev => ({
      ...prev,
      columns: prev.columns?.map((col, i) => 
        i === index ? { ...col, [field]: value } : col
      ) || []
    }));
  };

  const removeColumn = (index: number) => {
    setNewTable(prev => ({
      ...prev,
      columns: prev.columns?.filter((_, i) => i !== index) || []
    }));
  };

  const saveTable = () => {
    if (newTable.name && newTable.columns?.length) {
      setSchema(prev => ({
        tables: [...prev.tables, newTable as DatabaseTable]
      }));
      setNewTable({ name: '', columns: [], relationships: [] });
      setShowTableBuilder(false);
    }
  };

  const sqlExamples = [
    "Create a users table with authentication fields",
    "Add a posts table with user relationships and timestamps",
    "Create an e-commerce schema with products, orders, and customers",
    "Build a blog schema with categories, tags, and comments",
    "Design a social media database with users, posts, and follows"
  ];

  return (
    <div className="h-full bg-gray-900 text-gray-200">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-sm font-semibold flex items-center">
          <Database size={16} className="mr-2" />
          Database Management
        </h3>
      </div>

      <div className="flex h-full">
        {/* Provider Selection */}
        <div className="w-64 border-r border-gray-700 p-4">
          <div className="space-y-2 mb-6">
            <button
              onClick={() => setActiveProvider('supabase')}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                activeProvider === 'supabase' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="font-medium">Supabase</div>
              <div className="text-xs opacity-70">PostgreSQL + Auth</div>
            </button>
            <button
              onClick={() => setActiveProvider('firebase')}
              className={`w-full p-3 rounded-lg text-left transition-colors ${
                activeProvider === 'firebase' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <div className="font-medium">Firebase</div>
              <div className="text-xs opacity-70">NoSQL + Realtime</div>
            </button>
          </div>

          {/* Schema Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Schema</h4>
              <button
                onClick={() => setShowTableBuilder(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="space-y-2">
              {schema.tables.map((table, index) => (
                <div key={index} className="bg-gray-800 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Table size={14} className="text-blue-400" />
                      <span className="font-medium">{table.name}</span>
                    </div>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">
                    {table.columns.length} columns
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Configuration */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-4">
              {activeProvider === 'supabase' ? 'Supabase' : 'Firebase'} Configuration
            </h4>
            
            {activeProvider === 'supabase' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project URL</label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://your-project.supabase.co"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Anonymous Key</label>
                  <input
                    type="password"
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Service Key (Optional)</label>
                  <input
                    type="password"
                    value={supabaseServiceKey}
                    onChange={(e) => setSupabaseServiceKey(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
                <button
                  onClick={handleSaveSupabase}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Save Configuration</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <input
                    type="password"
                    value={firebaseApiKey}
                    onChange={(e) => setFirebaseApiKey(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Auth Domain</label>
                  <input
                    type="text"
                    value={firebaseAuthDomain}
                    onChange={(e) => setFirebaseAuthDomain(e.target.value)}
                    placeholder="your-project.firebaseapp.com"
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Project ID</label>
                  <input
                    type="text"
                    value={firebaseProjectId}
                    onChange={(e) => setFirebaseProjectId(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  />
                </div>
                <button
                  onClick={handleSaveFirebase}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>Save Configuration</span>
                </button>
              </div>
            )}
          </div>

          {/* AI SQL Generator */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium mb-4 flex items-center">
              <Code size={16} className="mr-2" />
              AI SQL Generator
            </h4>
            
            <div className="space-y-4">
              <textarea
                value={sqlPrompt}
                onChange={(e) => setSqlPrompt(e.target.value)}
                placeholder="Describe your database needs..."
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 h-24 resize-none"
              />
              
              <button
                onClick={() => onGenerateSQL(sqlPrompt, activeProvider)}
                disabled={!sqlPrompt.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center space-x-2"
              >
                <Database size={16} />
                <span>Generate SQL</span>
              </button>
            </div>

            <div className="mt-4">
              <h5 className="text-sm font-medium mb-2">Quick Examples:</h5>
              <div className="space-y-1">
                {sqlExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setSqlPrompt(example)}
                    className="block w-full text-left text-sm text-gray-400 hover:text-gray-200 p-2 rounded hover:bg-gray-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Builder Modal */}
      {showTableBuilder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-medium mb-4">Create Table</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Table Name</label>
                <input
                  type="text"
                  value={newTable.name || ''}
                  onChange={(e) => setNewTable(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Columns</label>
                  <button
                    onClick={addColumn}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Column
                  </button>
                </div>
                
                <div className="space-y-2">
                  {newTable.columns?.map((column, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-gray-700 p-2 rounded">
                      <input
                        type="text"
                        placeholder="Column name"
                        value={column.name}
                        onChange={(e) => updateColumn(index, 'name', e.target.value)}
                        className="flex-1 bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm"
                      />
                      <select
                        value={column.type}
                        onChange={(e) => updateColumn(index, 'type', e.target.value)}
                        className="bg-gray-600 border border-gray-500 rounded px-2 py-1 text-sm"
                      >
                        <option value="text">Text</option>
                        <option value="integer">Integer</option>
                        <option value="boolean">Boolean</option>
                        <option value="timestamp">Timestamp</option>
                        <option value="uuid">UUID</option>
                      </select>
                      <label className="flex items-center space-x-1 text-sm">
                        <input
                          type="checkbox"
                          checked={column.primaryKey}
                          onChange={(e) => updateColumn(index, 'primaryKey', e.target.checked)}
                        />
                        <Key size={12} />
                      </label>
                      <button
                        onClick={() => removeColumn(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowTableBuilder(false)}
                  className="px-4 py-2 text-gray-400 hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTable}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Create Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};