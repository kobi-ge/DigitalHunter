import React from "react";
import { useTactical } from "../context/TacticalContext";
import {
  Crosshair,
  Map,
  Database,
  Radio,
  Target,
  BarChart3,
  Play,
  Pause,
  PlusCircle,
  Volume2,
  VolumeX,
  ShieldAlert,
  Flame
} from "lucide-react";

export const Header = () => {
  const {
    activeTab,
    setActiveTab,
    isSimulating,
    setIsSimulating,
    simSpeed,
    setSimSpeed,
    soundEnabled,
    toggleSound,
    setIsAddTargetModalOpen,
    signals,
    targets
  } = useTactical();

  const activeP1Count = targets.filter(t => t.priority_level === 1 && t.status !== "destroyed").length;

  return (
    <header className="header-bar">
      <div className="brand-logo">
        <div className="brand-title">
          <Crosshair className="w-6 h-6 text-cyan-400 animate-pulse" style={{ color: "var(--accent-cyan)" }} />
          DIGITAL<span>HUNTER</span>
        </div>
        <span className="hud-badge">Tactical Defense v2.4</span>

        {activeP1Count > 0 && (
          <span className="badge-priority p1 flex items-center gap-1">
            <ShieldAlert size={12} />
            {activeP1Count} P1 ALERT
          </span>
        )}
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <Crosshair size={16} /> HUD Overview
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "map" ? "active" : ""}`}
          onClick={() => setActiveTab("map")}
        >
          <Map size={16} /> GIS Map
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "targetbank" ? "active" : ""}`}
          onClick={() => setActiveTab("targetbank")}
        >
          <Database size={16} /> Target Bank ({targets.length})
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "telemetry" ? "active" : ""}`}
          onClick={() => setActiveTab("telemetry")}
        >
          <Radio size={16} /> Kafka Stream
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "strikes" ? "active" : ""}`}
          onClick={() => setActiveTab("strikes")}
        >
          <Flame size={16} /> Strike Log
        </button>
        <button
          className={`nav-tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          <BarChart3 size={16} /> Intel Analytics
        </button>
      </nav>

      <div className="header-actions">
        {/* Simulation Controls */}
        <button
          className="action-btn"
          onClick={() => setIsSimulating(!isSimulating)}
          title={isSimulating ? "Pause Kafka Telemetry Stream" : "Resume Stream"}
        >
          {isSimulating ? <Pause size={14} className="text-amber-400" /> : <Play size={14} className="text-emerald-400" />}
          <span className="hidden sm:inline">{isSimulating ? "Stream Live" : "Paused"}</span>
        </button>

        <select
          className="hud-select"
          value={simSpeed}
          onChange={(e) => setSimSpeed(Number(e.target.value))}
          title="Kafka Stream Frequency Speed"
        >
          <option value={1}>1x Speed</option>
          <option value={2}>2x Speed</option>
          <option value={5}>5x Turbo</option>
        </select>

        <button
          className="action-btn"
          onClick={toggleSound}
          title={soundEnabled ? "Mute HUD Sound Effects" : "Enable Sound Effects"}
        >
          {soundEnabled ? <Volume2 size={16} className="text-cyan-400" /> : <VolumeX size={16} className="text-slate-400" />}
        </button>

        <button
          className="action-btn primary"
          onClick={() => setIsAddTargetModalOpen(true)}
        >
          <PlusCircle size={16} />
          <span>New Target</span>
        </button>
      </div>
    </header>
  );
};
