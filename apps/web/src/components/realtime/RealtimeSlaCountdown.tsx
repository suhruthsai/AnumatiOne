'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface RealtimeSlaCountdownProps {
  deadlineIso: string;
  initialDaysRemaining: number;
}

export function RealtimeSlaCountdown({ deadlineIso, initialDaysRemaining }: RealtimeSlaCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: initialDaysRemaining,
    hours: 14,
    minutes: 32,
    seconds: 45,
    isExpired: false,
  });

  useEffect(() => {
    const deadline = new Date(deadlineIso).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [deadlineIso]);

  const isUrgent = timeLeft.days <= 3;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <Clock className={`h-3 w-3 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-blue-400'}`} />
        <span>Statutory RTS SLA Clock</span>
      </div>

      <div className={`font-mono font-bold text-sm sm:text-base flex items-center gap-1 ${
        isUrgent ? 'text-rose-400' : 'text-white'
      }`}>
        <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
          {timeLeft.days}d
        </span>
        <span className="text-slate-500">:</span>
        <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
          {String(timeLeft.hours).padStart(2, '0')}h
        </span>
        <span className="text-slate-500">:</span>
        <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
          {String(timeLeft.minutes).padStart(2, '0')}m
        </span>
        <span className="text-slate-500">:</span>
        <span className={`bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 ${
          isUrgent ? 'text-rose-400 animate-pulse' : 'text-blue-400'
        }`}>
          {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>

      {isUrgent && (
        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 animate-pulse">
          <AlertTriangle className="h-2.5 w-2.5" />
          RTS Act S.4(2) Auto-Escalation Armed
        </span>
      )}
    </div>
  );
}
