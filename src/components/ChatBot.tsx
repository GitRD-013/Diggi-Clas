import React, { useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Fab,
  Zoom,
  Collapse,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  Close,
  Send,
  Psychology,
  Memory,
  AutoAwesome,
  Settings,
  Key,
  School,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useChat } from '../contexts/ChatContext';
import { generateAIResponseWithData } from '../utils/aiDataService';

// Styled components
const ChatContainer = styled(Card)(({ theme }) => ({
  height: '70vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 20,
  overflow: 'hidden',
  background: 'rgba(18, 18, 40, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  marginBottom: theme.spacing(4),
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '16px 20px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  background: 'rgba(124, 58, 237, 0.15)',
}));

const MessageList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.05)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(124, 58, 237, 0.5)',
    borderRadius: '6px',
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: '12px',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'flex',
  alignItems: 'center',
}));

const UserMessage = styled(Box)(({ theme }) => ({
  alignSelf: 'flex-end',
  background: 'rgba(124, 58, 237, 0.2)',
  borderRadius: '18px 18px 4px 18px',
  padding: '10px 16px',
  maxWidth: '75%',
}));

const BotMessage = styled(Box)(({ theme }) => ({
  alignSelf: 'flex-start',
  background: 'rgba(255, 255, 255, 0.08)',
  borderRadius: '18px 18px 18px 4px',
  padding: '10px 16px',
  maxWidth: '75%',
}));

const FaqItem = styled(ListItem)(({ theme }) => ({
  padding: '12px 16px',
  borderRadius: '12px',
  margin: '6px 0',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
  },
}));

// Knowledge base for the chatbot
const knowledgeBase = {
  // No longer used - we're using institution-specific data now
  systemInfo: {
    description: "Student management platform for educational institutions to manage students, fees, performance, and attendance."
  },
  features: [
    "Student record management",
    "Fee tracking and payment processing", 
    "Attendance monitoring",
    "Performance analysis"
  ]
};

// Popular questions
const popularQuestions = [
  "How can I view attendance for a student?",
  "How do I add a new student?",
  "How can I check pending fees?",
  "How do I generate a performance report?"
];

// Available models in OpenRouter
const availableModels = [
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus (Best Quality)' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet (Balanced)' },
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B (Fast)' },
  { id: 'google/gemini-pro', name: 'Gemini Pro' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Economical)' },
];

const ChatBot: React.FC = () => {
  // Get state from context instead of using local state
  const {
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
    setSavedApiKey
  } = useChat();
  
  const [openSettings, setOpenSettings] = React.useState(false);
  const [apiKeyError, setApiKeyError] = React.useState('');
  const [showApiAlert, setShowApiAlert] = React.useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      text: inputValue,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setShowFaqs(false);
    setIsTyping(true);

    let botResponse: string;

    // Use OpenRouter API if enabled and API key is provided
    if (useOpenRouter && savedApiKey) {
      try {
        botResponse = await getOpenRouterResponse(inputValue);
      } catch (error: any) {
        console.error('Error with OpenRouter API:', error);
        botResponse = "I'm having trouble connecting to my AI service right now. Let me answer with my built-in knowledge instead.\n\n" + 
                      generateLocalResponse(inputValue);
        // Temporarily disable OpenRouter due to error
        setShowApiAlert(true);
        setTimeout(() => setShowApiAlert(false), 8000);
      }
    } else {
      // Use local response generation
      botResponse = generateLocalResponse(inputValue);
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: botResponse, sender: 'bot' as const, timestamp: new Date() },
      ]);
      setIsTyping(false);
    }, useOpenRouter ? 300 : 1000); // Shorter delay for OpenRouter as it already has inherent processing time
  };

  // Function to call OpenRouter API
  const getOpenRouterResponse = async (query: string): Promise<string> => {
    const baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
    
    // Fetch real data-enriched system context
    const systemContext = await generateAIResponseWithData(query);
    
    // Create messages array for the API
    const apiMessages = [
      {
        role: "system",
        content: systemContext
      }
    ];
    
    // Add conversation history
    messages.forEach(msg => {
      apiMessages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      });
    });
    
    // Add current query
    apiMessages.push({
      role: "user",
      content: query
    });
    
    const requestBody = {
      messages: apiMessages,
      model: selectedModel,
      temperature: 0.5,
      max_tokens: 1000,
    };

    try {
      console.log("Calling OpenRouter API with model:", selectedModel);
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${savedApiKey}`,
          'HTTP-Referer': window.location.origin, // Required by OpenRouter
          'X-Title': 'Student Management AI Assistant' // Updated app name
        },
        body: JSON.stringify(requestBody),
      });

      console.log("OpenRouter API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API error response:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(`OpenRouter API error: ${errorData.error?.message || errorData.message || 'Unknown error'}`);
        } catch (parseError) {
          throw new Error(`OpenRouter API error: Status ${response.status} - ${errorText || 'Unknown error'}`);
        }
      }

      const data = await response.json();
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error("Unexpected OpenRouter API response format:", data);
        throw new Error("Unexpected response format from OpenRouter API");
      }
      
      return data.choices[0].message.content.trim();
    } catch (error: any) {
      console.error('Error calling OpenRouter API:', error);
      
      // Show more specific error in UI
      setMessages(prev => [
        ...prev,
        {
          text: `Error connecting to OpenRouter: ${error.message || 'Unknown error'}. I'll answer with my built-in knowledge instead.`,
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      
      throw error;
    }
  };

  const handleFaqClick = (question: string) => {
    setInputValue(question);
    sendMessage();
  };

  // Original local response generator function
  const generateLocalResponse = (input: string): string => {
    const query = input.toLowerCase();

    // Handle specific questions about the application data
    if (query.includes('how many student') || query.includes('number of student') || query.includes('student count')) {
      return "There are currently 5 students in the Student Management page.";
    }

    // Handle questions about viewing attendance
    if (query.includes('view attendance') || query.includes('check attendance') || query.includes('student attendance')) {
      return "To view a student's attendance: Navigate to the Attendance section from the sidebar, select a student from the list, and you'll see their attendance history. You can filter by date range or export the data as needed.";
    }

    // Handle questions about adding students
    if (query.includes('add student') || query.includes('new student') || query.includes('create student')) {
      return "To add a new student: Click the '+ Add Student' button in the Student Management page, fill in the required information in the form, and click 'Save'. The new student will appear in your student list immediately.";
    }

    // Handle questions about checking fees
    if (query.includes('fee') || query.includes('payment') || query.includes('pending fee') || query.includes('due')) {
      return "To check pending fees: Go to the Fees section from the sidebar, where you'll see all students with payment status. Students with pending fees are highlighted. You can filter by payment status or generate payment reminders.";
    }

    // Handle questions about performance reports
    if (query.includes('performance') || query.includes('report') || query.includes('generate report') || query.includes('academic')) {
      return "To generate a performance report: Navigate to the Performance section, select the student(s) and time period, choose the metrics you want to include, and click 'Generate Report'. You can view online or download as PDF.";
    }

    // Handle questions about student records
    if (query.includes('student') || query.includes('database') || query.includes('record') || 
        query.includes('profile') || query.includes('information')) {
      return "You can manage all student records from the Student Management section. Each student profile contains personal details, contact information, fee status, attendance records, and performance metrics.";
    }

    // Check for founder information
    if (query.includes('founder') || query.includes('who created') || query.includes('who made') || query.includes('rupam')) {
      return "Rupam Debnath is the founder of Diggi-Class. He created this tool to simplify student management for teachers and institutions.";
    }

    // Check for product information
    if (query.includes('what is diggi') || query.includes('about diggi') || query.includes('tell me about diggi')) {
      return "Diggi-Class is a student management platform designed for educational institutions to manage students, fees, performance, and attendance in one place.";
    }

    // Check for use cases
    if (query.includes('use case') || query.includes('how can i use') || query.includes('who can use')) {
      return "Diggi-Class Use Cases:\n• Schools can track student records and fee payments\n• Tuition centers can monitor performance and attendance\n• Teachers can manage class lists and generate invoices for students";
    }

    // Check for pricing information
    if (query.includes('price') || query.includes('cost') || query.includes('pricing') || query.includes('plan')) {
      return "Diggi-Class Pricing Plans:\n• Basic: ₹0/month (up to 25 students)\n• Pro: ₹99/month (up to 500 students)\n• Premium: ₹199/month (unlimited students)";
    }

    // Check for contact information
    if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('whatsapp')) {
      return "Contact Information:\n• Email: itsrupamdebnath@gmail.com\n• WhatsApp: https://wa.me/918402802480";
    }

    // Check for support information
    if (query.includes('support') || query.includes('help') || query.includes('assistance')) {
      return "Support Options:\n• Visit the \"Contact Us\" section on the dashboard\n• Use the built-in chatbot for FAQs\n• Email support available for plan or payment issues";
    }

    // Check for getting started information
    if (query.includes('get started') || query.includes('start') || query.includes('begin') || query.includes('setup')) {
      return "Getting Started with Diggi-Class:\n• Create an account\n• Add your institution or class\n• Start adding students and tracking progress";
    }

    // Check for dashboard/features information
    if (query.includes('dashboard') || query.includes('feature') || query.includes('module') || query.includes('function')) {
      return "Diggi-Class Dashboard includes modules for:\n• Student Management\n• Fees\n• Attendance\n• Performance\n• Reports\n• Analytics\n• And more!";
    }

    // Default response
    return "I'm here to help you manage your institution and students. You can ask about student data, attendance tracking, fee management, or performance reports. You can also ask about Diggi-Class features and pricing. How can I assist you today?";
  };

  // Settings dialog handlers
  const handleOpenSettings = () => {
    setOpenSettings(true);
    setApiKey(savedApiKey);
    setApiKeyError('');
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const handleSaveApiKey = async () => {
    // Clear previous errors
    setApiKeyError('');
    
    // If trying to use OpenRouter without an API key
    if (!apiKey && useOpenRouter) {
      setApiKeyError('API key is required to use OpenRouter AI');
      return;
    }
    
    if (apiKey) {
      // Basic validation - OpenRouter API keys are typically long strings
      if (apiKey.length < 20 || !apiKey.startsWith('sk-or-')) {
        setApiKeyError('Invalid API key format. OpenRouter keys start with "sk-or-"');
        return;
      }
      
      if (useOpenRouter) {
        // Test the API key before saving
        setApiKeyError('Testing connection...');
        
        try {
          // Simple test request
          const testUrl = 'https://openrouter.ai/api/v1/models';
          const response = await fetch(testUrl, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'HTTP-Referer': window.location.origin,
            }
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error("API key test failed:", errorText);
            
            try {
              const errorData = JSON.parse(errorText);
              setApiKeyError(`Invalid API key: ${errorData.error || errorData.message || 'Unknown error'}`);
            } catch (e) {
              setApiKeyError(`Connection error: ${response.status} ${response.statusText}`);
            }
            return;
          }
          
          // If successful, save the API key and model
          localStorage.setItem('openRouterApiKey', apiKey);
          localStorage.setItem('openRouterModel', selectedModel);
          localStorage.setItem('useOpenRouter', useOpenRouter.toString());
          setSavedApiKey(apiKey);
          
          // Add a message to the chat if enabling OpenRouter
          if (!savedApiKey) {
            setMessages(prev => [
              ...prev,
              {
                text: `🔄 I've been upgraded with OpenRouter AI (${getModelName(selectedModel)})! I now have expanded knowledge and capabilities.`,
                sender: 'bot',
                timestamp: new Date()
              }
            ]);
          }
          
          handleCloseSettings();
          
        } catch (error: any) {
          console.error("Error testing API key:", error);
          setApiKeyError(`Connection error: ${error.message || 'Could not connect to OpenRouter API'}`);
          return;
        }
      } else {
        // If not using OpenRouter but still saving a key
        localStorage.setItem('openRouterApiKey', apiKey);
        localStorage.setItem('openRouterModel', selectedModel);
        localStorage.setItem('useOpenRouter', 'false');
        setSavedApiKey(apiKey);
        handleCloseSettings();
      }
    } else {
      // Remove API key if cleared
      localStorage.removeItem('openRouterApiKey');
      localStorage.removeItem('openRouterModel');
      localStorage.removeItem('useOpenRouter');
      setSavedApiKey('');
      setUseOpenRouter(false);
      handleCloseSettings();
    }
  };

  // Helper function to get readable model name
  const getModelName = (modelId: string): string => {
    const model = availableModels.find(m => m.id === modelId);
    return model ? model.name : modelId;
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="600" color="white">
          AI Assistant
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {savedApiKey && (
            <Tooltip title={useOpenRouter ? `Using ${getModelName(selectedModel)}` : "Using built-in AI"}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={useOpenRouter} 
                    onChange={(e) => {
                      setUseOpenRouter(e.target.checked);
                      localStorage.setItem('useOpenRouter', e.target.checked.toString());
                    }}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color="white" sx={{ ml: 0.5 }}>
                    AI
                  </Typography>
                }
                sx={{ mr: 2 }}
              />
            </Tooltip>
          )}
          
          <Tooltip title="AI Settings">
            <IconButton 
              onClick={handleOpenSettings}
              sx={{ 
                color: 'white', 
                bgcolor: 'rgba(124, 58, 237, 0.2)',
                '&:hover': { bgcolor: 'rgba(124, 58, 237, 0.3)' }
              }}
            >
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Collapse in={showApiAlert}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setShowApiAlert(false)}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          Error connecting to OpenRouter. Switched to built-in AI.
        </Alert>
      </Collapse>
      
      <Typography variant="body1" color="rgba(255, 255, 255, 0.7)" sx={{ mb: 4 }}>
        Ask questions about students, attendance, fees, or get help with any platform features.
        {useOpenRouter && <Typography component="span" sx={{ ml: 1, color: 'primary.main', fontWeight: 500 }}>
          Using {getModelName(selectedModel)}
        </Typography>}
      </Typography>
      
      <ChatContainer>
        <ChatHeader>
          <Avatar
            sx={{
              bgcolor: useOpenRouter ? '#10a37f' : 'primary.main',
              width: 38,
              height: 38,
              mr: 1.5,
              boxShadow: '0 0 10px rgba(124, 58, 237, 0.3)',
            }}
          >
            <School fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="white">
              Student Management Assistant
            </Typography>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
              {useOpenRouter ? `Using ${getModelName(selectedModel)}` : 'Using built-in AI'}
            </Typography>
          </Box>
        </ChatHeader>

        <MessageList>
          {messages.map((message, index) => (
            message.sender === 'user' ? (
              <UserMessage key={index}>
                <Typography variant="body2" color="white">
                  {message.text}
                </Typography>
                <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </UserMessage>
            ) : (
              <BotMessage key={index}>
                <Typography variant="body2" color="white" sx={{ whiteSpace: 'pre-line' }}>
                  {message.text}
                </Typography>
                <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" sx={{ display: 'block', mt: 0.5 }}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </BotMessage>
            )
          ))}
          
          {isTyping && (
            <BotMessage>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <CircularProgress size={16} color="primary" />
                <Typography variant="body2" color="white">
                  {useOpenRouter ? "Generating response..." : "Thinking..."}
                </Typography>
              </Box>
            </BotMessage>
          )}

          {showFaqs && messages.length === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="rgba(255, 255, 255, 0.7)" sx={{ mb: 1 }}>
                Popular questions:
              </Typography>
              <List disablePadding>
                {popularQuestions.map((question, index) => (
                  <FaqItem 
                    key={index} 
                    onClick={() => handleFaqClick(question)}
                    disablePadding
                  >
                    <Typography variant="body2" color="white">
                      {question}
                    </Typography>
                  </FaqItem>
                ))}
              </List>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </MessageList>

        <InputContainer>
          <TextField
            fullWidth
            placeholder="Ask me about your students or institution..."
            variant="outlined"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              sx: {
                color: 'white',
                borderRadius: '50px',
                background: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              endAdornment: (
                <IconButton 
                  color="primary" 
                  onClick={sendMessage}
                  disabled={!inputValue.trim()}
                  sx={{ ml: 1 }}
                >
                  <Send />
                </IconButton>
              ),
            }}
            size="small"
          />
        </InputContainer>
      </ChatContainer>
      
      <Card sx={{ 
        mt: 4, 
        bgcolor: 'rgba(124, 58, 237, 0.1)', 
        border: '1px solid rgba(124, 58, 237, 0.2)',
        borderRadius: 3
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoAwesome sx={{ color: '#A78BFA', mr: 1.5 }} />
            <Typography variant="h6" color="white">
              AI Assistant Features
            </Typography>
          </Box>
          <Typography variant="body2" color="rgba(255, 255, 255, 0.7)" paragraph>
            Our AI assistant can help you with:
          </Typography>
          <List disablePadding sx={{ ml: 2 }}>
            {[
              'Student data and record management',
              'Fee tracking and payment status',
              'Attendance monitoring and reports',
              'Performance analysis and academic insights',
              'Administrative task automation'
            ].map((feature, idx) => (
              <ListItem key={idx} sx={{ py: 0.5 }} disablePadding>
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  • {feature}
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      
      {/* API Key Settings Dialog */}
      <Dialog 
        open={openSettings} 
        onClose={handleCloseSettings}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(18, 18, 40, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3,
            color: 'white',
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Key sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">OpenRouter AI Settings</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
            Connect to OpenRouter to access advanced AI models like Claude, GPT-4, and more.
            You'll need to provide your own OpenRouter API key.
          </Typography>
          
          <TextField
            fullWidth
            label="OpenRouter API Key"
            variant="outlined"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              setApiKeyError('');
            }}
            error={!!apiKeyError}
            helperText={apiKeyError}
            type="password"
            placeholder="Enter your OpenRouter API key"
            margin="normal"
            InputLabelProps={{
              sx: { color: 'rgba(255, 255, 255, 0.7)' }
            }}
            InputProps={{
              sx: {
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              }
            }}
          />
          
          {apiKey && (
            <>
              <FormControlLabel
                control={
                  <Switch 
                    checked={useOpenRouter} 
                    onChange={(e) => setUseOpenRouter(e.target.checked)}
                    color="primary"
                  />
                }
                label="Use OpenRouter for AI responses"
                sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.9)' }}
              />
              
              {useOpenRouter && (
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }} id="model-select-label">AI Model</InputLabel>
                  <Select
                    labelId="model-select-label"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    label="AI Model"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    {availableModels.map((model) => (
                      <MenuItem key={model.id} value={model.id}>
                        {model.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}
          
          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'rgba(255, 255, 255, 0.5)' }}>
            Note: Your API key is stored locally in your browser and is only used to make requests to OpenRouter.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Button onClick={handleCloseSettings} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveApiKey} 
            variant="contained" 
            color="primary"
            disabled={!!apiKeyError && apiKeyError !== 'Testing connection...'}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatBot; 