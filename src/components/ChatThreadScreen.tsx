import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Wind,
  Scale,
  Sparkles,
  Edit2,
  Send,
  Mic,
  Paperclip,
  Lock,
  Lightbulb,
  Check,
  User,
  Heart,
  Volume2,
  Sliders,
} from 'lucide-react';
import { ChatRoom, ChatMessage, ChatParticipant, MediationSuggestion } from '../types/chat';

interface ChatThreadScreenProps {
  room: ChatRoom;
  messages: ChatMessage[];
  currentUser: ChatParticipant;
  onBack: () => void;
  onSendMessage: (
    text: string,
    senderId?: string,
    senderName?: string,
    senderAvatar?: string,
    sentimentTag?: string,
    isMediated?: boolean,
    originalDraft?: string,
    rewriteUsed?: boolean
  ) => void;
  appUrl: string;
}

export const ChatThreadScreen: React.FC<ChatThreadScreenProps> = ({
  room,
  messages,
  currentUser,
  onBack,
  onSendMessage,
  appUrl,
}) => {
  // Input draft text matching screenshot
  const initialDraft =
    'You always do this when you get stressed and blame everyone else. I did not change it on';
  const [draft, setDraft] = useState(initialDraft);
  const [activeSpeaker, setActiveSpeaker] = useState<'alex' | 'guest'>('alex');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toneStyle, setToneStyle] = useState<'Gentler Tone' | 'Constructive Boundaries' | 'Direct & Kind'>('Gentler Tone');
  
  // Guided breathing micro-ritual state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCountdown, setBreathCountdown] = useState(3);

  // AI Mediation Suggestion State (matching image 4_5a43c4b0.png)
  const [suggestion, setSuggestion] = useState<MediationSuggestion>({
    accusatoryRisk: 'High',
    draftWarning: 'May sound accusatory',
    sentimentTag: 'Expressing hurt',
    suggestedRewrite:
      "“I didn't change it on purpose, but I hear that it caused stress. Can we coordinate next time so you're not caught off guard?”",
    rewriteTag: 'Validates & Clarifies',
    rationale: "Replacing \"You always\" with understanding prevents immediate defensiveness.",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Real-time AI Mediator analysis debounce
  useEffect(() => {
    if (!draft.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsAnalyzing(true);
      try {
        const res = await fetch('/api/mediate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            draftText: draft,
            recentContext: messages.slice(-3),
            toneStyle,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setSuggestion({
            accusatoryRisk: data.accusatoryRisk || 'Moderate',
            draftWarning: data.draftWarning || 'May sound accusatory',
            sentimentTag: data.sentimentTag || 'Expressing hurt',
            suggestedRewrite: data.suggestedRewrite.startsWith('“')
              ? data.suggestedRewrite
              : `“${data.suggestedRewrite}”`,
            rewriteTag: data.rewriteTag || 'Validates & Clarifies',
            rationale: data.rationale || "Replacing \"You always\" with understanding prevents immediate defensiveness.",
          });
        }
      } catch (e) {
        console.log('Mediation local fallback:', e);
      } finally {
        setIsAnalyzing(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [draft, toneStyle, messages]);

  const handleUseRewrite = () => {
    // Strip quotes from rewrite if present
    const cleanRewrite = suggestion.suggestedRewrite.replace(/^“|”$/g, '');
    setDraft(cleanRewrite);
  };

  const handleSend = () => {
    if (!draft.trim()) return;

    if (room.pacingMode && !isBreathing && breathCountdown === 3) {
      // Mindful 3-second micro-ritual pause
      setIsBreathing(true);
      const interval = setInterval(() => {
        setBreathCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsBreathing(false);
            setBreathCountdown(3);
            executeSend();
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    executeSend();
  };

  const executeSend = () => {
    const isRewrite = draft.includes("didn't change it on purpose") || draft !== initialDraft;
    const isAlex = activeSpeaker === 'alex';

    const senderId = isAlex ? currentUser.id : 'maya';
    const senderName = isAlex ? currentUser.name : room.name;
    const senderAvatar = isAlex ? currentUser.avatar : room.avatar;

    onSendMessage(
      draft,
      senderId,
      senderName,
      senderAvatar,
      isAlex ? undefined : 'Expressing hurt',
      true,
      initialDraft,
      isRewrite
    );

    setDraft('');
  };

  const handleSendOriginal = () => {
    onSendMessage(
      draft,
      currentUser.id,
      currentUser.name,
      currentUser.avatar,
      'Direct draft',
      false,
      draft,
      false
    );
    setDraft('');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md px-4 pt-3 pb-2.5 border-b border-stone-200/50">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Back button */}
          <button
            onClick={onBack}
            className="p-1 rounded-full hover:bg-stone-200 text-stone-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Contact Name & Live Status */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 leading-none">
                {room.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#E4F7EC] text-[#0A7B3E]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Thread
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1 font-medium">
              <span>Mediator Active</span>
              <span>•</span>
              <span>Slow Pacing</span>
            </div>
          </div>

          {/* Right actions: Lotus & Avatar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBreathing(!isBreathing)}
              title="Practice Mindful Breath"
              className="w-8 h-8 rounded-full bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center text-indigo-600 transition cursor-pointer"
            >
              <Heart className="w-4 h-4 text-indigo-600" />
            </button>
            <img
              src={room.avatar || currentUser.avatar}
              alt={room.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/80"
            />
          </div>
        </div>

        {/* Perspective Toggle Bar (Allows testing dialogue from both sides) */}
        <div className="max-w-md mx-auto mt-2 flex items-center justify-between bg-white/70 backdrop-blur-xs p-1.5 rounded-xl border border-stone-200/60 text-[11px]">
          <span className="text-stone-500 pl-1 font-medium">Speaking as:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveSpeaker('alex')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                activeSpeaker === 'alex'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Alex Morgan (You)
            </button>
            <button
              onClick={() => setActiveSpeaker('guest')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                activeSpeaker === 'guest'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {room.name} (Partner)
            </button>
          </div>
        </div>
      </div>

      {/* Main chat stream */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-3 space-y-4 overflow-y-auto no-scrollbar">
        {/* Pacing Mode Lilac Banner */}
        <div className="rounded-2xl bg-[#EDEAF7] p-3 flex items-center gap-2.5 text-[#3730A3]">
          <div className="shrink-0 animate-mindful-breath">
            <Wind className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xs font-medium leading-relaxed">
            Pacing Mode is on. Take a breath together before replying.
          </p>
        </div>

        {/* Guided Breathing Overlay if active */}
        {isBreathing && (
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-4 shadow-lg text-center animate-in fade-in">
            <div className="w-14 h-14 mx-auto rounded-full bg-white/20 flex items-center justify-center animate-mindful-breath">
              <Wind className="w-7 h-7 text-white" />
            </div>
            <p className="font-bold text-sm mt-2">Mindful 3-Second Breath</p>
            <p className="text-xs text-indigo-100 mt-0.5">Inhale calm... exhale tension</p>
            <div className="mt-2 text-2xl font-black text-amber-300 font-mono">
              {breathCountdown}s
            </div>
          </div>
        )}

        {/* Date chip */}
        <div className="flex justify-center">
          <span className="px-3.5 py-1 rounded-full bg-[#EAE6DE] text-stone-600 font-semibold text-[10px] tracking-wider uppercase">
            Today
          </span>
        </div>

        {/* Messages */}
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                isCurrentUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Partner Avatar */}
              {!isCurrentUser && (
                <img
                  src={msg.senderAvatar || room.avatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                />
              )}

              <div className={`max-w-[82%] space-y-1`}>
                <div
                  className={`p-4 rounded-3xl text-sm leading-relaxed ${
                    isCurrentUser
                      ? 'bg-[#4338CA] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white text-stone-900 rounded-tl-xs shadow-xs border border-stone-100'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Subtext info: time & sentiment */}
                <div
                  className={`flex items-center gap-2 text-[11px] ${
                    isCurrentUser ? 'justify-end text-stone-400' : 'justify-start text-stone-400'
                  }`}
                >
                  <span>{msg.timeFormatted}</span>
                  {msg.sentimentTag && (
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <span>🙂</span>
                      <span>{msg.sentimentTag}</span>
                    </span>
                  )}
                  {msg.rewriteUsed && (
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      Mediated
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Mediator Suggestion Card (Matching Image 4) */}
        {draft.length > 5 && (
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-stone-100/90 space-y-3.5 mt-2 transition-all">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100/80 flex items-center justify-center text-indigo-700">
                  <Scale className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-900 text-sm">AI Mediator Suggestion</h3>
              </div>

              {/* Tone Style selector pill */}
              <button
                onClick={() => {
                  const styles: Array<'Gentler Tone' | 'Constructive Boundaries' | 'Direct & Kind'> = [
                    'Gentler Tone',
                    'Constructive Boundaries',
                    'Direct & Kind',
                  ];
                  const nextIndex = (styles.indexOf(toneStyle) + 1) % styles.length;
                  setToneStyle(styles[nextIndex]);
                }}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF0EA] hover:bg-[#FCE7DC] text-[#C2410C] text-xs font-semibold transition cursor-pointer"
              >
                <Sliders className="w-3 h-3" />
                <span>{toneStyle}</span>
              </button>
            </div>

            {/* YOUR DRAFT */}
            <div className="rounded-2xl bg-[#FAF7F2] p-3.5 border border-stone-200/50">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-bold uppercase tracking-wider text-stone-400">
                  Your Draft
                </span>
                <span className="font-medium text-[#C2410C]">
                  {suggestion.draftWarning}
                </span>
              </div>
              <p className="text-xs text-stone-700 italic leading-relaxed">
                “{draft.length > 80 ? draft.substring(0, 77) + '...' : draft}”
              </p>
            </div>

            {/* SUGGESTED REWRITE */}
            <div className="rounded-2xl bg-[#F0FAF4] p-3.5 border border-[#86EFAC]/80">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-bold uppercase tracking-wider text-[#0A7B3E]">
                  Suggested Rewrite
                </span>
                <span className="font-semibold text-[#0A7B3E]">
                  {suggestion.rewriteTag}
                </span>
              </div>
              <p className="text-xs text-stone-900 font-medium leading-relaxed">
                {suggestion.suggestedRewrite}
              </p>
            </div>

            {/* Tip bullet */}
            <div className="flex items-start gap-2 text-xs text-stone-600 leading-normal pt-1">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{suggestion.rationale}</span>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleUseRewrite}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#4338CA] hover:bg-[#3730A3] active:scale-98 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Use Rewrite</span>
              </button>

              <div className="flex items-center gap-2 pt-0.5">
                <button
                  onClick={() => {
                    const clean = suggestion.suggestedRewrite.replace(/^“|”$/g, '');
                    setDraft(clean);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-stone-200/80 text-stone-700 text-xs font-semibold transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleSendOriginal}
                  className="flex-1 flex items-center justify-center py-2.5 rounded-2xl text-stone-500 hover:text-stone-800 text-xs font-semibold transition cursor-pointer"
                >
                  <span>Send Original</span>
                </button>
              </div>
            </div>

            {/* Private indicator */}
            <div className="flex items-center justify-center gap-1 text-[11px] text-stone-400 pt-1">
              <Lock className="w-3 h-3" />
              <span>Private to you</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area matching screenshot */}
      <div className="sticky bottom-0 bg-[#FAF7F2] px-4 pt-2 pb-4 border-t border-stone-200/60">
        <div className="max-w-md mx-auto">
          <div className="rounded-3xl bg-white p-3.5 shadow-md border border-stone-100 flex flex-col justify-between">
            <textarea
              rows={2}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a mindful message..."
              className="w-full bg-transparent text-sm text-stone-800 outline-hidden resize-none placeholder-stone-400 font-sans"
            />

            <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-1">
              <div className="flex items-center gap-3 text-stone-400">
                <button
                  type="button"
                  className="hover:text-stone-700 transition cursor-pointer"
                  title="Voice dictation"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="hover:text-stone-700 transition cursor-pointer"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-stone-400 font-medium">
                  {draft.length} chars
                </span>
                <button
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  className="w-9 h-9 rounded-full bg-[#4338CA] hover:bg-[#3730A3] active:scale-95 disabled:opacity-40 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 transition cursor-pointer"
                >
                  <Send className="w-4 h-4 -rotate-45 -translate-y-0.5 translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
