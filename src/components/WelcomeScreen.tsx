import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  pendingInviteRoom?: string | null;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  pendingInviteRoom,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-[#FAF7F2] px-6 py-12 overflow-hidden select-none">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-orange-100/40 to-indigo-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top spacer */}
      <div className="w-full pt-4" />

      {/* Main hero brand presentation */}
      <div className="relative flex flex-col items-center text-center my-auto">
        {/* Large white disc containing the emblem */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-white shadow-xl shadow-stone-200/50 flex items-center justify-center p-6 border border-stone-100/80 mb-10 transition transform hover:scale-102">
          <BrandLogo size="lg" showText={false} className="w-full h-full" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B] font-sans uppercase">
          The Other Side
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-base sm:text-lg text-stone-500 font-normal tracking-wide">
          Conversations made kinder.
        </p>

        {pendingInviteRoom && (
          <div className="mt-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-medium animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shared dialogue invitation detected</span>
          </div>
        )}
      </div>

      {/* Bottom Action Area */}
      <div className="w-full max-w-sm pb-6">
        <button
          onClick={onGetStarted}
          className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-[#4338CA] hover:bg-[#3730A3] active:scale-98 text-white font-semibold text-base shadow-lg shadow-indigo-600/25 transition cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>

        <p className="text-center text-[11px] text-stone-400 mt-4 tracking-tight">
          Mindful communication • AI mediation • Paced dialogue
        </p>
      </div>
    </div>
  );
};
