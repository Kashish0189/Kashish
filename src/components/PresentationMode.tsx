import React, { useState, useEffect } from "react";
import { useMedi } from "../context/MediContext";
import { MediScene } from "../3d/MediScene";
import { voiceService } from "../services/voice";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Bot,
  Sparkles,
  Award,
  Layers,
  Compass,
} from "lucide-react";

export const PresentationMode: React.FC = () => {
  const { presentationOpen, setPresentationOpen, setAnimationState } = useMedi();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = [
    {
      subtitle: "EXECUTIVE SUMMARY • VISION AXIS AI LAB",
      title: "MEDI IS NOT JUST AN APP",
      headline: "The First Prototype of a Physical & Holographic AI Companion",
      description:
        "Conventional healthcare chatbots exist trapped on flat glass screens. MEDI is being engineered with real physical presence — transitioning from software into 3D holographic projection and physical robotics.",
      animState: "MEDI_SPEAKING" as const,
      speechText: "Welcome. MEDI is not just an application. I am the software foundation for a physical and holographic companion system.",
    },
    {
      subtitle: "REAL-TIME ARCHITECTURE",
      title: "LIVE 3D & PROCEDURAL KINEMATICS",
      headline: "1.20m Virtual Proportions, Spatial Eye Tracking & Natural Gestures",
      description:
        "Powered by Blender and Three.js, MEDI communicates with real-time head tracking, respiration cycles, and 5 discrete emotive animation states — creating emotional attachment and senior engagement.",
      animState: "MEDI_LISTENING" as const,
      speechText: "Through 3D kinematics and spatial eye tracking, I maintain natural presence with the user throughout our conversations.",
    },
    {
      subtitle: "DAILY INDEPENDENCE & ASSISTANCE",
      title: "COMPANIONSHIP WITH CLINICAL PURPOSE",
      headline: "Daily Routine Assurance, Voice Reminders & Non-Clinical Safety",
      description:
        "Elderly users simply speak 'Hey MEDI' to schedule medication, check physician appointments, or initiate emergency escalation with 5-second false-alarm prevention.",
      animState: "MEDI_SPEAKING" as const,
      speechText: "I assist with daily medication schedules, upcoming appointments, and immediate caregiver escalation whenever help is needed.",
    },
    {
      subtitle: "INVESTMENT & PARTNER ROADMAP",
      title: "FROM SCREEN TO PHYSICAL PRESENCE",
      headline: "V0 Software Concept → V3 Live 3D → V6 Integrated Robotics",
      description:
        "Vision Axis AI Lab is actively collaborating with technology, healthcare, and spatial hardware partners to deploy MEDI into residential care suites, private homes, and physical companion devices.",
      animState: "MEDI_IDLE" as const,
      speechText: "From an AI on a screen, to an AI with presence. Together with our partners, we bring AI into the physical world.",
    },
  ];

  useEffect(() => {
    if (!presentationOpen) return;

    // Set character animation & speak current slide
    const slide = slides[currentSlide];
    setAnimationState(slide.animState);
    voiceService.speak(slide.speechText);

    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide((s) => s + 1);
      } else {
        setIsPlaying(false);
      }
    }, 8500);

    return () => clearTimeout(timer);
  }, [presentationOpen, currentSlide, isPlaying]);

  if (!presentationOpen) return null;

  const current = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  };

  const handleClose = () => {
    voiceService.stopSpeaking();
    setAnimationState("MEDI_IDLE");
    setPresentationOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-10 text-white overflow-hidden">
      {/* Background Holographic Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Controls */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-[1px]">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-sm tracking-wider">
              MEDI • EXECUTIVE VISION
            </div>
            <div className="text-[10px] font-mono text-cyan-400">
              VISION AXIS AI LAB • PARTNER BRIEFING
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress Pill indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? "w-6 bg-cyan-400"
                    : idx < currentSlide
                    ? "w-2 bg-slate-500"
                    : "w-2 bg-slate-800"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Stage: 3D MEDI + Cinematic Slide Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full my-auto">
        {/* Left: 3D MEDI companion speaking to partner */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center h-[340px] sm:h-[450px]">
          <div className="w-full h-full relative">
            <MediScene
              animationState={current.animState}
              interactiveHead={true}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Right: Slide Pitch Details */}
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{current.subtitle}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-wide">
            {current.title}
          </h2>

          <p className="text-lg sm:text-xl font-medium text-cyan-300">
            {current.headline}
          </p>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            {current.description}
          </p>

          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-cyan-400">VOICE:</span>
            <span className="italic">“{current.speechText}”</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-10 flex items-center justify-between max-w-7xl mx-auto w-full pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white transition-all flex items-center gap-2 text-xs font-mono"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? "Pause Tour" : "Play Tour"}</span>
          </button>

          <button
            onClick={() => {
              setCurrentSlide(0);
              setIsPlaying(true);
            }}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-900 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-400">
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-30 disabled:bg-slate-800 disabled:text-slate-500 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
