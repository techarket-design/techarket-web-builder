import React, { useState, useEffect } from 'react';
import { Code, Database, Terminal, Eye, Download, Star, Check, ArrowRight, Play, Pause, Monitor, Smartphone, Globe, Shield, Cpu, Heart, Mail, ExternalLink, Github, Twitter, Linkedin, Brain, Zap, Server, Lock, Rocket, Settings, Sparkles, Crown, Gift, Flame, CloudLightning as Lightning, Infinity, Target, Award, TrendingUp, Users, Clock, DollarSign, Layers, Palette, Wand2, Lightbulb, Megaphone, Headphones, Coffee, Gamepad2, Music, Camera, Video, Image, FileText, Bookmark, Calendar, MapPin, Phone, MessageCircle, Share2, ThumbsUp, Smile, Sun, Moon, Cloud, Umbrella, Snowflake } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const features = [
    {
      icon: Brain,
      title: "Revolutionary AI Integration",
      description: "Universal AI engine support - connect ANY AI service seamlessly with local Ollama + Mistral or 15+ cloud providers",
      demo: "Generate complete React apps, APIs, and databases using the world's most advanced AI models with zero limitations",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Code,
      title: "Instant Code Generation",
      description: "Generate complete, production-ready applications with advanced AI in seconds, not hours",
      demo: "Chat with AI to build React, Next.js, Vue, Python apps instantly with perfect code quality and Techarket branding",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Database,
      title: "Smart Database Integration",
      description: "Seamless Supabase and Firebase integration with auto-generated schemas and enterprise security",
      demo: "Create complex database structures with natural language and get production-ready schemas with RLS policies",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Terminal,
      title: "Integrated Development Environment",
      description: "Full terminal access with process management, live output, and development tools",
      demo: "Run commands, install packages, and manage processes in real-time with advanced monitoring and deployment",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Globe,
      title: "Universal Deployment",
      description: "Deploy anywhere - local computer, techarket.com, or any web server with one-click deployment",
      demo: "Download complete platform, deploy to web, or run locally with full customization and white-label options",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Full Stack Developer",
      company: "TechCorp",
      content: "Techarket with universal AI integration is absolutely incredible! I can use ANY AI engine - from local Ollama to GPT-4, Claude, or Gemini. It's like having every AI assistant working together perfectly.",
      rating: 5,
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "Marcus Rodriguez",
      role: "Startup Founder & CTO",
      company: "InnovateLab",
      content: "The universal AI integration is a complete game-changer! I can prototype with local Mistral for privacy, then switch to GPT-4 for complex tasks, all in one platform. We've reduced development time by 90%!",
      rating: 5,
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "Emily Johnson",
      role: "Lead Software Engineer",
      company: "DevStudio Pro",
      content: "Being able to deploy Techarket to our own servers while connecting to any AI engine is revolutionary. We have complete control, privacy, and access to the best AI models available.",
      rating: 5,
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "David Kim",
      role: "Technical Architect",
      company: "Enterprise Solutions",
      content: "For enterprise development, Techarket's universal deployment is unmatched. We can run it locally, deploy to our servers, or use techarket.com - all with the same powerful AI capabilities.",
      rating: 5,
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    }
  ];

  const universalFeatures = [
    {
      icon: Lock,
      title: "100% Universal & Flexible",
      description: "Run locally, deploy to any server, or use techarket.com. Connect to ANY AI engine with seamless integration.",
      benefit: "Complete freedom and flexibility"
    },
    {
      icon: Rocket,
      title: "Lightning Fast Performance",
      description: "Optimized for speed with local AI, cloud AI, or hybrid setups. No limitations, no compromises.",
      benefit: "Instant responses, unlimited usage"
    },
    {
      icon: Settings,
      title: "Universal AI Engine Support",
      description: "Connect to Ollama, OpenAI, Claude, Gemini, Grok, Mistral, Cohere, Perplexity, or ANY custom AI API.",
      benefit: "Use the best AI for every task"
    },
    {
      icon: Server,
      title: "Deploy Anywhere",
      description: "Download the complete platform and deploy to your own servers, techarket.com, or run locally.",
      benefit: "Complete control and ownership"
    }
  ];

  const pricingFeatures = [
    "🧠 Universal AI engine integration (15+ providers)",
    "⚡ Unlimited AI-powered code generation", 
    "🗄️ Database integration (Supabase/Firebase)",
    "🔧 Integrated terminal & process management",
    "👀 Live preview with hot reload",
    "📦 Project templates & scaffolding",
    "🎨 Advanced component library (15+ components)",
    "📱 Responsive design tools",
    "🌐 Universal deployment (local/web/server)",
    "💰 No API costs with local AI",
    "🔄 All future updates included",
    "📧 Priority email support",
    "🏢 Commercial usage rights",
    "🎯 Custom AI model integration help",
    "📥 Complete platform download",
    "🔧 White-label customization rights"
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, features.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/techarket-logo.jpeg" 
                alt="Techarket Logo" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold">Techarket</h1>
                <p className="text-xs text-blue-300">Universal AI Development Platform</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-blue-300 transition-colors">Features</a>
              <a href="#universal" className="hover:text-blue-300 transition-colors">Universal AI</a>
              <a href="#demo" className="hover:text-blue-300 transition-colors">Demo</a>
              <a href="#pricing" className="hover:text-blue-300 transition-colors">Pricing</a>
              <a href="#testimonials" className="hover:text-blue-300 transition-colors">Reviews</a>
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Get Started Free
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30 rounded-full px-6 py-3 mb-8 animate-pulse">
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">Universal AI Integration - Connect ANY AI Engine</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Build Apps with
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                Universal AI Power
              </span>
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Deploy Anywhere
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              The world's most advanced universal AI development platform. Connect to 
              <strong className="text-blue-400"> ANY AI engine</strong> - from local Ollama to GPT-4, Claude, Gemini, and beyond.
              <span className="block mt-2 text-lg text-blue-200">
                ✨ <strong>Deploy anywhere</strong> • 🧠 <strong>Universal AI</strong> • ⚡ <strong>Unlimited power</strong>
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <button
                onClick={onGetStarted}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-5 rounded-2xl font-semibold text-xl transition-all duration-200 transform hover:scale-105 shadow-2xl flex items-center space-x-3"
              >
                <Rocket className="w-6 h-6" />
                <span>Start Building Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="text-center">
                <div className="relative">
                  <div className="text-4xl font-bold text-red-400 line-through opacity-75">$50</div>
                  <div className="absolute -top-2 -right-8 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold transform rotate-12">
                    CROSSED OUT!
                  </div>
                </div>
                <div className="text-5xl font-bold text-green-400 animate-pulse">$0</div>
                <div className="text-sm text-gray-400">Free Forever*</div>
                <div className="text-xs text-pink-300 mt-1">*Just to make you fall in love with it! 💕</div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <Brain className="w-10 h-10 text-purple-400 mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">Universal AI</h3>
                <p className="text-sm text-gray-400">Connect to ANY AI engine - local or cloud, with seamless integration.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <Globe className="w-10 h-10 text-blue-400 mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">Deploy Anywhere</h3>
                <p className="text-sm text-gray-400">Local computer, your servers, techarket.com, or any web hosting.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <Lock className="w-10 h-10 text-green-400 mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">100% Flexible</h3>
                <p className="text-sm text-gray-400">Complete control - run locally for privacy or cloud for power.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <Download className="w-10 h-10 text-orange-400 mb-4 mx-auto" />
                <h3 className="font-semibold mb-2">Own the Platform</h3>
                <p className="text-sm text-gray-400">Download the complete platform and customize it as your own.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Universal AI Integration Section */}
      <section id="universal" className="py-20 bg-black/20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Universal AI Engine Integration
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Connect to ANY AI engine seamlessly. From local privacy to cloud power - use the best AI for every task.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto mb-16">
            <div>
              <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Connect to ANY AI Engine
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3 flex-shrink-0">
                    <span className="text-white font-bold text-lg">🧠</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-lg">Local AI (Ollama)</h4>
                    <p className="text-gray-300">Mistral, CodeLlama, Llama2, and 20+ models running locally for complete privacy.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-3 flex-shrink-0">
                    <span className="text-white font-bold text-lg">☁️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-lg">Cloud AI Powerhouses</h4>
                    <p className="text-gray-300">OpenAI GPT-4, Anthropic Claude, Google Gemini, xAI Grok, Mistral, Cohere, Perplexity.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-full p-3 flex-shrink-0">
                    <span className="text-white font-bold text-lg">⚙️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-lg">Custom AI APIs</h4>
                    <p className="text-gray-300">Connect to ANY AI service with custom endpoints, headers, and authentication.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-full p-3 flex-shrink-0">
                    <span className="text-white font-bold text-lg">🔄</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-lg">Seamless Switching</h4>
                    <p className="text-gray-300">Switch between AI engines instantly - use local for privacy, cloud for power.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-2">Universal AI Integration</span>
              </div>
              
              <div className="bg-black rounded-lg p-4 font-mono text-sm">
                <div className="text-green-400">🧠 Local AI: Ollama + Mistral ✅ Connected</div>
                <div className="text-blue-400 mt-2">☁️ OpenAI GPT-4 ✅ Connected</div>
                <div className="text-purple-400 mt-2">🤖 Anthropic Claude ✅ Connected</div>
                <div className="text-yellow-400 mt-2">🔍 Google Gemini ✅ Connected</div>
                <div className="text-orange-400 mt-2">🚀 xAI Grok ✅ Connected</div>
                <div className="text-pink-400 mt-2">⚙️ Custom API ✅ Connected</div>
                <div className="text-cyan-400 mt-2">💡 15+ AI engines ready for use!</div>
                <div className="text-white mt-2">🎯 Use the best AI for every task</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {universalFeatures.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{feature.description}</p>
                <div className="text-xs text-green-300 font-medium">{feature.benefit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Demo Section */}
      <section id="demo" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                See Universal AI in Action
              </span>
            </h2>
            <p className="text-xl text-gray-300">Watch how easy it is to build with ANY AI engine and deploy anywhere</p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-900 rounded-3xl border border-gray-700 overflow-hidden shadow-2xl">
              {/* Demo Controls */}
              <div className="bg-gray-800 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    <span>{isPlaying ? 'Pause' : 'Play'} Demo</span>
                  </button>
                  
                  <div className="flex space-x-2">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentFeature(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentFeature ? 'bg-blue-500' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Brain size={16} className="text-purple-400" />
                  <span>Universal AI Platform</span>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      {React.createElement(features[currentFeature].icon, {
                        size: 40,
                        className: `text-transparent bg-gradient-to-r ${features[currentFeature].color} bg-clip-text`
                      })}
                      <h3 className="text-3xl font-bold">{features[currentFeature].title}</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                      {features[currentFeature].description}
                    </p>
                    
                    <div className={`bg-gradient-to-r ${features[currentFeature].color} bg-opacity-20 border border-blue-500/30 rounded-xl p-4`}>
                      <p className="text-blue-200 text-sm">
                        <strong>Demo:</strong> {features[currentFeature].demo}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="ml-2">Techarket Universal Platform</span>
                      </div>
                      
                      <div className="bg-black rounded-lg p-4 font-mono text-sm">
                        <div className="text-green-400">$ techarket generate --ai=universal</div>
                        <div className="text-gray-400 mt-2">
                          {currentFeature === 0 && "🧠 Connecting to universal AI engines..."}
                          {currentFeature === 1 && "🤖 Generating with GPT-4 + Claude + Gemini..."}
                          {currentFeature === 2 && "🗄️ Creating database with AI assistance..."}
                          {currentFeature === 3 && "⚡ Starting development environment..."}
                          {currentFeature === 4 && "🌐 Preparing universal deployment..."}
                        </div>
                        <div className="text-blue-400 mt-2">
                          {currentFeature === 0 && "✅ 15+ AI engines ready for use"}
                          {currentFeature === 1 && "✅ Generated with best AI for each task"}
                          {currentFeature === 2 && "✅ Database optimized with AI insights"}
                          {currentFeature === 3 && "✅ Full development environment ready"}
                          {currentFeature === 4 && "✅ Ready for local/web/server deployment"}
                        </div>
                        <div className="text-purple-400 mt-2">
                          💰 Cost: $0.00 (Use local AI) or pay-per-use (cloud AI)
                        </div>
                        <div className="text-yellow-400 mt-2">
                          🌐 Deploy: Local, Web, or Your Servers
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Everything You Need to Build Anything
              </span>
            </h2>
            <p className="text-xl text-gray-300">Professional development tools with universal AI integration</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Brain,
                title: "Universal AI Integration",
                description: "Connect to ANY AI engine - local Ollama, OpenAI, Claude, Gemini, Grok, or custom APIs",
                features: ["15+ AI providers supported", "Seamless switching", "Custom API integration"],
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Code,
                title: "Smart Code Generation",
                description: "Generate complete applications with context-aware AI that uses the best model for each task",
                features: ["React, Next.js, Vue support", "TypeScript by default", "Production-ready code"],
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Database,
                title: "Database Management",
                description: "Visual database designer with AI-powered schema generation and optimization",
                features: ["Supabase integration", "Firebase support", "AI SQL generation"],
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Terminal,
                title: "Integrated Terminal",
                description: "Full terminal access with process management and real-time command execution",
                features: ["Process monitoring", "Package management", "Live output streaming"],
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Eye,
                title: "Live Preview",
                description: "Instant preview with hot reload and responsive design testing",
                features: ["Real-time updates", "Mobile preview", "Cross-browser testing"],
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: Globe,
                title: "Universal Deployment",
                description: "Deploy anywhere - download platform, web hosting, or your own servers",
                features: ["Complete platform download", "Web deployment", "Server hosting"],
                color: "from-pink-500 to-rose-500"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm text-gray-400">
                      <Check size={16} className="text-green-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Revolutionary Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-300">We're making universal AI development accessible to everyone</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-400/30 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                🎉 UNIVERSAL LAUNCH OFFER
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Techarket Universal</h3>
                <p className="text-gray-300 mb-6">Complete AI development platform with universal engine support</p>
                
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="text-center">
                    <div className="relative">
                      <span className="text-6xl font-bold text-red-400 line-through opacity-75">$50</span>
                      <div className="absolute -top-3 -right-6 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold transform rotate-12 animate-bounce">
                        NOPE!
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">Regular Price</div>
                  </div>
                  
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                  
                  <div className="text-center">
                    <span className="text-8xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text animate-pulse">
                      $0
                    </span>
                    <div className="text-lg text-green-400 font-bold">FREE FOREVER*</div>
                    <div className="text-sm text-pink-300">*Just to make you fall in love! 💕</div>
                  </div>
                </div>

                <button 
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-12 py-4 rounded-2xl font-semibold text-xl transition-all duration-200 transform hover:scale-105 shadow-2xl mb-8 flex items-center space-x-3 mx-auto"
                >
                  <Gift className="w-6 h-6" />
                  <span>Get Universal Access Now</span>
                  <Sparkles className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4 text-blue-300 flex items-center">
                    <Crown className="w-5 h-5 mr-2" />
                    ✨ Universal Features
                  </h4>
                  <ul className="space-y-3">
                    {pricingFeatures.slice(0, 8).map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <Check size={16} className="text-green-400" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 text-purple-300 flex items-center">
                    <Rocket className="w-5 h-5 mr-2" />
                    🚀 Pro Benefits
                  </h4>
                  <ul className="space-y-3">
                    {pricingFeatures.slice(8).map((feature, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <Check size={16} className="text-green-400" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-pink-900/30 to-purple-900/30 border border-pink-500/30 rounded-2xl">
                <p className="text-center text-pink-200 text-lg">
                  <strong>🎁 Why Free?</strong><br />
                  We believe universal AI development should be accessible to everyone. We're so confident you\'ll love Techarket that we're giving it away free just to make you fall in love with universal AI development!
                </p>
                <p className="text-center text-sm text-gray-400 mt-4">
                  Need enterprise features or custom deployment? Contact us at <a href="mailto:techarket@gmail.com" className="text-blue-400 hover:text-blue-300 underline">techarket@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                Loved by Developers Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-300">See what our users are saying about universal AI development</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center space-x-1 mb-6">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                    <div className="text-xs text-blue-400">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Development?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of developers building the future with universal AI</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={onGetStarted}
              className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-5 rounded-2xl font-semibold text-xl transition-all duration-200 transform hover:scale-105 shadow-2xl flex items-center space-x-3"
            >
              <Rocket className="w-6 h-6" />
              <span>Start Building Today</span>
            </button>
            
            <div className="text-center">
              <div className="text-3xl font-bold line-through opacity-75">$50 Lifetime</div>
              <div className="text-4xl font-bold text-green-300">FREE FOREVER</div>
              <div className="text-sm opacity-75">Universal AI, unlimited power</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/techarket-logo.jpeg" 
                  alt="Techarket Logo" 
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="text-xl font-bold">Techarket</span>
              </div>
              <p className="text-gray-400 text-sm">
                The most advanced universal AI-powered development platform. Connect to ANY AI engine and deploy anywhere.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#universal" className="hover:text-white transition-colors">Universal AI</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="mailto:techarket@gmail.com" className="hover:text-white transition-colors flex items-center space-x-2">
                    <Mail size={14} />
                    <span>techarket@gmail.com</span>
                  </a>
                </li>
                <li><a href="#" className="hover:text-white transition-colors">Universal AI Setup</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Deployment Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Techarket. All rights reserved. Made with ❤️ for developers who value universal AI and deployment flexibility.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};