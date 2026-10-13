import React, { useState } from 'react';
import { Plus, Search, Code, Layout, Database, User, Mail, Star, MessageSquare, BarChart3, Users, Calendar, Settings, Bell, Heart, Shield, Zap, Globe, Smartphone, Monitor, Palette, Camera, Music, Video, FileText, Download, Upload, Share2, Lock, Key, Eye, EyeOff, ChevronDown, ChevronUp, Menu, X, Home, Info, Phone, MapPin, Clock, DollarSign, TrendingUp, Award, Target, Lightbulb, Rocket, Crown, Gift, Sparkles, Flame, Coffee, Gamepad2, Headphones, Bookmark, ThumbsUp, Smile, Sun, Moon, Cloud, Umbrella, Snowflake } from 'lucide-react';
import { ComponentBlock } from '../types';

interface ComponentBlocksProps {
  onAddComponent: (component: ComponentBlock) => void;
}

export const ComponentBlocks: React.FC<ComponentBlocksProps> = ({ onAddComponent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const componentBlocks: ComponentBlock[] = [
    // Navigation Components
    {
      id: 'navbar-modern',
      name: 'Modern Navigation Bar',
      category: 'Navigation',
      description: 'Responsive navigation with logo, menu items, and CTA button',
      preview: 'Modern navbar with gradient background and smooth animations',
      code: `import React, { useState } from 'react';
import { Menu, X, Home, User, Settings, Mail } from 'lucide-react';

export const ModernNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#', icon: Home },
    { name: 'About', href: '#about', icon: User },
    { name: 'Services', href: '#services', icon: Settings },
    { name: 'Contact', href: '#contact', icon: Mail },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="/techarket-logo.jpeg" 
                alt="Logo" 
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="ml-2 text-xl font-bold text-white">Brand</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </a>
            ))}
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-blue-200 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-700 rounded-lg mt-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-blue-200 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={16} />
                  <span>{item.name}</span>
                </a>
              ))}
              <button className="w-full text-left bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md font-medium mt-2">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};`
    },
    
    // Hero Sections
    {
      id: 'hero-gradient',
      name: 'Gradient Hero Section',
      category: 'Hero',
      description: 'Eye-catching hero with gradient background and call-to-action',
      preview: 'Modern hero section with animated gradient background',
      code: `import React from 'react';
import { ArrowRight, Play, Star } from 'lucide-react';

export const GradientHero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="mb-6">
          <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
            <Star className="w-4 h-4 mr-2 text-yellow-400" />
            #1 Rated Platform
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Build Amazing
          <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Applications
          </span>
          <span className="block text-4xl md:text-5xl">with AI Power</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform your ideas into reality with our AI-powered development platform. 
          Build faster, smarter, and more efficiently than ever before.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button className="group bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl flex items-center space-x-2">
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button className="group bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center space-x-2 border border-white/20">
            <Play className="w-5 h-5" />
            <span>Watch Demo</span>
          </button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { number: '10K+', label: 'Active Users' },
            { number: '99.9%', label: 'Uptime' },
            { number: '24/7', label: 'Support' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};`
    },

    // Feature Cards
    {
      id: 'feature-cards',
      name: 'Feature Cards Grid',
      category: 'Features',
      description: 'Responsive grid of feature cards with icons and descriptions',
      preview: 'Clean feature cards with hover effects and icons',
      code: `import React from 'react';
import { Code, Database, Shield, Zap, Globe, Users } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  const features = [
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Write maintainable, scalable code with our advanced tools and best practices.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Database,
      title: 'Smart Database',
      description: 'Intelligent database management with automatic optimization and scaling.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption and compliance standards.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with sub-second response times and global CDN.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Deploy worldwide with automatic scaling and load balancing.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with real-time collaboration tools.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Development
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to build, deploy, and scale your applications with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className={\`w-16 h-16 bg-gradient-to-r \${feature.color} rounded-2xl flex items-center justify-center mb-6\`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};`
    },

    // Pricing Cards
    {
      id: 'pricing-cards',
      name: 'Pricing Cards',
      category: 'Pricing',
      description: 'Professional pricing cards with features and call-to-action buttons',
      preview: 'Modern pricing cards with popular plan highlighting',
      code: `import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

export const PricingCards: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      description: 'Perfect for individuals and small projects',
      icon: Zap,
      features: [
        '5 Projects',
        '10GB Storage',
        'Basic Support',
        'SSL Certificate',
        'Custom Domain'
      ],
      popular: false,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      description: 'Ideal for growing businesses and teams',
      icon: Star,
      features: [
        'Unlimited Projects',
        '100GB Storage',
        'Priority Support',
        'Advanced Analytics',
        'Team Collaboration',
        'API Access'
      ],
      popular: true,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For large organizations with advanced needs',
      icon: Crown,
      features: [
        'Everything in Pro',
        'Unlimited Storage',
        '24/7 Phone Support',
        'Custom Integrations',
        'SLA Guarantee',
        'Dedicated Manager'
      ],
      popular: false,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Start free and scale as you grow. All plans include our core features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={\`relative bg-gray-800 rounded-2xl p-8 border-2 transition-all duration-300 transform hover:scale-105 \${
                plan.popular 
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/20' 
                  : 'border-gray-700 hover:border-gray-600'
              }\`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={\`w-16 h-16 bg-gradient-to-r \${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4\`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-4">{plan.description}</p>
                
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={\`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 \${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }\`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};`
    },

    // Testimonials
    {
      id: 'testimonials',
      name: 'Testimonials Section',
      category: 'Social Proof',
      description: 'Customer testimonials with photos and ratings',
      preview: 'Professional testimonials with star ratings and customer photos',
      code: `import React from 'react';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      content: 'This platform has revolutionized how we build applications. The AI assistance is incredible and has saved us months of development time.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Lead Developer, InnovateCorp',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      content: 'The code quality and development speed improvements are outstanding. Our team productivity has increased by 300% since we started using this.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Startup Founder',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      content: 'As a non-technical founder, this platform allowed me to prototype and build my MVP without hiring a full development team.',
      rating: 5
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Loved by Developers Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our customers are saying about their experience with our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 relative hover:shadow-lg transition-shadow duration-300"
            >
              <Quote className="w-8 h-8 text-blue-500 mb-6" />
              
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center space-x-1 mb-6">
                {Array.from({ length: testimonial.rating }, (_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};`
    },

    // Contact Forms
    {
      id: 'contact-form',
      name: 'Contact Form',
      category: 'Forms',
      description: 'Professional contact form with validation',
      preview: 'Modern contact form with input validation and success states',
      code: `import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Let's Start a Conversation
              </h3>
              <p className="text-gray-600 mb-8">
                We're here to help and answer any question you might have. 
                We look forward to hearing from you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">hello@example.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Office</h4>
                  <p className="text-gray-600">123 Business St, City, State 12345</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-600">
                  Thank you for your message. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us more about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};`
    },

    // FAQ Section
    {
      id: 'faq-section',
      name: 'FAQ Section',
      category: 'Content',
      description: 'Expandable FAQ section with smooth animations',
      preview: 'Interactive FAQ with collapsible answers',
      code: `import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How does the AI-powered development work?',
      answer: 'Our AI analyzes your requirements and generates production-ready code using advanced machine learning models. It understands context, follows best practices, and creates maintainable, scalable applications.'
    },
    {
      question: 'Is my code and data secure?',
      answer: 'Absolutely. We use enterprise-grade security with end-to-end encryption. Your code never leaves your machine when using local AI models, and all data is protected with bank-level security standards.'
    },
    {
      question: 'What programming languages and frameworks are supported?',
      answer: 'We support all major languages and frameworks including React, Next.js, Vue, Python, Node.js, TypeScript, and many more. Our AI is constantly learning new technologies and best practices.'
    },
    {
      question: 'Can I use this for commercial projects?',
      answer: 'Yes! All our plans include commercial usage rights. You own the code generated by our platform and can use it for any commercial purpose without restrictions.'
    },
    {
      question: 'How much does it cost?',
      answer: 'We offer flexible pricing starting from free for individual developers. Our paid plans start at $9/month with advanced features for teams and enterprises. Check our pricing page for detailed information.'
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes, we provide comprehensive support including documentation, tutorials, email support, and priority support for paid plans. Our team is here to help you succeed.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about our platform and services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};`
    },

    // Newsletter Signup
    {
      id: 'newsletter',
      name: 'Newsletter Signup',
      category: 'Forms',
      description: 'Email newsletter signup with validation',
      preview: 'Modern newsletter signup with email validation',
      code: `import React, { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubscribed(true);
    setEmail('');
    
    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-4">
          Stay Updated
        </h2>
        
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Get the latest updates, tips, and exclusive content delivered straight to your inbox.
        </p>

        {isSubscribed ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              You're all set!
            </h3>
            <p className="text-blue-100">
              Thank you for subscribing. Check your email for confirmation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-6 py-4 rounded-xl border-0 focus:ring-4 focus:ring-white/20 text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </div>
            
            <p className="text-blue-100 text-sm mt-4">
              No spam, unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};`
    },

    // Stats Section
    {
      id: 'stats-section',
      name: 'Statistics Section',
      category: 'Content',
      description: 'Animated statistics with counters',
      preview: 'Eye-catching stats with animated counters',
      code: `import React, { useEffect, useState } from 'react';
import { Users, Code, Globe, Award } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const [counts, setCounts] = useState({
    users: 0,
    projects: 0,
    countries: 0,
    awards: 0
  });

  const stats = [
    {
      icon: Users,
      label: 'Active Users',
      value: 50000,
      suffix: '+',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Code,
      label: 'Projects Created',
      value: 125000,
      suffix: '+',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Globe,
      label: 'Countries',
      value: 150,
      suffix: '+',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Award,
      label: 'Awards Won',
      value: 25,
      suffix: '',
      color: 'from-orange-500 to-red-500'
    }
  ];

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    stats.forEach((stat, index) => {
      let currentCount = 0;
      const increment = stat.value / steps;
      
      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= stat.value) {
          currentCount = stat.value;
          clearInterval(timer);
        }
        
        setCounts(prev => ({
          ...prev,
          [index === 0 ? 'users' : index === 1 ? 'projects' : index === 2 ? 'countries' : 'awards']: Math.floor(currentCount)
        }));
      }, stepDuration);
    });
  }, []);

  const getCountValue = (index: number) => {
    switch (index) {
      case 0: return counts.users;
      case 1: return counts.projects;
      case 2: return counts.countries;
      case 3: return counts.awards;
      default: return 0;
    }
  };

  return (
    <div className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Trusted by Developers Worldwide
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of developers who are building the future with our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className={\`w-20 h-20 bg-gradient-to-r \${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl transition-shadow duration-300\`}>
                <stat.icon className="w-10 h-10 text-white" />
              </div>
              
              <div className="text-5xl font-bold text-white mb-2">
                {getCountValue(index).toLocaleString()}{stat.suffix}
              </div>
              
              <div className="text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};`
    },

    // Team Section
    {
      id: 'team-section',
      name: 'Team Section',
      category: 'Content',
      description: 'Team member cards with social links',
      preview: 'Professional team showcase with member profiles',
      code: `import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export const TeamSection: React.FC = () => {
  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Visionary leader with 15+ years in tech, passionate about AI and innovation.',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#',
        email: 'alex@company.com'
      }
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Technical expert specializing in AI/ML and scalable architecture design.',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#',
        email: 'sarah@company.com'
      }
    },
    {
      name: 'Michael Rodriguez',
      role: 'Lead Developer',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Full-stack developer with expertise in modern web technologies and DevOps.',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#',
        email: 'michael@company.com'
      }
    },
    {
      name: 'Emily Davis',
      role: 'Head of Design',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Creative designer focused on user experience and beautiful, functional interfaces.',
      social: {
        twitter: '#',
        linkedin: '#',
        github: '#',
        email: 'emily@company.com'
      }
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The passionate people behind our platform, dedicated to building the future of development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-gray-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-full"></div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {member.name}
              </h3>
              
              <p className="text-blue-600 font-semibold mb-4">
                {member.role}
              </p>
              
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {member.bio}
              </p>
              
              <div className="flex justify-center space-x-4">
                <a
                  href={member.social.twitter}
                  className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Twitter className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                </a>
                <a
                  href={member.social.linkedin}
                  className="w-10 h-10 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Linkedin className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                </a>
                <a
                  href={member.social.github}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Github className="w-5 h-5 text-gray-600" />
                </a>
                <a
                  href={\`mailto:\${member.social.email}\`}
                  className="w-10 h-10 bg-gray-100 hover:bg-green-100 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <Mail className="w-5 h-5 text-gray-600 hover:text-green-600" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};`
    }
  ];

  const categories = ['all', ...Array.from(new Set(componentBlocks.map(block => block.category)))];

  const filteredBlocks = componentBlocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full bg-gray-800 border-t border-gray-700">
      <div className="p-3 border-b border-gray-700">
        <h4 className="text-sm font-semibold text-gray-200 mb-3 flex items-center">
          <Code size={14} className="mr-2" />
          Component Library
        </h4>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search components..."
            className="w-full bg-gray-700 border border-gray-600 rounded pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      <div className="p-2 space-y-2 max-h-96 overflow-y-auto">
        {filteredBlocks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Code size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No components found</p>
          </div>
        ) : (
          filteredBlocks.map((block) => (
            <div
              key={block.id}
              className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer group"
              onClick={() => onAddComponent(block)}
            >
              <div className="flex items-start justify-between mb-2">
                <h5 className="text-sm font-medium text-gray-200 group-hover:text-white">
                  {block.name}
                </h5>
                <Plus size={14} className="text-gray-400 group-hover:text-blue-400 flex-shrink-0 ml-2" />
              </div>
              <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                {block.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">
                  {block.category}
                </span>
                <span className="text-xs text-blue-400">Click to add</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};