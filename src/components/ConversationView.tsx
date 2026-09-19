import React, { useState, useRef, useEffect } from "react";
import { useMedi } from "../context/MediContext";
import { MediScene } from "../3d/MediScene";
import { voiceService } from "../services/voice";
import {
  Send,
  Mic,
  Volume2,
  Sparkles,
  Bot,
  User,
  Clock,
  ArrowDownCircle,
  HelpCircle,
} from "lucide-react";

export const ConversationView: React.FC = () => {
  const {
    conversation,
    animationState,
    setAnimationState,
    sendMessage,
    triggerHeyMedi,
    cancelListening,
    isListening,
    isSpeaking,
    liveTranscript,
    userProfile,
  } = useMedi();

  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, liveTranscript]);

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

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-12 min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left / Top: Persistent 3D MEDI Companion Presence (Section #17) */}
      <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
        <div className="w-full h-[320px] sm:h-[400px] rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <MediScene
            animationState={animationState}
            onStateChange={setAnimationState}
            className="w-full h-full"
          />

          {/* Holographic Header Tag */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              3D PRESENCE: ACTIVE
            </div>
          </div>

          {/* Reaction status pill */}
          <div className="absolute bottom-4 left-4 right-4 z-20 px-3 py-2 rounded-xl bg-slate-950/90 border border-slate-700/80 backdrop-blur-md text-xs text-slate-300 flex items-center justify-between">
            <span className="font-mono text-cyan-400">STATUS:</span>
            <span className="font-semibold text-white">
              {animationState === "MEDI_IDLE"
                ? "Relaxed / Gentle Breathing"
                : animationState === "MEDI_LISTENING"
                ? "Listening & Attentive"
                : animationState === "MEDI_THINKING"
                ? "Processing Context"
                : animationState === "MEDI_SPEAKING"
                ? "Conversing & Gesturing"
                : "Alert Safety Protocol"}
            </span>
          </div>
        </div>

        <div className="mt-3 text-center text-xs text-slate-400">
          MEDI stays in real-time 3D presence during all conversations.
        </div>
      </div>

      {/* Right / Main: Holographic Dialogue Thread */}
      <div className="lg:col-span-7 flex flex-col h-[580px] rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Dialogue Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">MEDI Dialogue</h2>
              <p className="text-[11px] text-slate-400">
                Vision Axis Conversational Engine
              </p>
            </div>
          </div>

          {isListening ? (
            <button
              onClick={cancelListening}
              className="px-3 py-1.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 animate-pulse shadow-lg shadow-cyan-500/30"
              title="Click to cancel voice input"
            >
              <Mic className="w-3.5 h-3.5 animate-bounce" />
              <span>Listening… [Esc]</span>
            </button>
          ) : (
            <button
              onClick={() => triggerHeyMedi()}
              className="px-3 py-1.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:bg-cyan-900/60 transition-colors flex items-center gap-1.5"
              title="Activate 'Hey MEDI' voice listening (Shortcut: [H])"
            >
              <Mic className="w-3.5 h-3.5 text-cyan-400" />
              <span>“Hey MEDI” [H]</span>
            </button>
          )}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-cyan-500 text-slate-950"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-sm shadow-md"
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-70">
                  <span className="font-semibold">
                    {msg.sender === "user" ? userProfile.name : "MEDI"}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="text-sm">{msg.text}</p>

                {msg.sender === "medi" && (
                  <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-cyan-300">
                    <button
                      onClick={() => voiceService.speak(msg.text)}
                      className="hover:underline flex items-center gap-1 opacity-80 hover:opacity-100"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Replay Voice</span>
                    </button>

                    {msg.actionTriggered && (
                      <span className="font-mono text-[10px] bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800 text-cyan-400">
                        Action: {msg.actionTriggered}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Live Transcript / Attentive Listening indicator */}
          {(liveTranscript || isListening) && (
            <div className="flex items-start gap-3 animate-in fade-in duration-200">
              <div className="w-8 h-8 rounded-full bg-cyan-500/30 border border-cyan-400 text-cyan-300 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="bg-slate-800/80 border border-cyan-500/60 rounded-2xl p-3 text-sm text-cyan-200 font-mono flex items-center gap-2.5 shadow-lg shadow-cyan-950/40">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-semibold">{liveTranscript || "Listening…"}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center rounded-full bg-slate-900 border border-slate-700 px-3 py-1.5 focus-within:border-cyan-500">
            <button
              onClick={() => triggerHeyMedi()}
              className={`p-2 rounded-full mr-1 transition-all ${
                isListening
                  ? "bg-cyan-500 text-slate-950 animate-pulse"
                  : "text-slate-400 hover:text-cyan-400"
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask MEDI anything or command a reminder..."
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />

            <button
              onClick={handleSend}
              disabled={!inputVal.trim()}
              className="p-2 rounded-full text-cyan-400 hover:text-white disabled:text-slate-600"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
