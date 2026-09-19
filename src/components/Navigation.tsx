import React from "react";
import { useMedi } from "../context/MediContext";
import {
  Sparkles,
  Bell,
  Calendar,
  ShieldAlert,
  Compass,
  Settings,
  MessageSquare,
  Bot,
  PlayCircle,
  Volume2,
  Mic,
} from "lucide-react";

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    animationState,
    triggerEmergencyAlert,
    setPresentationOpen,
    triggerHeyMedi,
    cancelListening,
    isListening,
    isSpeaking,
  } = useMedi();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-white tracking-wider">
                  MEDI
                </span>
                <span className="text-[10px] font-mono text-cyan-400/80 border border-cyan-500/30 px-1.5 py-0.2 rounded bg-cyan-950/40">
                  VISION AXIS
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    animationState === "MEDI_ALERT"
                      ? "bg-rose-400 animate-ping"
                      : isListening
                      ? "bg-cyan-400 animate-pulse"
                      : isSpeaking
                      ? "bg-indigo-400 animate-pulse"
                      : "bg-emerald-400"
                  }`}
                />
                <span className="font-mono text-[10px] uppercase text-slate-300">
                  {animationState === "MEDI_ALERT"
                    ? "Alert"
                    : isListening
                    ? "Listening..."
                    : isSpeaking
                    ? "Speaking..."
                    : "Ready"}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-full shadow-inner">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "home"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Companion
          </button>

          <button
            onClick={() => setActiveTab("conversation")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "conversation"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Dialog
          </button>

          <button
            onClick={() => setActiveTab("reminders")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "reminders"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Reminders
          </button>

          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "appointments"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Appointments
          </button>

          <button
            onClick={() => setActiveTab("beyond-screen")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeTab === "beyond-screen"
                ? "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-400/50 font-semibold shadow-sm shadow-cyan-500/20"
                : "text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Beyond the Screen
          </button>
        </nav>

        {/* Right: Actions & Emergency */}
        <div className="flex items-center gap-2">
          {/* Quick Voice Trigger in Navbar */}
          <button
            onClick={() => (isListening ? cancelListening() : triggerHeyMedi())}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 ${
              isListening
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/50 animate-pulse"
                : "bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:bg-cyan-950/40"
            }`}
            title={
              isListening
                ? "Listening… (Click or press Esc to cancel)"
                : "Activate 'Hey MEDI' (Keyboard shortcut: [H])"
            }
          >
            <Mic className={`w-3.5 h-3.5 ${isListening ? "text-slate-950" : "text-cyan-400"}`} />
            <span className="hidden sm:inline">{isListening ? "Listening…" : "“Hey MEDI”"}</span>
          </button>

          {/* Pitch & Tech Partner Presentation Mode Button */}
          <button
            onClick={() => setPresentationOpen(true)}
            className="px-3 py-1.5 rounded-full bg-slate-900 border border-indigo-500/40 hover:border-indigo-400 text-indigo-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm shadow-indigo-950/50 hover:bg-indigo-950/40"
            title="Open 30-Second Technology Partner Presentation"
          >
            <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline font-mono">Vision Pitch</span>
          </button>

          {/* Emergency SOS Button (Large, high-contrast, accessible) */}
          <button
            onClick={() => {
              setActiveTab("emergency");
            }}
            className="px-3.5 py-1.5 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
            title="Emergency Assistance Escalation"
          >
            <ShieldAlert className="w-4 h-4 text-white" />
            <span className="font-bold tracking-wide">SOS</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => setActiveTab("settings")}
            className={`p-2 rounded-full transition-colors ${
              activeTab === "settings"
                ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
            title="Settings & Accessibility"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800/80 px-2 py-2 flex items-center justify-around backdrop-blur-xl">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
            activeTab === "home" ? "text-cyan-400 font-medium" : "text-slate-400"
          }`}
        >
          <Bot className="w-5 h-5" />
          <span className="text-[10px]">Companion</span>
        </button>

        <button
          onClick={() => setActiveTab("conversation")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
            activeTab === "conversation" ? "text-cyan-400 font-medium" : "text-slate-400"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Dialog</span>
        </button>

        <button
          onClick={() => setActiveTab("reminders")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
            activeTab === "reminders" ? "text-cyan-400 font-medium" : "text-slate-400"
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px]">Reminders</span>
        </button>

        <button
          onClick={() => setActiveTab("beyond-screen")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
            activeTab === "beyond-screen" ? "text-cyan-300 font-semibold" : "text-indigo-400"
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Beyond</span>
        </button>

        <button
          onClick={() => setActiveTab("emergency")}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
            activeTab === "emergency" ? "text-rose-400 font-bold" : "text-slate-400"
          }`}
        >
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <span className="text-[10px] text-rose-400 font-bold">SOS</span>
        </button>
      </div>
    </header>
  );
};
