import React, { useState } from 'react';
import { SlidersHorizontal, Plus, Search, MessageSquare, Sparkles, Smartphone, Share2, Copy, Check } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ChatRoom, ChatParticipant } from '../types/chat';

interface ChatsScreenProps {
  rooms: ChatRoom[];
  currentUser: ChatParticipant;
  onSelectRoom: (roomId: string) => void;
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenApkModal: () => void;
  appUrl: string;
}

export const ChatsScreen: React.FC<ChatsScreenProps> = ({
  rooms,
  currentUser,
  onSelectRoom,
  onNewChat,
  onOpenSettings,
  onOpenApkModal,
  appUrl,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'invites'>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'active') return room.status === 'active';
    if (filter === 'invites') return room.status === 'pending';
    return true;
  });

  const handleCopyDirectLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 select-none">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-stone-200/50">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Logo brand */}
          <div className="flex items-center">
            <BrandLogo size="sm" showText={true} />
          </div>

          {/* Center screen title & status */}
          <div className="text-center">
            <h2 className="text-base font-bold text-stone-900 leading-none">Chats</h2>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-700 tracking-tight">
                Mediator Active
              </span>
            </div>
          </div>

          {/* Right actions: Filter + Avatar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenApkModal}
              title="Build APK & Direct Link"
              className="p-1.5 rounded-full hover:bg-stone-200/70 text-stone-600 transition cursor-pointer"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenSettings}
              className="relative rounded-full ring-2 ring-emerald-500/80 p-0.5 hover:scale-105 transition cursor-pointer"
              title="Alex Morgan Profile"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-3 space-y-3.5">
        {/* Quick Link Share & APK Strip */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-50/90 via-white to-amber-50/70 p-3 border border-indigo-100 flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-900 leading-tight">Direct Peer-to-Peer Link</p>
              <p className="text-[10px] text-stone-500">Share with a friend to chat directly in real-time</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyDirectLink}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
            >
              {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedLink ? 'Copied' : 'Share Link'}
            </button>
            <button
              onClick={onOpenApkModal}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] transition cursor-pointer"
              title="Android APK build"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Start Fresh Card */}
        <div className="rounded-3xl bg-white p-4 shadow-sm border border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEFEA] flex items-center justify-center text-[#F27A54] shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base leading-tight">Start Fresh</h3>
              <p className="text-xs text-stone-500 mt-0.5">Invite someone to tal...</p>
            </div>
          </div>
          <button
            onClick={onNewChat}
            className="flex items-center gap-1 px-4 py-2.5 rounded-full bg-[#4338CA] hover:bg-[#3730A3] active:scale-95 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-[#EFECE6]/70 focus:bg-white text-stone-800 placeholder-stone-400 text-sm pl-11 pr-4 py-2.5 rounded-full border border-transparent focus:border-stone-300 transition outline-hidden"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              filter === 'all'
                ? 'bg-[#4338CA] text-white shadow-xs'
                : 'bg-[#EFECE6] text-stone-600 hover:bg-stone-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              filter === 'active'
                ? 'bg-[#4338CA] text-white shadow-xs'
                : 'bg-[#EFECE6] text-stone-600 hover:bg-stone-200'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('invites')}
            className={`px-5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              filter === 'invites'
                ? 'bg-[#4338CA] text-white shadow-xs'
                : 'bg-[#EFECE6] text-stone-600 hover:bg-stone-200'
            }`}
          >
            Invites
          </button>
        </div>

        {/* Chat List */}
        <div className="space-y-2.5 pt-1">
          {filteredRooms.map((room) => {
            const isElena = room.id === 'elena-rostova';
            const isMaya = room.id === 'maya-lin';
            const isJulian = room.id === 'julian-vance';
            const isDavid = room.id === 'david-chen';

            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className="group w-full rounded-2xl bg-white p-3.5 shadow-xs border border-stone-100/90 hover:border-indigo-100 hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {room.avatar ? (
                      <img
                        src={room.avatar}
                        alt={room.name}
                        className="w-13 h-13 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-full bg-[#FFEAE5] flex items-center justify-center text-[#F27A54] font-bold text-sm">
                        ER
                      </div>
                    )}

                    {/* Online status indicator dot */}
                    {isMaya && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                    {isJulian && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                    {isElena && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-orange-400 border-2 border-white" />
                    )}
                    {isDavid && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-indigo-300 border-2 border-white" />
                    )}
                  </div>

                  {/* Name & Snippet */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-stone-900 text-sm truncate">{room.name}</h4>
                      {isMaya && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                    </div>
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {room.lastMessageSnippet}
                    </p>
                  </div>
                </div>

                {/* Right metadata / status */}
                <div className="shrink-0 text-right">
                  {room.status === 'pending' ? (
                    <span className="text-xs font-semibold text-orange-400">
                      Pending
                    </span>
                  ) : (
                    <span className="text-xs text-stone-400 font-medium">
                      {room.lastMessageTime}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredRooms.length === 0 && (
            <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-stone-200 p-6">
              <p className="text-sm font-medium text-stone-600">No conversations found</p>
              <p className="text-xs text-stone-400 mt-1">Tap "+ New Chat" to start a mindful dialogue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
