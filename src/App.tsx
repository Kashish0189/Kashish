import React from "react";
import { MediProvider, useMedi } from "./context/MediContext";
import { Navigation } from "./components/Navigation";
import { HomeScreen } from "./components/HomeScreen";
import { ConversationView } from "./components/ConversationView";
import { RemindersView } from "./components/RemindersView";
import { AppointmentsView } from "./components/AppointmentsView";
import { EmergencyView } from "./components/EmergencyView";
import { BeyondTheScreen } from "./components/BeyondTheScreen";
import { SettingsView } from "./components/SettingsView";
import { PresentationMode } from "./components/PresentationMode";
import { CheckCircle, X, Sparkles } from "lucide-react";

const MainContent: React.FC = () => {
  const { activeTab, activeNotification, dismissNotification } = useMedi();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Floating Notification Toast */}
      {activeNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-auto">
          <div className="p-3.5 rounded-2xl bg-cyan-950/95 border border-cyan-400/60 backdrop-blur-xl shadow-2xl shadow-cyan-950/60 flex items-center justify-between gap-3 text-cyan-200 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
              <span className="font-medium">{activeNotification}</span>
            </div>
            <button
              onClick={dismissNotification}
              className="p-1 rounded-lg text-cyan-400 hover:text-white hover:bg-cyan-900/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Header & Navigation */}
      <Navigation />

      {/* Screen Views Router */}
      <main className="flex-1 flex flex-col">
        {activeTab === "home" && <HomeScreen />}
        {activeTab === "conversation" && <ConversationView />}
        {activeTab === "reminders" && <RemindersView />}
        {activeTab === "appointments" && <AppointmentsView />}
        {activeTab === "emergency" && <EmergencyView />}
        {activeTab === "beyond-screen" && <BeyondTheScreen />}
        {activeTab === "settings" && <SettingsView />}
      </main>

      {/* Pitch / Executive Presentation Modal */}
      <PresentationMode />
    </div>
  );
};

export default function App() {
  return (
    <MediProvider>
      <MainContent />
    </MediProvider>
  );
}
