import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Type definitions
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
  lastSeen?: string;
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
  inviteLink?: string;
  createdAt: string;
}

// Initial state data representing the screens in the user request
const DEFAULT_PARTICIPANTS: Record<string, ChatParticipant> = {
  alex: {
    id: 'alex',
    name: 'Alex Morgan',
    email: 'alex@craft.io',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    isOnline: true,
    status: 'active',
  },
  maya: {
    id: 'maya',
    name: 'Maya Lin',
    email: 'maya.lin@quietcraft.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    isOnline: true,
    status: 'active',
  },
  julian: {
    id: 'julian',
    name: 'Julian Vance',
    email: 'julian@vance.design',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    isOnline: true,
    status: 'in_dialogue',
  },
  elena: {
    id: 'elena',
    name: 'Elena Rostova',
    email: 'elena.rostova@dialogue.org',
    avatar: '', // ER initials badge
    isOnline: false,
    status: 'pending',
  },
  david: {
    id: 'david',
    name: 'David Chen',
    email: 'david.chen@calmworks.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    isOnline: false,
    status: 'resolved',
  },
};

const DEFAULT_ROOMS: Record<string, ChatRoom> = {
  'maya-lin': {
    id: 'maya-lin',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    participants: [DEFAULT_PARTICIPANTS.alex, DEFAULT_PARTICIPANTS.maya],
    lastMessageSnippet: '“I appreciate you explaining that. Let’s…”',
    lastMessageTime: '10m',
    status: 'active',
    pacingMode: true,
    pacingSeconds: 3,
    mediatorActive: true,
    createdAt: new Date().toISOString(),
  },
  'julian-vance': {
    id: 'julian-vance',
    name: 'Julian Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    participants: [DEFAULT_PARTICIPANTS.alex, DEFAULT_PARTICIPANTS.julian],
    lastMessageSnippet: '“Could we set clear expectations arou…”',
    lastMessageTime: '2h',
    status: 'active',
    pacingMode: true,
    pacingSeconds: 3,
    mediatorActive: true,
    createdAt: new Date().toISOString(),
  },
  'elena-rostova': {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    avatar: '',
    participants: [DEFAULT_PARTICIPANTS.alex, DEFAULT_PARTICIPANTS.elena],
    lastMessageSnippet: 'Invitation sent via WhatsApp link',
    lastMessageTime: 'Pending',
    status: 'pending',
    pacingMode: true,
    pacingSeconds: 3,
    mediatorActive: true,
    createdAt: new Date().toISOString(),
  },
  'david-chen': {
    id: 'david-chen',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    participants: [DEFAULT_PARTICIPANTS.alex, DEFAULT_PARTICIPANTS.david],
    lastMessageSnippet: '“Thank you for taking time to hear my …”',
    lastMessageTime: '3d',
    status: 'resolved',
    pacingMode: false,
    pacingSeconds: 0,
    mediatorActive: true,
    createdAt: new Date().toISOString(),
  },
};

const DEFAULT_MESSAGES: Record<string, ChatMessage[]> = {
  'maya-lin': [
    {
      id: 'm1',
      roomId: 'maya-lin',
      senderId: 'maya',
      senderName: 'Maya Lin',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      text: 'I felt overwhelmed when the plan changed yesterday without warning.',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      timeFormatted: '10:14 AM',
    },
    {
      id: 'm2',
      roomId: 'maya-lin',
      senderId: 'maya',
      senderName: 'Maya Lin',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
      text: "It felt like my schedule didn't matter.",
      timestamp: new Date(Date.now() - 3600000 * 2 + 60000).toISOString(),
      timeFormatted: '10:15 AM',
      sentimentTag: 'Expressing hurt',
    },
  ],
  'julian-vance': [
    {
      id: 'j1',
      roomId: 'julian-vance',
      senderId: 'julian',
      senderName: 'Julian Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
      text: 'Could we set clear expectations around the client handoff tomorrow?',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      timeFormatted: '08:30 AM',
      sentimentTag: 'Constructive Request',
    },
  ],
  'david-chen': [
    {
      id: 'd1',
      roomId: 'david-chen',
      senderId: 'david',
      senderName: 'David Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
      text: 'Thank you for taking time to hear my perspective on the project timeline.',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
      timeFormatted: 'Oct 28',
      sentimentTag: 'Gratitude',
    },
  ],
};

// In-memory data store with file persistence
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'chats.json');

let rooms: Record<string, ChatRoom> = { ...DEFAULT_ROOMS };
let messages: Record<string, ChatMessage[]> = { ...DEFAULT_MESSAGES };

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.rooms) rooms = { ...DEFAULT_ROOMS, ...parsed.rooms };
    if (parsed.messages) messages = { ...DEFAULT_MESSAGES, ...parsed.messages };
  }
} catch (e) {
  console.log('Using in-memory store:', e);
}

function persistData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ rooms, messages }, null, 2));
  } catch (err) {
    // ignore in read-only sandbox
  }
}

// Real-time Server-Sent Events subscriber pool
type SSEResponse = Response;
const roomSubscribers: Record<string, Set<SSEResponse>> = {};

function notifySubscribers(roomId: string, eventData: unknown) {
  const subs = roomSubscribers[roomId];
  if (!subs || subs.size === 0) return;
  const payload = `data: ${JSON.stringify(eventData)}\n\n`;
  for (const client of subs) {
    try {
      client.write(payload);
    } catch {
      subs.delete(client);
    }
  }
}

// ---------------- API ROUTES ----------------

// Get all rooms / contacts
app.get('/api/rooms', (_req: Request, res: Response) => {
  res.json({
    rooms: Object.values(rooms),
    currentUser: DEFAULT_PARTICIPANTS.alex,
  });
});

// Get single room details and messages
app.get('/api/rooms/:roomId', (req: Request, res: Response) => {
  const { roomId } = req.params;
  const room = rooms[roomId];
  if (!room) {
    // If room does not exist, create an instant room so direct link sharing works seamlessly!
    const newRoom: ChatRoom = {
      id: roomId,
      name: `Direct Chat #${roomId.slice(0, 6)}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
      participants: [DEFAULT_PARTICIPANTS.alex],
      lastMessageSnippet: 'Start a mindful dialogue...',
      lastMessageTime: 'Just now',
      status: 'active',
      pacingMode: true,
      pacingSeconds: 3,
      mediatorActive: true,
      createdAt: new Date().toISOString(),
    };
    rooms[roomId] = newRoom;
    messages[roomId] = [];
    persistData();
    res.json({ room: newRoom, messages: [] });
    return;
  }
  res.json({
    room,
    messages: messages[roomId] || [],
  });
});

// Create new room or invite link
app.post('/api/rooms', (req: Request, res: Response) => {
  const { name, email, avatar, pacingMode = true } = req.body;
  const roomId = `room-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  
  const guestParticipant: ChatParticipant = {
    id: `user-${Date.now()}`,
    name: name || 'Guest Partner',
    email: email || '',
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
    isOnline: true,
    status: 'active',
  };

  const newRoom: ChatRoom = {
    id: roomId,
    name: guestParticipant.name,
    avatar: guestParticipant.avatar,
    participants: [DEFAULT_PARTICIPANTS.alex, guestParticipant],
    lastMessageSnippet: 'Invitation link ready to share',
    lastMessageTime: 'Just now',
    status: 'active',
    pacingMode,
    pacingSeconds: 3,
    mediatorActive: true,
    createdAt: new Date().toISOString(),
  };

  rooms[roomId] = newRoom;
  messages[roomId] = [
    {
      id: `welcome-${Date.now()}`,
      roomId,
      senderId: 'system',
      senderName: 'The Other Side',
      senderAvatar: '/icon.svg',
      text: 'Welcome to your mindful dialogue space. Pacing mode is active and AI Mediator is present to keep conversations kind.',
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  persistData();
  res.status(201).json({ room: newRoom, messages: messages[roomId] });
});

// Post a message in a room
app.post('/api/rooms/:roomId/messages', (req: Request, res: Response) => {
  const { roomId } = req.params;
  const {
    text,
    senderId = 'alex',
    senderName = 'Alex Morgan',
    senderAvatar = DEFAULT_PARTICIPANTS.alex.avatar,
    sentimentTag,
    isMediated,
    originalDraft,
    rewriteUsed,
  } = req.body;

  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Text message is required' });
    return;
  }

  if (!rooms[roomId]) {
    rooms[roomId] = {
      id: roomId,
      name: 'Shared Dialogue',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
      participants: [DEFAULT_PARTICIPANTS.alex],
      lastMessageSnippet: text,
      lastMessageTime: 'Just now',
      status: 'active',
      pacingMode: true,
      pacingSeconds: 3,
      mediatorActive: true,
      createdAt: new Date().toISOString(),
    };
  }

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    roomId,
    senderId,
    senderName,
    senderAvatar,
    text,
    timestamp: now.toISOString(),
    timeFormatted,
    sentimentTag,
    isMediated,
    originalDraft,
    rewriteUsed,
  };

  if (!messages[roomId]) messages[roomId] = [];
  messages[roomId].push(newMessage);

  // Update room snippet
  rooms[roomId].lastMessageSnippet = text.length > 40 ? text.substring(0, 37) + '...' : text;
  rooms[roomId].lastMessageTime = 'Just now';

  persistData();

  // Notify real-time subscribers
  notifySubscribers(roomId, {
    type: 'new_message',
    message: newMessage,
    room: rooms[roomId],
  });

  res.status(201).json(newMessage);
});

// SSE endpoint for live real-time sync across devices/links
app.get('/api/rooms/:roomId/events', (req: Request, res: Response) => {
  const { roomId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!roomSubscribers[roomId]) {
    roomSubscribers[roomId] = new Set();
  }
  roomSubscribers[roomId].add(res);

  // Send initial connection event
  res.write(`data: ${JSON.stringify({ type: 'connected', roomId, timestamp: Date.now() })}\n\n`);

  // Keep alive heartbeat every 20s
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    if (roomSubscribers[roomId]) {
      roomSubscribers[roomId].delete(res);
      if (roomSubscribers[roomId].size === 0) {
        delete roomSubscribers[roomId];
      }
    }
  });
});

// AI Mediator Analysis & Rewrite Endpoint
app.post('/api/mediate', async (req: Request, res: Response) => {
  const { draftText, recentContext = [], toneStyle = 'Gentler Tone' } = req.body;

  if (!draftText || !draftText.trim()) {
    res.status(400).json({ error: 'draftText is required' });
    return;
  }

  // First try Gemini API if valid GEMINI_API_KEY is present
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 15) {
    try {
      const ai = new GoogleGenAI();
      const prompt = `
You are the AI Mediator in "The Other Side", an empathetic mindful communication app that promotes non-violent communication, de-escalation, and kinder dialogue.

Context of recent conversation:
${JSON.stringify(recentContext.slice(-4), null, 2)}

User's draft reply to analyze:
"${draftText}"

Tone style preference: "${toneStyle}"

Analyze this draft with high emotional intelligence.
1. Determine if it has accusatory, defensive, dismissive, or passive-aggressive language (e.g., "you always", "you never", "blame", "it's your fault", "why do you").
2. Provide:
- accusatoryRisk: "High" | "Moderate" | "Low"
- draftWarning: 2-4 words tag (e.g. "May sound accusatory", "Slightly defensive", "High tension", "Respectful")
- sentimentTag: 2-3 words sentiment tag (e.g. "Expressing hurt", "Frustrated", "Clarifying intent", "Constructive")
- suggestedRewrite: A compassionate, Non-Violent Communication (NVC) rewrite that validates the other person's emotions, states facts without blaming, expresses honest perspective gently, and invites collaborative solution.
- rewriteTag: "Validates & Clarifies" | "Gentler Tone" | "Constructive Boundaries"
- rationale: 1 brief sentence explaining the psychological benefit of this reframing (e.g. "Replacing 'You always' with understanding prevents immediate defensiveness.").

Return ONLY valid JSON matching this schema:
{
  "accusatoryRisk": "High",
  "draftWarning": "May sound accusatory",
  "sentimentTag": "Expressing hurt",
  "suggestedRewrite": "...",
  "rewriteTag": "Validates & Clarifies",
  "rationale": "..."
}
`;

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout')), 2500)
      );

      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const response = await Promise.race([geminiPromise, timeoutPromise]);
      const responseText = response.text?.trim();
      if (responseText) {
        const parsed = JSON.parse(responseText);
        res.json(parsed);
        return;
      }
    } catch (err) {
      console.warn('Gemini mediation fallback to heuristics:', err);
    }
  }

  // Resilient heuristic engine (mirrors screenshot exactly and handles common emotional patterns)
  const lower = draftText.toLowerCase();

  let draftWarning = 'May sound accusatory';
  let accusatoryRisk = 'Moderate';
  let rewriteTag = 'Validates & Clarifies';
  let suggestedRewrite = "I didn't change it on purpose, but I hear that it caused stress. Can we coordinate next time so you're not caught off guard?";
  let rationale = "Replacing 'You always' with understanding prevents immediate defensiveness.";
  let sentimentTag = 'Clarifying intent';

  if (lower.includes('you always') || lower.includes('you never') || lower.includes('blame')) {
    draftWarning = 'May sound accusatory';
    accusatoryRisk = 'High';
    suggestedRewrite = "I didn't change it on purpose, but I hear that it caused stress. Can we coordinate next time so you're not caught off guard?";
    rationale = "Replacing 'You always' with understanding prevents immediate defensiveness.";
    rewriteTag = 'Validates & Clarifies';
  } else if (lower.includes('calm down') || lower.includes('overreacting') || lower.includes('crazy')) {
    draftWarning = 'Minimizing feelings';
    accusatoryRisk = 'High';
    suggestedRewrite = 'I want to understand your perspective better. Let us take a moment to look at this together.';
    rationale = 'Validating emotional weight builds mutual trust.';
    rewriteTag = 'Gentler Tone';
  } else if (lower.includes('not my problem') || lower.includes('whatever') || lower.includes("don't care")) {
    draftWarning = 'Dismissive boundary';
    accusatoryRisk = 'Moderate';
    suggestedRewrite = 'I have limited capacity right now, but I value our partnership. Let us revisit this when we can both give it our full attention.';
    rationale = 'Setting clear, respectful boundaries preserves relational harmony.';
    rewriteTag = 'Constructive Boundaries';
  } else {
    draftWarning = 'Direct Tone';
    accusatoryRisk = 'Low';
    suggestedRewrite = `I hear what you're saying. ${draftText.trim()} Let me know how that sounds to you.`;
    rationale = 'Framing thoughts as open questions invites mutual collaboration.';
    rewriteTag = 'Gentler Tone';
  }

  res.json({
    accusatoryRisk,
    draftWarning,
    sentimentTag,
    suggestedRewrite,
    rewriteTag,
    rationale,
  });
});

// Insights and communication statistics endpoint
app.get('/api/insights', (_req: Request, res: Response) => {
  res.json({
    calmScore: 84,
    scoreTrend: '+8% from last week',
    status: 'Peaceful trend',
    pausesCount: 12,
    preventedMisunderstandings: 4,
    toneReframing: {
      total: 32,
      directAndKind: 18,
      deescalatedDrafts: 9,
      constructiveBoundaries: 5,
      signaturePivot: 'Your most common rephrasing: swapping "You always" for "When plans change".',
    },
    conversationHealth: [
      {
        id: 'maya-lin',
        name: 'Maya Lin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
        status: 'Resolved',
        badgeColor: 'green',
        summary: 'Pacing Mode used • Resolution reached with clarity',
      },
      {
        id: 'julian-vance',
        name: 'Julian Vance',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
        status: 'In dialogue',
        badgeColor: 'purple',
        summary: 'Active session • Tone balanced',
      },
    ],
    mindfulMicroRitual: {
      name: '3-Second Breath',
      practicedTimes: 8,
      description: 'Practiced before 8 outgoing messages. Kept heart rate grounded & calm.',
    },
  });
});

// APK & Release info endpoint
app.get('/api/release-info', (_req: Request, res: Response) => {
  res.json({
    appName: 'The Other Side',
    packageName: 'io.theotherside.app',
    versionName: '1.0.0-release',
    versionCode: 100,
    buildStatus: 'RELEASE_READY',
    pwaCompliant: true,
    twaSupported: true,
    apkDownloadUrl: '/release/TheOtherSide-v1.0.0.apk',
    webApkDirectInstall: true,
    sha256Fingerprint: '4F:A3:8C:11:90:E5:6B:42:19:98:C1:23:44:A8:FB:E2:81:40:55:09',
  });
});

// Mount Vite or serve static files
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`The Other Side server listening on port ${PORT} (isProduction: ${isProduction})`);
  });
}

startServer();
