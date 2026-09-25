'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ChevronRight,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'ASSISTANT';
  text: string;
  timestamp: string;
  followUps?: string[];
}

export function RegulatoryAIChatbot() {
  const { currentProfile } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ASSISTANT',
      text: `Hello! I am your **AnumatiOne Regulatory Digital Twin Assistant**. I can simulate clearance timelines, explain the Adversarial Path Optimizer, evaluate Green Channel auto-approvals, and help you eliminate 78% of application queries before submission.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followUps: [
        'Can I get Green Channel auto-approval?',
        'Why is MPCB CTE on the critical path?',
        'How does MahaVault pre-validate documents?',
        'What Maharashtra schemes (PSI 2019) can I claim?',
      ],
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          profile: currentProfile,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const botMsg: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: 'ASSISTANT',
          text: data.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUps: data.data.followUpSuggestions,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-600 via-blue-600 to-accent-purple px-4 py-3 text-sm font-bold text-white shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="relative">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
          </div>
          <span className="hidden sm:inline">Ask AI Regulatory Copilot</span>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="flex flex-col w-[380px] sm:w-[420px] h-[580px] rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/80 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-600 to-accent-purple text-white shadow-md">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  AnumatiOne Regulatory AI
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </h4>
                <p className="text-[10px] text-slate-400">
                  {currentProfile.companyName} context loaded
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-slate-700 bg-slate-950 p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleSend('Hello! Explain AnumatiOne in English')}
                  className="px-2 py-0.5 rounded text-blue-300 font-bold hover:bg-slate-800"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => handleSend('नमस्ते! AnumatiOne और ग्रीन चैनल के बारे में हिन्दी में बताएं')}
                  className="px-2 py-0.5 rounded text-amber-300 font-bold hover:bg-slate-800"
                >
                  हिन्दी
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ASSISTANT' && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    msg.sender === 'USER'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line text-xs font-sans">
                    {msg.text}
                  </div>
                  <div className="mt-1 text-[9px] text-slate-400/80 text-right">
                    {msg.timestamp}
                  </div>

                  {/* Suggestion Follow-Up Pills */}
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Recommended Questions:
                      </span>
                      {msg.followUps.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSend(prompt)}
                          className="flex items-center justify-between w-full text-left text-[11px] rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1.5 text-blue-300 hover:bg-slate-800 hover:border-blue-500/40 transition-colors"
                        >
                          <span>{prompt}</span>
                          <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-400" />
                <span>Consulting Regulatory Knowledge Graph...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="border-t border-slate-800 p-3 bg-slate-900/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about approvals, delays, rules, or incentives..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
