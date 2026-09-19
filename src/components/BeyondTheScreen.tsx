import React, { useState } from "react";
import {
  Sparkles,
  Layers,
  Cpu,
  Eye,
  Mic,
  MonitorPlay,
  Bot,
  Activity,
  ShieldCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Boxes,
  Compass,
} from "lucide-react";

export const BeyondTheScreen: React.FC = () => {
  const [activeEcosystemIndex, setActiveEcosystemIndex] = useState(0);

  // Vision Pipeline Nodes
  const pipelineNodes = [
    {
      step: "01",
      title: "AI Software",
      desc: "Conversational intelligence & memory context",
      icon: Cpu,
      status: "Functional",
      color: "from-cyan-500 to-blue-500",
    },
    {
      step: "02",
      title: "Real-Time 3D MEDI",
      desc: "Blender-modeled, fully rigged companion",
      icon: Bot,
      status: "Functional",
      color: "from-blue-500 to-indigo-500",
    },
    {
      step: "03",
      title: "Voice Interaction",
      desc: "“Hey MEDI” speech recognition & voice synthesis",
      icon: Mic,
      status: "Functional",
      color: "from-indigo-500 to-violet-500",
    },
    {
      step: "04",
      title: "Computer Vision",
      desc: "Spatial gesture, face & fall detection",
      icon: Eye,
      status: "In Development",
      color: "from-violet-500 to-purple-500",
    },
    {
      step: "05",
      title: "Holographic Display",
      desc: "Dedicated glass/laser spatial projection",
      icon: MonitorPlay,
      status: "Vision / POC",
      color: "from-purple-500 to-fuchsia-500",
    },
    {
      step: "06",
      title: "Physical AI Companion",
      desc: "Integrated sensors, physical robotics & spatial presence",
      icon: Boxes,
      status: "Long-term Target",
      color: "from-fuchsia-500 to-rose-500",
    },
  ];

  // Ecosystem modules (Section #22)
  const ecosystemModules = [
    {
      id: "ai",
      title: "MEDI AI",
      tagline: "Cognitive Intelligence",
      points: [
        "Conversational intelligence tuned for senior empathy",
        "Deep context awareness across routines and habits",
        "Personalised care interaction without clinical coldness",
        "Multilingual communication architecture",
      ],
      icon: Cpu,
      badge: "Core Platform",
    },
    {
      id: "voice",
      title: "MEDI VOICE",
      tagline: "Natural Speech Synthesis & Recognition",
      points: [
        "“Hey MEDI” hands-free wake word recognition",
        "Real-time acoustic analysis and conversational turn-taking",
        "Natural speech cadence customized for older adult comprehension",
        "Noise-robust speech capture for noisy domestic environments",
      ],
      icon: Mic,
      badge: "Real-Time",
    },
    {
      id: "vision",
      title: "MEDI VISION",
      tagline: "Spatial & Biometric Awareness",
      points: [
        "Computer vision for room and posture tracking",
        "Non-intrusive gesture and hand movement recognition",
        "Early warning fall and distress indicator algorithms",
        "Environmental obstacle and safety awareness",
      ],
      icon: Eye,
      badge: "In Dev",
    },
    {
      id: "3d",
      title: "MEDI 3D",
      tagline: "Blender Character & Animation Rig",
      points: [
        "1.20m metric character scale with balanced proportions",
        "Complete skeletal armature: neck, head, shoulders, arms, hands, torso",
        "Smooth real-time WebGL / Three.js rendering engine",
        "Independent hot-swappable GLTF/GLB asset architecture",
      ],
      icon: Bot,
      badge: "Live 3D Engine",
    },
    {
      id: "holographic",
      title: "MEDI HOLOGRAPHIC",
      tagline: "Spatial Physical Projection Display",
      points: [
        "Future spatial display and light-field optical pods",
        "Physical-space presence without requiring AR glasses or VR headsets",
        "Room-scale ambient eye contact and presence cues",
        "Volumetric depth presentation in living rooms or care suites",
      ],
      icon: MonitorPlay,
      badge: "Hardware Roadmap",
    },
    {
      id: "routines",
      title: "MEDI ROUTINES",
      tagline: "Daily Lifestyle & Medication Assurance",
      points: [
        "Automated medication schedule tracking with dosage guidelines",
        "Doctor and outpatient appointments with vocal reminders",
        "Hydration, gentle exercise, and daily routine encouragement",
        "Non-punitive gentle notifications that respect dignity",
      ],
      icon: Activity,
      badge: "Clinical UX",
    },
    {
      id: "safety",
      title: "MEDI SAFETY",
      tagline: "Escalation & Emergency Protection",
      points: [
        "Single-touch SOS and automatic distress triggers",
        "Direct caregiver and family contact communication loops",
        "Professional emergency dispatch integration (911 / 112)",
        "Strict non-diagnostic boundaries: always escalates to human doctors",
      ],
      icon: ShieldCheck,
      badge: "Escalation Hub",
    },
  ];

  // Roadmap Stages V0-V6 (Section #23)
  const roadmapStages = [
    {
      ver: "V0",
      title: "Software Concept",
      status: "Completed",
      badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-800",
      desc: "Initial AI companion interface and companion interaction principles.",
    },
    {
      ver: "V1",
      title: "Functional AI Companion",
      status: "Live Demo",
      badgeColor: "bg-cyan-950 text-cyan-300 border-cyan-700",
      desc: "Real-time conversational intelligence, daily medication reminders, and medical appointment tracking.",
    },
    {
      ver: "V2",
      title: "Voice MEDI",
      status: "Live Demo",
      badgeColor: "bg-cyan-950 text-cyan-300 border-cyan-700",
      desc: "“Hey MEDI” speech recognition, acoustic waveform feedback, and vocal speech synthesis.",
    },
    {
      ver: "V3",
      title: "Real-Time 3D Character",
      status: "Live Demo",
      badgeColor: "bg-cyan-950 text-cyan-300 border-cyan-700",
      desc: "Interactive 3D Three.js character, rigged articulated joints, look-at cursor tracking, and 5 animation states.",
    },
    {
      ver: "V4",
      title: "Computer Vision & Gestures",
      status: "In Development",
      badgeColor: "bg-amber-950 text-amber-300 border-amber-800",
      desc: "Webcam/depth sensor gesture recognition, movement tracking, and non-wearable fall monitoring.",
    },
    {
      ver: "V5",
      title: "Holographic Proof-of-Concept",
      status: "Hardware Vision",
      badgeColor: "bg-purple-950 text-purple-300 border-purple-800",
      desc: "MEDI displayed through dedicated spatial display hardware, creating an optical holographic presence in a room.",
    },
    {
      ver: "V6",
      title: "Physical AI Companion System",
      status: "Future Vision",
      badgeColor: "bg-indigo-950 text-indigo-300 border-indigo-800",
      desc: "Integrated physical AI device combining voice, multi-spectral sensors, spatial projection, and physical companion presence.",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 pb-28 md:pb-16 space-y-16">
      {/* Hero Headline Section (Section #21) */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>VISION AXIS AI LAB • STRATEGIC ROADMAP</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
          BEYOND THE SCREEN
        </h1>

        <p className="text-lg sm:text-xl text-cyan-200 font-light italic">
          “The app is only the beginning.”
        </p>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          MEDI is not being built as another screen-bound application. We are engineering the first software prototype of a larger physical and holographic AI companion ecosystem — designed to bring AI into true physical space.
        </p>
      </div>

      {/* Visual Pipeline (Section #21) */}
      <div className="space-y-4">
        <div className="text-center mb-8">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            The Evolution Paradigm
          </h2>
          <p className="text-2xl font-display font-bold text-white mt-1">
            Screen → Voice → 3D Presence → Holographic → Physical AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineNodes.map((node, i) => {
            const Icon = node.icon;
            return (
              <div
                key={i}
                className="relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all group overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-slate-500">
                    PHASE {node.step}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      node.status === "Functional"
                        ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                        : node.status === "In Development"
                        ? "bg-amber-950 text-amber-300 border-amber-800"
                        : "bg-purple-950 text-purple-300 border-purple-800"
                    }`}
                  >
                    {node.status}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {node.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {node.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Holographic Hardware Concept Diagram */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Future Hardware Specifications
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              The MEDI Spatial Holographic Pod
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              While today’s prototype runs in real-time WebGL, Vision Axis AI Lab is specifying the future optical hardware companion: a free-standing pedestal projector with volumetric light field emitters.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 font-mono text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block">Target Height:</span>
                <span className="text-white font-bold">1.20 Metres (Virtual)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block">Display Angle:</span>
                <span className="text-white font-bold">360° Light Field</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block">Sensor Array:</span>
                <span className="text-white font-bold">LiDAR + Dual Mic Array</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block">Tactile Interaction:</span>
                <span className="text-white font-bold">Spatial Gesture Sensing</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/20 text-center relative">
            <div className="w-24 h-24 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center mb-4 animate-pulse shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <MonitorPlay className="w-12 h-12 text-cyan-300" />
            </div>
            <h4 className="text-lg font-bold text-white">Physical AI Companion</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              “From an AI on a screen to an AI with presence.”
            </p>
            <span className="mt-3 text-[10px] font-mono text-cyan-300/80 border border-cyan-500/30 px-2 py-0.5 rounded">
              VISION AXIS HARDWARE LABS
            </span>
          </div>
        </div>
      </div>

      {/* MEDI Technology Ecosystem (Section #22) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Component Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
              MEDI Technology Ecosystem
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            7 Integrated Subsystems
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ecosystemModules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-cyan-300 font-mono mb-3">
                    {item.tagline}
                  </p>

                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {item.points.map((pt, pidx) => (
                      <li key={pidx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold mt-0.5">›</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* THE EVOLUTION OF MEDI (V0 - V6 Roadmap - Section #23) */}
      <div className="space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            Development Phases
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
            The Evolution of MEDI (V0 — V6)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Transparent breakdown: completed software demonstrations vs. upcoming hardware and spatial milestones.
          </p>
        </div>

        <div className="relative border-l-2 border-slate-800 pl-6 ml-3 sm:ml-6 space-y-8">
          {roadmapStages.map((stage, idx) => (
            <div key={stage.ver} className="relative group">
              {/* Timeline marker */}
              <div
                className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${
                  stage.status === "Completed"
                    ? "bg-emerald-500 border-emerald-400"
                    : stage.status === "Live Demo"
                    ? "bg-cyan-500 border-cyan-300 animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                    : "bg-slate-900 border-slate-600"
                }`}
              />

              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 group-hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-cyan-400">
                      {stage.ver}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {stage.title}
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${stage.badgeColor}`}
                  >
                    {stage.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Brand Message (Section #30) */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 border border-cyan-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/20 to-transparent pointer-events-none" />

        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
          Vision Axis AI Lab
        </span>

        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wider">
          MEDI
        </h2>

        <div className="space-y-1">
          <p className="text-xl sm:text-2xl font-light text-cyan-200">
            Beyond the Screen.
          </p>
          <p className="text-xl sm:text-2xl font-semibold text-white">
            AI With Presence.
          </p>
        </div>

        <p className="text-sm text-slate-400 max-w-lg mx-auto pt-2">
          “From an AI on a screen to an AI with presence.”
        </p>

        <div className="pt-4 flex items-center justify-center gap-4 text-xs font-mono text-slate-500">
          <span>Vision Axis AI Lab</span>
          <span>•</span>
          <span>Hardware & Spatial AI Division</span>
        </div>
      </div>
    </div>
  );
};
