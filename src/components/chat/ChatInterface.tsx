import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { ChangeEvent } from 'react';

// Message types
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'tisai';
  timestamp: Date;
}

// Props
interface ChatInterfaceProps {
  mode: 'full' | 'fast-track';
}

// Demo initial messages based on mode
const getInitialMessages = (mode: 'full' | 'fast-track'): Message[] => {
  const baseWelcome = {
    id: '1',
    sender: 'tisai' as const,
    timestamp: new Date(),
  };

  if (mode === 'full') {
    return [
      {
        ...baseWelcome,
        content: `👋 Welcome to TisAi WorldAPI Connect! I'll guide you through the complete setup process for integrating with WorldAPI. Let's start with some basic information. What's your name?`,
      },
    ];
  } else {
    return [
      {
        ...baseWelcome,
        content: `⚡ Welcome to the Fast Track setup! Let's get you connected quickly. I just need a few essential details to configure your WorldAPI connection. First, could you provide your name, organization, and email?`,
      },
    ];
  }
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ mode }) => {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages(mode));
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Audio toggle state
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial animation
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      '.chat-message',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }
    );

    return () => {
      tl.kill();
    };
  }, []);

  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Demo response (in a real app, this would call an API)
  const simulateResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Simple demo responses based on message content
    setTimeout(() => {
      let responseContent = '';
      
      if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
        responseContent = "Hello! How can I help you with your WorldAPI integration today?";
      } else if (userMessage.toLowerCase().includes('name')) {
        responseContent = "Great! Nice to meet you. What organization are you representing?";
      } else if (userMessage.toLowerCase().includes('organization') || userMessage.toLowerCase().includes('company')) {
        responseContent = "Thanks for that information. Now, what's your email address so we can associate it with your WorldAPI account?";
      } else if (userMessage.toLowerCase().includes('email') || userMessage.toLowerCase().includes('@')) {
        responseContent = "Perfect! I've recorded your email. Now let's establish a connection to the WorldAPI servers. Would you like me to initiate the connection now?";
      } else if (userMessage.toLowerCase().includes('yes') || userMessage.toLowerCase().includes('connect')) {
        responseContent = "Great! I'm initiating the connection to WorldAPI servers... Connection established! You can now download your configuration file from the progress panel.";
      } else {
        responseContent = "I understand. Let's move forward with your WorldAPI integration. Is there anything specific you'd like to know about the API?";
      }
      
      const newMessage: Message = {
        id: `tisai-${Date.now()}`,
        content: responseContent,
        sender: 'tisai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      
      // If audio is enabled, you would trigger text-to-speech here
      if (audioEnabled) {
        // Text-to-speech would go here
        console.log('TTS would speak:', responseContent);
      }
    }, 1500);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    
    // Simulate TisAi response
    simulateResponse(inputValue);
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // Toggle audio
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header with audio controls */}
      <div className="bg-dark p-4 flex items-center justify-between">
        <div>
          <h3 className="font-medium">TisAi Assistant</h3>
          <p className="text-sm text-white/60">{mode === 'full' ? 'Full Onboarding' : 'Fast Track'}</p>
        </div>
        <button 
          onClick={toggleAudio}
          className={`p-2 rounded-full transition-colors ${audioEnabled ? 'bg-secondary bg-opacity-20 text-secondary' : 'bg-white bg-opacity-5 text-white/60'}`}
          aria-label={audioEnabled ? 'Disable audio' : 'Enable audio'}
        >
          {audioEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-primary to-dark">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-message flex items-center space-x-2 text-white/60">
            <div className="w-10 h-10 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '200ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <ChatInput
        value={inputValue}
        onChange={handleInputChange}
        onSend={handleSendMessage}
        disabled={isTyping}
      />
    </div>
  );
};

export default ChatInterface; 