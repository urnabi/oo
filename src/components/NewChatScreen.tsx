import React, { useState } from 'react';
import { UserPlus, Copy, Check, Share2, MessageCircle, Mail, PhoneCall, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ChatParticipant } from '../types/chat';

interface NewChatScreenProps {
  currentUser: ChatParticipant;
  onCreateRoom: (name: string, email: string) => void;
  onSelectExisting: (roomId: string) => void;
  onOpenSettings: () => void;
  appUrl: string;
}

export const NewChatScreen: React.FC<NewChatScreenProps> = ({
  currentUser,
  onCreateRoom,
  onSelectExisting,
  onOpenSettings,
  appUrl,
}) => {
  const [mode, setMode] = useState<'contacts' | 'name'>('contacts');
  const [selectedContact, setSelectedContact] = useState('Maya Lin (maya.lin@quietcraft.io)');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // Unique invite link
  const inviteLink = `${appUrl}?chat=maya-lin&invite=kindness`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on The Other Side',
          text: 'Start a mindful, kind conversation with me on The Other Side:',
          url: inviteLink,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi, let's connect on The Other Side for a mindful conversation: ${inviteLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleSMS = () => {
    const text = encodeURIComponent(
      `Let's talk on The Other Side: ${inviteLink}`
    );
    window.location.href = `sms:?&body=${text}`;
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('Mindful Dialogue on The Other Side');
    const body = encodeURIComponent(
      `Hi,\n\nI'd like to invite you to a mindful dialogue space where conversations are made kinder: ${inviteLink}\n\nWarmly,\n${currentUser.name}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleResend = () => {
    setResendStatus('Invitation resent via link');
    setTimeout(() => setResendStatus(null), 2500);
  };

  const handleStartCustom = () => {
    if (mode === 'name' && customName.trim()) {
      onCreateRoom(customName.trim(), customEmail.trim());
    } else {
      onSelectExisting('maya-lin');
    }
  };

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
        {/* Card 1: Invite to Chat */}
        <div className="rounded-3xl bg-white p-5 shadow-xs border border-stone-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-lg leading-tight">Invite to Chat</h3>
              <p className="text-xs text-stone-500 mt-1">Start a mindful dialogue with anyone</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>

          {/* Toggle buttons */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => setMode('contacts')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold transition cursor-pointer ${
                mode === 'contacts'
                  ? 'bg-[#4338CA] text-white shadow-md shadow-indigo-600/20'
                  : 'bg-[#F0ECE1] text-stone-700 hover:bg-stone-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Contacts</span>
            </button>
            <button
              onClick={() => setMode('name')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold transition cursor-pointer ${
                mode === 'name'
                  ? 'bg-[#4338CA] text-white shadow-md shadow-indigo-600/20'
                  : 'bg-[#F0ECE1] text-stone-700 hover:bg-stone-200'
              }`}
            >
              <span>✏️ Enter Name</span>
            </button>
          </div>

          {/* Input field */}
          <div className="mt-4">
            {mode === 'contacts' ? (
              <div className="flex items-center gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-stone-200/80">
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 text-xs font-bold">
                  ML
                </div>
                <input
                  type="text"
                  value={selectedContact}
                  onChange={(e) => setSelectedContact(e.target.value)}
                  className="w-full bg-transparent text-xs text-stone-800 font-medium outline-hidden"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter partner's name (e.g. Sam)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#FAF7F2] p-3 rounded-2xl border border-stone-200/80 text-xs text-stone-800 outline-hidden focus:border-indigo-500"
                />
                <input
                  type="email"
                  placeholder="Optional email (e.g. sam@example.com)"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] p-3 rounded-2xl border border-stone-200/80 text-xs text-stone-800 outline-hidden focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Invite Link */}
        <div className="rounded-3xl bg-white p-5 shadow-xs border border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-indigo-600 font-semibold text-xs tracking-wide">🔗 Invite Link</span>
            </div>
            <span className="text-[11px] font-medium bg-[#FAF7F2] text-stone-500 px-3 py-1 rounded-full border border-stone-200/60">
              Auto-expires in 48h
            </span>
          </div>

          {/* Link pill with copy button */}
          <div className="mt-3.5 flex items-center justify-between gap-2 bg-[#FAF7F2] p-2 pl-3 rounded-2xl border border-stone-200/70">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs text-stone-700 font-medium truncate">
                {inviteLink.replace(/^https?:\/\//, '').slice(0, 24)}...
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Send via section */}
          <div className="mt-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Send Via
            </p>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {/* Share */}
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1.5 transition hover:scale-105 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] hover:bg-stone-200/80 flex items-center justify-center text-stone-700 border border-stone-200/60">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] text-stone-600 font-medium">Share</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="flex flex-col items-center gap-1.5 transition hover:scale-105 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] hover:bg-emerald-50 flex items-center justify-center text-emerald-600 border border-stone-200/60">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] text-stone-600 font-medium">WhatsApp</span>
              </button>

              {/* Message / SMS */}
              <button
                onClick={handleSMS}
                className="flex flex-col items-center gap-1.5 transition hover:scale-105 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] hover:bg-stone-200/80 flex items-center justify-center text-stone-700 border border-stone-200/60">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <span className="text-[11px] text-stone-600 font-medium">Message</span>
              </button>

              {/* Email */}
              <button
                onClick={handleEmail}
                className="flex flex-col items-center gap-1.5 transition hover:scale-105 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF7F2] hover:bg-indigo-50 flex items-center justify-center text-indigo-600 border border-stone-200/60">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[11px] text-stone-600 font-medium">Email</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Pending invite */}
        <div className="rounded-3xl bg-white p-4 shadow-xs border border-stone-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
                alt="Maya Lin"
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-orange-400 border-2 border-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-stone-900 text-sm">Maya Lin</h4>
                <span className="text-xs font-semibold text-orange-400">• Pending</span>
              </div>
              <p className="text-xs text-stone-500 truncate mt-0.5">
                Chat unlocks upon accepta...
              </p>
            </div>
          </div>
          <button
            onClick={handleResend}
            className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-stone-200/80 text-stone-700 text-xs font-semibold transition cursor-pointer shrink-0 border border-stone-200/60"
          >
            {resendStatus ? 'Sent!' : 'Resend'}
          </button>
        </div>

        {/* Action Button: Jump into dialogue immediately */}
        <button
          onClick={handleStartCustom}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-[#4338CA] hover:bg-[#3730A3] active:scale-98 text-white font-semibold text-sm shadow-md transition cursor-pointer"
        >
          <span>Open Mindful Thread</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
