import React, { useState } from 'react';
import { Brain, Zap, Target, Layers, Wand2, Settings, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface PromptOptimization {
  original: string;
  optimized: string;
  improvements: string[];
  estimatedTokens: number;
  complexity: 'simple' | 'medium' | 'complex';
}

interface AIOptimizedPromptsProps {
  onOptimizedPrompt: (prompt: string) => void;
}

export const AIOptimizedPrompts: React.FC<AIOptimizedPromptsProps> = ({ onOptimizedPrompt }) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [optimization, setOptimization] = useState<PromptOptimization | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationLevel, setOptimizationLevel] = useState<'balanced' | 'performance' | 'quality'>('balanced');

  const optimizePrompt = async () => {
    if (!inputPrompt.trim()) return;

    setIsOptimizing(true);
    try {
      // Simulate AI prompt optimization
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const optimized = await performPromptOptimization(inputPrompt, optimizationLevel);
      setOptimization(optimized);
    } catch (error) {
      console.error('Prompt optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const performPromptOptimization = async (prompt: string, level: string): Promise<PromptOptimization> => {
    // Advanced prompt optimization logic
    const improvements: string[] = [];
    let optimized = prompt;

    // 1. Structure Enhancement
    if (!prompt.includes('You are')) {
      optimized = `You are Techarket AI, an expert development assistant. ${optimized}`;
      improvements.push('Added clear AI role definition');
    }

    // 2. Context Optimization
    if (prompt.length > 2000) {
      // Break down long prompts
      const sections = breakDownPrompt(prompt);
      optimized = reassembleOptimizedPrompt(sections, level);
      improvements.push('Optimized prompt structure for better processing');
    }

    // 3. Specificity Enhancement
    if (!prompt.includes('specific') && !prompt.includes('detailed')) {
      optimized += '\n\nProvide specific, detailed implementation with complete code examples.';
      improvements.push('Enhanced specificity requirements');
    }

    // 4. Output Format Specification
    if (!prompt.includes('format') && !prompt.includes('structure')) {
      optimized += '\n\nStructure your response with clear sections and proper formatting.';
      improvements.push('Added output format specification');
    }

    // 5. Technology Stack Clarification
    if (prompt.includes('website') || prompt.includes('app')) {
      optimized += '\n\nUse modern technologies: React, TypeScript, Tailwind CSS, and include Techarket branding.';
      improvements.push('Specified modern technology stack');
    }

    // 6. Performance Optimization
    if (level === 'performance') {
      optimized = optimizeForPerformance(optimized);
      improvements.push('Optimized for faster AI processing');
    }

    // 7. Quality Enhancement
    if (level === 'quality') {
      optimized = enhanceForQuality(optimized);
      improvements.push('Enhanced for higher quality output');
    }

    return {
      original: prompt,
      optimized,
      improvements,
      estimatedTokens: estimateTokens(optimized),
      complexity: determineComplexity(optimized)
    };
  };

  const breakDownPrompt = (prompt: string): string[] => {
    // Intelligent prompt segmentation
    const sentences = prompt.split(/[.!?]+/);
    const sections: string[] = [];
    let currentSection = '';

    for (const sentence of sentences) {
      if ((currentSection + sentence).length > 500 && currentSection) {
        sections.push(currentSection.trim());
        currentSection = sentence;
      } else {
        currentSection += sentence + '.';
      }
    }

    if (currentSection) {
      sections.push(currentSection.trim());
    }

    return sections;
  };

  const reassembleOptimizedPrompt = (sections: string[], level: string): string => {
    const coreSection = sections[0];
    const contextSections = sections.slice(1);
    
    let optimized = coreSection;
    
    if (level === 'performance') {
      // Prioritize core requirements
      optimized += '\n\nCore Requirements: ' + contextSections.slice(0, 2).join(' ');
    } else if (level === 'quality') {
      // Include comprehensive context
      optimized += '\n\nDetailed Context: ' + contextSections.join(' ');
    } else {
      // Balanced approach
      optimized += '\n\nContext: ' + contextSections.slice(0, 3).join(' ');
    }

    return optimized;
  };

  const optimizeForPerformance = (prompt: string): string => {
    // Performance-focused optimizations
    let optimized = prompt;
    
    // Reduce redundancy
    optimized = optimized.replace(/\b(\w+)\b(?=.*\b\1\b)/gi, '');
    
    // Prioritize key instructions
    optimized = 'PRIORITY INSTRUCTIONS: ' + optimized;
    
    // Add performance hints
    optimized += '\n\nOptimize for speed and efficiency. Provide concise, actionable output.';
    
    return optimized;
  };

  const enhanceForQuality = (prompt: string): string => {
    // Quality-focused enhancements
    let optimized = prompt;
    
    // Add quality requirements
    optimized += '\n\nQUALITY REQUIREMENTS:';
    optimized += '\n- Production-ready code with best practices';
    optimized += '\n- Comprehensive error handling and validation';
    optimized += '\n- Detailed documentation and comments';
    optimized += '\n- Modern design patterns and architecture';
    optimized += '\n- Accessibility and performance optimization';
    
    return optimized;
  };

  const estimateTokens = (text: string): number => {
    // Rough token estimation (1 token ≈ 4 characters)
    return Math.ceil(text.length / 4);
  };

  const determineComplexity = (prompt: string): 'simple' | 'medium' | 'complex' => {
    const length = prompt.length;
    const keywords = ['build', 'create', 'implement', 'design', 'develop', 'integrate'];
    const keywordCount = keywords.filter(keyword => prompt.toLowerCase().includes(keyword)).length;
    
    if (length < 500 && keywordCount < 3) return 'simple';
    if (length < 1500 && keywordCount < 6) return 'medium';
    return 'complex';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'complex': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getOptimizationLevelDescription = (level: string) => {
    switch (level) {
      case 'performance':
        return 'Optimized for faster AI processing and quicker responses';
      case 'quality':
        return 'Enhanced for highest quality output with comprehensive details';
      case 'balanced':
        return 'Balanced approach between speed and quality';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <Brain className="w-6 h-6 text-purple-400" />
        <h3 className="text-lg font-semibold">AI Prompt Optimizer</h3>
        <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs">
          BETA
        </span>
      </div>

      {/* Optimization Level */}
      <div>
        <label className="block text-sm font-medium mb-2">Optimization Level</label>
        <div className="flex bg-gray-700 rounded-lg p-1">
          {[
            { id: 'performance', label: 'Performance', icon: Zap, description: 'Faster processing' },
            { id: 'balanced', label: 'Balanced', icon: Target, description: 'Speed + Quality' },
            { id: 'quality', label: 'Quality', icon: Layers, description: 'Best output' }
          ].map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setOptimizationLevel(id as any)}
              className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                optimizationLevel === id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title={description}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {getOptimizationLevelDescription(optimizationLevel)}
        </p>
      </div>

      {/* Input Prompt */}
      <div>
        <label className="block text-sm font-medium mb-2">Your Prompt</label>
        <textarea
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Enter your prompt here... The AI will optimize it for better results."
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 h-32 resize-none text-sm"
        />
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>{inputPrompt.length} characters</span>
          <span>~{estimateTokens(inputPrompt)} tokens</span>
        </div>
      </div>

      {/* Optimize Button */}
      <button
        onClick={optimizePrompt}
        disabled={!inputPrompt.trim() || isOptimizing}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-3 rounded font-medium flex items-center justify-center space-x-2"
      >
        {isOptimizing ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            <span>Optimizing...</span>
          </>
        ) : (
          <>
            <Wand2 size={16} />
            <span>Optimize Prompt</span>
          </>
        )}
      </button>

      {/* Optimization Results */}
      {optimization && (
        <div className="space-y-4">
          <div className="border-t border-gray-700 pt-4">
            <h4 className="font-medium mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              Optimization Results
            </h4>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-700 rounded p-3 text-center">
                <div className="text-lg font-semibold text-blue-400">
                  {optimization.estimatedTokens}
                </div>
                <div className="text-xs text-gray-400">Estimated Tokens</div>
              </div>
              <div className="bg-gray-700 rounded p-3 text-center">
                <div className={`text-lg font-semibold ${getComplexityColor(optimization.complexity)}`}>
                  {optimization.complexity}
                </div>
                <div className="text-xs text-gray-400">Complexity</div>
              </div>
              <div className="bg-gray-700 rounded p-3 text-center">
                <div className="text-lg font-semibold text-green-400">
                  {optimization.improvements.length}
                </div>
                <div className="text-xs text-gray-400">Improvements</div>
              </div>
            </div>

            {/* Improvements */}
            <div className="mb-4">
              <h5 className="font-medium mb-2 text-green-400">Applied Improvements:</h5>
              <ul className="space-y-1">
                {optimization.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optimized Prompt */}
            <div>
              <h5 className="font-medium mb-2">Optimized Prompt:</h5>
              <div className="bg-gray-900 rounded p-4 text-sm">
                <pre className="whitespace-pre-wrap text-gray-300 max-h-40 overflow-y-auto">
                  {optimization.optimized}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => onOptimizedPrompt(optimization.optimized)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium flex items-center space-x-2"
              >
                <Zap size={16} />
                <span>Use Optimized Prompt</span>
              </button>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(optimization.optimized);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-900/20 border border-blue-700 rounded p-4">
        <h5 className="font-medium mb-2 text-blue-300 flex items-center">
          <Settings size={16} className="mr-2" />
          Optimization Tips
        </h5>
        <ul className="text-sm text-blue-200 space-y-1">
          <li>• Be specific about your requirements and desired output format</li>
          <li>• Include technology preferences (React, TypeScript, etc.)</li>
          <li>• Mention any constraints or special considerations</li>
          <li>• Use performance mode for quick iterations</li>
          <li>• Use quality mode for production-ready code</li>
        </ul>
      </div>
    </div>
  );
};