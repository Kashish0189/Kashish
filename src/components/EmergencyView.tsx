import React, { useState, useEffect } from "react";
import { useMedi } from "../context/MediContext";
import { EmergencyContact } from "../types";
import {
  ShieldAlert,
  PhoneCall,
  UserCheck,
  AlertTriangle,
  Plus,
  HeartPulse,
  Info,
  CheckCircle,
  X,
} from "lucide-react";

export const EmergencyView: React.FC = () => {
  const { emergencyContacts, addEmergencyContact, triggerEmergencyAlert } = useMedi();

  const [confirmModal, setConfirmModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [triggeredSuccess, setTriggeredSuccess] = useState(false);
  const [simulatedCallContact, setSimulatedCallContact] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [rel, setRel] = useState("");
  const [phone, setPhone] = useState("");

  // Countdown timer for emergency confirmation
  useEffect(() => {
    let interval: any = null;
    if (isCountingDown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (isCountingDown && countdown === 0) {
      setIsCountingDown(false);
      setConfirmModal(false);
      setTriggeredSuccess(true);
      triggerEmergencyAlert();
    }
    return () => clearInterval(interval);
  }, [isCountingDown, countdown]);

  const handleStartEmergency = () => {
    setCountdown(5);
    setIsCountingDown(true);
    setConfirmModal(true);
  };

  const handleCancelEmergency = () => {
    setIsCountingDown(false);
    setConfirmModal(false);
    setCountdown(5);
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addEmergencyContact({
      name: name.trim(),
      relationship: rel.trim() || "Emergency Contact",
      phone: phone.trim(),
      isPrimary: emergencyContacts.length === 0,
    });

    setName("");
    setRel("");
    setPhone("");
    setShowAddModal(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-28 md:pb-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-950/80 border border-rose-600/50 text-rose-300 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Priority Emergency Assistance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide">
          Emergency Escalation & Support
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Instant connection to designated caregivers, family members, and professional emergency dispatch.
        </p>
      </div>

      {/* Trigger Successful Notification */}
      {triggeredSuccess && (
        <div className="p-4 rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-white flex items-center justify-between shadow-2xl animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
            <div>
              <p className="font-bold text-base">Emergency Protocol Activated</p>
              <p className="text-xs text-rose-200">
                MEDI is speaking audio alerts, notifying your primary contact, and transmitting your status.
              </p>
            </div>
          </div>
          <button
            onClick={() => setTriggeredSuccess(false)}
            className="p-1 rounded-lg bg-rose-900 text-rose-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* GIANT HIGH-CONTRAST SOS BUTTON (Section #16, 20) */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950 border border-rose-600/40 shadow-2xl">
        <p className="text-xs font-mono uppercase tracking-widest text-rose-400 mb-4 font-bold">
          Emergency Action (Tap to activate)
        </p>

        <button
          onClick={handleStartEmergency}
          className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 active:scale-95 transition-all shadow-[0_0_60px_rgba(225,29,72,0.6)] flex flex-col items-center justify-center text-white border-4 border-white/20 group cursor-pointer"
        >
          <ShieldAlert className="w-16 h-16 sm:w-20 sm:h-20 text-white group-hover:scale-110 transition-transform drop-shadow" />
          <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-wider mt-2">
            CALL SOS
          </span>
          <span className="text-[11px] font-mono text-rose-100/90 uppercase mt-0.5">
            5s Safety Confirmation
          </span>
        </button>

        <p className="text-xs text-slate-400 mt-6 text-center max-w-md">
          Includes an immediate 5-second cancel window to prevent accidental button presses.
        </p>
      </div>

      {/* Direct National Emergency Services (Large Buttons) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400">USA & Canada</span>
            <h3 className="text-xl font-bold text-white">911</h3>
            <span className="text-xs text-rose-400">Emergency Dispatch</span>
          </div>
          <a
            href="tel:911"
            className="p-3 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white transition-all font-semibold text-xs flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call</span>
          </a>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400">India Emergency</span>
            <h3 className="text-xl font-bold text-white">112 / 108</h3>
            <span className="text-xs text-rose-400">Ambulance & Police</span>
          </div>
          <a
            href="tel:112"
            className="p-3 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white transition-all font-semibold text-xs flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call</span>
          </a>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400">Europe / Universal</span>
            <h3 className="text-xl font-bold text-white">112</h3>
            <span className="text-xs text-rose-400">Single Emergency Num</span>
          </div>
          <a
            href="tel:112"
            className="p-3 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white transition-all font-semibold text-xs flex items-center gap-1.5"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call</span>
          </a>
        </div>
      </div>

      {/* Trusted Family & Caregiver Emergency Contacts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              Designated Emergency Contacts
            </h2>
            <p className="text-xs text-slate-400">
              MEDI contacts these individuals in sequence during an escalated situation.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 rounded-2xl border transition-all ${
                contact.isPrimary
                  ? "bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-950/30"
                  : "bg-slate-900/60 border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400">
                  {contact.relationship}
                </span>
                {contact.isPrimary && (
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded font-mono border border-cyan-800">
                    Primary
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white">{contact.name}</h3>
              <p className="text-sm font-mono text-slate-300 mt-1">{contact.phone}</p>

              <button
                onClick={() => setSimulatedCallContact(contact.name)}
                className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Simulate Call</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical & Regulatory Safety Notice (Section #25) */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Clinical & Safety Disclaimer (Vision Axis AI Lab)</span>
        </div>
        <p className="leading-relaxed">
          MEDI is an assistive AI companion developed to support daily routines, medication reminders, and general care awareness. MEDI does NOT claim to replace certified doctors, clinical caregivers, or emergency rescue professionals. For acute trauma, chest pain, stroke symptoms, or falls requiring medical intervention, please contact local emergency dispatch (e.g. 911 / 112) without delay.
        </p>
      </div>

      {/* 5-Second Confirmation Dialog Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 text-center shadow-[0_0_80px_rgba(225,29,72,0.5)] space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500 text-rose-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <h2 className="text-xl font-bold text-white">
              Triggering Emergency Alert
            </h2>

            <p className="text-xs text-slate-300">
              Notifying primary emergency contacts and activating MEDI high-priority alarm in:
            </p>

            <div className="text-5xl font-extrabold font-mono text-rose-500 animate-bounce">
              {countdown}s
            </div>

            <button
              onClick={handleCancelEmergency}
              className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm tracking-wide transition-all border border-slate-700"
            >
              CANCEL (False Alarm)
            </button>
          </div>
        </div>
      )}

      {/* Simulated Call Notification */}
      {simulatedCallContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center animate-pulse">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-mono text-cyan-400 uppercase">
                Simulated Care Call
              </p>
              <h3 className="text-lg font-bold text-white mt-1">
                {simulatedCallContact}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Connecting secure VoIP audio bridge...
              </p>
            </div>
            <button
              onClick={() => setSimulatedCallContact(null)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Add Emergency Contact</h2>

            <form onSubmit={handleAddContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Vance"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  value={rel}
                  onChange={(e) => setRel(e.target.value)}
                  placeholder="e.g. Son / Primary Caregiver"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 345-6789"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm shadow-md shadow-cyan-500/20"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
