import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  ChatIcon, 
  PaperAirplaneIcon, 
  SparklesIcon,
  XIcon,
  UserIcon,
  ChipIcon
} from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I am John Enow AI, your educational assistant. I can help you with research, answer questions about your studies, and provide educational support across all subjects. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', {
        message: userMessage.content,
        conversationHistory: messages.slice(-10).map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Hello! I am John Enow AI, your educational assistant. I can help you with research, answer questions about your studies, and provide educational support across all subjects. How can I help you today?'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-fadeIn">
      {/* Header */}
      <div className="hero-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <SparklesIcon className="h-12 w-12 text-amber-400 mr-4" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">John Enow AI</h1>
                <p className="text-xl text-blue-100">Your Educational Research Assistant</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <XIcon className="h-5 w-5 mr-2" />
              Clear Chat
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Messages */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`flex-shrink-0 ${
                    message.role === 'user' ? 'ml-3' : 'mr-3'
                  }`}>
                    {message.role === 'user' ? (
                      <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                        <ChipIcon className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-800 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <ChipIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-800">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question or start a research topic..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex items-center px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Research Topics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              'Mathematics help',
              'Science concepts',
              'History facts',
              'Literature analysis',
              'Physics problems',
              'Chemistry basics',
              'Geography',
              'Grammar tips'
            ].map((topic) => (
              <button
                key={topic}
                onClick={() => setInput(topic)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm text-gray-700"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <SparklesIcon className="h-5 w-5 text-blue-800 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">About AI Research Assistant</h4>
              <p className="text-sm text-blue-700">
                This AI assistant can help you with homework, explain complex concepts, provide research assistance, 
                and answer educational questions. It's designed to support your learning journey across all subjects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
