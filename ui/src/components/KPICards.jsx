import React from "react";
import { useTactical } from "../context/TacticalContext";
import { Database, ShieldAlert, Radio, Flame, CheckCircle2 } from "lucide-react";

export const KPICards = () => {
  const { targets, signals, attacks, damageReports } = useTactical();

  const totalTargets = targets.length;
  const activeTargets = targets.filter(t => t.status !== "destroyed").length;
  const p1Count = targets.filter(t => t.priority_level === 1 && t.status !== "destroyed").length;
  const destroyedCount = targets.filter(t => t.status === "destroyed").length;
  const totalStrikes = attacks.length;

  return (
    <div className="kpi-grid">
      <div className="hud-panel kpi-card">
        <div className="kpi-icon-wrapper">
          <Database size={22} />
        </div>
        <div className="kpi-info">
          <span className="kpi-label">Active Targets</span>
          <span className="kpi-value">{activeTargets} / {totalTargets}</span>
          <span className="kpi-sub">
            <span style={{ color: "var(--status-active)" }}>● {activeTargets} Active</span>
          </span>
        </div>
      </div>

      <div className="hud-panel kpi-card p1">
        <div className="kpi-icon-wrapper">
          <ShieldAlert size={22} />
        </div>
        <div className="kpi-info">
          <span className="kpi-label">P1 Critical Threats</span>
          <span className="kpi-value" style={{ color: "var(--p1-critical)" }}>{p1Count}</span>
          <span className="kpi-sub">High Priority Trackers</span>
        </div>
      </div>

      <div className="hud-panel kpi-card signals">
        <div className="kpi-icon-wrapper">
          <Radio size={22} />
        </div>
        <div className="kpi-info">
          <span className="kpi-label">Telemetry Received</span>
          <span className="kpi-value" style={{ color: "var(--accent-purple)" }}>{signals.length}</span>
          <span className="kpi-sub">SIGINT / VISINT / HUMINT</span>
        </div>
      </div>

      <div className="hud-panel kpi-card strikes">
        <div className="kpi-icon-wrapper">
          <Flame size={22} />
        </div>
        <div className="kpi-info">
          <span className="kpi-label">Strikes Dispatched</span>
          <span className="kpi-value" style={{ color: "var(--accent-amber)" }}>{totalStrikes}</span>
          <span className="kpi-sub">Precision Ordnance</span>
        </div>
      </div>

      <div className="hud-panel kpi-card neutralized">
        <div className="kpi-icon-wrapper">
          <CheckCircle2 size={22} />
        </div>
        <div className="kpi-info">
          <span className="kpi-label">Targets Neutralized</span>
          <span className="kpi-value" style={{ color: "var(--accent-emerald)" }}>{destroyedCount}</span>
          <span className="kpi-sub">Confirmed Destroyed</span>
        </div>
      </div>
    </div>
  );
};
