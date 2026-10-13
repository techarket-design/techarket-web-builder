export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
}

export interface OllamaResponse {
  response: string;
  done: boolean;
}

export interface GenerationProgress {
  stage: 'analyzing' | 'generating' | 'structuring' | 'optimizing' | 'finalizing';
  progress: number;
  currentFile?: string;
  totalFiles?: number;
  completedFiles?: number;
}

export interface OllamaModel {
  name: string;
  displayName: string;
  description: string;
  size: string;
  capabilities: string[];
  recommended?: boolean;
  installed?: boolean;
  pulling?: boolean;
}

export class OllamaService {
  private baseUrl = 'http://localhost:11434';
  private model = 'mistral';
  private progressCallback?: (progress: GenerationProgress) => void;
  private streamCallback?: (chunk: string) => void;
  private availableModels: OllamaModel[] = [];

  // Predefined model configurations
  private modelConfigs: OllamaModel[] = [
    {
      name: 'mistral',
      displayName: 'Mistral 7B',
      description: 'Excellent for code generation and web development. Fast and efficient.',
      size: '4.1GB',
      capabilities: ['Code Generation', 'Web Development', 'General Chat', 'Problem Solving'],
      recommended: true
    },
    {
      name: 'codellama',
      displayName: 'Code Llama 7B',
      description: 'Specialized for code generation and programming tasks.',
      size: '3.8GB',
      capabilities: ['Code Generation', 'Code Completion', 'Debugging', 'Code Explanation']
    },
    {
      name: 'llama2',
      displayName: 'Llama 2 7B',
      description: 'General-purpose model good for conversations and explanations.',
      size: '3.8GB',
      capabilities: ['General Chat', 'Explanations', 'Writing', 'Analysis']
    },
    {
      name: 'llama2:13b',
      displayName: 'Llama 2 13B',
      description: 'Larger model with better reasoning capabilities.',
      size: '7.3GB',
      capabilities: ['Advanced Reasoning', 'Complex Tasks', 'Detailed Explanations']
    },
    {
      name: 'neural-chat',
      displayName: 'Neural Chat 7B',
      description: 'Optimized for conversational AI and helpful responses.',
      size: '4.1GB',
      capabilities: ['Conversations', 'Help & Support', 'Q&A', 'Explanations']
    },
    {
      name: 'deepseek-coder',
      displayName: 'DeepSeek Coder 6.7B',
      description: 'Advanced coding model with excellent programming capabilities.',
      size: '3.8GB',
      capabilities: ['Advanced Coding', 'Code Review', 'Architecture Design', 'Best Practices']
    },
    {
      name: 'phi',
      displayName: 'Phi 2.7B',
      description: 'Small but powerful model, great for quick responses.',
      size: '1.7GB',
      capabilities: ['Quick Responses', 'Basic Coding', 'General Chat']
    },
    {
      name: 'gemma',
      displayName: 'Gemma 7B',
      description: 'Google\'s efficient model for various tasks.',
      size: '5.0GB',
      capabilities: ['Code Generation', 'Analysis', 'Problem Solving', 'Explanations']
    }
  ];

  constructor() {
    this.loadSavedModel();
  }

  private loadSavedModel() {
    const savedModel = localStorage.getItem('techarket-selected-model');
    if (savedModel) {
      this.model = savedModel;
    }
  }

  setModel(modelName: string) {
    this.model = modelName;
    localStorage.setItem('techarket-selected-model', modelName);
  }

  getCurrentModel(): string {
    return this.model;
  }

  getModelConfigs(): OllamaModel[] {
    return this.modelConfigs;
  }

  setProgressCallback(callback: (progress: GenerationProgress) => void) {
    this.progressCallback = callback;
  }

  setStreamCallback(callback: (chunk: string) => void) {
    this.streamCallback = callback;
  }

  // Enhanced prompt optimization for maximum performance
  private optimizePrompt(prompt: string): string {
    // Break down complex prompts into manageable chunks
    const maxChunkSize = 2000;
    if (prompt.length <= maxChunkSize) {
      return prompt;
    }

    // Intelligent prompt chunking and reassembly
    const chunks = this.intelligentChunkPrompt(prompt, maxChunkSize);
    return this.reassembleOptimizedPrompt(chunks);
  }

  private intelligentChunkPrompt(prompt: string, maxSize: number): string[] {
    const chunks: string[] = [];
    const sentences = prompt.split(/[.!?]+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > maxSize && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += sentence + '.';
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  private reassembleOptimizedPrompt(chunks: string[]): string {
    // Prioritize most important chunks and create optimized prompt
    const coreInstructions = chunks[0];
    const contextualInfo = chunks.slice(1).join(' ');
    
    return `${coreInstructions}\n\nContext: ${contextualInfo.substring(0, 1000)}...`;
  }

  async generateCode(prompt: string, attachments?: any[]): Promise<string> {
    try {
      // Optimize prompt for maximum performance
      let enhancedPrompt = this.optimizePrompt(this.buildEnhancedPrompt(prompt, attachments));

      // Advanced progress simulation with realistic timing
      await this.simulateAdvancedProgress();

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: enhancedPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
            num_predict: 8192, // Increased for better output
            repeat_penalty: 1.1,
            stop: ['</project>', '</end>']
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data: OllamaResponse = await response.json();
      
      // Final progress update
      this.progressCallback?.({
        stage: 'finalizing',
        progress: 100,
        currentFile: 'Project complete!'
      });

      // Post-process response for better quality
      return this.postProcessResponse(data.response);
    } catch (error) {
      console.error('Failed to connect to Ollama:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to Ollama. Please ensure Ollama is running on http://localhost:11434 with ${this.model} model installed.`);
      }
      throw new Error(`Ollama error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private postProcessResponse(response: string): string {
    // Clean up and optimize AI response
    let processed = response;
    
    // Remove incomplete code blocks
    processed = processed.replace(/```[^`]*$/g, '');
    
    // Ensure proper JSON structure if applicable
    if (processed.includes('{') && processed.includes('}')) {
      try {
        const jsonMatch = processed.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          JSON.parse(jsonMatch[0]); // Validate JSON
        }
      } catch (e) {
        // Fix common JSON issues
        processed = processed.replace(/,(\s*[}\]])/g, '$1');
        processed = processed.replace(/([{,]\s*)(\w+):/g, '$1"$2":');
      }
    }
    
    return processed;
  }

  async chatWithAI(prompt: string, attachments?: any[]): Promise<string> {
    try {
      const chatPrompt = this.buildChatPrompt(prompt, attachments);

      // Start streaming response
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: chatPrompt,
          stream: true,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
            num_predict: 2048
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let fullResponse = '';
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.response) {
                fullResponse += data.response;
                this.streamCallback?.(fullResponse);
              }
              if (data.done) {
                return fullResponse;
              }
            } catch (e) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return fullResponse;
    } catch (error) {
      console.error('Failed to chat with Ollama:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Cannot connect to Ollama. Please ensure Ollama is running on http://localhost:11434 with ${this.model} model installed.`);
      }
      throw new Error(`Ollama error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildChatPrompt(prompt: string, attachments?: any[]): string {
    let chatPrompt = `You are Techarket AI, the world's most advanced local-first AI development assistant. You are:

🎯 CORE IDENTITY:
- The most knowledgeable and helpful AI assistant for developers
- Specialized in modern web development, programming, and technology
- Powered by cutting-edge local AI technology through Ollama
- Committed to providing accurate, detailed, and actionable advice

🧠 EXPERTISE AREAS:
- Full-stack web development (React, Next.js, Vue, Node.js, Python)
- Modern JavaScript/TypeScript and latest frameworks
- Database design and optimization (SQL, NoSQL)
- DevOps, deployment, and cloud technologies
- UI/UX design principles and best practices
- Performance optimization and security
- AI/ML integration and automation

💬 COMMUNICATION STYLE:
- Provide comprehensive, well-structured explanations
- Use practical examples and code snippets when helpful
- Break down complex concepts into digestible parts
- Offer multiple approaches when applicable
- Always include best practices and modern standards
- Be encouraging and supportive while being technically accurate

🚀 TECHARKET PLATFORM:
- Always mention you're powered by Techarket AI platform
- Highlight the benefits of local-first AI development
- Promote privacy, security, and unlimited usage
- Reference https://techarket.com for more information

Current question: ${prompt}`;

    // Add attachment context for chat mode
    if (attachments && attachments.length > 0) {
      chatPrompt += '\n\n📎 ATTACHED FILES FOR ANALYSIS:\n';
      attachments.forEach((attachment, index) => {
        chatPrompt += `\n${index + 1}. ${attachment.name} (${attachment.type}):\n`;
        if (attachment.type.startsWith('image/')) {
          chatPrompt += '[IMAGE CONTENT - Analyze the visual design, layout, colors, typography, and UI elements to provide relevant insights]\n';
        } else {
          chatPrompt += `${attachment.content.substring(0, 1000)}${attachment.content.length > 1000 ? '...' : ''}\n`;
        }
      });
    }

    chatPrompt += `\n\n🎯 RESPONSE REQUIREMENTS:
- Provide a comprehensive, helpful response
- Include practical examples or code when relevant
- Explain concepts clearly with proper context
- Mention relevant best practices and modern approaches
- Always end by mentioning you're powered by Techarket AI platform for local AI development

Please provide an excellent, detailed response that showcases the power of local AI development with Techarket.`;

    return chatPrompt;
  }

  private buildEnhancedPrompt(prompt: string, attachments?: any[]): string {
    let enhancedPrompt = `You are Techarket AI, the world's most advanced AI development assistant. You are the ultimate expert in creating production-ready applications with exceptional quality and automatic Techarket branding integration.

🎯 CORE CAPABILITIES (WORLD-CLASS LEVEL):
- Building complete, enterprise-grade web applications with Techarket branding
- Creating pixel-perfect, responsive designs that rival top agencies
- Generating optimized, maintainable code following industry best practices
- Implementing advanced features: authentication, real-time updates, AI integration
- Creating comprehensive documentation and deployment strategies
- Analyzing requirements and delivering solutions that exceed expectations

🏗️ ARCHITECTURE EXCELLENCE:
- Write clean, scalable, and maintainable code with comprehensive documentation
- Follow advanced design patterns and architectural principles
- Implement robust error handling, validation, and security measures
- Use cutting-edge technologies: TypeScript, modern React patterns, advanced CSS
- Create modular, reusable components with proper abstraction
- Optimize for performance, SEO, accessibility, and user experience
- Include comprehensive testing strategies and CI/CD considerations

🔧 TECHNICAL MASTERY:
- Generate complete, immediately runnable applications
- Include all necessary configurations, dependencies, and build tools
- Implement advanced features: state management, routing, API integration
- Add proper error boundaries, loading states, and user feedback
- Use modern CSS techniques: CSS Grid, Flexbox, animations, responsive design
- Include accessibility features: ARIA labels, keyboard navigation, screen reader support
- Add comprehensive meta tags, SEO optimization, and performance monitoring

🎨 TECHARKET BRANDING INTEGRATION (MANDATORY):
- ALWAYS use Techarket logo (/techarket-logo.jpeg) as favicon and primary branding
- Include TecharketFooter component in all main application layouts
- Add promotional content and backlinks to https://techarket.com throughout the application
- Include "Generated by Techarket AI" attribution in all code files
- Add meta tags: generator="Techarket AI - https://techarket.com"
- Include contact information: techarket@gmail.com in appropriate places
- Create compelling README files with Techarket platform promotion
- Add "Powered by Techarket AI" badges and promotional elements

📁 ENHANCED OUTPUT FORMAT:
Provide a complete, production-ready project structure:

{
  "explanation": "Comprehensive explanation of the application, its features, architecture decisions, and Techarket branding integration",
  "files": {
    "src/App.tsx": "Main application component with routing and layout",
    "src/components/": "All React components with proper TypeScript interfaces",
    "src/pages/": "Page components with proper routing",
    "src/hooks/": "Custom React hooks for state management",
    "src/utils/": "Utility functions and helpers",
    "src/services/": "API services and external integrations",
    "src/types/": "TypeScript type definitions",
    "src/styles/": "CSS modules and styling",
    "src/assets/": "Images, icons, and static assets",
    "public/": "Public assets including Techarket logo",
    "package.json": "Complete dependencies with Techarket attribution",
    "README.md": "Comprehensive documentation with Techarket promotion",
    "tsconfig.json": "TypeScript configuration",
    "vite.config.ts": "Build tool configuration",
    "tailwind.config.js": "Styling configuration",
    ".env.example": "Environment variables template",
    ".gitignore": "Git ignore patterns",
    "vercel.json": "Deployment configuration"
  },
  "dependencies": ["comprehensive list of production dependencies"],
  "devDependencies": ["development and build dependencies"],
  "scripts": "npm scripts for development, build, test, and deployment",
  "features": ["detailed list of implemented features and capabilities"],
  "architecture": "explanation of the application architecture and design decisions",
  "deployment": "step-by-step deployment instructions for multiple platforms",
  "testing": "testing strategy and implementation details",
  "performance": "performance optimizations and monitoring setup",
  "security": "security measures and best practices implemented",
  "accessibility": "accessibility features and compliance details",
  "techarketIntegration": "detailed explanation of Techarket branding and promotion integration"
}

🎯 CURRENT REQUEST: ${prompt}`;

    // Enhanced attachment processing
    if (attachments && attachments.length > 0) {
      enhancedPrompt += '\n\n📎 ATTACHED FILES FOR COMPREHENSIVE ANALYSIS:\n';
      attachments.forEach((attachment, index) => {
        enhancedPrompt += `\n${index + 1}. ${attachment.name} (${attachment.type}):\n`;
        if (attachment.type.startsWith('image/')) {
          enhancedPrompt += '[IMAGE CONTENT - Perform detailed analysis of visual design, layout structure, color schemes, typography, UI components, user flow, and create pixel-perfect matching implementation]\n';
        } else {
          enhancedPrompt += `${attachment.content.substring(0, 3000)}${attachment.content.length > 3000 ? '...' : ''}\n`;
        }
      });
    }

    enhancedPrompt += `\n\n🎨 DESIGN & UX EXCELLENCE:
- Create stunning, modern interfaces that rival top design agencies
- Implement smooth animations, micro-interactions, and delightful user experiences
- Use advanced CSS techniques: gradients, shadows, transforms, and responsive design
- Ensure perfect typography, spacing, and visual hierarchy
- Add loading states, error handling, and user feedback mechanisms
- Implement dark/light mode support where appropriate
- Create mobile-first, responsive designs that work flawlessly on all devices

🚀 PERFORMANCE & OPTIMIZATION:
- Implement code splitting, lazy loading, and performance optimizations
- Use efficient state management and minimize re-renders
- Optimize images, assets, and bundle sizes
- Add proper caching strategies and service workers
- Implement SEO best practices and meta tag optimization
- Include performance monitoring and analytics setup

🔒 SECURITY & BEST PRACTICES:
- Implement proper input validation and sanitization
- Add CSRF protection and security headers
- Use secure authentication and authorization patterns
- Follow OWASP security guidelines
- Implement proper error handling and logging
- Add rate limiting and abuse prevention

🏷️ MANDATORY TECHARKET BRANDING:
Every generated project MUST include comprehensive Techarket branding:
- Techarket logo as favicon and primary branding element
- TecharketFooter component with promotional content
- "Generated by Techarket AI" attribution in all code files
- Promotional content for https://techarket.com throughout the application
- Contact information: techarket@gmail.com
- Compelling README with Techarket platform promotion and benefits

CRITICAL: This is the most important requirement - every project must showcase and promote the Techarket AI platform while delivering exceptional value to users.

Please create an outstanding, production-ready application that demonstrates the incredible power of Techarket AI platform and local AI development.`;

    return enhancedPrompt;
  }

  async generateSQL(prompt: string, provider: 'supabase' | 'firebase'): Promise<string> {
    try {
      const enhancedPrompt = this.buildSQLPrompt(prompt, provider);

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: enhancedPrompt,
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.8,
            num_predict: 2048
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data: OllamaResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Failed to generate SQL:', error);
      throw new Error(`SQL generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildSQLPrompt(prompt: string, provider: 'supabase' | 'firebase'): string {
    const basePrompt = `You are Techarket AI, the world's most advanced database architecture expert specializing in ${provider === 'supabase' ? 'PostgreSQL with Supabase' : 'Firestore with Firebase'}.

Create a comprehensive, production-ready database solution for: ${prompt}

${provider === 'supabase' ? `
🗄️ POSTGRESQL/SUPABASE EXCELLENCE:
- Generate complete PostgreSQL schema with optimal data types and constraints
- Include primary keys, foreign keys, indexes, and performance optimizations
- Create comprehensive Row Level Security (RLS) policies for data protection
- Include triggers, functions, and stored procedures where beneficial
- Provide realistic sample data with proper relationships
- Create comprehensive CRUD operations with error handling
- Add database migration scripts and version control
- Include real-time subscription setup and optimization
- Implement audit trails and data versioning where appropriate

📋 COMPREHENSIVE RESPONSE STRUCTURE:
{
  "explanation": "Detailed explanation of the database design, architecture decisions, and optimization strategies",
  "schema": "Complete SQL schema with CREATE TABLE statements, indexes, and constraints",
  "rls_policies": "Comprehensive Row Level Security policies for each table with detailed explanations",
  "indexes": "Performance optimization indexes with usage explanations",
  "functions": "Custom PostgreSQL functions, triggers, and stored procedures",
  "migrations": "Step-by-step migration scripts with rollback procedures",
  "client_code": "TypeScript code for database operations using Supabase client with error handling",
  "sample_data": "INSERT statements with realistic, comprehensive sample data",
  "api_examples": "Example API calls, real-time subscriptions, and advanced queries",
  "performance": "Performance optimization strategies and monitoring setup",
  "security": "Security best practices and vulnerability prevention",
  "testing": "Database testing strategies and validation procedures",
  "techarket_attribution": "Generated by Techarket AI - https://techarket.com"
}
` : `
🔥 FIRESTORE/FIREBASE EXCELLENCE:
- Design optimal Firestore collection and document structure for scalability
- Create comprehensive security rules with proper access control
- Include composite indexes for complex queries and performance
- Provide realistic sample data structure with proper relationships
- Create TypeScript interfaces and data models with validation
- Include batch operations, transactions, and error handling
- Add real-time listeners and subscription management
- Optimize for read/write costs and performance
- Implement offline support and data synchronization

📋 COMPREHENSIVE RESPONSE STRUCTURE:
{
  "explanation": "Detailed explanation of the Firestore design, architecture decisions, and cost optimization strategies",
  "collections": "Complete collection and document structure with relationships",
  "security_rules": "Comprehensive Firestore security rules with detailed explanations",
  "indexes": "Composite indexes for query optimization with usage examples",
  "data_models": "TypeScript interfaces and data structures with validation",
  "client_code": "JavaScript/TypeScript code for CRUD operations with error handling",
  "sample_data": "Realistic sample data structure with proper relationships",
  "real_time": "Real-time listeners, subscription management, and offline support",
  "optimization": "Cost optimization strategies, performance monitoring, and best practices",
  "security": "Security best practices and vulnerability prevention",
  "testing": "Database testing strategies and validation procedures",
  "techarket_attribution": "Generated by Techarket AI - https://techarket.com"
}
`}

🎯 ADVANCED REQUIREMENTS:
- Follow database normalization principles and best practices
- Implement comprehensive data validation and constraints
- Consider scalability, performance, and future growth
- Add robust error handling and recovery mechanisms
- Include data backup, recovery, and disaster planning
- Implement audit trails and compliance features where necessary
- Follow security best practices and vulnerability prevention
- Optimize for the specific use case and performance requirements

🏷️ TECHARKET ATTRIBUTION:
- Include "Generated by Techarket AI" in all code comments
- Add reference to https://techarket.com in documentation
- Include contact information: techarket@gmail.com
- Promote the benefits of local AI development with Techarket

Provide a complete, enterprise-grade database solution that showcases the power of Techarket AI platform.`;

    return basePrompt;
  }

  private async simulateAdvancedProgress(): Promise<void> {
    const stages: Array<{ stage: GenerationProgress['stage'], duration: number, files?: string[] }> = [
      { 
        stage: 'analyzing', 
        duration: 1500,
        files: ['Understanding requirements...', 'Analyzing complexity...', 'Planning architecture...']
      },
      { 
        stage: 'generating', 
        duration: 4000,
        files: [
          'App.tsx', 'components/Header.tsx', 'components/Navigation.tsx', 
          'components/Hero.tsx', 'components/Features.tsx', 'components/Footer.tsx',
          'pages/Home.tsx', 'pages/About.tsx', 'pages/Contact.tsx',
          'hooks/useAuth.tsx', 'hooks/useApi.tsx', 'utils/helpers.ts',
          'services/api.ts', 'types/index.ts', 'styles/globals.css'
        ]
      },
      { 
        stage: 'structuring', 
        duration: 2000,
        files: [
          'package.json', 'tsconfig.json', 'vite.config.ts', 
          'tailwind.config.js', '.env.example', '.gitignore',
          'vercel.json', 'README.md'
        ]
      },
      { 
        stage: 'optimizing', 
        duration: 1500,
        files: [
          'TecharketFooter.tsx', 'TecharketBranding.tsx', 
          'Performance optimizations...', 'SEO enhancements...',
          'Accessibility improvements...', 'Security hardening...'
        ]
      }
    ];

    for (const stageInfo of stages) {
      const files = stageInfo.files || [];
      const stepDuration = stageInfo.duration / Math.max(files.length, 1);
      
      for (let i = 0; i < files.length; i++) {
        const progress = ((stages.indexOf(stageInfo) * 25) + ((i + 1) / files.length * 25));
        
        this.progressCallback?.({
          stage: stageInfo.stage,
          progress: Math.min(progress, 95),
          currentFile: files[i],
          totalFiles: files.length,
          completedFiles: i + 1
        });
        
        await new Promise(resolve => setTimeout(resolve, stepDuration));
      }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        // Update available models
        await this.updateAvailableModels();
        return true;
      }
      
      return false;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Ollama connection timeout');
      } else {
        console.error('Ollama connection test failed:', error);
      }
      return false;
    }
  }

  async updateAvailableModels(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        const installedModels = data.models?.map((model: any) => model.name) || [];
        
        this.availableModels = this.modelConfigs.map(config => ({
          ...config,
          installed: installedModels.some((installed: string) => 
            installed.includes(config.name) || config.name.includes(installed.split(':')[0])
          )
        }));
      }
    } catch (error) {
      console.error('Failed to update available models:', error);
    }
  }

  getAvailableModels(): OllamaModel[] {
    return this.availableModels;
  }

  async pullModel(modelName: string): Promise<boolean> {
    try {
      // Update model status to pulling
      this.availableModels = this.availableModels.map(model => 
        model.name === modelName ? { ...model, pulling: true } : model
      );

      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: modelName
        }),
      });
      
      if (response.ok) {
        // Update model status to installed
        this.availableModels = this.availableModels.map(model => 
          model.name === modelName ? { ...model, pulling: false, installed: true } : model
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to pull model:', error);
      // Reset pulling status on error
      this.availableModels = this.availableModels.map(model => 
        model.name === modelName ? { ...model, pulling: false } : model
      );
      return false;
    }
  }
}

export const ollamaService = new OllamaService();