import React from "react";
import { TacticalProvider, useTactical } from "./context/TacticalContext";
import { Header } from "./components/Header";
import { CombatHUD } from "./components/CombatHUD";
import { TacticalMap } from "./components/TacticalMap";
import { TelemetryFeed } from "./components/TelemetryFeed";
import { TargetBank } from "./components/TargetBank";
import { TargetModal } from "./components/TargetModal";
import { GameOverModal } from "./components/GameOverModal";
import { AnalyticsPanel } from "./components/AnalyticsPanel";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

function MainGame() {
  const { activeTab, visionMode, notifications } = useTactical();

  const renderContent = () => {
    switch (activeTab) {
      case "map":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "3fr 1.1fr", gap: "14px", height: "calc(100vh - 230px)" }}>
            <TacticalMap />
            <TargetModal />
          </div>
        );

      case "targetbank":
        return (
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.1fr", gap: "14px", height: "calc(100vh - 230px)" }}>
            <TargetBank />
            <TargetModal />
          </div>
        );

      case "telemetry":
        return (
          <div style={{ height: "calc(100vh - 230px)" }}>
            <TelemetryFeed />
          </div>
        );

      case "analytics":
        return (
          <div style={{ height: "calc(100vh - 230px)" }}>
            <AnalyticsPanel />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`app-container ${visionMode === "nvg" ? "vision-nvg" : (visionMode === "flir" ? "vision-flir" : "")}`}>
      <Header />
      <main className="main-content">
        <CombatHUD />
        {renderContent()}
      </main>

      {/* Game Over & Wave Cleared Modal */}
      <GameOverModal />

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
      <MainGame />
    </TacticalProvider>
  );
}
