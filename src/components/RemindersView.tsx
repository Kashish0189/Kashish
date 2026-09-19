import React, { useState } from "react";
import { useMedi } from "../context/MediContext";
import { Reminder } from "../types";
import {
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Pill,
  Sun,
  Sparkles,
  Calendar,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export const RemindersView: React.FC = () => {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useMedi();
  const [showAddModal, setShowAddModal] = useState(false);

  // New reminder form state
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("08:00 PM");
  const [type, setType] = useState<"medication" | "routine" | "custom">("medication");
  const [repeat, setRepeat] = useState<"Every day" | "Weekdays" | "Once" | "Custom">("Every day");
  const [dosage, setDosage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      title: title.trim(),
      time,
      type,
      repeat,
      active: true,
      dosage: dosage.trim() || undefined,
    });

    setTitle("");
    setDosage("");
    setShowAddModal(false);
  };

  const getIcon = (t: string) => {
    switch (t) {
      case "medication":
        return <Pill className="w-5 h-5 text-cyan-400" />;
      case "routine":
        return <Sun className="w-5 h-5 text-amber-400" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-28 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Daily Reminders
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              {reminders.filter((r) => r.active).length} Active
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Automated notifications spoken by MEDI to keep your daily routines on track.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {reminders.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-lg text-slate-300 font-medium">No reminders yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Say “Hey MEDI, remind me to take my medicine at 8 PM” or tap Add Reminder.
            </p>
          </div>
        ) : (
          reminders.map((r) => (
            <div
              key={r.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                r.active
                  ? "bg-slate-900/70 border-slate-800 hover:border-cyan-500/40 shadow-lg"
                  : "bg-slate-950/40 border-slate-900 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => toggleReminder(r.id)}
                  className="mt-0.5 text-slate-400 hover:text-cyan-400 transition-colors"
                  title={r.active ? "Pause reminder" : "Activate reminder"}
                >
                  {r.active ? (
                    <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="p-1 rounded-lg bg-slate-800">
                      {getIcon(r.type)}
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      {r.title}
                    </h3>
                    <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {r.type}
                    </span>
                  </div>

                  {r.dosage && (
                    <p className="text-xs text-cyan-300/90 mt-1 pl-8">
                      Dosage: {r.dosage}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 pl-8">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <strong className="text-slate-200 font-mono text-sm">
                        {r.time}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>{r.repeat}</span>
                    <span>•</span>
                    <span className={r.active ? "text-emerald-400" : "text-slate-500"}>
                      {r.active ? "Active" : "Paused"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  onClick={() => toggleReminder(r.id)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {r.active ? "Pause" : "Resume"}
                </button>
                <button
                  onClick={() => deleteReminder(r.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Create New Reminder</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Reminder Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Evening Blood Pressure Medicine"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 8:00 PM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="medication">Medication</option>
                    <option value="routine">Daily Routine</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Dosage / Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g. 1 tablet with warm water"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Repeat Frequency
                </label>
                <select
                  value={repeat}
                  onChange={(e) => setRepeat(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Every day">Every day</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Once">Once</option>
                  <option value="Custom">Custom</option>
                </select>
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
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
