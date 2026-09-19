import React, { useState } from "react";
import { useMedi } from "../context/MediContext";
import {
  User,
  Globe,
  Volume2,
  Sliders,
  Eye,
  Layers,
  Sparkles,
  Bot,
  Save,
  CheckCircle2,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const { userProfile, updateUserProfile, language, setLanguage } = useMedi();

  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age);
  const [gender, setGender] = useState(userProfile.gender);
  const [notes, setNotes] = useState(userProfile.notes || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Accessibility state
  const [fontSize, setFontSize] = useState("standard");
  const [highContrast, setHighContrast] = useState(false);

  const languages = [
    { name: "English", flag: "🇺🇸", code: "en" },
    { name: "Hindi", flag: "🇮🇳", code: "hi" },
    { name: "Spanish", flag: "🇪🇸", code: "es" },
    { name: "French", flag: "🇫🇷", code: "fr" },
    { name: "Tamil", flag: "🇮🇳", code: "ta" },
    { name: "Telugu", flag: "🇮🇳", code: "te" },
    { name: "German", flag: "🇩🇪", code: "de" },
    { name: "Japanese", flag: "🇯🇵", code: "ja" },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      age: Number(age),
      gender,
      notes: notes.trim(),
      preferredLanguage: language,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-28 md:pb-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
          Preferences & Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your MEDI companion, language, accessibility, and 3D specifications.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile and preferences successfully saved.</span>
        </div>
      )}

      {/* User Profile Form */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-white">
          <User className="w-5 h-5 text-cyan-400" />
          <h2>User Profile & Care Notes</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Preferred Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Caregiver & Routine Notes (Known allergies, daily habits)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mild hypertension, prefers afternoon garden walks"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm flex items-center gap-2 shadow-md shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Multilingual Support (Section #18) */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-white">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h2>Companion Language</h2>
        </div>
        <p className="text-xs text-slate-400">
          MEDI will communicate, display reminders, and synthesize speech in your selected language.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.name}
              onClick={() => setLanguage(lang.name)}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                language === lang.name
                  ? "bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/40 font-semibold"
                  : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <span className="text-sm">{lang.name}</span>
              <span className="text-lg">{lang.flag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Senior Accessibility & Comfort (Section #20) */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-white">
          <Eye className="w-5 h-5 text-amber-400" />
          <h2>Elderly Usability & Accessibility</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-slate-400">Interface Contrast</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                Ultra-High Contrast Mode
              </span>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-colors ${
                  highContrast
                    ? "bg-amber-400 text-slate-950"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {highContrast ? "ENABLED" : "STANDARD"}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Enhances text contrast and button outlines for reduced vision fatigue.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-slate-400">Spoken Speech Cadence</span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">Gentle & Clear Pace</span>
              <span className="text-xs font-mono text-cyan-400">0.95x Speed</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Calibrated specifically for seniors and clear room acoustic comprehension.
            </p>
          </div>
        </div>
      </div>

      {/* Technical 3D Character Inspector (Section #11, 12, 13) */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h2>Blender 3D Character Pipeline Specs</h2>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            THREE.JS • GLTF / GLB READY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block">Character Scale:</span>
            <span className="text-white font-bold">1.20m (Metric virtual height)</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block">Armature Rig Nodes:</span>
            <span className="text-white font-bold">Head, Neck, Torso, Arms</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block">Animation Logic:</span>
            <span className="text-white font-bold">Procedural Kinematics</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          The 3D component is structured to seamlessly accept exported Blender assets (`.glb` / `.gltf`). Simply drop your 3D asset onto the companion stage in 3D controls to load custom articulated models.
        </p>
      </div>
    </div>
  );
};
