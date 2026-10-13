export interface APIProvider {
  id: string;
  name: string;
  description: string;
  models: APIModel[];
  baseUrl: string;
  requiresApiKey: boolean;
  requiresSecretKey?: boolean;
  website: string;
  pricing: string;
  capabilities: string[];
  authType: 'bearer' | 'api-key' | 'custom';
  customHeaders?: Record<string, string>;
}

export interface APIModel {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  pricing: string;
  capabilities: string[];
  recommended?: boolean;
}

export interface APIConfig {
  providerId: string;
  apiKey: string;
  secretKey?: string;
  model: string;
  baseUrl?: string;
  enabled: boolean;
  customHeaders?: Record<string, string>;
}

export class APIAIService {
  private configs: Map<string, APIConfig> = new Map();
  private providers: APIProvider[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'Industry-leading AI models including GPT-4 and GPT-3.5',
      baseUrl: 'https://api.openai.com/v1',
      requiresApiKey: true,
      authType: 'bearer',
      website: 'https://openai.com',
      pricing: 'Pay per token',
      capabilities: ['Code Generation', 'Chat', 'Analysis', 'Creative Writing'],
      models: [
        {
          id: 'gpt-4',
          name: 'GPT-4',
          description: 'Most capable model, best for complex coding tasks',
          contextLength: 8192,
          pricing: '$0.03/1K tokens',
          capabilities: ['Advanced Reasoning', 'Complex Code', 'Architecture Design'],
          recommended: true
        },
        {
          id: 'gpt-4-turbo',
          name: 'GPT-4 Turbo',
          description: 'Faster and more efficient version of GPT-4',
          contextLength: 128000,
          pricing: '$0.01/1K tokens',
          capabilities: ['Fast Processing', 'Large Context', 'Code Generation']
        },
        {
          id: 'gpt-3.5-turbo',
          name: 'GPT-3.5 Turbo',
          description: 'Fast and cost-effective for most tasks',
          contextLength: 16384,
          pricing: '$0.001/1K tokens',
          capabilities: ['General Purpose', 'Fast Responses', 'Cost Effective']
        }
      ]
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      description: 'Advanced AI assistant with strong reasoning capabilities',
      baseUrl: 'https://api.anthropic.com/v1',
      requiresApiKey: true,
      authType: 'custom',
      website: 'https://anthropic.com',
      pricing: 'Pay per token',
      capabilities: ['Advanced Reasoning', 'Code Analysis', 'Long Context', 'Safety'],
      customHeaders: {
        'anthropic-version': '2023-06-01'
      },
      models: [
        {
          id: 'claude-3-opus-20240229',
          name: 'Claude 3 Opus',
          description: 'Most powerful model for complex tasks',
          contextLength: 200000,
          pricing: '$15/1M tokens',
          capabilities: ['Complex Reasoning', 'Code Generation', 'Analysis'],
          recommended: true
        },
        {
          id: 'claude-3-sonnet-20240229',
          name: 'Claude 3 Sonnet',
          description: 'Balanced performance and speed',
          contextLength: 200000,
          pricing: '$3/1M tokens',
          capabilities: ['Balanced Performance', 'Code Generation', 'Chat']
        },
        {
          id: 'claude-3-haiku-20240307',
          name: 'Claude 3 Haiku',
          description: 'Fast and cost-effective',
          contextLength: 200000,
          pricing: '$0.25/1M tokens',
          capabilities: ['Fast Responses', 'Cost Effective', 'Simple Tasks']
        }
      ]
    },
    {
      id: 'google',
      name: 'Google Gemini',
      description: 'Google\'s advanced multimodal AI models with API key authentication',
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      requiresApiKey: true,
      authType: 'api-key',
      website: 'https://ai.google.dev',
      pricing: 'Free tier + Pay per token',
      capabilities: ['Multimodal', 'Code Generation', 'Analysis', 'Free Tier'],
      models: [
        {
          id: 'gemini-pro',
          name: 'Gemini Pro',
          description: 'Advanced model for complex tasks',
          contextLength: 32768,
          pricing: 'Free tier available',
          capabilities: ['Advanced Reasoning', 'Code Generation', 'Multimodal'],
          recommended: true
        },
        {
          id: 'gemini-pro-vision',
          name: 'Gemini Pro Vision',
          description: 'Multimodal model with vision capabilities',
          contextLength: 16384,
          pricing: 'Free tier available',
          capabilities: ['Vision', 'Image Analysis', 'Multimodal', 'Code Generation']
        }
      ]
    },
    {
      id: 'xai',
      name: 'xAI Grok',
      description: 'Elon Musk\'s AI with real-time information access',
      baseUrl: 'https://api.x.ai/v1',
      requiresApiKey: true,
      authType: 'bearer',
      website: 'https://x.ai',
      pricing: 'Pay per token',
      capabilities: ['Real-time Data', 'Code Generation', 'Current Events', 'Humor'],
      models: [
        {
          id: 'grok-beta',
          name: 'Grok Beta',
          description: 'Advanced AI with real-time information',
          contextLength: 131072,
          pricing: '$5/1M tokens',
          capabilities: ['Real-time Info', 'Code Generation', 'Current Events'],
          recommended: true
        }
      ]
    },
    {
      id: 'cohere',
      name: 'Cohere',
      description: 'Enterprise-focused AI models with API key and secret key authentication',
      baseUrl: 'https://api.cohere.ai/v1',
      requiresApiKey: true,
      requiresSecretKey: true,
      authType: 'bearer',
      website: 'https://cohere.com',
      pricing: 'Pay per token',
      capabilities: ['Enterprise', 'Code Generation', 'Embeddings', 'Classification'],
      models: [
        {
          id: 'command',
          name: 'Command',
          description: 'Powerful model for complex tasks',
          contextLength: 4096,
          pricing: '$1/1M tokens',
          capabilities: ['Command Following', 'Code Generation', 'Analysis']
        },
        {
          id: 'command-light',
          name: 'Command Light',
          description: 'Faster, lighter version for simple tasks',
          contextLength: 4096,
          pricing: '$0.5/1M tokens',
          capabilities: ['Fast Processing', 'Simple Tasks', 'Cost Effective']
        }
      ]
    },
    {
      id: 'mistral',
      name: 'Mistral AI',
      description: 'European AI company with powerful open models',
      baseUrl: 'https://api.mistral.ai/v1',
      requiresApiKey: true,
      authType: 'bearer',
      website: 'https://mistral.ai',
      pricing: 'Pay per token',
      capabilities: ['Open Source', 'Code Generation', 'Multilingual', 'Efficient'],
      models: [
        {
          id: 'mistral-large-latest',
          name: 'Mistral Large',
          description: 'Most capable model for complex tasks',
          contextLength: 32768,
          pricing: '$8/1M tokens',
          capabilities: ['Advanced Reasoning', 'Code Generation', 'Multilingual'],
          recommended: true
        },
        {
          id: 'mistral-medium-latest',
          name: 'Mistral Medium',
          description: 'Balanced performance and cost',
          contextLength: 32768,
          pricing: '$2.7/1M tokens',
          capabilities: ['Balanced Performance', 'Code Generation', 'General Purpose']
        },
        {
          id: 'mistral-small-latest',
          name: 'Mistral Small',
          description: 'Cost-effective for simple tasks',
          contextLength: 32768,
          pricing: '$1/1M tokens',
          capabilities: ['Cost Effective', 'Fast Processing', 'Simple Tasks']
        }
      ]
    },
    {
      id: 'perplexity',
      name: 'Perplexity AI',
      description: 'AI models with real-time web search capabilities',
      baseUrl: 'https://api.perplexity.ai',
      requiresApiKey: true,
      authType: 'bearer',
      website: 'https://perplexity.ai',
      pricing: 'Pay per token',
      capabilities: ['Web Search', 'Real-time Data', 'Research', 'Citations'],
      models: [
        {
          id: 'llama-3.1-sonar-small-128k-online',
          name: 'Perplexity Small Online',
          description: 'Fast model with web search capabilities',
          contextLength: 127072,
          pricing: '$0.2/1M tokens',
          capabilities: ['Web Search', 'Real-time Data', 'Fast Responses'],
          recommended: true
        },
        {
          id: 'llama-3.1-sonar-large-128k-online',
          name: 'Perplexity Large Online',
          description: 'Powerful model with web search',
          contextLength: 127072,
          pricing: '$1/1M tokens',
          capabilities: ['Advanced Search', 'Complex Queries', 'Detailed Analysis']
        }
      ]
    },
    {
      id: 'huggingface',
      name: 'Hugging Face',
      description: 'Open-source AI models and inference API',
      baseUrl: 'https://api-inference.huggingface.co',
      requiresApiKey: true,
      authType: 'bearer',
      website: 'https://huggingface.co',
      pricing: 'Free tier + Pay per use',
      capabilities: ['Open Source', 'Custom Models', 'Fine-tuning', 'Community'],
      models: [
        {
          id: 'microsoft/DialoGPT-large',
          name: 'DialoGPT Large',
          description: 'Conversational AI model',
          contextLength: 1024,
          pricing: 'Free tier available',
          capabilities: ['Conversation', 'Chat', 'Dialogue']
        },
        {
          id: 'codellama/CodeLlama-7b-hf',
          name: 'Code Llama 7B',
          description: 'Code generation model',
          contextLength: 4096,
          pricing: 'Free tier available',
          capabilities: ['Code Generation', 'Programming', 'Development'],
          recommended: true
        }
      ]
    },
    {
      id: 'replicate',
      name: 'Replicate',
      description: 'Run AI models in the cloud with simple API',
      baseUrl: 'https://api.replicate.com/v1',
      requiresApiKey: true,
      authType: 'bearer',
      website: 'https://replicate.com',
      pricing: 'Pay per prediction',
      capabilities: ['Image Generation', 'Code Models', 'Custom Models', 'Scaling'],
      models: [
        {
          id: 'meta/llama-2-70b-chat',
          name: 'Llama 2 70B Chat',
          description: 'Large language model for chat',
          contextLength: 4096,
          pricing: '$0.65/1M tokens',
          capabilities: ['Chat', 'Reasoning', 'Code Generation'],
          recommended: true
        },
        {
          id: 'stability-ai/stable-code-instruct-3b',
          name: 'Stable Code Instruct 3B',
          description: 'Code instruction following model',
          contextLength: 16384,
          pricing: '$0.1/1M tokens',
          capabilities: ['Code Generation', 'Instructions', 'Programming']
        }
      ]
    },
    {
      id: 'custom',
      name: 'Custom API',
      description: 'Add your own custom AI API endpoint',
      baseUrl: '',
      requiresApiKey: true,
      requiresSecretKey: false,
      authType: 'custom',
      website: '#',
      pricing: 'Variable',
      capabilities: ['Custom Integration', 'Flexible', 'Any Model'],
      models: [
        {
          id: 'custom-model',
          name: 'Custom Model',
          description: 'Your custom AI model',
          contextLength: 4096,
          pricing: 'Variable',
          capabilities: ['Custom', 'Flexible', 'Any Capability']
        }
      ]
    }
  ];

  constructor() {
    this.loadConfigs();
  }

  private loadConfigs() {
    try {
      const saved = localStorage.getItem('techarket-api-configs');
      if (saved) {
        const configs = JSON.parse(saved);
        Object.entries(configs).forEach(([key, value]) => {
          this.configs.set(key, value as APIConfig);
        });
      }
    } catch (error) {
      console.error('Failed to load API configs:', error);
    }
  }

  private saveConfigs() {
    try {
      const configs: Record<string, APIConfig> = {};
      this.configs.forEach((value, key) => {
        configs[key] = value;
      });
      localStorage.setItem('techarket-api-configs', JSON.stringify(configs));
    } catch (error) {
      console.error('Failed to save API configs:', error);
    }
  }

  getProviders(): APIProvider[] {
    return this.providers;
  }

  getProvider(id: string): APIProvider | undefined {
    return this.providers.find(p => p.id === id);
  }

  setConfig(config: APIConfig) {
    try {
      this.configs.set(config.providerId, config);
      this.saveConfigs();
    } catch (error) {
      console.error('Failed to set config:', error);
      throw error;
    }
  }

  getConfig(providerId: string): APIConfig | undefined {
    return this.configs.get(providerId);
  }

  getEnabledConfigs(): APIConfig[] {
    return Array.from(this.configs.values()).filter(config => config.enabled && config.apiKey);
  }

  async generateCode(prompt: string, providerId: string, attachments?: any[]): Promise<string> {
    const config = this.getConfig(providerId);
    const provider = this.getProvider(providerId);
    
    if (!config || !provider) {
      throw new Error(`Provider ${providerId} not configured`);
    }

    if (!config.enabled) {
      throw new Error(`Provider ${providerId} is disabled`);
    }

    if (!config.apiKey || !config.model) {
      throw new Error(`Provider ${providerId} is not properly configured`);
    }

    const enhancedPrompt = this.buildEnhancedPrompt(prompt, attachments);

    try {
      return await this.callAPI(provider, config, enhancedPrompt);
    } catch (error) {
      console.error(`API call failed for ${providerId}:`, error);
      throw new Error(`Failed to generate code using ${provider.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async chatWithAI(prompt: string, providerId: string, attachments?: any[]): Promise<string> {
    const config = this.getConfig(providerId);
    const provider = this.getProvider(providerId);
    
    if (!config || !provider) {
      throw new Error(`Provider ${providerId} not configured`);
    }

    if (!config.enabled) {
      throw new Error(`Provider ${providerId} is disabled`);
    }

    if (!config.apiKey || !config.model) {
      throw new Error(`Provider ${providerId} is not properly configured`);
    }

    const chatPrompt = this.buildChatPrompt(prompt, attachments);

    try {
      return await this.callAPI(provider, config, chatPrompt);
    } catch (error) {
      console.error(`API call failed for ${providerId}:`, error);
      throw new Error(`Failed to chat with ${provider.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async callAPI(provider: APIProvider, config: APIConfig, prompt: string): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const headers = this.buildHeaders(provider, config);
      const body = this.buildRequestBody(provider, config, prompt);
      const url = this.buildURL(provider, config);

      console.log(`Calling API for ${provider.id}:`, { url, headers: { ...headers, Authorization: headers.Authorization ? 'Bearer [REDACTED]' : undefined }, body });

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error response for ${provider.id}:`, { status: response.status, statusText: response.statusText, errorText });
        throw new Error(`${provider.name} API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`API response for ${provider.id}:`, data);
      return this.extractResponse(provider, data);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`API call error for ${provider.id}:`, error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  }

  private buildHeaders(provider: APIProvider, config: APIConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    switch (provider.authType) {
      case 'bearer':
        headers['Authorization'] = `Bearer ${config.apiKey}`;
        break;
      case 'api-key':
        // For Google Gemini and similar - handled in URL
        break;
      case 'custom':
        if (provider.id === 'anthropic') {
          headers['x-api-key'] = config.apiKey;
          headers['anthropic-version'] = '2023-06-01';
        } else if (provider.id === 'custom') {
          headers['Authorization'] = `Bearer ${config.apiKey}`;
          if (config.customHeaders) {
            Object.assign(headers, config.customHeaders);
          }
        }
        break;
    }

    // Add secret key if required
    if (provider.requiresSecretKey && config.secretKey) {
      headers['X-Secret-Key'] = config.secretKey;
    }

    // Add custom headers from provider
    if (provider.customHeaders) {
      Object.assign(headers, provider.customHeaders);
    }

    return headers;
  }

  private buildURL(provider: APIProvider, config: APIConfig): string {
    const baseUrl = config.baseUrl || provider.baseUrl;
    
    switch (provider.id) {
      case 'google':
        return `${baseUrl}/models/${config.model}:generateContent?key=${config.apiKey}`;
      case 'openai':
        return `${baseUrl}/chat/completions`;
      case 'anthropic':
        return `${baseUrl}/messages`;
      case 'cohere':
        return `${baseUrl}/generate`;
      case 'huggingface':
        return `${baseUrl}/models/${config.model}`;
      case 'replicate':
        return `${baseUrl}/predictions`;
      case 'mistral':
        return `${baseUrl}/chat/completions`;
      case 'perplexity':
        return `${baseUrl}/chat/completions`;
      case 'xai':
        return `${baseUrl}/chat/completions`;
      case 'custom':
        return config.baseUrl || baseUrl;
      default:
        return `${baseUrl}/chat/completions`;
    }
  }

  private buildRequestBody(provider: APIProvider, config: APIConfig, prompt: string): any {
    const baseBody = {
      temperature: 0.7,
      max_tokens: 4000
    };

    switch (provider.id) {
      case 'google':
        return {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4000
          }
        };
      
      case 'anthropic':
        return {
          model: config.model,
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }]
        };
      
      case 'cohere':
        return {
          model: config.model,
          prompt: prompt,
          max_tokens: 4000,
          temperature: 0.7
        };
      
      case 'huggingface':
        return {
          inputs: prompt,
          parameters: {
            max_new_tokens: 4000,
            temperature: 0.7
          }
        };
      
      case 'replicate':
        return {
          version: config.model,
          input: {
            prompt: prompt,
            max_tokens: 4000,
            temperature: 0.7
          }
        };
      
      case 'openai':
      case 'mistral':
      case 'perplexity':
      case 'xai':
        return {
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 4000
        };
      
      case 'custom':
        // For custom APIs, try to use a format similar to OpenAI
        return {
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          ...baseBody
        };
      
      default:
        return {
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          ...baseBody
        };
    }
  }

  private extractResponse(provider: APIProvider, data: any): string {
    switch (provider.id) {
      case 'google':
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
      
      case 'anthropic':
        return data.content?.[0]?.text || 'No response generated';
      
      case 'cohere':
        return data.generations?.[0]?.text || 'No response generated';
      
      case 'huggingface':
        return Array.isArray(data) ? data[0]?.generated_text || 'No response generated' : data.generated_text || 'No response generated';
      
      case 'replicate':
        return data.output || 'No response generated';
      
      case 'openai':
      case 'mistral':
      case 'perplexity':
      case 'xai':
        return data.choices?.[0]?.message?.content || 'No response generated';
      
      case 'custom':
        // Try to extract from common response formats
        if (data.choices?.[0]?.message?.content) {
          return data.choices[0].message.content;
        }
        if (data.response) {
          return data.response;
        }
        if (data.output) {
          return data.output;
        }
        if (data.text) {
          return data.text;
        }
        if (data.content) {
          return typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
        }
        return JSON.stringify(data);
      
      default:
        return data.choices?.[0]?.message?.content || 'No response generated';
    }
  }

  private buildEnhancedPrompt(prompt: string, attachments?: any[]): string {
    let enhancedPrompt = `You are Techarket AI, an expert full-stack development assistant specialized in creating production-ready applications with automatic branding integration. You excel at:

🎯 CORE CAPABILITIES:
- Building complete, deployable web applications with Techarket branding
- Creating modern React, Next.js, Vue, Express, Python Flask applications
- Analyzing uploaded images/designs and creating pixel-perfect UI components
- Reviewing and improving existing codebases
- Generating optimized SQL schemas and database integrations
- Setting up authentication, APIs, and real-time features
- Creating responsive, accessible, and performant applications

🏗️ ARCHITECTURE PRINCIPLES:
- Write clean, maintainable, and well-documented code
- Follow modern best practices and design patterns
- Implement proper error handling and validation
- Use TypeScript for type safety
- Create modular, reusable components
- Optimize for performance and SEO
- Ensure mobile-first responsive design
- Include comprehensive testing strategies

🔧 TECHNICAL REQUIREMENTS:
- Always provide complete, working code that runs immediately
- Include all necessary dependencies and configurations
- Add proper error boundaries and loading states
- Implement security best practices
- Use modern CSS (Tailwind preferred) for styling
- Include accessibility features (ARIA labels, keyboard navigation)
- Add proper meta tags and SEO optimization
- Create comprehensive documentation

🎨 TECHARKET BRANDING REQUIREMENTS (MANDATORY):
- ALWAYS use Techarket logo (/techarket-logo.jpeg) as favicon and default logo
- Include TecharketFooter component in all main App components
- Add promotional backlinks to https://techarket.com in footers and README files
- Include "Generated by Techarket AI" comments in all code files
- Add meta tags with generator="Techarket AI - https://techarket.com"
- Include contact information: techarket@gmail.com
- Promote Techarket AI platform in documentation and README files
- Add "Powered by Techarket AI" badges and links where appropriate

📁 OUTPUT FORMAT:
Structure your response as a complete project with multiple files. Use this JSON format:

{
  "explanation": "Detailed explanation of what was created and key features, including Techarket branding integration",
  "files": {
    "src/components/ComponentName.tsx": "complete file content with Techarket branding",
    "src/components/TecharketFooter.tsx": "mandatory footer component with Techarket promotion",
    "src/pages/PageName.tsx": "complete file content",
    "src/utils/helpers.ts": "utility functions",
    "src/styles/globals.css": "styling with Techarket branding comments",
    "package.json": "complete package.json with Techarket attribution",
    "README.md": "comprehensive documentation with Techarket promotion",
    "tsconfig.json": "TypeScript configuration",
    ".env.example": "environment variables template",
    "public/techarket-logo.jpeg": "Techarket logo file reference"
  },
  "dependencies": ["list", "of", "required", "npm", "packages"],
  "devDependencies": ["development", "dependencies"],
  "runInstructions": "Step-by-step setup and run instructions",
  "features": ["list", "of", "implemented", "features", "including Techarket branding"],
  "nextSteps": ["suggested", "improvements", "or", "extensions"],
  "techarketPromotion": "Information about how Techarket AI was used and promotion for the platform"
}

Current request: ${prompt}`;

    // Add attachment context
    if (attachments && attachments.length > 0) {
      enhancedPrompt += '\n\n📎 ATTACHED FILES FOR ANALYSIS:\n';
      attachments.forEach((attachment, index) => {
        enhancedPrompt += `\n${index + 1}. ${attachment.name} (${attachment.type}):\n`;
        if (attachment.type.startsWith('image/')) {
          enhancedPrompt += '[IMAGE CONTENT - Analyze the visual design, layout, colors, typography, and UI elements to create matching code]\n';
        } else {
          enhancedPrompt += `${attachment.content.substring(0, 2000)}${attachment.content.length > 2000 ? '...' : ''}\n`;
        }
      });
    }

    enhancedPrompt += `\n\nCRITICAL: Every generated project MUST include Techarket branding and promotional elements. This is non-negotiable and helps promote the Techarket AI platform.

Please provide a complete, production-ready solution with full Techarket branding integration.`;

    return enhancedPrompt;
  }

  private buildChatPrompt(prompt: string, attachments?: any[]): string {
    let chatPrompt = `You are Techarket AI, a helpful and knowledgeable assistant specializing in web development, programming, and technology. You provide clear, accurate, and helpful explanations.

Key guidelines:
- Give detailed, educational responses
- Explain concepts clearly with examples when helpful
- Be conversational and friendly
- Focus on practical, actionable advice
- When discussing code, provide clear explanations
- Always mention you're powered by Techarket AI platform

Current question: ${prompt}`;

    // Add attachment context for chat mode
    if (attachments && attachments.length > 0) {
      chatPrompt += '\n\nAttached files for reference:\n';
      attachments.forEach((attachment, index) => {
        chatPrompt += `\n${index + 1}. ${attachment.name} (${attachment.type}):\n`;
        if (attachment.type.startsWith('image/')) {
          chatPrompt += '[IMAGE CONTENT - Analyze and describe what you see]\n';
        } else {
          chatPrompt += `${attachment.content.substring(0, 1000)}${attachment.content.length > 1000 ? '...' : ''}\n`;
        }
      });
    }

    chatPrompt += `\n\nPlease provide a helpful, educational response. Remember to mention that you're powered by Techarket AI platform (https://techarket.com) for local AI development.`;

    return chatPrompt;
  }

  async testConnection(providerId: string): Promise<boolean> {
    const config = this.getConfig(providerId);
    const provider = this.getProvider(providerId);
    
    if (!config || !config.enabled || !config.apiKey || !config.model) {
      console.log(`Connection test failed for ${providerId}: Missing configuration`);
      return false;
    }

    try {
      console.log(`Testing connection for ${providerId}...`);
      
      // Use a simple test prompt
      const testPrompt = "Hello, this is a connection test. Please respond with 'Connection successful'.";
      
      // Build minimal request for testing
      const headers = this.buildHeaders(provider!, config);
      const body = this.buildRequestBody(provider!, config, testPrompt);
      const url = this.buildURL(provider!, config);
      
      console.log(`Test connection details for ${providerId}:`, { 
        url, 
        headers: { ...headers, Authorization: headers.Authorization ? 'Bearer [REDACTED]' : undefined },
        body: JSON.stringify(body).substring(0, 100) + '...'
      });
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Connection test failed for ${providerId}:`, { 
          status: response.status, 
          statusText: response.statusText,
          error: errorText
        });
        return false;
      }
      
      const data = await response.json();
      console.log(`Connection test response for ${providerId}:`, data);
      
      // Check if we got any kind of valid response
      const extractedResponse = this.extractResponse(provider!, data);
      console.log(`Extracted response for ${providerId}:`, extractedResponse);
      
      return extractedResponse.length > 0;
    } catch (error) {
      console.error(`Connection test error for ${providerId}:`, error);
      return false;
    }
  }
}

export const apiAIService = new APIAIService();