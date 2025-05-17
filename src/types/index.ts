
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  score?: number;
  rank?: number;
  debatesWon?: number;
  debatesParticipated?: number;
  createdAt?: string;
}

export interface Topic {
  id: string;
  title: string;
  category: "Politics" | "Tech" | "Ethics" | "Society" | "Science" | "Other";
  description?: string;
}

export interface DebateRoom {
  id: string;
  name: string;
  topic: Topic;
  createdBy: string;
  participants: User[];
  isVoice: boolean;
  maxParticipants: number;
  status: "waiting" | "active" | "completed";
  createdAt: string;
  endsAt?: string;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: string;
  isAI?: boolean;
}

export interface AIFeedback {
  id: string;
  userId: string;
  username: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  timestamp: string;
}

export interface DebateSummary {
  winner?: User;
  scores: { userId: string; username: string; score: number }[];
  summary: string;
  keyPoints: string[];
}

export enum AuthStatus {
  IDLE = "idle",
  LOADING = "loading",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
  ERROR = "error"
}
