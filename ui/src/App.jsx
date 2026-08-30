import React from "react";
import { TacticalProvider, useTactical } from "./context/TacticalContext";
import { Header } from "./components/Header";
import { KPICards } from "./components/KPICards";
import { TacticalMap } from "./components/TacticalMap";
import { TelemetryFeed } from "./components/TelemetryFeed";
import { TargetBank } from "./components/TargetBank";
import { TargetModal } from "./components/TargetModal";
import { StrikeModal } from "./components/StrikeModal";
import { AddTargetModal } from "./components/AddTargetModal";
import { DamageLog } from "./components/DamageLog";
import { AnalyticsPanel } from "./components/AnalyticsPanel";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

function MainDashboard() {
  const { activeTab, notifications } = useTactical();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <KPICards />
            <div className="dashboard-grid">
              <TacticalMap />
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%" }}>
                <TargetModal />
              </div>
            </div>
          </>
        );

      case "map":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "16px", height: "calc(100vh - 100px)" }}>
            <TacticalMap />
            <TargetModal />
          </div>
        );

      case "targetbank":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr", gap: "16px", height: "calc(100vh - 100px)" }}>
            <TargetBank />
            <TargetModal />
          </div>
        );

      case "telemetry":
        return (
          <div style={{ height: "calc(100vh - 100px)" }}>
            <TelemetryFeed />
          </div>
        );

      case "strikes":
        return (
          <div style={{ height: "calc(100vh - 100px)" }}>
            <DamageLog />
          </div>
        );

      case "analytics":
        return (
          <div style={{ height: "calc(100vh - 100px)" }}>
            <AnalyticsPanel />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Global Modals */}
      <StrikeModal />
      <AddTargetModal />

      {/* Toast Notification Overlay */}
      <div className="toast-container">
        {notifications.map(n => (
          <div key={n.id} className={`toast ${n.type}`}>
            {n.type === "danger" && <AlertTriangle size={16} />}
            {n.type === "warning" && <AlertCircle size={16} />}
            {n.type === "success" && <CheckCircle size={16} />}
            {n.type === "info" && <Info size={16} />}
            <span>{n.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TacticalProvider>
      <MainDashboard />
    </TacticalProvider>
  );
}
