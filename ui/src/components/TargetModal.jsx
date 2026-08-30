import React from "react";
import { useTactical } from "../context/TacticalContext";
import { X, Target, MapPin, Radio, Flame, ShieldAlert, Crosshair, Cpu } from "lucide-react";
import { WEAPON_TYPES } from "../data/initialData";

export const TargetModal = () => {
  const {
    selectedTarget,
    setSelectedTargetId,
    setStrikeTarget,
    signals,
    setActiveTab
  } = useTactical();

  if (!selectedTarget) return null;

  // Filter signals related to this target
  const targetSignals = signals.filter(s => s.entity_id === selectedTarget.entity_id);

  // Recommended weapon based on target type
  const suitableWeapons = WEAPON_TYPES.filter(w => 
    w.suitableFor.includes(selectedTarget.type) || w.suitableFor.includes("infrastructure")
  );

  return (
    <div className="hud-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Target size={20} className="text-cyan-400" style={{ color: "var(--accent-cyan)" }} />
          <div>
            <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "#fff" }}>
              {selectedTarget.name}
            </h3>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-cyan)" }}>
              ID: {selectedTarget.entity_id}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <span className={`badge-priority p${selectedTarget.priority_level}`}>
            P{selectedTarget.priority_level} Priority
          </span>
          <span className={`badge-status ${selectedTarget.status}`}>
            {selectedTarget.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, overflowY: "auto" }}>
        {/* Core Attributes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "rgba(6, 10, 18, 0.6)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>CLASS TYPE</span>
            <div style={{ fontSize: "0.9rem", fontWeight: "600", textTransform: "capitalize" }}>{selectedTarget.type.replace("_", " ")}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>DISTANCE FROM HQ</span>
            <div style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--accent-amber)", fontFamily: "var(--font-mono)" }}>{selectedTarget.distance} km</div>
          </div>
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>LATITUDE</span>
            <div style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>{selectedTarget.lat.toFixed(5)}</div>
          </div>
          <div>
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>LONGITUDE</span>
            <div style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>{selectedTarget.lon.toFixed(5)}</div>
          </div>
        </div>

        {/* Tactical Ordnance Recommendation */}
        <div style={{ background: "rgba(255, 0, 85, 0.05)", border: "1px solid rgba(255, 0, 85, 0.2)", padding: "14px", borderRadius: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-crimson)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "8px" }}>
            <Cpu size={16} /> RECOMMENDED ORDNANCE SELECTION
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-main)", marginBottom: "8px" }}>
            Optimal precision strike match for <b>{selectedTarget.type}</b>:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {suitableWeapons.map(w => (
              <span key={w.id} style={{
                background: "rgba(14, 21, 37, 0.9)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
                color: "var(--accent-cyan)"
              }}>
                🎯 {w.id} ({w.precision})
              </span>
            ))}
          </div>
        </div>

        {/* Telemetry History */}
        <div>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Radio size={14} className="text-purple-400" /> SIGNAL TELEMETRY LOG ({targetSignals.length})
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "180px", overflowY: "auto" }}>
            {targetSignals.length === 0 ? (
              <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)", fontStyle: "italic" }}>
                No recent signals captured for this target.
              </div>
            ) : (
              targetSignals.map(s => (
                <div key={s.signal_id} style={{ background: "rgba(6, 10, 18, 0.8)", padding: "8px", borderRadius: "4px", fontSize: "0.75rem", fontFamily: "var(--font-mono)", display: "flex", justifyContent: "space-between" }}>
                  <span><b>{s.signal_type}</b> @ {s.reported_lat}, {s.reported_lon}</span>
                  <span style={{ color: "var(--text-muted)" }}>{new Date(s.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ display: "flex", gap: "10px", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border-subtle)" }}>
        <button
          className="action-btn"
          style={{ flex: 1 }}
          onClick={() => setActiveTab("map")}
        >
          <MapPin size={16} /> Locate Map
        </button>

        {selectedTarget.status !== "destroyed" && (
          <button
            className="action-btn danger"
            style={{ flex: 1.5 }}
            onClick={() => setStrikeTarget(selectedTarget)}
          >
            <Flame size={16} /> Execute Air Strike
          </button>
        )}
      </div>
    </div>
  );
};
