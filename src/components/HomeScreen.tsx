import React, { useState, useEffect } from "react";
import { useMedi } from "../context/MediContext";
import { MediScene } from "../3d/MediScene";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bell,
  Clock,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Volume2,
  HelpCircle,
} from "lucide-react";

export const HomeScreen: React.FC = () => {
  const {
    animationState,
    setAnimationState,
    conversation,
    reminders,
    appointments,
    triggerHeyMedi,
    sendMessage,
    isListening,
    isSpeaking,
    liveTranscript,
    isWakeWordActive,
    toggleWakeWord,
    cancelListening,
    setActiveTab,
    userProfile,
  } = useMedi();

  const [inputVal, setInputVal] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Upcoming reminder to show on home glance
  const upcomingReminder = reminders.find((r) => r.active) || reminders[0];

  const handleSend = () => {
    if (inputVal.trim()) {
      sendMessage(inputVal.trim());
      setInputVal("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick demonstration commands as requested in prompt #10
  const demoCommands = [
    {
      label: "Take medicine at 8 PM",
      full: "remind me to take my medicine at 8 PM",
      icon: "💊",
    },
    {
      label: "Appointments tomorrow?",
      full: "what appointments do I have tomorrow?",
      icon: "📅",
    },
    {
      label: "Schedule today?",
      full: "what is on my schedule today?",
      icon: "📋",
    },
    {
      label: "I need help",
      full: "I need help",
      icon: "🆘",
    },
    {
      label: "Good morning",
      full: "good morning",
      icon: "☀️",
    },
  ];

  // Simulated live audio wave heights
  const waveBars = [12, 28, 16, 36, 48, 22, 40, 52, 28, 18, 32, 46, 20, 14];

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between pb-24 md:pb-10 overflow-hidden">
      {/* Background Holographic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Top Bar Glance: Time & Upcoming Reminder */}
      <div className="w-full max-w-2xl px-4 pt-4 z-20 flex items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-800 backdrop-blur-md text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime}</span>
        </div>

        {upcomingReminder && (
          <button
            onClick={() => setActiveTab("reminders")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/70 border border-cyan-500/30 hover:border-cyan-400/60 backdrop-blur-md text-cyan-300 transition-colors group text-left"
          >
            <Bell className="w-3.5 h-3.5 text-cyan-400 group-hover:animate-bounce" />
            <span className="truncate max-w-[160px] sm:max-w-xs font-sans text-xs">
              {upcomingReminder.title} ({upcomingReminder.time})
            </span>
            <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </button>
        )}
      </div>

      {/* Center 3D MEDI Stage (Dominates Screen) */}
      <div className="relative w-full max-w-2xl flex-1 flex flex-col items-center justify-center min-h-[420px] sm:min-h-[480px]">
        {/* The 3D Interactive Canvas */}
        <div className="w-full h-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center">
          <MediScene
            animationState={animationState}
            onStateChange={setAnimationState}
            interactiveHead={true}
            className="w-full h-full"
          />
        </div>

        {/* Prominent Listening... Active State HUD Display */}
        {(isListening || animationState === "MEDI_LISTENING") && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-md pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 rounded-2xl bg-slate-950/95 border-2 border-cyan-400/80 backdrop-blur-xl shadow-2xl shadow-cyan-500/30 flex flex-col items-center gap-2.5 text-center">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                  <span className="font-display font-bold text-sm tracking-wider text-cyan-300 uppercase">
                    Listening…
                  </span>
                </div>
                <button
                  onClick={cancelListening}
                  className="text-xs font-mono text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 transition-colors"
                  title="Cancel voice listening (Esc)"
                >
                  Cancel [Esc]
                </button>
              </div>

              {/* Dynamic Sound Wave Reaction */}
              <div className="flex items-center justify-center gap-1 h-7 py-0.5">
                {[12, 24, 36, 18, 42, 28, 16, 38, 30, 20, 14].map((h, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 bg-cyan-400 rounded-full animate-pulse shadow-sm shadow-cyan-400/80"
                    style={{
                      height: `${Math.max(6, h * (0.6 + Math.sin(idx + Date.now() * 0.006) * 0.4))}px`,
                      animationDelay: `${idx * 75}ms`,
                    }}
                  />
                ))}
              </div>

              {/* Live Transcript or Attentive Prompt */}
              <div className="text-sm font-medium text-white px-2">
                {liveTranscript && liveTranscript !== "Listening…" && liveTranscript !== "Listening..."
                  ? `“${liveTranscript}”`
                  : "MEDI is listening attentively… Speak now or choose a command"}
              </div>

              {/* Quick suggestion chips while listening */}
              <div className="flex flex-wrap gap-1.5 justify-center pt-1 border-t border-slate-800/80 w-full mt-0.5">
                <button
                  onClick={() => triggerHeyMedi("remind me to take my medicine at 8 PM")}
                  className="text-[11px] px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-cyan-200 transition-colors"
                >
                  💊 Take medicine at 8 PM
                </button>
                <button
                  onClick={() => triggerHeyMedi("what appointments do I have tomorrow?")}
                  className="text-[11px] px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-cyan-200 transition-colors"
                >
                  📅 Tomorrow's appointments
                </button>
                <button
                  onClick={() => triggerHeyMedi("I need help")}
                  className="text-[11px] px-2 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-200 transition-colors"
                >
                  🆘 I need help
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Speaking Subtitle (when not in listening state) */}
        {!isListening && animationState !== "MEDI_LISTENING" && (isSpeaking || liveTranscript) && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl bg-slate-950/85 border border-cyan-500/40 backdrop-blur-md text-cyan-200 text-sm font-medium flex items-center gap-2 shadow-xl shadow-cyan-950/40 max-w-[90%] text-center">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="truncate">
              {liveTranscript || (isSpeaking ? "Speaking..." : "Listening...")}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Companion Interaction Interface (Matching Reference Design) */}
      <div className="w-full max-w-xl px-4 z-20 flex flex-col items-center gap-4">
        {/* Dynamic Greeting & Subtitle */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-wide">
            Good morning, {userProfile.name}!
          </h1>
          <p className="text-sm sm:text-base text-slate-300/90 font-light">
            How are you feeling today?
          </p>
        </div>

        {/* Audio Visualizer Wave (Animated bars matching speaking/listening) */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 h-7 py-1 px-4">
          {waveBars.map((baseH, idx) => {
            const activeHeight = isSpeaking
              ? Math.min(28, Math.max(6, baseH + Math.sin(idx + Date.now() * 0.01) * 12))
              : isListening
              ? Math.min(24, Math.max(6, 14 + Math.cos(idx * 0.8) * 8))
              : Math.max(4, baseH * 0.25);

            return (
              <div
                key={idx}
                style={{ height: `${activeHeight}px` }}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? "bg-cyan-400 shadow-sm shadow-cyan-400/80"
                    : isListening
                    ? "bg-cyan-300 shadow-sm shadow-cyan-300/90"
                    : "bg-cyan-500/30"
                }`}
              />
            );
          })}
        </div>

        {/* "Hey MEDI" Prompt Helper & Wake Word Toggle */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => triggerHeyMedi()}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-2 shadow-sm ${
              isListening
                ? "bg-cyan-500 text-slate-950 font-bold shadow-cyan-500/50 scale-105"
                : "bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-300"
            }`}
            title="Simulate or activate 'Hey MEDI' (Keyboard shortcut: [H])"
          >
            <span className="text-[10px] bg-cyan-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
              VOICE [H]
            </span>
            <span>“Hey MEDI”</span>
          </button>

          <button
            onClick={toggleWakeWord}
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all flex items-center gap-1 ${
              isWakeWordActive
                ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20"
                : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300"
            }`}
            title="Continuous hands-free wake word listening"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isWakeWordActive ? "bg-emerald-400 animate-ping" : "bg-slate-600"
              }`}
            />
            <span>Wake-Word: {isWakeWordActive ? "Listening" : "Ready"}</span>
          </button>
        </div>

        {/* Main Input Control Bar (Text + Voice Mic + Send) */}
        <div className="w-full relative flex items-center">
          <div className="w-full flex items-center rounded-full bg-slate-900/90 border border-slate-700/80 focus-within:border-cyan-500/80 shadow-2xl backdrop-blur-xl px-2 py-1.5 transition-all">
            {/* Mic Button: Click to trigger "Hey MEDI" voice listening */}
            <button
              onClick={() => triggerHeyMedi()}
              className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                isListening
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/50 animate-pulse scale-105"
                  : "bg-slate-800 text-cyan-400 hover:bg-slate-700 hover:text-cyan-300"
              }`}
              title="Voice Input (Say 'Hey MEDI')"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Input field */}
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message or ask MEDI..."
              className="flex-1 bg-transparent px-3 py-1 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!inputVal.trim()}
              className={`p-2.5 rounded-full transition-all ${
                inputVal.trim()
                  ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/30"
                  : "text-slate-600 cursor-not-allowed"
              }`}
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* "Say 'Hey MEDI' to talk" footer caption */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono tracking-wide">
          <span className="text-cyan-400">·||·</span>
          <span>Say “Hey MEDI” to talk</span>
          <span className="text-cyan-400">·||·</span>
        </div>

        {/* Quick Demo Commands (Section #10 requirements) */}
        <div className="w-full pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Prototype Commands
            </span>
            <span className="text-[10px] text-cyan-400/80 font-mono">
              Click to test AI Pipeline
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {demoCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => triggerHeyMedi(cmd.full)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95 text-left"
              >
                <span>{cmd.icon}</span>
                <span>{cmd.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
