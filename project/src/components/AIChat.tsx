import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Send, Loader, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setInitialLoad(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    const tempUserMsg: Message = {
      id: 'temp-user',
      message: userMessage,
      role: 'user',
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const conversationHistory = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.message,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-health-chat`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            conversationHistory,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to get AI response');

      const { response: aiResponse } = await response.json();

      await loadMessages();
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: 'error',
        message: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev.filter((m) => m.id !== 'temp-user'), errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What does my latest health report mean?",
    "Give me a personalized diet plan",
    "What exercises should I do?",
    "How can I improve my sleep quality?",
  ];

  if (initialLoad) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/40 rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Health Coach</h2>
            <p className="text-sm text-white/80">Ask me anything about your health</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Start a conversation</h3>
            <p className="text-sm text-gray-600 mb-6">Ask me about your health reports, diet, exercise, or wellness tips</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(question)}
                  className="p-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl text-sm text-left hover:bg-white/80 hover:border-emerald-300 transition-all"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-3 max-w-[80%] ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`p-2 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-emerald-400 to-cyan-500'
                      : 'bg-white/60 backdrop-blur-sm'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <div
                  className={`p-4 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white'
                      : 'bg-white/60 backdrop-blur-sm text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white/60 backdrop-blur-sm rounded-xl">
                <Bot className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
                <Loader className="w-5 h-5 animate-spin text-emerald-600" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-gray-200/50 bg-white/20">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your health..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
