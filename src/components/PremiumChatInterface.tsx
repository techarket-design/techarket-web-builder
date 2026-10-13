import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Paperclip, X, Image, FileText, Database, Code2, CheckCircle, AlertCircle, Zap, MessageSquare, Wrench, Brain, Eye, Monitor, Square, Sparkles, Wand2, Target, Award, Crown, Gift, Coffee, Rocket, Heart, Flame, Bookmark, Star, Settings, Palette, Layers, Box, Circle, Triangle, Hexagon, Octagon, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Mic, MicOff, Camera, Video, Phone, PhoneOff, Share2, Download, Upload, Save, Edit3, Copy, Scissors, RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, Move, MousePointer, Crosshair, Grid3X3, Ruler, Compass, Map, Navigation, Anchor, Flag, MapPin, Globe, Wifi, WifiOff, Signal, Battery, BatteryLow, Power, PowerOff, Cpu, HardDrive, MemoryStick as Memory, Monitor as MonitorIcon, Smartphone, Tablet, Laptop, Watch, Headphones, Speaker, Keyboard, Mouse, Printer, Scan as Scanner, Webcam, Gamepad2, Joystick, Radio, Tv, Film, Music, Disc, CassetteTape as Cassette, Cylinder as Vinyl, Microscope as Microphone, VolumeIcon, PlayCircle, PauseCircle, StopCircle, FastForward, Rewind, Repeat, Shuffle, SkipBackIcon, SkipForwardIcon, Volume1, Volume2Icon, VolumeXIcon, Route as Mute, Route as Unmute, SpeakerIcon, HeadphonesIcon, MicroscopeIcon as MicrophoneIcon, MicIcon, MicOffIcon, CameraIcon, VideoIcon, PhoneIcon, PhoneOffIcon, PhoneCallIcon, PhoneIncomingIcon, PhoneOutgoingIcon, PhoneMissedIcon, MessageCircle, MessageSquareIcon, Mail, MailOpen, Inbox, Send as SendIcon, Reply, ReplyAll, Forward, Archive, Trash, Trash2, Delete, Backpack as Backspace, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsLeft, ChevronsRight, ChevronsUp, ChevronsDown, CornerDownLeft, CornerDownRight, CornerUpLeft, CornerUpRight, CornerLeftDown, CornerLeftUp, CornerRightDown, CornerRightUp, ArrowUpLeft, ArrowUpRight, ArrowDownLeft, ArrowDownRight, ArrowBigLeft, ArrowBigRight, ArrowBigUp, ArrowBigDown, ArrowBigUpDash, ArrowBigDownDash, ArrowBigLeftDash, ArrowBigRightDash, MoveHorizontal, MoveVertical, MoveDiagonal, MoveDiagonal2, Move3d, RotateCcwIcon, RotateCwIcon, FlipHorizontal, FlipVertical, FlipHorizontal2, FlipVertical2, Rotate3d, Rotate3DIcon as RotateIcon, RefreshCcw, RefreshCw, MousePointerClick as RotateCounterClockwise, RotateCw as RotateClockwise, Repeat1, Repeat2, RepeatIcon, ShuffleIcon, Command as Random, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, DicesIcon, Cast as Casino, Spade, Club, Diamond, Heart as HeartIcon, Guitar as Suit, Club as Clubs, Diamond as Diamonds, Heart as Hearts, Spade as Spades } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { AIMessage, FileAttachment } from '../types';

interface GenerationProgress {
  stage: string;
  progress: number;
  currentFile?: string;
  totalFiles?: number;
  completedFiles?: number;
}

interface PremiumChatInterfaceProps {
  messages: AIMessage[];
  onSendMessage: (message: string, attachments?: FileAttachment[], mode?: 'chat' | 'action') => void;
  isLoading: boolean;
  generationProgress?: GenerationProgress | null;
  streamingResponse?: string;
  onStopGeneration?: () => void;
}

interface ChatTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  icon: React.ComponentType<any>;
}

const chatThemes: ChatTheme[] = [
  {
    id: 'default',
    name: 'Techarket Blue',
    primary: 'from-blue-600 to-purple-600',
    secondary: 'from-blue-700 to-purple-700',
    accent: 'blue-500',
    background: 'gray-900',
    surface: 'gray-800',
    text: 'gray-200',
    icon: Zap
  },
  {
    id: 'emerald',
    name: 'Emerald Pro',
    primary: 'from-emerald-600 to-teal-600',
    secondary: 'from-emerald-700 to-teal-700',
    accent: 'emerald-500',
    background: 'gray-900',
    surface: 'gray-800',
    text: 'gray-200',
    icon: Crown
  },
  {
    id: 'rose',
    name: 'Rose Gold',
    primary: 'from-rose-600 to-pink-600',
    secondary: 'from-rose-700 to-pink-700',
    accent: 'rose-500',
    background: 'gray-900',
    surface: 'gray-800',
    text: 'gray-200',
    icon: Heart
  },
  {
    id: 'amber',
    name: 'Amber Glow',
    primary: 'from-amber-600 to-orange-600',
    secondary: 'from-amber-700 to-orange-700',
    accent: 'amber-500',
    background: 'gray-900',
    surface: 'gray-800',
    text: 'gray-200',
    icon: Flame
  }
];

export const PremiumChatInterface: React.FC<PremiumChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  generationProgress,
  streamingResponse,
  onStopGeneration
}) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [chatMode, setChatMode] = useState<'chat' | 'action'>('action');
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(chatThemes[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [messageSpacing, setMessageSpacing] = useState('comfortable');
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [showAvatars, setShowAvatars] = useState(true);
  const [showTypingIndicator, setShowTypingIndicator] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [messageFormat, setMessageFormat] = useState<'plain' | 'markdown' | 'code'>('markdown');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showContextPanel, setShowContextPanel] = useState(false);
  const [contextFiles, setContextFiles] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState<{id: string, title: string, date: Date}[]>([]);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<{id: string, title: string, prompt: string}[]>([]);
  const [showAISettings, setShowAISettings] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4000);
  const [topP, setTopP] = useState(0.9);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
  const [presencePenalty, setPresencePenalty] = useState(0.0);
  const [showCodeSnippets, setShowCodeSnippets] = useState(false);
  const [codeSnippets, setCodeSnippets] = useState<{id: string, language: string, code: string}[]>([]);
  const [showReactions, setShowReactions] = useState(false);
  const [messageReactions, setMessageReactions] = useState<Record<string, string[]>>({});
  const [showThreads, setShowThreads] = useState(false);
  const [messageThreads, setMessageThreads] = useState<Record<string, AIMessage[]>>({});
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarkedMessages, setBookmarkedMessages] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [messageTags, setMessageTags] = useState<Record<string, string[]>>({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showExport, setShowExport] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'markdown' | 'pdf' | 'html'>('json');
  const [showShare, setShowShare] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{id: string, message: string, type: 'info' | 'success' | 'warning' | 'error', timestamp: Date}[]>([]);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [showScreenReader, setShowScreenReader] = useState(false);
  const [showKeyboardNavigation, setShowKeyboardNavigation] = useState(false);
  const [showColorBlindMode, setShowColorBlindMode] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'>('none');
  const [showDyslexiaFont, setShowDyslexiaFont] = useState(false);
  const [showLineHeight, setShowLineHeight] = useState(false);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [showLetterSpacing, setShowLetterSpacing] = useState(false);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [showWordSpacing, setShowWordSpacing] = useState(false);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [showTextAlign, setShowTextAlign] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [showTextDirection, setShowTextDirection] = useState(false);
  const [textDirection, setTextDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [showTextTransform, setShowTextTransform] = useState(false);
  const [textTransform, setTextTransform] = useState<'none' | 'uppercase' | 'lowercase' | 'capitalize'>('none');
  const [showTextDecoration, setShowTextDecoration] = useState(false);
  const [textDecoration, setTextDecoration] = useState<'none' | 'underline' | 'overline' | 'line-through'>('none');
  const [showTextShadow, setShowTextShadow] = useState(false);
  const [textShadow, setTextShadow] = useState(false);
  const [showTextStroke, setShowTextStroke] = useState(false);
  const [textStroke, setTextStroke] = useState(false);
  const [showTextFill, setShowTextFill] = useState(false);
  const [textFill, setTextFill] = useState(false);
  const [showTextClip, setShowTextClip] = useState(false);
  const [textClip, setTextClip] = useState(false);
  const [showTextOverflow, setShowTextOverflow] = useState(false);
  const [textOverflow, setTextOverflow] = useState<'clip' | 'ellipsis'>('ellipsis');
  const [showWhiteSpace, setShowWhiteSpace] = useState(false);
  const [whiteSpace, setWhiteSpace] = useState<'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line'>('normal');
  const [showWordBreak, setShowWordBreak] = useState(false);
  const [wordBreak, setWordBreak] = useState<'normal' | 'break-all' | 'keep-all' | 'break-word'>('normal');
  const [showWordWrap, setShowWordWrap] = useState(false);
  const [wordWrap, setWordWrap] = useState<'normal' | 'break-word'>('normal');
  const [showHyphens, setShowHyphens] = useState(false);
  const [hyphens, setHyphens] = useState<'none' | 'manual' | 'auto'>('none');
  const [showOverflowWrap, setShowOverflowWrap] = useState(false);
  const [overflowWrap, setOverflowWrap] = useState<'normal' | 'break-word' | 'anywhere'>('normal');
  const [showTextRendering, setShowTextRendering] = useState(false);
  const [textRendering, setTextRendering] = useState<'auto' | 'optimizeSpeed' | 'optimizeLegibility' | 'geometricPrecision'>('auto');
  const [showFontKerning, setShowFontKerning] = useState(false);
  const [fontKerning, setFontKerning] = useState<'auto' | 'normal' | 'none'>('auto');
  const [showFontVariantLigatures, setShowFontVariantLigatures] = useState(false);
  const [fontVariantLigatures, setFontVariantLigatures] = useState<'normal' | 'none' | 'common-ligatures' | 'no-common-ligatures' | 'discretionary-ligatures' | 'no-discretionary-ligatures' | 'historical-ligatures' | 'no-historical-ligatures' | 'contextual' | 'no-contextual'>('normal');
  const [showFontVariantCaps, setShowFontVariantCaps] = useState(false);
  const [fontVariantCaps, setFontVariantCaps] = useState<'normal' | 'small-caps' | 'all-small-caps' | 'petite-caps' | 'all-petite-caps' | 'unicase' | 'titling-caps'>('normal');
  const [showFontVariantNumeric, setShowFontVariantNumeric] = useState(false);
  const [fontVariantNumeric, setFontVariantNumeric] = useState<'normal' | 'ordinal' | 'slashed-zero' | 'lining-nums' | 'oldstyle-nums' | 'proportional-nums' | 'tabular-nums' | 'diagonal-fractions' | 'stacked-fractions'>('normal');
  const [showFontVariantEastAsian, setShowFontVariantEastAsian] = useState(false);
  const [fontVariantEastAsian, setFontVariantEastAsian] = useState<'normal' | 'jis78' | 'jis83' | 'jis90' | 'jis04' | 'simplified' | 'traditional' | 'full-width' | 'proportional-width' | 'ruby'>('normal');
  const [showFontVariantAlternates, setShowFontVariantAlternates] = useState(false);
  const [fontVariantAlternates, setFontVariantAlternates] = useState<'normal' | 'historical-forms'>('normal');
  const [showFontVariantPosition, setShowFontVariantPosition] = useState(false);
  const [fontVariantPosition, setFontVariantPosition] = useState<'normal' | 'sub' | 'super'>('normal');
  const [showFontOpticalSizing, setShowFontOpticalSizing] = useState(false);
  const [fontOpticalSizing, setFontOpticalSizing] = useState<'auto' | 'none'>('auto');
  const [showFontFeatureSettings, setShowFontFeatureSettings] = useState(false);
  const [fontFeatureSettings, setFontFeatureSettings] = useState<'normal' | string>('normal');
  const [showFontVariationSettings, setShowFontVariationSettings] = useState(false);
  const [fontVariationSettings, setFontVariationSettings] = useState<'normal' | string>('normal');
  const [showFontPalette, setShowFontPalette] = useState(false);
  const [fontPalette, setFontPalette] = useState<'normal' | 'light' | 'dark'>('normal');
  const [showFontSynthesis, setShowFontSynthesis] = useState(false);
  const [fontSynthesis, setFontSynthesis] = useState<'none' | 'weight' | 'style' | 'small-caps' | 'weight style' | 'weight small-caps' | 'style small-caps' | 'weight style small-caps'>('weight style');
  const [showFontSizeAdjust, setShowFontSizeAdjust] = useState(false);
  const [fontSizeAdjust, setFontSizeAdjust] = useState<'none' | number>(0.5);
  const [showFontStretch, setShowFontStretch] = useState(false);
  const [fontStretch, setFontStretch] = useState<'normal' | 'ultra-condensed' | 'extra-condensed' | 'condensed' | 'semi-condensed' | 'semi-expanded' | 'expanded' | 'extra-expanded' | 'ultra-expanded' | string>('normal');
  const [showFontStyle, setShowFontStyle] = useState(false);
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic' | 'oblique' | string>('normal');
  const [showFontWeight, setShowFontWeight] = useState(false);
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold' | 'lighter' | 'bolder' | number>(400);
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [fontFamily, setFontFamily] = useState<string>('sans-serif');
  const [showFontSize, setShowFontSize] = useState(false);
  const [fontSizeValue, setFontSizeValue] = useState<string>('16px');
  const [showLineHeightValue, setShowLineHeightValue] = useState(false);
  const [lineHeightValue, setLineHeightValue] = useState<string>('1.5');
  const [showLetterSpacingValue, setShowLetterSpacingValue] = useState(false);
  const [letterSpacingValue, setLetterSpacingValue] = useState<string>('0');
  const [showWordSpacingValue, setShowWordSpacingValue] = useState(false);
  const [wordSpacingValue, setWordSpacingValue] = useState<string>('0');
  const [showTextIndent, setShowTextIndent] = useState(false);
  const [textIndent, setTextIndent] = useState<string>('0');
  const [showTextJustify, setShowTextJustify] = useState(false);
  const [textJustify, setTextJustify] = useState<'auto' | 'inter-word' | 'inter-character' | 'none'>('auto');
  const [showTextJustifyTrim, setShowTextJustifyTrim] = useState(false);
  const [textJustifyTrim, setTextJustifyTrim] = useState<'auto' | 'none' | 'start' | 'end' | 'start end'>('auto');
  const [showTextUnderlineOffset, setShowTextUnderlineOffset] = useState(false);
  const [textUnderlineOffset, setTextUnderlineOffset] = useState<string>('auto');
  const [showTextDecorationThickness, setShowTextDecorationThickness] = useState(false);
  const [textDecorationThickness, setTextDecorationThickness] = useState<string>('auto');
  const [showTextDecorationColor, setShowTextDecorationColor] = useState(false);
  const [textDecorationColor, setTextDecorationColor] = useState<string>('currentColor');
  const [showTextDecorationStyle, setShowTextDecorationStyle] = useState(false);
  const [textDecorationStyle, setTextDecorationStyle] = useState<'solid' | 'double' | 'dotted' | 'dashed' | 'wavy'>('solid');
  const [showTextDecorationLine, setShowTextDecorationLine] = useState(false);
  const [textDecorationLine, setTextDecorationLine] = useState<'none' | 'underline' | 'overline' | 'line-through' | 'underline overline' | 'underline line-through' | 'overline line-through' | 'underline overline line-through'>('none');
  const [showTextEmphasis, setShowTextEmphasis] = useState(false);
  const [textEmphasis, setTextEmphasis] = useState<'none' | 'filled' | 'open' | 'dot' | 'circle' | 'double-circle' | 'triangle' | 'sesame' | 'filled sesame'>('none');
  const [showTextEmphasisColor, setShowTextEmphasisColor] = useState(false);
  const [textEmphasisColor, setTextEmphasisColor] = useState<string>('currentColor');
  const [showTextEmphasisPosition, setShowTextEmphasisPosition] = useState(false);
  const [textEmphasisPosition, setTextEmphasisPosition] = useState<'over' | 'under' | 'over right' | 'over left' | 'under right' | 'under left'>('over');
  const [showTextEmphasisStyle, setShowTextEmphasisStyle] = useState(false);
  const [textEmphasisStyle, setTextEmphasisStyle] = useState<'none' | 'filled' | 'open' | 'dot' | 'circle' | 'double-circle' | 'triangle' | 'sesame' | 'filled sesame'>('none');
  const [showTextShadowColor, setShowTextShadowColor] = useState(false);
  const [textShadowColor, setTextShadowColor] = useState<string>('currentColor');
  const [showTextShadowBlur, setShowTextShadowBlur] = useState(false);
  const [textShadowBlur, setTextShadowBlur] = useState<string>('0');
  const [showTextShadowOffsetX, setShowTextShadowOffsetX] = useState(false);
  const [textShadowOffsetX, setTextShadowOffsetX] = useState<string>('0');
  const [showTextShadowOffsetY, setShowTextShadowOffsetY] = useState(false);
  const [textShadowOffsetY, setTextShadowOffsetY] = useState<string>('0');
  const [showTextStrokeColor, setShowTextStrokeColor] = useState(false);
  const [textStrokeColor, setTextStrokeColor] = useState<string>('currentColor');
  const [showTextStrokeWidth, setShowTextStrokeWidth] = useState(false);
  const [textStrokeWidth, setTextStrokeWidth] = useState<string>('0');
  const [showTextFillColor, setShowTextFillColor] = useState(false);
  const [textFillColor, setTextFillColor] = useState<string>('currentColor');
  const [showTextOrientation, setShowTextOrientation] = useState(false);
  const [textOrientation, setTextOrientation] = useState<'mixed' | 'upright' | 'sideways' | 'sideways-right' | 'use-glyph-orientation'>('mixed');
  const [showWritingMode, setShowWritingMode] = useState(false);
  const [writingMode, setWritingMode] = useState<'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr'>('horizontal-tb');
  const [showTextCombineUpright, setShowTextCombineUpright] = useState(false);
  const [textCombineUpright, setTextCombineUpright] = useState<'none' | 'all' | 'digits' | number>('none');
  const [showTextOrientation2, setShowTextOrientation2] = useState(false);
  const [textOrientation2, setTextOrientation2] = useState<'mixed' | 'upright' | 'sideways' | 'sideways-right' | 'use-glyph-orientation'>('mixed');
  const [showWritingMode2, setShowWritingMode2] = useState(false);
  const [writingMode2, setWritingMode2] = useState<'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr'>('horizontal-tb');
  const [showTextCombineUpright2, setShowTextCombineUpright2] = useState(false);
  const [textCombineUpright2, setTextCombineUpright2] = useState<'none' | 'all' | 'digits' | number>('none');
  const [showTextOrientation3, setShowTextOrientation3] = useState(false);
  const [textOrientation3, setTextOrientation3] = useState<'mixed' | 'upright' | 'sideways' | 'sideways-right' | 'use-glyph-orientation'>('mixed');
  const [showWritingMode3, setShowWritingMode3] = useState(false);
  const [writingMode3, setWritingMode3] = useState<'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr'>('horizontal-tb');
  const [showTextCombineUpright3, setShowTextCombineUpright3] = useState(false);
  const [textCombineUpright3, setTextCombineUpright3] = useState<'none' | 'all' | 'digits' | number>('none');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, generationProgress, streamingResponse]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const attachment: FileAttachment = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          content: reader.result!,
          preview: file.type.startsWith('image/') ? reader.result as string : undefined
        };
        setAttachments(prev => [...prev, attachment]);
      };
      
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
      'text/*': ['.txt', '.md', '.json', '.js', '.ts', '.tsx', '.jsx', '.css', '.html'],
      'application/json': ['.json']
    }
  });

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || attachments.length > 0) && !isLoading) {
      onSendMessage(input.trim(), attachments, chatMode);
      setInput('');
      setAttachments([]);
    }
  };

  const chatSuggestions = [
    {
      icon: MessageSquare,
      text: "Explain the difference between React hooks and class components",
      category: "Learning"
    },
    {
      icon: Database,
      text: "What are the best practices for database design?",
      category: "Database"
    },
    {
      icon: Code2,
      text: "How do I optimize my React app for performance?",
      category: "Optimization"
    },
    {
      icon: Brain,
      text: "Explain how authentication works in modern web apps",
      category: "Security"
    }
  ];

  const actionSuggestions = [
    {
      icon: Code2,
      text: "Build me a modern e-commerce website with React and Tailwind",
      category: "Full Stack"
    },
    {
      icon: Database,
      text: "Create a blog platform with user authentication and comments",
      category: "Web App"
    },
    {
      icon: Image,
      text: "Build a portfolio website with dark mode and animations",
      category: "Frontend"
    },
    {
      icon: FileText,
      text: "Create a task management app with drag and drop",
      category: "Productivity"
    }
  ];

  const suggestions = chatMode === 'chat' ? chatSuggestions : actionSuggestions;

  const getProgressIcon = (stage: string) => {
    switch (stage) {
      case 'analyzing': return <Zap className="animate-pulse" />;
      case 'generating': return <Code2 className="animate-spin" />;
      case 'structuring': return <FileText className="animate-bounce" />;
      case 'optimizing': return <CheckCircle className="animate-pulse" />;
      default: return <Loader className="animate-spin" />;
    }
  };

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case 'analyzing': return 'Analyzing your request with AI...';
      case 'generating': return 'Generating code with advanced AI models...';
      case 'structuring': return 'Structuring project files and components...';
      case 'optimizing': return 'Optimizing code and adding Techarket branding...';
      case 'finalizing': return 'Finalizing project structure...';
      default: return 'Processing your request...';
    }
  };

  const renderLivePreview = () => {
    if (!showLivePreview || chatMode !== 'action' || !isLoading) return null;

    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-200 flex items-center space-x-2">
            <Monitor size={16} className="text-blue-400" />
            <span>Live Preview - AI Building Your App</span>
          </h4>
          <button
            onClick={() => setShowLivePreview(false)}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>

        {generationProgress && (
          <div className="space-y-3">
            {/* Current Stage */}
            <div className="flex items-center space-x-2">
              {getProgressIcon(generationProgress.stage)}
              <span className="text-sm font-medium text-gray-200">
                {getStageDescription(generationProgress.stage)}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${currentTheme.primary} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${generationProgress.progress}%` }}
              />
            </div>

            {/* File Progress */}
            {generationProgress.currentFile && (
              <div className="bg-gray-900 rounded p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-300">Creating: {generationProgress.currentFile}</span>
                  {generationProgress.totalFiles && (
                    <span className="text-gray-400">
                      {generationProgress.completedFiles || 0} / {generationProgress.totalFiles} files
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Stage-specific preview */}
            <div className="bg-gray-900 rounded p-3 text-xs">
              {generationProgress.stage === 'analyzing' && (
                <div className="text-blue-300">
                  🧠 AI is understanding your requirements and planning the application structure...
                </div>
              )}
              {generationProgress.stage === 'generating' && (
                <div className="text-green-300">
                  ⚡ Creating React components, pages, and utility functions with modern best practices...
                </div>
              )}
              {generationProgress.stage === 'structuring' && (
                <div className="text-yellow-300">
                  📁 Organizing project files, setting up configurations, and preparing build tools...
                </div>
              )}
              {generationProgress.stage === 'optimizing' && (
                <div className="text-purple-300">
                  🎨 Adding Techarket branding, optimizing performance, and finalizing documentation...
                </div>
              )}
              {generationProgress.stage === 'finalizing' && (
                <div className="text-green-300">
                  ✨ Almost ready! Applying final touches and preparing your production-ready application...
                </div>
              )}
            </div>

            {/* Simulated file creation preview */}
            {generationProgress.stage === 'generating' && (
              <div className="bg-gray-900 rounded p-3">
                <div className="text-xs text-gray-400 mb-2">Recently created files:</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle size={12} />
                    <span>src/App.tsx - Main application component</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle size={12} />
                    <span>src/components/Header.tsx - Navigation header</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-400">
                    <Loader size={12} className="animate-spin" />
                    <span>src/components/Footer.tsx - Creating...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      case 'xlarge': return 'text-xl';
      default: return 'text-base';
    }
  };

  const getSpacingClass = () => {
    switch (messageSpacing) {
      case 'compact': return 'space-y-2';
      case 'spacious': return 'space-y-6';
      default: return 'space-y-4';
    }
  };

  const toggleBookmark = (messageId: string) => {
    setBookmarkedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const addReaction = (messageId: string, reaction: string) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), reaction]
    }));
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // In a real implementation, this would start recording
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Simulate recording for 5 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsRecording(false);
      setRecordingTime(0);
      setInput("This is a voice transcription example. In a real implementation, this would be the transcribed text from your voice recording.");
    }, 5000);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex flex-col h-full bg-${currentTheme.background} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`} {...getRootProps()}>
      <input {...getInputProps()} />
      
      {isDragActive && (
        <div className={`absolute inset-0 bg-${currentTheme.accent}/20 border-2 border-dashed border-${currentTheme.accent}-400 rounded-lg flex items-center justify-center z-50`}>
          <div className="text-center">
            <Paperclip size={48} className={`mx-auto mb-4 text-${currentTheme.accent}-400`} />
            <p className={`text-${currentTheme.accent}-400 font-medium`}>Drop files here to analyze</p>
          </div>
        </div>
      )}

      {/* Enhanced Header with Theme Selector */}
      <div className={`p-4 border-b border-gray-700 bg-${currentTheme.surface}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex bg-gray-700 rounded-xl p-1">
            <button
              onClick={() => setChatMode('chat')}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                chatMode === 'chat'
                  ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg transform scale-105`
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600'
              }`}
            >
              <MessageSquare size={16} />
              <span>Chat Mode</span>
            </button>
            <button
              onClick={() => setChatMode('action')}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                chatMode === 'action'
                  ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg transform scale-105`
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-600'
              }`}
            >
              <Wrench size={16} />
              <span>Action Mode</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors`}
                title="Settings"
              >
                <Settings size={18} />
              </button>
              
              {showSettings && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 p-3">
                  <h4 className="text-sm font-medium text-gray-200 mb-3">Chat Settings</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Theme</label>
                      <div className="grid grid-cols-2 gap-2">
                        {chatThemes.map(theme => {
                          const ThemeIcon = theme.icon;
                          return (
                            <button
                              key={theme.id}
                              onClick={() => setCurrentTheme(theme)}
                              className={`p-2 rounded flex items-center space-x-2 ${
                                currentTheme.id === theme.id
                                  ? `bg-gradient-to-r ${theme.primary} text-white`
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              <ThemeIcon size={14} />
                              <span className="text-xs">{theme.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Font Size</label>
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xlarge">Extra Large</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Message Spacing</label>
                      <select
                        value={messageSpacing}
                        onChange={(e) => setMessageSpacing(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                      >
                        <option value="compact">Compact</option>
                        <option value="comfortable">Comfortable</option>
                        <option value="spacious">Spacious</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={showTimestamps}
                          onChange={(e) => setShowTimestamps(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-gray-300">Show timestamps</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={showAvatars}
                          onChange={(e) => setShowAvatars(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-gray-300">Show avatars</span>
                      </label>
                      
                      <label className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={showTypingIndicator}
                          onChange={(e) => setShowTypingIndicator(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-gray-300">Show typing indicator</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Preview Toggle for Action Mode */}
            {chatMode === 'action' && (
              <button
                onClick={() => setShowLivePreview(!showLivePreview)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  showLivePreview
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                <Eye size={16} />
                <span>Live Preview</span>
              </button>
            )}

            {/* Stop Generation Button */}
            {isLoading && onStopGeneration && (
              <button
                onClick={onStopGeneration}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Square size={16} />
                <span>Stop</span>
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-400">
            {chatMode === 'chat' 
              ? '💬 Ask questions, get explanations, and learn from AI'
              : '🚀 Generate code, build apps, and edit your project with AI assistance'
            }
          </p>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 ${getSpacingClass()}`}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img 
                src="/techarket-logo.jpeg" 
                alt="Techarket AI" 
                className="w-16 h-16 rounded-xl object-cover shadow-lg"
              />
              <Bot size={64} className={`text-${currentTheme.accent}-400`} />
            </div>
            <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${currentTheme.primary} bg-clip-text text-transparent`}>
              {chatMode === 'chat' ? 'Chat with Techarket AI' : 'Build with Techarket AI'}
            </h3>
            <p className="text-lg mb-8 text-gray-300">
              {chatMode === 'chat' 
                ? 'Ask questions, get explanations, and learn about web development'
                : 'Generate complete applications using universal AI integration'
              }
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setInput(suggestion.text)}
                    className={`p-6 bg-${currentTheme.surface} rounded-xl border border-gray-700 hover:border-${currentTheme.accent}-500 hover:bg-gray-750 transition-all duration-200 text-left group transform hover:scale-105`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 bg-${currentTheme.accent}-600/20 rounded-lg group-hover:bg-${currentTheme.accent}-600/30 transition-colors`}>
                        <Icon size={24} className={`text-${currentTheme.accent}-400 group-hover:text-${currentTheme.accent}-300`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-200 group-hover:text-white mb-2">
                          {suggestion.text}
                        </p>
                        <p className="text-sm text-gray-500 group-hover:text-gray-400">{suggestion.category}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Live Preview Panel */}
            {renderLivePreview()}

            {/* Enhanced Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-4xl p-6 rounded-2xl shadow-lg ${
                    message.role === 'user'
                      ? `bg-gradient-to-r ${currentTheme.primary} text-white`
                      : `bg-${currentTheme.surface} text-${currentTheme.text} border border-gray-700`
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {showAvatars && (
                      <div className="flex-shrink-0">
                        {message.role === 'user' ? (
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <User size={20} />
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <img 
                              src="/techarket-logo.jpeg" 
                              alt="Techarket AI" 
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mb-4 space-y-2">
                          {message.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center space-x-2 text-sm opacity-80">
                              {attachment.type.startsWith('image/') ? (
                                <Image size={16} />
                              ) : (
                                <FileText size={16} />
                              )}
                              <span>{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className={`whitespace-pre-wrap font-sans leading-relaxed ${getFontSizeClass()}`}>
                        {message.content}
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-xs opacity-70 flex items-center space-x-3">
                          {showTimestamps && (
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                          )}
                          {message.mode && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              message.mode === 'chat' 
                                ? `bg-blue-600/20 text-blue-300` 
                                : `bg-${currentTheme.accent}-600/20 text-${currentTheme.accent}-300`
                            }`}>
                              {message.mode === 'chat' ? '💬 Chat' : '🚀 Action'}
                            </span>
                          )}
                        </div>

                        {/* Message Actions */}
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleBookmark(message.id)}
                            className={`p-1 rounded hover:bg-gray-700 ${
                              bookmarkedMessages.includes(message.id) 
                                ? 'text-yellow-400' 
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                            title={bookmarkedMessages.includes(message.id) ? 'Remove bookmark' : 'Bookmark'}
                          >
                            <Bookmark size={14} className={bookmarkedMessages.includes(message.id) ? 'fill-current' : ''} />
                          </button>
                          
                          <button
                            onClick={() => setShowReactions(true)}
                            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                            title="Add reaction"
                          >
                            <Heart size={14} />
                          </button>
                          
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(message.content);
                            }}
                            className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-gray-300"
                            title="Copy to clipboard"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Message Reactions */}
                      {messageReactions[message.id] && messageReactions[message.id].length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {messageReactions[message.id].map((reaction, index) => (
                            <span key={index} className="bg-gray-700 rounded-full px-2 py-0.5 text-xs">
                              {reaction}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Enhanced Streaming Response */}
        {streamingResponse && (
          <div className="flex justify-start">
            <div className={`bg-${currentTheme.surface} text-${currentTheme.text} p-6 rounded-2xl border border-gray-700 max-w-4xl shadow-lg`}>
              <div className="flex items-start space-x-4">
                {showAvatars && (
                  <div className="flex items-center space-x-2">
                    <img 
                      src="/techarket-logo.jpeg" 
                      alt="Techarket AI" 
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className={`whitespace-pre-wrap font-sans leading-relaxed ${getFontSizeClass()}`}>
                    {streamingResponse}
                    <span className={`inline-block w-3 h-6 bg-${currentTheme.accent}-400 ml-1 animate-pulse`}></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Loading State with Progress */}
        {isLoading && chatMode === 'action' && !showLivePreview && (
          <div className="flex justify-start">
            <div className={`bg-${currentTheme.surface} text-${currentTheme.text} p-6 rounded-2xl border border-gray-700 max-w-4xl shadow-lg`}>
              <div className="flex items-start space-x-4">
                {showAvatars && (
                  <div className="flex items-center space-x-2">
                    <img 
                      src="/techarket-logo.jpeg" 
                      alt="Techarket AI" 
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  {generationProgress ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        {getProgressIcon(generationProgress.stage)}
                        <span className="text-lg font-medium">
                          {getStageDescription(generationProgress.stage)}
                        </span>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r ${currentTheme.primary} h-3 rounded-full transition-all duration-300 relative overflow-hidden`}
                          style={{ width: `${generationProgress.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                      
                      {/* File Progress */}
                      {generationProgress.currentFile && (
                        <div className="text-sm text-gray-400">
                          <div className="flex items-center justify-between">
                            <span className="text-blue-300">✨ Creating: {generationProgress.currentFile}</span>
                            {generationProgress.totalFiles && (
                              <span>
                                {generationProgress.completedFiles || 0} / {generationProgress.totalFiles} files
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Stage-specific messages */}
                      <div className="text-sm text-blue-300 bg-blue-900/20 rounded-lg p-3">
                        {generationProgress.stage === 'analyzing' && "🧠 AI is understanding your requirements..."}
                        {generationProgress.stage === 'generating' && "⚡ Creating components and pages with AI..."}
                        {generationProgress.stage === 'structuring' && "📁 Organizing project structure..."}
                        {generationProgress.stage === 'optimizing' && "🎨 Adding Techarket branding and optimizations..."}
                        {generationProgress.stage === 'finalizing' && "✨ Almost ready! Finalizing your project..."}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Loader size={20} className="animate-spin" />
                      <span className="text-lg">Connecting to AI...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simple loading for chat mode */}
        {isLoading && chatMode === 'chat' && showTypingIndicator && (
          <div className="flex justify-start">
            <div className={`bg-${currentTheme.surface} text-${currentTheme.text} p-6 rounded-2xl border border-gray-700 max-w-4xl shadow-lg`}>
              <div className="flex items-start space-x-4">
                {showAvatars && (
                  <div className="flex items-center space-x-2">
                    <img 
                      src="/techarket-logo.jpeg" 
                      alt="Techarket AI" 
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Brain size={20} className={`animate-pulse text-${currentTheme.accent}-400`} />
                    <span className="text-lg">Thinking with AI...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Attachments Preview */}
      {attachments.length > 0 && (
        <div className={`p-4 border-t border-gray-700 bg-${currentTheme.surface}`}>
          <div className="flex flex-wrap gap-3">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="relative bg-gray-700 rounded-xl p-3 flex items-center space-x-3 group">
                {attachment.preview ? (
                  <img src={attachment.preview} alt={attachment.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-blue-400" />
                  </div>
                )}
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-300 block truncate max-w-32">{attachment.name}</span>
                  <span className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(1)} KB</span>
                </div>
                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Input Form */}
      <form onSubmit={handleSubmit} className={`p-6 border-t border-gray-700 bg-${currentTheme.surface}`}>
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            {isVoiceMode && isRecording ? (
              <div className={`w-full bg-gray-700 border border-${currentTheme.accent}-500 rounded-xl px-6 py-4 text-white flex items-center justify-center`}>
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full bg-${currentTheme.accent}-600 flex items-center justify-center mb-2 animate-pulse`}>
                    <Mic size={32} className="text-white" />
                  </div>
                  <div className="text-lg font-medium">{formatRecordingTime(recordingTime)}</div>
                  <div className="text-sm text-gray-400 mt-1">Recording...</div>
                </div>
              </div>
            ) : (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={
                  chatMode === 'chat' 
                    ? "Ask me anything about web development..."
                    : "Describe your app idea - I'll build it with AI..."
                }
                className={`w-full bg-gray-700 border border-gray-600 rounded-xl px-6 py-4 pr-16 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${currentTheme.accent}-500 focus:border-transparent resize-none`}
                disabled={isLoading || isRecording}
                rows={input.split('\n').length || 1}
                style={{ minHeight: '60px', maxHeight: '200px' }}
              />
            )}
            
            <div className="absolute right-4 top-4 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsVoiceMode(!isVoiceMode)}
                className={`p-1.5 rounded-full ${
                  isVoiceMode 
                    ? `bg-${currentTheme.accent}-600 text-white` 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                title={isVoiceMode ? 'Switch to text input' : 'Switch to voice input'}
              >
                {isVoiceMode ? <Keyboard size={18} /> : <Mic size={18} />}
              </button>
              
              <label className="cursor-pointer text-gray-400 hover:text-gray-300">
                <Paperclip size={20} />
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    onDrop(files);
                  }}
                  accept="image/*,.txt,.md,.json,.js,.ts,.tsx,.jsx,.css,.html"
                />
              </label>
            </div>
          </div>
          
          {isVoiceMode ? (
            <button
              type="button"
              onClick={isRecording ? () => setIsRecording(false) : startVoiceRecording}
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700'
                  : `bg-gradient-to-r ${currentTheme.primary} hover:${currentTheme.secondary}`
              } text-white shadow-lg transform hover:scale-105`}
            >
              {isRecording ? (
                <>
                  <Square size={20} />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Mic size={20} />
                  <span>Record</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={(!input.trim() && attachments.length === 0) || isLoading}
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 ${
                chatMode === 'chat'
                  ? `bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800`
                  : `bg-gradient-to-r ${currentTheme.primary} hover:${currentTheme.secondary}`
              } disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white shadow-lg transform hover:scale-105`}
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  <span>{chatMode === 'chat' ? 'Thinking...' : 'Building...'}</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>{chatMode === 'chat' ? 'Ask' : 'Build'}</span>
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Enhanced Quick tip */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Zap size={12} className={`text-${currentTheme.accent}-400`} />
            <span>
              {chatMode === 'chat' 
                ? 'Chat mode: Get explanations and learn from AI'
                : 'Action mode: Generate and edit code with AI - Enable Live Preview to see the building process!'
              }
            </span>
          </div>
          <div className="text-gray-600">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </form>
    </div>
  );
};