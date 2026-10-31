export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  timeFormatted: string;
  sentimentTag?: string;
  isMediated?: boolean;
  originalDraft?: string;
  rewriteUsed?: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  isOnline: boolean;
  status: 'active' | 'pending' | 'resolved' | 'in_dialogue';
}

export interface ChatRoom {
  id: string;
  name: string;
  avatar: string;
  participants: ChatParticipant[];
  lastMessageSnippet: string;
  lastMessageTime: string;
  status: 'active' | 'pending' | 'resolved';
  pacingMode: boolean;
  pacingSeconds: number;
  mediatorActive: boolean;
  createdAt: string;
}

export interface MediationSuggestion {
  accusatoryRisk: 'High' | 'Moderate' | 'Low';
  draftWarning: string;
  sentimentTag: string;
  suggestedRewrite: string;
  rewriteTag: string;
  rationale: string;
}
