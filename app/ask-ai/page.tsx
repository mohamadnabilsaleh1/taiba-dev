"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, AlertCircle, Sparkles, Copy, Check, User, Bot, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function AskAIPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { mode } = useTheme();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    const trimmed = prompt.trim();
    if (!trimmed) return setError('Please enter a message.');

    // Add user message immediately
    const userMsg = { role: 'user' as const, content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/grok', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            { role: 'user', content: trimmed }
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to get response');
      }

      let assistantContent = '';
      if (result.status === 'success') {
        assistantContent = typeof result.data === 'string' 
          ? result.data 
          : JSON.stringify(result.data, null, 2);
      } else {
        assistantContent = result.message || 'Unknown response format';
      }

      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: assistantContent 
      }]);

    } catch (err: any) {
      const errorMsg = err?.message || 'Network error occurred';
      setError(errorMsg);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: `Error: ${errorMsg}` 
      }]);
    } finally {
      setLoading(false);
    }
  }

  function clearConversation() {
    setMessages([]);
    setError(null);
    setPrompt('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div>
      {/* Header - exactly matching Ask Question page */}
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h1 className="h1-bold text-dark100_light900">Ask AI Assistant</h1>
        
        <Button
          onClick={clearConversation}
          className="flex items-center gap-2 bg-red-100 px-4 py-2.5 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
        >
          <Trash2 className="h-4 w-4" />
          Clear Chat
        </Button>
      </div>

      {/* Main Chat Area */}
      <div className="mt-9">
        {/* Chat Section - matching Question form styling */}
        <div className="lg:col-span-3">
          <div className="flex w-full flex-col gap-10 rounded-[10px] bg-light-900 p-9 dark:bg-dark-300">
            {/* Messages Container - styled like form fields */}
            <div className="flex w-full flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label className="paragraph-semibold text-dark400_light800">
                  Conversation <span className="text-primary-500">*</span>
                </label>
                
                <div className="h-[400px] overflow-y-auto space-y-4 rounded-md border bg-light-800 p-4 dark:bg-dark-400">
                  {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-4 rounded-full bg-primary-100 p-4 dark:bg-primary-900/20">
                        <Bot className="h-12 w-12 text-primary-500" />
                      </div>
                      <h3 className="h3-semibold text-dark200_light900 mb-2">
                        How can I help you today?
                      </h3>
                      <p className="body-regular text-dark500_light500 max-w-md">
                        Ask me about coding problems, debugging, architecture decisions, or any technical questions you have.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 ${
                          msg.role === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.role === 'user' 
                            ? 'bg-primary-500' 
                            : 'bg-light-600 dark:bg-dark-300'
                        }`}>
                          {msg.role === 'user' ? (
                            <User className="h-5 w-5 text-white" />
                          ) : (
                            <Bot className="h-5 w-5 text-white" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div className={`flex-1 max-w-[80%] group`}>
                          <div className={`rounded-2xl px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-primary-500 text-white'
                              : 'bg-light-700 text-dark-300 dark:bg-dark-300 dark:text-light-700'
                          }`}>
                            <p className="body-regular whitespace-pre-wrap break-words">{msg.content}</p>
                          </div>
                          
                          {/* Copy button for assistant messages */}
                          {msg.role === 'assistant' && (
                            <button
                              onClick={() => copyToClipboard(msg.content, index)}
                              className="mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 text-xs text-light-500 hover:text-primary-500 dark:text-dark-400 dark:hover:text-primary-400"
                            >
                              {copiedIndex === index ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  Copy
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Loading indicator */}
                  {loading && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-light-600 dark:bg-dark-300 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-light-700 dark:bg-dark-300 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                          <span className="text-sm text-dark-500 dark:text-light-500">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                <p className="body-regular mt-2.5 text-light-500">
                  Chat with AI assistant about coding problems, debugging, or any technical questions.
                </p>
              </div>
            </div>

            {/* Input Area - matching form field styling */}
            <div className="flex w-full flex-col gap-3">
              <label className="paragraph-semibold text-dark400_light800">
                Your Message <span className="text-primary-500">*</span>
              </label>
              
              {error && (
                <div className="flex items-center gap-2 rounded-md bg-red-100 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="relative">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  className="paragraph-regular no-focus min-h-[56px] w-full resize-none rounded-md border bg-light-800 p-4 pr-12 text-dark300_light700 light-border-2 dark:bg-dark-400"
                  rows={1}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="absolute right-3 bottom-3 rounded-md p-2 text-primary-500 hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-primary-900/20"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
              
              <p className="body-regular mt-2.5 text-light-500">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>

            {/* Submit button - matching Question component */}
            <Button
              type="submit"
              onClick={handleSubmit}
              className="primary-gradient w-fit !text-light-900"
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}