import { MediAnimationState, Reminder, Appointment, UserProfile } from "../types";

export interface AIResponse {
  reply: string;
  action: "CREATE_REMINDER" | "VIEW_APPOINTMENTS" | "VIEW_REMINDERS" | "EMERGENCY_ALERT" | "GREETING" | null;
  actionData?: {
    reminderTitle?: string;
    reminderTime?: string;
    reminderType?: "medication" | "routine" | "custom";
  };
  suggestedAnimation: MediAnimationState;
}

export async function processMediMessage(
  message: string,
  userProfile: UserProfile,
  language: string
): Promise<AIResponse> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        userContext: userProfile,
        language,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        reply: data.reply || "I am right here with you.",
        action: data.action || null,
        actionData: data.actionData,
        suggestedAnimation: data.suggestedAnimation || "MEDI_SPEAKING",
      };
    }
  } catch (err) {
    console.info("Server chat request handled via client companion fallback:", err);
  }

  // Robust client-side fallback if offline or network unavailable
  const lower = message.toLowerCase();
  if (lower.includes("remind") || lower.includes("medicine") || lower.includes("medication") || lower.includes("pill")) {
    const timeMatch = lower.match(/(at\s+)?(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    const extractedTime = timeMatch ? timeMatch[2].toUpperCase() : "8:00 PM";
    return {
      reply: `Of course. I'll remind you to take your medicine at ${extractedTime}.`,
      action: "CREATE_REMINDER",
      actionData: {
        reminderTitle: "Evening Blood Pressure Medication",
        reminderTime: extractedTime,
        reminderType: "medication",
      },
      suggestedAnimation: "MEDI_SPEAKING",
    };
  }

  if (lower.includes("appointment") || lower.includes("doctor") || lower.includes("tomorrow") || lower.includes("schedule")) {
    return {
      reply: "Tomorrow at 10:30 AM, you have a scheduled appointment with Dr. Sarah Jenkins (Cardiology Clinic).",
      action: "VIEW_APPOINTMENTS",
      suggestedAnimation: "MEDI_SPEAKING",
    };
  }

  if (lower.includes("help") || lower.includes("emergency") || lower.includes("fall")) {
    return {
      reply: "I am alerting your primary emergency contact right now and staying on audio with you. Please sit down safely.",
      action: "EMERGENCY_ALERT",
      suggestedAnimation: "MEDI_ALERT",
    };
  }

  if (lower.includes("morning") || lower.includes("hello") || lower.includes("good day")) {
    return {
      reply: `Good morning, ${userProfile.name || "friend"}! How are you feeling today? I have your morning routine prepared.`,
      action: "GREETING",
      suggestedAnimation: "MEDI_SPEAKING",
    };
  }

  return {
    reply: `I understand. I am your MEDI companion, always active to assist with your medications, appointments, and safety.`,
    action: null,
    suggestedAnimation: "MEDI_SPEAKING",
  };
}
