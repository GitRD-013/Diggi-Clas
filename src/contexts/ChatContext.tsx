import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Message = {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  showFaqs: boolean;
  setShowFaqs: React.Dispatch<React.SetStateAction<boolean>>;
  useOpenRouter: boolean;
  setUseOpenRouter: React.Dispatch<React.SetStateAction<boolean>>;
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  savedApiKey: string;
  setSavedApiKey: React.Dispatch<React.SetStateAction<string>>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "👋 Hi there! I'm your smart assistant. How can I help you manage your students today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFaqs, setShowFaqs] = useState(true);
  
  // OpenRouter API integration
  const [useOpenRouter, setUseOpenRouter] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3-sonnet');

  // Load saved API key from localStorage on component mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openRouterApiKey');
    if (storedApiKey) {
      setSavedApiKey(storedApiKey);
      setApiKey(storedApiKey);
    }
    
    const storedModel = localStorage.getItem('openRouterModel');
    if (storedModel) {
      setSelectedModel(storedModel);
    }
    
    const useAI = localStorage.getItem('useOpenRouter') === 'true';
    setUseOpenRouter(useAI);
  }, []);

  const clearChat = () => {
    setMessages([
      {
        text: "👋 Hi there! I'm your smart assistant. How can I help you manage your students today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setShowFaqs(true);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        inputValue,
        setInputValue,
        isTyping,
        setIsTyping,
        showFaqs,
        setShowFaqs,
        useOpenRouter,
        setUseOpenRouter,
        selectedModel,
        setSelectedModel,
        apiKey,
        setApiKey,
        savedApiKey,
        setSavedApiKey,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext; 