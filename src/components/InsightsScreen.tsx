import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Scale,
  Heart,
  CheckCircle2,
  RefreshCw,
  Wind,
  Lightbulb,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ChatParticipant } from '../types/chat';

interface InsightsScreenProps {
  currentUser: ChatParticipant;
  onOpenSettings: () => void;
  onSelectRoom: (roomId: string) => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  currentUser,
  onOpenSettings,
  onSelectRoom,
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-stone-200/50">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <BrandLogo size="sm" showText={true} />

          <div className="text-center">
            <h2 className="text-base font-bold text-stone-900 leading-none">New Chat</h2>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-emerald-700 tracking-tight">
                Mediated
              </span>
            </div>
          </div>

          <button
            onClick={onOpenSettings}
            className="rounded-full ring-2 ring-emerald-500/80 p-0.5 hover:scale-105 transition cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {/* Title area */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Insights</h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Personal communication rhythm & clarity
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Heart className="w-4 h-4" />
          </div>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              timeRange === 'week'
                ? 'bg-[#4338CA] text-white shadow-xs'
                : 'bg-[#EFECE6] text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>This Week</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              timeRange === 'month'
                ? 'bg-[#4338CA] text-white shadow-xs'
                : 'bg-[#EFECE6] text-stone-600 hover:bg-stone-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              timeRange === 'all'
                ? 'bg-[#4338CA] text-white shadow-xs'
                : 'bg-[#EFECE6] text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Time
          </button>
        </div>

        {/* Card 1: Calm Score */}
        <div className="rounded-3xl bg-white p-5 shadow-xs border border-stone-100 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E4F7EC] text-[#0A7B3E]">
              <span>🌿</span>
              <span>Peaceful trend</span>
            </span>
            <span className="text-xs text-stone-400 font-medium">Past 7 days</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-[#4338CA] tracking-tight">84%</span>
            <div>
              <p className="font-bold text-stone-900 text-sm">Calm Score</p>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+8% from last week</span>
              </div>
            </div>
          </div>

          {/* Progress Flow Bar */}
          <div>
            <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden flex">
              <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full w-[84%]" />
            </div>
            <div className="flex justify-end mt-1 text-[11px] font-semibold text-stone-400">
              High flow
            </div>
          </div>

          {/* Highlight note */}
          <div className="rounded-2xl bg-[#FAF7F2] p-3.5 border border-stone-200/50 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-700 leading-relaxed">
              You paused before replying <strong className="font-bold text-stone-900">12 times</strong> this week, preventing <strong className="font-bold text-emerald-700">4 potential misunderstandings</strong>.
            </p>
          </div>
        </div>

        {/* Card 2: Tone Reframing */}
        <div className="rounded-3xl bg-white p-5 shadow-xs border border-stone-100 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#FFEFEA] flex items-center justify-center text-[#F27A54]">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">Tone Reframing</h3>
            </div>
            <span className="text-xs text-stone-400 font-medium">32 exchanges</span>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-2.5">
            {/* Direct & Kind */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>Direct & Kind</span>
                </div>
                <span className="text-stone-900 font-bold">18</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-[56%]" />
              </div>
            </div>

            {/* De-escalated Drafts */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>De-escalated Drafts</span>
                </div>
                <span className="text-stone-900 font-bold">9</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[28%]" />
              </div>
            </div>

            {/* Constructive Boundaries */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-2 h-2 rounded-full bg-[#F27A54]" />
                  <span>Constructive Boundaries</span>
                </div>
                <span className="text-stone-900 font-bold">5</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-[#F27A54] rounded-full w-[16%]" />
              </div>
            </div>
          </div>

          {/* Signature pivot tip */}
          <div className="rounded-2xl bg-[#FAF7F2] p-3.5 border border-stone-200/50 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Signature Pivot
              </p>
              <p className="text-xs text-stone-700 mt-0.5 leading-relaxed">
                Your most common rephrasing: swapping <strong className="text-stone-900 italic font-semibold">“You always”</strong> for <strong className="text-indigo-700 font-semibold">“When plans change”</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Conversation Health */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-stone-900 text-sm">Conversation Health</h3>
            <span className="text-xs text-indigo-600 font-medium">Live status</span>
          </div>

          {/* Maya Lin */}
          <div
            onClick={() => onSelectRoom('maya-lin')}
            className="rounded-2xl bg-white p-3.5 shadow-xs border border-stone-100 flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-100 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
                  alt="Maya Lin"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[7px] text-white">
                  ✓
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-stone-900 text-xs">Maya Lin</h4>
                <p className="text-[11px] text-stone-500 truncate">
                  Pacing Mode used • Resolution reache...
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
              Resolved
            </span>
          </div>

          {/* Julian Vance */}
          <div
            onClick={() => onSelectRoom('julian-vance')}
            className="rounded-2xl bg-white p-3.5 shadow-xs border border-stone-100 flex items-center justify-between gap-3 cursor-pointer hover:border-indigo-100 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80"
                  alt="Julian Vance"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[7px] text-white">
                  ↺
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-stone-900 text-xs">Julian Vance</h4>
                <p className="text-[11px] text-stone-500 truncate">
                  Active session • Tone balanced
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full shrink-0">
              In dialogue
            </span>
          </div>
        </div>

        {/* Card 4: Mindful Micro-Ritual */}
        <div className="rounded-3xl bg-[#EDEAF7] p-4 flex items-start gap-3 text-[#3730A3]">
          <div className="w-10 h-10 rounded-2xl bg-white/60 flex items-center justify-center shrink-0">
            <Wind className="w-5 h-5 text-indigo-600 animate-mindful-breath" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
              Mindful Micro-Ritual
            </span>
            <p className="text-xs font-semibold text-stone-900 mt-0.5 leading-snug">
              3–Second Breath: Practiced before 8 outgoing messages.
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Kept heart rate grounded & calm
            </p>
          </div>
        </div>

        {/* Heart Quote */}
        <div className="text-center py-2 flex items-center justify-center gap-1.5 text-xs text-stone-500">
          <Heart className="w-3.5 h-3.5 text-emerald-600" />
          <span>Every pause creates space for understanding</span>
        </div>
      </div>
    </div>
  );
};
