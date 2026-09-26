'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  Scale, 
  RefreshCw,
  Building2,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  MessageSquare,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'ASSISTANT';
  text: string;
  timestamp: string;
  followUps?: string[];
  legalBasis?: {
    actTitle: string;
    sectionOrRule: string;
    department: string;
    statutorySafeguard?: string;
  };
}

const PRESET_QUERIES = [
  {
    category: 'Fast SLA & 48-Hr Approval',
    icon: Zap,
    color: 'text-amber-400 border-amber-500/30 bg-amber-950/20 hover:bg-amber-900/30',
    prompt: 'How does the Fast SLA 48-Hour Green Channel grant accelerated clearance approval under Maharashtra RTS Act?',
  },
  {
    category: 'PSI 2019 Incentives',
    icon: Sparkles,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/30',
    prompt: 'How much SGST refund and capital subsidy can my manufacturing enterprise claim under Maharashtra PSI 2019?',
  },
  {
    category: 'Maharashtra EV Policy 2025',
    icon: Building2,
    color: 'text-blue-400 border-blue-500/30 bg-blue-950/20 hover:bg-blue-900/30',
    prompt: 'What are the benefits under Maharashtra Electric Vehicle Policy 2025 regarding stamp duty waiver and power tariff subsidy?',
  },
  {
    category: 'Statutory Rules & RTS Act',
    icon: Scale,
    color: 'text-purple-400 border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/30',
    prompt: 'What is the deemed approval mechanism under Section 10 of Maharashtra Right to Services Act 2015 if a department delays?',
  },
  {
    category: 'MIDC DCR Setbacks & MPCB CTE',
    icon: FileText,
    color: 'text-rose-400 border-rose-500/30 bg-rose-950/20 hover:bg-rose-900/30',
    prompt: 'What are the mandatory boundary setbacks under Rule 14 of MIDC DCR and CTE requirements for Orange category industries?',
  },
];

export default function ChatPage() {
  const router = useRouter();
  const { isAuthenticated, logout, currentProfile, currentIndustrialist } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fastSlaApplying, setFastSlaApplying] = useState(false);
  const [fastSlaSuccess, setFastSlaSuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ASSISTANT',
      text: `Namaste! I am **MahaSutra Regulatory AI**, your statutory co-pilot for Maharashtra single-window approvals.\n\nI am grounded in all **9 Maharashtra Statutory Acts** (RTS Act 2015, MIDC Act 1961, MPCB Water & Air Acts, DISH 1948) and state incentive schemes (**PSI 2019/2024, EV Policy 2025, CMEGP**).\n\nIf you want **Fast SLA approval**, I can immediately guide you through qualifying for 48-Hour Green Channel clearance or activate it right away. What would you like to explore?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followUps: [
        'How do I activate Fast SLA for my project?',
        'Calculate my PSI 2019 industrial subsidies',
        'Explain Maharashtra RTS Act deemed approvals',
        'Show MPCB CTE requirements for Orange tier',
      ],
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          profile: currentProfile,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const botMessage: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: 'ASSISTANT',
          text: data.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          followUps: data.data.followUpSuggestions,
          legalBasis: data.data.legalBasis,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'ASSISTANT',
          text: 'Unable to reach the regulatory inference engine. Please check your connection or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerFastSla = async () => {
    setFastSlaApplying(true);
    try {
      const res = await fetch('/api/v1/applications/fast-sla', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: currentProfile.companyName }),
      });
      const data = await res.json();
      if (data.success) {
        setFastSlaSuccess(true);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });

        // Add confirmation message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: `fast_sla_${Date.now()}`,
            sender: 'ASSISTANT',
            text: `⚡ **FAST SLA ACTIVATED SUCCESSFULLY!**\n\nAll pending statutory applications for **${currentIndustrialist?.companyName || currentProfile.companyName}** have been granted **GREEN_CHANNEL_APPROVED** under Section 4(1) of the Maharashtra Right to Services Act 2015.\n\n* **Approval Turnaround:** Accelerated to 48 Hours\n* **Status:** Green Channel Sanctioned\n* **Digital Certificates:** Generated with cryptographic SHA-256 signatures & QR hash\n\nYou can view and download your certificates directly on the **[Overview](/portal/applications)** page.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            followUps: [
              'View my approved digital certificates',
              'Check my PSI 2019 incentive disbursement',
              'What are post-commissioning compliance returns?',
            ],
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFastSlaApplying(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner with Fast SLA Trigger */}
      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/50 via-slate-900/90 to-purple-950/40 p-5 sm:p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/30">
              <MessageSquare className="h-3.5 w-3.5" />
              Access to Chatbot (Regulatory AI)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              Maharashtra Statutory Acts & Schemes
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Regulatory & Schemes AI Co-Pilot
          </h1>

          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Inquire about single-window clearance timelines, statutory rules (RTS Act 2015, MIDC DCR), state subsidy schemes (PSI 2019, EV Policy), or immediately trigger Fast SLA approvals.
          </p>
        </div>

        {/* 1-Click Fast SLA Button */}
        <div className="shrink-0 flex items-center gap-3">
          <button
            onClick={handleTriggerFastSla}
            disabled={fastSlaApplying}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-lg ${
              fastSlaSuccess
                ? 'bg-emerald-600 text-white border border-emerald-400/40'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 hover:brightness-110 active:scale-95'
            }`}
          >
            <Zap className={`h-4 w-4 ${fastSlaApplying ? 'animate-spin' : ''}`} />
            <span>
              {fastSlaApplying
                ? 'Accelerating Clearances...'
                : fastSlaSuccess
                ? '⚡ Fast SLA Active (48-Hr Approved)'
                : '⚡ Apply for Fast SLA (48-Hr Approval)'}
            </span>
          </button>

          <button
            onClick={() => {
              logout();
              router.push('/auth/login');
            }}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/70 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-red-950/50 hover:from-red-500 hover:to-rose-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Sign out of current session"
          >
            <LogOut className="h-4 w-4 text-white" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Preset Query Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Knowledge Base Shortcuts (Schemes & Statutory Rules):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_QUERIES.map((q, idx) => {
            const Icon = q.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(q.prompt)}
                disabled={loading}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all group ${q.color}`}
              >
                <Icon className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold block text-white group-hover:underline">
                    {q.category}
                  </span>
                  <span className="text-[10px] text-slate-300 line-clamp-2">
                    {q.prompt}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Window Container */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl flex flex-col h-[580px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-sm ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ASSISTANT' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 space-y-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'USER'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'border border-slate-800 bg-slate-950 text-slate-200 shadow-md'
                }`}
              >
                <div className="whitespace-pre-line prose prose-invert prose-xs max-w-none">
                  {msg.text}
                </div>

                {/* Statutory Basis Citation if provided */}
                {msg.legalBasis && (
                  <div className="rounded-xl border border-blue-500/20 bg-blue-950/30 p-2.5 text-xs text-blue-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Scale className="h-3.5 w-3.5 text-blue-400" />
                      Statutory Basis: {msg.legalBasis.actTitle}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Rule: {msg.legalBasis.sectionOrRule} • Authority: {msg.legalBasis.department}
                    </div>
                    {msg.legalBasis.statutorySafeguard && (
                      <div className="text-[11px] text-emerald-400 font-medium">
                        🛡️ {msg.legalBasis.statutorySafeguard}
                      </div>
                    )}
                  </div>
                )}

                {/* Follow up suggestions */}
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Suggested Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.followUps.map((fu, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(fu)}
                          className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:border-blue-500 hover:text-white transition-all text-left"
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] ${
                    msg.sender === 'USER' ? 'text-blue-200' : 'text-slate-500'
                  } text-right`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'USER' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 text-sm justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-400" />
                <span>Consulting Maharashtra Statutory Corpus & RAG index...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-800 bg-slate-950/80 p-3 sm:p-4">
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
              placeholder="Ask about Maharashtra schemes, RTS Act deemed approvals, Fast SLA 48-hr Green Channel..."
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
