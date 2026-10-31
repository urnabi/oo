import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatsScreen } from './components/ChatsScreen';
import { NewChatScreen } from './components/NewChatScreen';
import { ChatThreadScreen } from './components/ChatThreadScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav, TabType } from './components/BottomNav';
import { ApkReleaseModal } from './components/ApkReleaseModal';
import { ChatRoom, ChatMessage, ChatParticipant } from './types/chat';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'welcome' | 'chats' | 'new' | 'thread' | 'insights' | 'settings'
  >('welcome');
  const [activeTab, setActiveTab] = useState<TabType>('chats');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('maya-lin');
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [pendingInviteRoom, setPendingInviteRoom] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<ChatParticipant>({
    id: 'alex',
    name: 'Alex Morgan',
    email: 'alex@craft.io',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    isOnline: true,
    status: 'active',
  });

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Current shareable URL for direct link chatting
  const appUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://theotherside.chat';

  // Check URL query parameters for direct shared chat links: ?chat=room-123 or ?join=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatParam = params.get('chat') || params.get('join') || params.get('room');
    if (chatParam) {
      setPendingInviteRoom(chatParam);
      setSelectedRoomId(chatParam);
      // Skip welcome if direct invite link is clicked
      setCurrentScreen('thread');
      setActiveTab('chats');
    }
  }, []);

  // Fetch rooms list from backend
  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/rooms');
      if (res.ok) {
        const data = await res.json();
        if (data.rooms) setRooms(data.rooms);
        if (data.currentUser) setCurrentUser(data.currentUser);
      }
    } catch (e) {
      console.log('Error loading rooms:', e);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Fetch active room messages and listen to real-time Server-Sent Events (SSE)
  useEffect(() => {
    if (!selectedRoomId) return;

    // Load existing messages
    fetch(`/api/rooms/${selectedRoomId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.messages) setMessages(data.messages);
          if (data.room) {
            setRooms((prev) => {
              const idx = prev.findIndex((r) => r.id === data.room.id);
              if (idx >= 0) {
                const next = [...prev];
                next[idx] = data.room;
                return next;
              }
              return [data.room, ...prev];
            });
          }
        }
      })
      .catch((err) => console.log('Error fetching room detail:', err));

    // Connect SSE for live real-time bidirectional messaging
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`/api/rooms/${selectedRoomId}/events`);
      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'new_message' && payload.message) {
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some((m) => m.id === payload.message.id)) return prev;
              return [...prev, payload.message];
            });
            // Update room snippet
            if (payload.room) {
              setRooms((prev) =>
                prev.map((r) => (r.id === payload.room.id ? { ...r, ...payload.room } : r))
              );
            }
          }
        } catch {
          // ignore parsing error
        }
      };
    } catch (err) {
      console.log('SSE connection error:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [selectedRoomId]);

  // Send message to backend
  const handleSendMessage = async (
    text: string,
    senderId?: string,
    senderName?: string,
    senderAvatar?: string,
    sentimentTag?: string,
    isMediated?: boolean,
    originalDraft?: string,
    rewriteUsed?: boolean
  ) => {
    try {
      const res = await fetch(`/api/rooms/${selectedRoomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          senderId: senderId || currentUser.id,
          senderName: senderName || currentUser.name,
          senderAvatar: senderAvatar || currentUser.avatar,
          sentimentTag,
          isMediated,
          originalDraft,
          rewriteUsed,
        }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        fetchRooms();
      }
    } catch (err) {
      console.log('Error sending message:', err);
    }
  };

  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setCurrentScreen('thread');
  };

  const handleCreateRoom = async (name: string, email: string) => {
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        const data = await res.json();
        await fetchRooms();
        setSelectedRoomId(data.room.id);
        setCurrentScreen('thread');
      }
    } catch (err) {
      console.log('Error creating room:', err);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'chats') setCurrentScreen('chats');
    if (tab === 'new') setCurrentScreen('new');
    if (tab === 'insights') setCurrentScreen('insights');
    if (tab === 'settings') setCurrentScreen('settings');
  };

  const currentRoom =
    rooms.find((r) => r.id === selectedRoomId) || {
      id: selectedRoomId,
      name: 'Maya Lin',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      participants: [currentUser],
      lastMessageSnippet: '“I appreciate you explaining that. Let’s…”',
      lastMessageTime: '10m',
      status: 'active' as const,
      pacingMode: true,
      pacingSeconds: 3,
      mediatorActive: true,
      createdAt: new Date().toISOString(),
    };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1E24] font-sans">
      {/* Screen Routing */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          pendingInviteRoom={pendingInviteRoom}
          onGetStarted={() => {
            if (pendingInviteRoom) {
              setSelectedRoomId(pendingInviteRoom);
              setCurrentScreen('thread');
            } else {
              setCurrentScreen('chats');
              setActiveTab('chats');
            }
          }}
        />
      )}

      {currentScreen === 'chats' && (
        <ChatsScreen
          rooms={rooms}
          currentUser={currentUser}
          onSelectRoom={handleSelectRoom}
          onNewChat={() => {
            setCurrentScreen('new');
            setActiveTab('new');
          }}
          onOpenSettings={() => {
            setCurrentScreen('settings');
            setActiveTab('settings');
          }}
          onOpenApkModal={() => setIsApkModalOpen(true)}
          appUrl={appUrl}
        />
      )}

      {currentScreen === 'new' && (
        <NewChatScreen
          currentUser={currentUser}
          onCreateRoom={handleCreateRoom}
          onSelectExisting={handleSelectRoom}
          onOpenSettings={() => {
            setCurrentScreen('settings');
            setActiveTab('settings');
          }}
          appUrl={appUrl}
        />
      )}

      {currentScreen === 'thread' && (
        <ChatThreadScreen
          room={currentRoom}
          messages={messages}
          currentUser={currentUser}
          onBack={() => {
            setCurrentScreen('chats');
            setActiveTab('chats');
          }}
          onSendMessage={handleSendMessage}
          appUrl={appUrl}
        />
      )}

      {currentScreen === 'insights' && (
        <InsightsScreen
          currentUser={currentUser}
          onOpenSettings={() => {
            setCurrentScreen('settings');
            setActiveTab('settings');
          }}
          onSelectRoom={handleSelectRoom}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          currentUser={currentUser}
          onUpdateUser={(name, email) => {
            setCurrentUser((prev) => ({ ...prev, name, email }));
          }}
          onLogout={() => setCurrentScreen('welcome')}
          onOpenApkModal={() => setIsApkModalOpen(true)}
        />
      )}

      {/* Persistent Bottom Nav (shown on main tab views, hidden on welcome & chat thread) */}
      {currentScreen !== 'welcome' && currentScreen !== 'thread' && (
        <BottomNav activeTab={activeTab} onSelectTab={handleTabChange} />
      )}

      {/* APK & Release Modal */}
      <ApkReleaseModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        appUrl={appUrl}
      />
    </div>
  );
}
