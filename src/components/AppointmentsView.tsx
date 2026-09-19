import React, { useState } from "react";
import { useMedi } from "../context/MediContext";
import { Appointment } from "../types";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  Trash2,
  Bell,
  CheckCircle2,
  Building,
} from "lucide-react";

export const AppointmentsView: React.FC = () => {
  const { appointments, addAppointment, deleteAppointment } = useMedi();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("Tomorrow");
  const [time, setTime] = useState("10:30 AM");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addAppointment({
      title: title.trim(),
      doctorName: doctorName.trim() || undefined,
      date,
      time,
      location: location.trim() || undefined,
      reminderActive: true,
    });

    setTitle("");
    setDoctorName("");
    setLocation("");
    setShowAddModal(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-28 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Medical & Scheduled Appointments
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Verified visits with healthcare professionals, synced with MEDI audio reminders.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Appointment</span>
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-lg text-slate-300 font-medium">
              No appointments scheduled
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Ask MEDI “What appointments do I have tomorrow?” or add one above.
            </p>
          </div>
        ) : (
          appointments.map((app) => (
            <div
              key={app.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 shadow-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{app.title}</h3>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                    {app.date}
                  </span>
                </div>

                {app.doctorName && (
                  <div className="flex items-center gap-2 text-sm text-slate-300 pl-1">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span className="font-medium">{app.doctorName}</span>
                  </div>
                )}

                {app.location && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 pl-1">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span>{app.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 pl-1">
                  <span className="flex items-center gap-1.5 font-mono text-sm text-cyan-300 font-bold">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    {app.time}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Bell className="w-3.5 h-3.5" />
                    Spoken Reminder Active
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => deleteAppointment(app.id)}
                  className="p-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                  title="Remove Appointment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Schedule Appointment</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Appointment Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Doctor Follow-up Consultation"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Physician / Specialist Name
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Jenkins, MD"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Tomorrow or Oct 15"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Location / Clinic Details
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. St. Jude Wellness Center, Suite 302"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
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
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
