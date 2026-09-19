import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ActiveTab,
  MediAnimationState,
  Reminder,
  Appointment,
  EmergencyContact,
  UserProfile,
  ChatMessage,
} from "../types";
import { voiceService, playWakeChime } from "../services/voice";
import { processMediMessage } from "../services/ai";

interface MediContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  animationState: MediAnimationState;
  setAnimationState: (state: MediAnimationState) => void;
  conversation: ChatMessage[];
  reminders: Reminder[];
  appointments: Appointment[];
  emergencyContacts: EmergencyContact[];
  userProfile: UserProfile;
  language: string;
  setLanguage: (lang: string) => void;
  isListening: boolean;
  isSpeaking: boolean;
  liveTranscript: string;
  isWakeWordActive: boolean;
  toggleWakeWord: () => void;
  cancelListening: () => void;
  activeNotification: string | null;
  presentationOpen: boolean;
  setPresentationOpen: (open: boolean) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;

  // Actions
  triggerHeyMedi: (presetText?: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  addReminder: (rem: Omit<Reminder, "id">) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  addAppointment: (app: Omit<Appointment, "id">) => void;
  deleteAppointment: (id: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addEmergencyContact: (c: Omit<EmergencyContact, "id">) => void;
  triggerEmergencyAlert: () => void;
  dismissNotification: () => void;
}

const MediContext = createContext<MediContextType | undefined>(undefined);

export const MediProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [animationState, setAnimationState] = useState<MediAnimationState>("MEDI_IDLE");
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // User Profile with elderly-friendly defaults
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("medi_user_profile");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Eleanor",
          age: 74,
          gender: "Female",
          preferredLanguage: "English",
          country: "United States",
          notes: "Mild hypertension, loves morning garden walks",
        };
  });

  const [language, setLanguageState] = useState<string>("English");

  // Initial Seed Reminders
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem("medi_reminders");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "rem-1",
            title: "Blood Pressure Medication (Amlodipine 5mg)",
            time: "8:00 PM",
            type: "medication",
            repeat: "Every day",
            active: true,
            dosage: "1 tablet with glass of water",
          },
          {
            id: "rem-2",
            title: "Morning Vitamin D3 + Calcium",
            time: "9:00 AM",
            type: "medication",
            repeat: "Every day",
            active: true,
            dosage: "1 capsule with breakfast",
          },
          {
            id: "rem-3",
            title: "Gentle 15-Minute Garden Walk",
            time: "4:30 PM",
            type: "routine",
            repeat: "Every day",
            active: true,
          },
        ];
  });

  // Initial Seed Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem("medi_appointments");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "app-1",
            title: "Cardiologist Consultation",
            doctorName: "Dr. Sarah Jenkins, MD",
            date: "Tomorrow",
            time: "10:30 AM",
            location: "St. Jude Wellness Center, Suite 302",
            reminderActive: true,
          },
          {
            id: "app-2",
            title: "Optometry Vision Checkup",
            doctorName: "Dr. Marcus Reed",
            date: "Next Tuesday, Oct 14",
            time: "2:00 PM",
            location: "Vision Specialists Clinic",
            reminderActive: true,
          },
        ];
  });

  // Initial Emergency Contacts
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem("medi_emergency_contacts");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "em-1",
            name: "Sarah Vance",
            relationship: "Daughter & Primary Caregiver",
            phone: "+1 (555) 234-5678",
            isPrimary: true,
          },
          {
            id: "em-2",
            name: "Dr. Robert Patel",
            relationship: "Primary Care Physician",
            phone: "+1 (555) 890-1234",
            isPrimary: false,
          },
          {
            id: "em-3",
            name: "Senior Living Care Concierge",
            relationship: "24/7 Resident Support",
            phone: "+1 (555) 911-0022",
            isPrimary: false,
          },
        ];
  });

  // Conversation history
  const [conversation, setConversation] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "medi",
      text: "Good morning! How are you today? I'm right here with you.",
      timestamp: "Just now",
    },
  ]);

  // Voice engine states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);

  // Persist storage
  useEffect(() => {
    localStorage.setItem("medi_user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("medi_reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("medi_appointments", JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("medi_emergency_contacts", JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  // Connect Voice Service Callbacks
  useEffect(() => {
    voiceService.setCallbacks({
      onWakeWord: () => {
        // Wake-word "Hey MEDI" detected by speech recognition engine
        triggerHeyMedi();
      },
      onListeningStart: () => {
        setIsListening(true);
        setAnimationState("MEDI_LISTENING");
        setLiveTranscript("Listening…");
      },
      onListeningEnd: () => {
        setIsListening(false);
      },
      onTranscript: (text, isFinal) => {
        setLiveTranscript(text);
        if (isFinal && text.trim().length > 0) {
          sendMessage(text.trim());
          setLiveTranscript("");
        }
      },
      onSpeakingStart: () => {
        setIsSpeaking(true);
        setAnimationState("MEDI_SPEAKING");
      },
      onSpeakingEnd: () => {
        setIsSpeaking(false);
        setAnimationState("MEDI_IDLE");
      },
    });
  }, [userProfile, reminders, appointments]);

  const toggleWakeWord = () => {
    if (isWakeWordActive) {
      voiceService.stopWakeWordMonitoring();
      setIsWakeWordActive(false);
      setActiveNotification("Wake-word monitoring paused");
    } else {
      const started = voiceService.startWakeWordMonitoring();
      setIsWakeWordActive(true);
      setActiveNotification(
        started
          ? "Say 'Hey MEDI' anytime to wake up companion"
          : "Wake-word simulator active: Say 'Hey MEDI' or press [H]"
      );
    }
  };

  const cancelListening = () => {
    voiceService.stopListening();
    setIsListening(false);
    setLiveTranscript("");
    setAnimationState("MEDI_IDLE");
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    if (lang === "Hindi") voiceService.setLanguage("hi-IN");
    else if (lang === "Spanish") voiceService.setLanguage("es-ES");
    else if (lang === "French") voiceService.setLanguage("fr-FR");
    else voiceService.setLanguage("en-US");
  };

  const addReminder = (rem: Omit<Reminder, "id">) => {
    const newRem: Reminder = {
      ...rem,
      id: "rem-" + Date.now(),
    };
    setReminders((prev) => [newRem, ...prev]);
    setActiveNotification(`Reminder created: ${newRem.title} at ${newRem.time}`);
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const addAppointment = (app: Omit<Appointment, "id">) => {
    const newApp: Appointment = {
      ...app,
      id: "app-" + Date.now(),
    };
    setAppointments((prev) => [newApp, ...prev]);
    setActiveNotification(`Appointment saved: ${newApp.title} (${newApp.time})`);
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  const addEmergencyContact = (contact: Omit<EmergencyContact, "id">) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: "em-" + Date.now(),
    };
    setEmergencyContacts((prev) => [...prev, newContact]);
  };

  const triggerEmergencyAlert = () => {
    setAnimationState("MEDI_ALERT");
    const primary = emergencyContacts.find((c) => c.isPrimary) || emergencyContacts[0];
    const alertMsg = `Emergency escalation activated. Alerting ${primary?.name || "Caregiver"} and displaying direct medical support channels.`;
    setActiveNotification(alertMsg);

    const newMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "medi",
      text: alertMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actionTriggered: "EMERGENCY_ALERT",
    };
    setConversation((prev) => [...prev, newMsg]);

    voiceService.speak(alertMsg, () => {
      // Keep state as alert or return after delay
      setTimeout(() => setAnimationState("MEDI_IDLE"), 6000);
    });
  };

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  // Main message sending pipeline
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // 1. Add user message
    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setConversation((prev) => [...prev, userMsg]);

    // 2. Set THINKING state
    setAnimationState("MEDI_THINKING");

    // 3. Process AI
    const res = await processMediMessage(text, userProfile, language);

    // 4. Set SPEAKING state & add MEDI message
    setAnimationState(res.suggestedAnimation || "MEDI_SPEAKING");

    const mediMsg: ChatMessage = {
      id: "medi-" + Date.now(),
      sender: "medi",
      text: res.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      actionTriggered: res.action || undefined,
    };
    setConversation((prev) => [...prev, mediMsg]);

    // 5. Handle Actions
    if (res.action === "CREATE_REMINDER") {
      const title = res.actionData?.reminderTitle || "Medication Reminder";
      const time = res.actionData?.reminderTime || "8:00 PM";
      const type = res.actionData?.reminderType || "medication";
      addReminder({
        title,
        time,
        type,
        repeat: "Every day",
        active: true,
      });
    } else if (res.action === "VIEW_APPOINTMENTS") {
      setActiveTab("appointments");
    } else if (res.action === "VIEW_REMINDERS") {
      setActiveTab("reminders");
    } else if (res.action === "EMERGENCY_ALERT") {
      setActiveTab("emergency");
      triggerEmergencyAlert();
      return;
    }

    // 6. Speak response via Web Speech TTS
    voiceService.speak(res.reply, () => {
      setAnimationState("MEDI_IDLE");
    });
  };

  // Dedicated "Hey MEDI" voice trigger & simulation
  const triggerHeyMedi = async (presetText?: string) => {
    // 1. Play soothing companion acoustic chime
    playWakeChime();

    // 2. Immediately transition to MEDI_LISTENING attentive state
    setAnimationState("MEDI_LISTENING");
    setIsListening(true);
    setLiveTranscript("Listening…");

    // 3. Preset prompt simulation (e.g. from command cards or test buttons)
    if (presetText) {
      setTimeout(() => {
        setLiveTranscript(`"${presetText}"`);
      }, 500);

      setTimeout(() => {
        setIsListening(false);
        setLiveTranscript("");
        sendMessage(presetText);
      }, 1300);
      return;
    }

    // 4. Start active voice recognition
    voiceService.startListening();
  };

  // Keyboard shortcut: Press [H] outside inputs to say/simulate "Hey MEDI", [Escape] to cancel
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (e.key === "Escape" && isListening) {
        cancelListening();
        return;
      }

      if (!isTyping && (e.key === "h" || e.key === "H")) {
        e.preventDefault();
        triggerHeyMedi();
      }
    };

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [isListening]);

  return (
    <MediContext.Provider
      value={{
        activeTab,
        setActiveTab,
        animationState,
        setAnimationState,
        conversation,
        reminders,
        appointments,
        emergencyContacts,
        userProfile,
        language,
        setLanguage,
        isListening,
        isSpeaking,
        liveTranscript,
        isWakeWordActive,
        toggleWakeWord,
        cancelListening,
        activeNotification,
        presentationOpen,
        setPresentationOpen,
        onboardingOpen,
        setOnboardingOpen,
        triggerHeyMedi,
        sendMessage,
        addReminder,
        toggleReminder,
        deleteReminder,
        addAppointment,
        deleteAppointment,
        updateUserProfile,
        addEmergencyContact,
        triggerEmergencyAlert,
        dismissNotification,
      }}
    >
      {children}
    </MediContext.Provider>
  );
};

export const useMedi = () => {
  const context = useContext(MediContext);
  if (!context) {
    throw new Error("useMedi must be used within a MediProvider");
  }
  return context;
};
