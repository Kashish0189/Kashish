export type MediAnimationState =
  | "MEDI_IDLE"
  | "MEDI_LISTENING"
  | "MEDI_THINKING"
  | "MEDI_SPEAKING"
  | "MEDI_ALERT";

export type ActiveTab =
  | "home"
  | "conversation"
  | "reminders"
  | "appointments"
  | "emergency"
  | "beyond-screen"
  | "settings";

export interface Reminder {
  id: string;
  title: string;
  time: string;
  type: "medication" | "routine" | "custom";
  repeat: "Every day" | "Weekdays" | "Once" | "Custom";
  active: boolean;
  dosage?: string;
}

export interface Appointment {
  id: string;
  title: string;
  doctorName?: string;
  date: string;
  time: string;
  location?: string;
  reminderActive: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  preferredLanguage: string;
  country: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "medi";
  text: string;
  timestamp: string;
  actionTriggered?: string;
}

export interface RoadmapStage {
  version: string;
  title: string;
  subtitle: string;
  status: "Completed" | "Live Demo" | "In Development" | "Future Vision";
  description: string;
  keyFeatures: string[];
}
