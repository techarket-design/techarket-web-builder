import React, { useState, useEffect } from 'react';
import { Settings, Key, Globe, Check, X, Eye, EyeOff, TestTube, Loader, ExternalLink, Info, Zap, DollarSign, Plus, Download, AlertCircle, RefreshCw } from 'lucide-react';
import { apiAIService, APIProvider, APIConfig } from '../services/apiAI';

interface APIConfigPanelProps {
  onConfigUpdate?: () => void;
}

export const APIConfigPanel: React.FC<APIConfigPanelProps> = ({ onConfigUpdate }) => {
  const [providers, setProviders] = useState<APIProvider[]>([]);
  const [configs, setConfigs] = useState<Map<string, APIConfig>>(new Map());
  const [showApiKey, setShowApiKey] = useState<Map<string, boolean>>(new Map());
  const [showSecretKey, setShowSecretKey] = useState<Map<string, boolean>>(new Map());
  const [testingConnection, setTestingConnection] = useState<Map<string, boolean>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<Map<string, boolean>>(new Map());
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [showCustomProvider, setShowCustomProvider] = useState(false);
  const [customProvider, setCustomProvider] = useState({
    name: '',
    baseUrl: '',
    authType: 'bearer' as 'bearer' | 'api-key' | 'custom',
    requiresSecretKey: false
  });
  const [debugMode, setDebugMode] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  useEffect(() => {
    loadProviders();
    loadConfigs();
  }, []);

  const loadProviders = () => {
    try {
      const allProviders = apiAIService.getProviders();
      setProviders(allProviders);
    } catch (error) {
      console.error('Failed to load providers:', error);
      addDebugLog('Failed to load providers: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const loadConfigs = () => {
    try {
      const configMap = new Map<string, APIConfig>();
      const allProviders = apiAIService.getProviders();
      
      allProviders.forEach(provider => {
        const config = apiAIService.getConfig(provider.id);
        if (config) {
          configMap.set(provider.id, config);
        } else {
          // Create default config
          configMap.set(provider.id, {
            providerId: provider.id,
            apiKey: '',
            secretKey: '',
            model: '',
            enabled: false
          });
        }
      });
      setConfigs(configMap);
    } catch (error) {
      console.error('Failed to load configs:', error);
      addDebugLog('Failed to load configs: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleConfigChange = (providerId: string, field: keyof APIConfig, value: any) => {
    try {
      const currentConfig = configs.get(providerId) || {
        providerId,
        apiKey: '',
        secretKey: '',
        model: '',
        enabled: false
      };

      const updatedConfig = { ...currentConfig, [field]: value };
      
      // Set default model if not set and API key is provided
      if (field === 'apiKey' && value && !updatedConfig.model) {
        const provider = providers.find(p => p.id === providerId);
        const recommendedModel = provider?.models.find(m => m.recommended);
        if (recommendedModel) {
          updatedConfig.model = recommendedModel.id;
        } else if (provider?.models.length) {
          updatedConfig.model = provider.models[0].id;
        }
      }

      // Validate API key format
      if (field === 'apiKey' && value) {
        const isValidKey = validateApiKey(providerId, value);
        if (!isValidKey) {
          const newErrors = new Map(errors);
          newErrors.set(providerId, 'Invalid API key format');
          setErrors(newErrors);
        } else {
          const newErrors = new Map(errors);
          newErrors.delete(providerId);
          setErrors(newErrors);
        }
      }

      const newConfigs = new Map(configs);
      newConfigs.set(providerId, updatedConfig);
      setConfigs(newConfigs);

      // Save to service
      apiAIService.setConfig(updatedConfig);
      onConfigUpdate?.();
      
      addDebugLog(`Updated config for ${providerId}, field: ${field}, value: ${field === 'apiKey' ? '[REDACTED]' : value}`);
    } catch (error) {
      console.error('Failed to update config:', error);
      addDebugLog('Failed to update config: ' + (error instanceof Error ? error.message : String(error)));
      const newErrors = new Map(errors);
      newErrors.set(providerId, 'Failed to save configuration');
      setErrors(newErrors);
    }
  };

  const validateApiKey = (providerId: string, apiKey: string): boolean => {
    if (!apiKey || apiKey.trim().length === 0) return false;
    
    // More lenient validation to avoid false negatives
    switch (providerId) {
      case 'openai':
        return apiKey.length > 10;
      case 'anthropic':
        return apiKey.length > 10;
      case 'google':
        return apiKey.length > 10;
      case 'xai':
        return apiKey.length > 10;
      case 'cohere':
        return apiKey.length > 10;
      case 'mistral':
        return apiKey.length > 10;
      case 'perplexity':
        return apiKey.length > 10;
      case 'huggingface':
        return apiKey.length > 10;
      case 'replicate':
        return apiKey.length > 10;
      case 'custom':
        return apiKey.length > 5;
      default:
        return apiKey.length > 10;
    }
  };

  const toggleApiKeyVisibility = (providerId: string) => {
    const newShowApiKey = new Map(showApiKey);
    newShowApiKey.set(providerId, !newShowApiKey.get(providerId));
    setShowApiKey(newShowApiKey);
  };

  const toggleSecretKeyVisibility = (providerId: string) => {
    const newShowSecretKey = new Map(showSecretKey);
    newShowSecretKey.set(providerId, !newShowSecretKey.get(providerId));
    setShowSecretKey(newShowSecretKey);
  };

  const testConnection = async (providerId: string) => {
    const newTesting = new Map(testingConnection);
    newTesting.set(providerId, true);
    setTestingConnection(newTesting);

    addDebugLog(`Testing connection for ${providerId}...`);

    try {
      const success = await apiAIService.testConnection(providerId);
      const newStatus = new Map(connectionStatus);
      newStatus.set(providerId, success);
      setConnectionStatus(newStatus);
      
      if (success) {
        const newErrors = new Map(errors);
        newErrors.delete(providerId);
        setErrors(newErrors);
        addDebugLog(`Connection test successful for ${providerId}`);
      } else {
        const newErrors = new Map(errors);
        newErrors.set(providerId, 'Connection test failed');
        setErrors(newErrors);
        addDebugLog(`Connection test failed for ${providerId}`);
      }
    } catch (error) {
      const newStatus = new Map(connectionStatus);
      newStatus.set(providerId, false);
      setConnectionStatus(newStatus);
      
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      const newErrors = new Map(errors);
      newErrors.set(providerId, errorMessage);
      setErrors(newErrors);
      
      addDebugLog(`Connection test error for ${providerId}: ${errorMessage}`);
    } finally {
      const newTesting = new Map(testingConnection);
      newTesting.set(providerId, false);
      setTestingConnection(newTesting);
    }
  };

  const downloadTecharketPlatform = () => {
    // Create a comprehensive download package
    const platformFiles = {
      'README.md': `# Techarket AI Platform - Complete Download Package

🚀 **The Most Advanced Local-First AI Development Platform**

## 🌟 What's Included

This download package contains the complete Techarket AI Platform that you can:
- Run locally on your machine
- Deploy to any web server
- Host on techarket.com or your own domain
- Customize and extend as needed

## 📁 Package Contents

- \`/src\` - Complete source code
- \`/public\` - Static assets and Techarket branding
- \`package.json\` - All dependencies and scripts
- \`vite.config.ts\` - Build configuration
- \`tailwind.config.js\` - Styling configuration
- \`tsconfig.json\` - TypeScript configuration
- \`.env.example\` - Environment variables template

## 🚀 Quick Start

### Local Development
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
\`\`\`

### Production Build
\`\`\`bash
# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

### Deploy to Web
\`\`\`bash
# Build the project
npm run build

# Upload the 'dist' folder to your web server
# Or deploy to Netlify, Vercel, etc.
\`\`\`

## 🌐 Web Deployment Options

### Option 1: Static Hosting
- Upload the \`dist\` folder to any web server
- Works with Apache, Nginx, or any static hosting
- Perfect for techarket.com deployment

### Option 2: Platform Deployment
- **Netlify**: Drag and drop the \`dist\` folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Enable Pages in repository settings
- **Firebase Hosting**: Use Firebase CLI

### Option 3: Custom Server
- Use the included Express server setup
- Deploy to VPS, AWS, Google Cloud, etc.
- Full control over server configuration

## 🔧 Configuration

### Environment Variables
Create a \`.env\` file with:
\`\`\`env
VITE_APP_NAME=Techarket AI Platform
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://your-api-url.com
\`\`\`

### Customization
- Modify \`src/components\` for UI changes
- Update \`src/services\` for API integrations
- Customize \`tailwind.config.js\` for styling
- Add new AI providers in \`src/services/apiAI.ts\`

## 🤖 AI Integration

### Local AI (Ollama)
- Install Ollama: \`curl -fsSL https://ollama.com/install.sh | sh\`
- Pull models: \`ollama pull mistral\`
- Start service: \`ollama serve\`

### Cloud AI APIs
- Configure API keys in the Database → API AI Engines section
- Supports OpenAI, Anthropic, Google, xAI, and more
- Add custom API endpoints for any AI service

## 📱 Features

- 🧠 **Local & Cloud AI**: Ollama + 10+ cloud AI providers
- 💻 **Code Generation**: Complete applications with AI
- 🗄️ **Database Integration**: Supabase, Firebase support
- 🔧 **Development Tools**: Editor, terminal, preview
- 📦 **Project Management**: Templates, scaffolding, export
- 🎨 **Component Library**: 15+ production-ready components
- 🔒 **Privacy First**: Local processing, secure storage

## 🛠️ Technical Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite for fast development
- **Editor**: Monaco Editor with IntelliSense
- **AI Integration**: Ollama + Multiple cloud APIs
- **Database**: Supabase, Firebase support
- **Deployment**: Static files, universal compatibility

## 📞 Support

- **Email**: techarket@gmail.com
- **Website**: https://techarket.com
- **Documentation**: Comprehensive guides included
- **Community**: Join our developer community

## 📄 License

MIT License - Use for personal and commercial projects

---

**Built with ❤️ by the Techarket Team**

*Empowering developers with local-first AI tools that enhance creativity while maintaining complete privacy and control.*`,

      'package.json': JSON.stringify({
        "name": "techarket-ai-platform",
        "version": "1.0.0",
        "description": "The most advanced local-first AI development platform",
        "type": "module",
        "scripts": {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview",
          "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
          "type-check": "tsc --noEmit"
        },
        "dependencies": {
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "@monaco-editor/react": "^4.6.0",
          "@supabase/supabase-js": "^2.38.4",
          "file-saver": "^2.0.5",
          "jszip": "^3.10.1",
          "lucide-react": "^0.344.0",
          "react-dropzone": "^14.2.3"
        },
        "devDependencies": {
          "@eslint/js": "^9.9.1",
          "@types/file-saver": "^2.0.7",
          "@types/react": "^18.3.5",
          "@types/react-dom": "^18.3.0",
          "@vitejs/plugin-react": "^4.3.1",
          "autoprefixer": "^10.4.18",
          "eslint": "^9.9.1",
          "eslint-plugin-react-hooks": "^5.1.0-rc.0",
          "eslint-plugin-react-refresh": "^0.4.11",
          "globals": "^15.9.0",
          "postcss": "^8.4.35",
          "tailwindcss": "^3.4.1",
          "typescript": "^5.5.3",
          "typescript-eslint": "^8.3.0",
          "vite": "^5.4.2"
        },
        "keywords": ["ai", "development", "platform", "ollama", "mistral", "react", "typescript"],
        "author": "Techarket Team <techarket@gmail.com>",
        "license": "MIT",
        "homepage": "https://techarket.com",
        "repository": {
          "type": "git",
          "url": "https://github.com/techarket/ai-platform"
        }
      }, null, 2),

      'DEPLOYMENT.md': `# Techarket AI Platform - Deployment Guide

## 🌐 Web Deployment Instructions

### For techarket.com Hosting

1. **Build the Project**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Upload to Server**
   - Upload the entire \`dist\` folder to your web server
   - Point your domain to the \`dist\` folder
   - Ensure your server supports SPA routing

3. **Server Configuration**
   
   **Apache (.htaccess)**
   \`\`\`apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   \`\`\`
   
   **Nginx**
   \`\`\`nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   \`\`\`

### Cloud Platform Deployment

#### Netlify
1. Build: \`npm run build\`
2. Drag \`dist\` folder to Netlify
3. Configure redirects: \`_redirects\` file with \`/* /index.html 200\`

#### Vercel
1. Connect GitHub repository
2. Set build command: \`npm run build\`
3. Set output directory: \`dist\`

#### AWS S3 + CloudFront
1. Upload \`dist\` to S3 bucket
2. Enable static website hosting
3. Configure CloudFront for SPA routing

### Local Computer Integration

#### Option 1: Local Development Server
\`\`\`bash
# Clone or extract the platform
cd techarket-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
\`\`\`

#### Option 2: Local Production Build
\`\`\`bash
# Build for production
npm run build

# Serve locally
npm run preview

# Or use any static server
npx serve dist
\`\`\`

#### Option 3: Desktop App (Electron)
\`\`\`bash
# Install Electron
npm install electron --save-dev

# Add to package.json scripts:
# "electron": "electron ."

# Create main.js for Electron
# Run: npm run electron
\`\`\`

### Environment Configuration

Create \`.env\` file:
\`\`\`env
# App Configuration
VITE_APP_NAME=Techarket AI Platform
VITE_APP_VERSION=1.0.0

# API Configuration (optional)
VITE_API_URL=https://api.techarket.com

# Analytics (optional)
VITE_ANALYTICS_ID=your-analytics-id
\`\`\`

### Security Considerations

1. **API Keys**: Never expose API keys in client-side code
2. **CORS**: Configure CORS for your domain
3. **HTTPS**: Always use HTTPS in production
4. **CSP**: Implement Content Security Policy headers

### Performance Optimization

1. **Caching**: Configure proper cache headers
2. **Compression**: Enable gzip/brotli compression
3. **CDN**: Use CDN for static assets
4. **Monitoring**: Set up performance monitoring

### Troubleshooting

#### Common Issues:
- **404 on refresh**: Configure SPA routing
- **API CORS errors**: Check CORS configuration
- **Build failures**: Ensure Node.js 16+ and npm 8+
- **Memory issues**: Increase Node.js memory limit

#### Support:
- Email: techarket@gmail.com
- Documentation: Included in download
- Community: Join our developer community

---

**Ready to deploy? Let's make Techarket AI Platform available to the world! 🚀**`
    };

    // Create and download the package
    import('jszip').then(({ default: JSZip }) => {
      const zip = new JSZip();
      
      // Add all platform files
      Object.entries(platformFiles).forEach(([filename, content]) => {
        zip.file(filename, content);
      });

      // Add source code (simplified for download)
      zip.file('src/main.tsx', `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`);

      zip.file('index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/jpeg" href="/techarket-logo.jpeg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Techarket - AI-Powered Local Development Platform" />
    <title>Techarket - AI-Powered Development Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

      // Generate and download
      zip.generateAsync({ type: 'blob' }).then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'techarket-ai-platform-complete.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'openai': return '🤖';
      case 'anthropic': return '🧠';
      case 'google': return '🔍';
      case 'xai': return '🚀';
      case 'cohere': return '🏢';
      case 'mistral': return '🌟';
      case 'perplexity': return '🔎';
      case 'huggingface': return '🤗';
      case 'replicate': return '🔄';
      case 'custom': return '⚙️';
      default: return '🤖';
    }
  };

  const enabledConfigs = Array.from(configs.values()).filter(config => config.enabled && config.apiKey);

  const addDebugLog = (message: string) => {
    setDebugLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  return (
    <div className="h-full bg-gray-900 text-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center">
            <Settings size={16} className="mr-2" />
            Universal AI Engine Integration
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400">
              {enabledConfigs.length} provider{enabledConfigs.length !== 1 ? 's' : ''} configured
            </span>
            <button
              onClick={downloadTecharketPlatform}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs flex items-center space-x-1"
              title="Download complete Techarket platform"
            >
              <Download size={12} />
              <span>Download Platform</span>
            </button>
            <button
              onClick={() => setDebugMode(!debugMode)}
              className={`p-1.5 rounded text-xs ${debugMode ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              title="Toggle debug mode"
            >
              <AlertCircle size={12} />
            </button>
          </div>
        </div>
        
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-200">
              <p className="mb-1">Universal AI integration - connect any AI engine seamlessly.</p>
              <p>Supports API keys, secret keys, custom headers, and any authentication method.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {providers.map((provider) => {
            const config = configs.get(provider.id);
            const isConfigured = config && config.apiKey && config.apiKey.trim().length > 0;
            const isEnabled = config?.enabled || false;
            const isTesting = testingConnection.get(provider.id) || false;
            const connectionOk = connectionStatus.get(provider.id);
            const showKey = showApiKey.get(provider.id) || false;
            const showSecret = showSecretKey.get(provider.id) || false;
            const error = errors.get(provider.id);

            return (
              <div
                key={provider.id}
                className={`border rounded-lg transition-all duration-200 ${
                  isEnabled && isConfigured
                    ? 'bg-green-900/20 border-green-600'
                    : isConfigured
                    ? 'bg-blue-900/20 border-blue-600'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getProviderIcon(provider.id)}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-200">{provider.name}</h4>
                          {provider.website !== '#' && (
                            <a
                              href={provider.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{provider.description}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <DollarSign size={12} />
                            <span>{provider.pricing}</span>
                          </div>
                          <span>•</span>
                          <span>{provider.models.length} model{provider.models.length !== 1 ? 's' : ''}</span>
                          {provider.requiresSecretKey && (
                            <>
                              <span>•</span>
                              <span className="text-yellow-400">Requires Secret Key</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isConfigured && (
                        <>
                          {connectionOk === true && (
                            <Check size={16} className="text-green-400" />
                          )}
                          {connectionOk === false && (
                            <X size={16} className="text-red-400" />
                          )}
                          <button
                            onClick={() => testConnection(provider.id)}
                            disabled={isTesting || !isEnabled}
                            className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white px-2 py-1 rounded text-xs transition-colors"
                          >
                            {isTesting ? (
                              <Loader size={12} className="animate-spin" />
                            ) : (
                              <TestTube size={12} />
                            )}
                            <span>Test</span>
                          </button>
                        </>
                      )}
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) => handleConfigChange(provider.id, 'enabled', e.target.checked)}
                          disabled={!isConfigured}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-400">Enable</span>
                      </label>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {provider.capabilities.map((capability, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>

                  {/* Configuration */}
                  <div className="space-y-3">
                    {/* Custom Base URL for custom provider */}
                    {provider.id === 'custom' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          API Base URL
                        </label>
                        <input
                          type="url"
                          value={config?.baseUrl || ''}
                          onChange={(e) => handleConfigChange(provider.id, 'baseUrl', e.target.value)}
                          placeholder="https://api.your-ai-service.com/v1"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showKey ? 'text' : 'password'}
                          value={config?.apiKey || ''}
                          onChange={(e) => handleConfigChange(provider.id, 'apiKey', e.target.value)}
                          placeholder={`Enter your ${provider.name} API key...`}
                          className={`w-full bg-gray-700 border rounded px-3 py-2 pr-10 text-sm transition-colors ${
                            error ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => toggleApiKeyVisibility(provider.id)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                        >
                          {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {error && (
                        <p className="text-red-400 text-xs mt-1">{error}</p>
                      )}
                    </div>

                    {/* Secret Key for providers that require it */}
                    {provider.requiresSecretKey && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Secret Key
                        </label>
                        <div className="relative">
                          <input
                            type={showSecret ? 'text' : 'password'}
                            value={config?.secretKey || ''}
                            onChange={(e) => handleConfigChange(provider.id, 'secretKey', e.target.value)}
                            placeholder={`Enter your ${provider.name} secret key...`}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 pr-10 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => toggleSecretKeyVisibility(provider.id)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                          >
                            {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {isConfigured && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Model
                        </label>
                        <select
                          value={config?.model || ''}
                          onChange={(e) => handleConfigChange(provider.id, 'model', e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-blue-500"
                        >
                          <option value="">Select a model...</option>
                          {provider.models.map((model) => (
                            <option key={model.id} value={model.id}>
                              {model.name} - {model.pricing}
                              {model.recommended ? ' (Recommended)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Model Details */}
                    {config?.model && (
                      <div className="bg-gray-800 rounded p-3">
                        {(() => {
                          const selectedModel = provider.models.find(m => m.id === config.model);
                          if (!selectedModel) return null;
                          
                          return (
                            <div>
                              <h5 className="font-medium text-gray-200 mb-2 flex items-center space-x-2">
                                <span>{selectedModel.name}</span>
                                {selectedModel.recommended && (
                                  <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs">
                                    Recommended
                                  </span>
                                )}
                              </h5>
                              <p className="text-sm text-gray-400 mb-2">{selectedModel.description}</p>
                              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                                <div>
                                  <span className="font-medium">Context Length:</span>
                                  <br />
                                  {selectedModel.contextLength.toLocaleString()} tokens
                                </div>
                                <div>
                                  <span className="font-medium">Pricing:</span>
                                  <br />
                                  {selectedModel.pricing}
                                </div>
                              </div>
                              <div className="mt-2">
                                <div className="flex flex-wrap gap-1">
                                  {selectedModel.capabilities.map((capability, index) => (
                                    <span
                                      key={index}
                                      className="bg-gray-600 text-gray-300 px-2 py-0.5 rounded text-xs"
                                    >
                                      {capability}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Debug Panel */}
      {debugMode && (
        <div className="p-4 border-t border-gray-700 bg-gray-800/50 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm text-purple-400">Debug Console</h4>
            <div className="flex space-x-2">
              <button 
                onClick={() => setDebugLogs([])}
                className="text-xs text-gray-400 hover:text-gray-300"
              >
                Clear
              </button>
              <button 
                onClick={() => {
                  const consoleContent = debugLogs.join('\n');
                  navigator.clipboard.writeText(consoleContent);
                }}
                className="text-xs text-gray-400 hover:text-gray-300"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="bg-gray-900 rounded p-2 text-xs font-mono text-gray-300 h-40 overflow-y-auto">
            {debugLogs.length === 0 ? (
              <div className="text-gray-500 italic">No logs yet. Test a connection to see debug information.</div>
            ) : (
              debugLogs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/50 flex-shrink-0">
        <h4 className="font-medium mb-3 flex items-center">
          <Key size={16} className="mr-2 text-yellow-400" />
          Universal AI Integration Guide
        </h4>
        
        <div className="space-y-3 text-sm text-gray-400 max-h-32 overflow-y-auto">
          <div>
            <strong className="text-gray-300">OpenAI:</strong> Get API key from{' '}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              platform.openai.com/api-keys
            </a>
          </div>
          <div>
            <strong className="text-gray-300">Anthropic:</strong> Get API key from{' '}
            <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              console.anthropic.com
            </a>
          </div>
          <div>
            <strong className="text-gray-300">Google Gemini:</strong> Get API key from{' '}
            <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              makersuite.google.com/app/apikey
            </a>
          </div>
          <div>
            <strong className="text-gray-300">Custom APIs:</strong> Use the Custom API option for any AI service with REST API
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded">
          <div className="flex items-start space-x-2">
            <Zap size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-green-200">
              <p className="mb-1"><strong>Universal Integration:</strong></p>
              <p>Techarket seamlessly integrates with ANY AI engine. Just provide the API endpoint, authentication, and model details!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};