'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const LIVE_EVENTS = [
  {
    dept: 'MSEDCL',
    icon: '⚡',
    text: 'Chakan 220kV Substation feeder load sanctioned (3,500 kVA dedicated industrial line)',
    badge: 'Real-Time SCADA Ping',
    color: 'text-amber-400',
  },
  {
    dept: 'MAHABHULEKH & MIDC',
    icon: '📜',
    text: '7/12 Land Extract Gat No. 412/1 synchronized with DigiLocker Data Vault (Haveli SRO)',
    badge: 'DigiLocker Hash Verified',
    color: 'text-emerald-400',
  },
  {
    dept: 'MPCB PUNE',
    icon: '🧪',
    text: 'Consent to Establish (CTE) Zero Liquid Discharge (ZLD) mass balance accepted without physical query',
    badge: 'Deemed Fast-Track',
    color: 'text-blue-400',
  },
  {
    dept: 'RTS ACT 2015 SENTINEL',
    icon: '⏱️',
    text: 'Legal statutory SLA countdown active across 18 MIDC clusters: 0 arbitrary rejections recorded today',
    badge: 'Zero-Query Protocol',
    color: 'text-purple-400',
  },
  {
    dept: 'MAHA-FIRE SERVICES',
    icon: '🚒',
    text: 'Provisional Fire NOC hydrant & riser schematic approved by Chief Fire Officer MIDC Pune',
    badge: 'NBC 2016 Compliant',
    color: 'text-rose-400',
  },
  {
    dept: 'DISH MAHARASHTRA',
    icon: '🏢',
    text: 'Factory License occupational safety scrutiny completed using Council of Architecture blueprint CA/2018/98412',
    badge: 'Pre-Validated Vault Pull',
    color: 'text-sky-400',
  },
];

export function LiveEventStream() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST');
    };
    updateTime();
    const timeTimer = setInterval(updateTime, 1000);

    const eventTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
    }, 4500);

    return () => {
      clearInterval(timeTimer);
      clearInterval(eventTimer);
    };
  }, []);

  const current = LIVE_EVENTS[currentIndex];

  return (
    <div className="w-full border-b border-blue-500/20 bg-gradient-to-r from-slate-950 via-blue-950/30 to-slate-950 px-4 py-2 text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-hidden">
        {/* Left: Live Indicator */}
        <div className="flex shrink-0 items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
            MAITRI LIVE SENTINEL
          </span>
          <span className="hidden sm:inline-block rounded bg-blue-500/10 px-1.5 py-0.5 font-mono text-[10px] text-blue-300 border border-blue-500/20">
            18ms • GoM SDC
          </span>
        </div>

        {/* Center: Live Event Ticker */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2 px-2 text-center">
          <span className="shrink-0">{current.icon}</span>
          <span className="hidden md:inline font-mono font-bold text-[10px] uppercase text-slate-400">
            [{current.dept}]
          </span>
          <span className="truncate text-[11px] font-medium text-slate-200">
            {current.text}
          </span>
          <span className="hidden lg:inline shrink-0 rounded-full bg-slate-800/80 px-2 py-0.5 text-[9px] font-mono font-semibold text-slate-300 border border-slate-700">
            {current.badge}
          </span>
        </div>

        {/* Right: Live Clock */}
        <div className="hidden sm:flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-slate-400">
          <Clock className="h-3 w-3 text-blue-400" />
          <span>{currentTime || '08:00:00 IST'}</span>
        </div>
      </div>
    </div>
  );
}
