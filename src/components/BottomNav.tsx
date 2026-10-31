import React from 'react';
import { MessageSquare, PlusCircle, HelpCircle, Settings, Edit3 } from 'lucide-react';

export type TabType = 'chats' | 'new' | 'insights' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-stone-200/80 px-4 py-2 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Chats Tab */}
        <button
          onClick={() => onSelectTab('chats')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'chats' ? 'text-indigo-600 font-semibold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-600" />
          </div>
          <span className="text-[11px] tracking-tight">Chats</span>
        </button>

        {/* New Chat Tab */}
        <button
          onClick={() => onSelectTab('new')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'new' ? 'text-indigo-600 font-semibold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <Edit3 className="w-5 h-5" />
          <span className="text-[11px] tracking-tight">New</span>
        </button>

        {/* Insights Tab */}
        <button
          onClick={() => onSelectTab('insights')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'insights' ? 'text-indigo-600 font-semibold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[11px] tracking-tight">Insights</span>
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${
            activeTab === 'settings' ? 'text-indigo-600 font-semibold' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[11px] tracking-tight">Settings</span>
        </button>
      </div>
    </div>
  );
};
