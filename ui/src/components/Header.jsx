import React from "react";
import { useTactical } from "../context/TacticalContext";
import {
  Crosshair,
  Map,
  Database,
  Radio,
  BarChart3,
  Volume2,
  VolumeX,
  Package,
  RotateCcw,
  Sparkles,
  Flame,
  Shield
} from "lucide-react";

export const Header = () => {
  const {
    activeTab,
    setActiveTab,
    soundEnabled,
    toggleSound,
    callResupply,
    resupplyCooldown,
    restartGame,
    currentWaveNum,
    player,
    enemies
  } = useTactical();

  const activeThreats = enemies.filter(e => e.status !== "destroyed").length;

  return (
    <header className="header-bar">
      <div className="brand-logo">
        <div className="brand-title">
          <Crosshair className="w-6 h-6 animate-pulse" style={{ color: "var(--accent-cyan)" }} />
          FRONTLINE<span>OPERATOR</span>
        </div>
        <span className="hud-badge">Tactical Sim v3.0</span>

        {activeThreats > 0 && (
          <span className="badge-priority p1 flex items-center gap-1">
            <Flame size={12} />
            {activeThreats} HOSTILES ACTIVE
          </span>
        )}
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === "map" ? "active" : ""}`}
          onClick={() => setActiveTab("map")}
        >
          <Map size={16} /> Combat Radar
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "targetbank" ? "active" : ""}`}
          onClick={() => setActiveTab("targetbank")}
        >
          <Database size={16} /> Hostile Target Bank ({enemies.length})
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "telemetry" ? "active" : ""}`}
          onClick={() => setActiveTab("telemetry")}
        >
          <Radio size={16} /> Live Intel Stream
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 size={16} /> Battle Log & Stats
        </button>
      </nav>

      <div className="header-actions">
        {/* Quick Resupply */}
        <button
          className={`action-btn ${resupplyCooldown > 0 ? "disabled" : ""}`}
          onClick={callResupply}
          disabled={resupplyCooldown > 0}
          title="Call Airdrop Munition Resupply (R)"
        >
          <Package size={15} className="text-amber-400" />
          <span className="hidden sm:inline">
            {resupplyCooldown > 0 ? `Resupply (${Math.round(resupplyCooldown)}s)` : "Resupply (R)"}
          </span>
        </button>

        {/* Audio Toggle */}
        <button
          className="action-btn"
          onClick={toggleSound}
          title={soundEnabled ? "Mute Combat Sound Effects" : "Enable Sound Effects"}
        >
          {soundEnabled ? <Volume2 size={16} className="text-cyan-400" /> : <VolumeX size={16} className="text-slate-400" />}
        </button>

        {/* Restart Mission */}
        <button
          className="action-btn danger"
          onClick={restartGame}
          title="Restart Mission from Wave 1"
        >
          <RotateCcw size={15} />
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>
    </header>
  );
};
