import type { AssessmentPlan } from "@workspace/api-client-react";

export type User = { name: string; email: string; createdAt: string };
export type MoodEntry = {
  id: string;
  date: string;
  mood: number;
  label: string;
  note: string;
  emotion?: string;
  createdAt: string;
};
export type Assessment = {
  id: string;
  type: "gad7" | "phq9" | "pss10" | "big5";
  date: string;
  scores: Record<string, number>;
  plan: AssessmentPlan;
};
export type Appointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: "booked" | "cancelled";
  createdAt: string;
};
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};
export type ChatStore = Record<"therapist" | "doctor", ChatMessage[]>;

const KEYS = {
  user: "psychwell_user",
  lang: "psychwell_lang",
  chat: "psychwell_chat",
  assessments: "psychwell_assessments",
  mood: "psychwell_mood",
  appointments: "psychwell_appointments",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  getUser: (): User | null => read<User | null>(KEYS.user, null),
  setUser: (u: User | null) => {
    if (u) write(KEYS.user, u);
    else window.localStorage.removeItem(KEYS.user);
  },
  getLang: (): "en" | "ur" => read<"en" | "ur">(KEYS.lang, "en"),
  setLang: (l: "en" | "ur") => write(KEYS.lang, l),
  getChat: (): ChatStore =>
    read<ChatStore>(KEYS.chat, { therapist: [], doctor: [] }),
  setChat: (c: ChatStore) => write(KEYS.chat, c),
  getAssessments: (): Assessment[] => read<Assessment[]>(KEYS.assessments, []),
  setAssessments: (a: Assessment[]) => write(KEYS.assessments, a),
  getMood: (): MoodEntry[] => read<MoodEntry[]>(KEYS.mood, []),
  setMood: (m: MoodEntry[]) => write(KEYS.mood, m),
  getAppointments: (): Appointment[] =>
    read<Appointment[]>(KEYS.appointments, []),
  setAppointments: (a: Appointment[]) => write(KEYS.appointments, a),
  clearAll: () => {
    Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
  },
};

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
