import React, { useState } from "react";
import { useTactical } from "../context/TacticalContext";
import { X, Flame, ShieldAlert, CheckCircle, Crosshair, AlertTriangle } from "lucide-react";
import { WEAPON_TYPES } from "../data/initialData";

export const StrikeModal = () => {
  const { strikeTarget, setStrikeTarget, dispatchStrike } = useTactical();
  const [selectedWeapon, setSelectedWeapon] = useState(WEAPON_TYPES[0].id);
  const [isLaunching, setIsLaunching] = useState(false);

  if (!strikeTarget) return null;

  const weaponObj = WEAPON_TYPES.find(w => w.id === selectedWeapon) || WEAPON_TYPES[0];

  const handleLaunch = () => {
    setIsLaunching(true);
    dispatchStrike(strikeTarget.entity_id, selectedWeapon);

    setTimeout(() => {
      setIsLaunching(false);
      setStrikeTarget(null);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={() => setStrikeTarget(null)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: "var(--accent-crimson)" }}>
            <Flame className="animate-pulse" /> DISPATCH PRECISION STRIKE
          </div>
          <button
            onClick={() => setStrikeTarget(null)}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Target Summary Banner */}
          <div style={{
            background: "rgba(255, 0, 85, 0.1)",
            border: "1px solid var(--accent-crimson)",
            borderRadius: "8px",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--accent-crimson)" }}>TARGET DESIGNATION</div>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#fff" }}>{strikeTarget.name} ({strikeTarget.entity_id})</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Class: {strikeTarget.type.replace("_", " ")} | Coords: {strikeTarget.lat}, {strikeTarget.lon}</div>
            </div>
            <span className={`badge-priority p${strikeTarget.priority_level}`}>P{strikeTarget.priority_level}</span>
          </div>

          {/* Weapon Selector */}
          <div>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
              SELECT ORDNANCE WEAPON SYSTEM
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {WEAPON_TYPES.map(w => (
                <div
                  key={w.id}
                  onClick={() => setSelectedWeapon(w.id)}
                  style={{
                    background: selectedWeapon === w.id ? "rgba(0, 243, 255, 0.15)" : "rgba(8, 14, 26, 0.8)",
                    border: selectedWeapon === w.id ? "1.5px solid var(--accent-cyan)" : "1px solid var(--border-subtle)",
                    borderRadius: "6px",
                    padding: "10px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "0.85rem", color: selectedWeapon === w.id ? "var(--accent-cyan)" : "#fff" }}>
                    {w.id}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{w.category}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--accent-amber)", marginTop: "4px" }}>
                    CEP: {w.precision} | Range: {w.range}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Weapon Specs */}
          <div style={{ background: "rgba(6, 10, 18, 0.8)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-subtle)", fontSize: "0.8rem" }}>
            <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "4px" }}>ORDNANCE PAYLOAD & GUIDANCE</div>
            <div>Payload: <b>{weaponObj.payload}</b></div>
            <div>Precision Rating: <b>{weaponObj.precision}</b></div>
          </div>

          {/* Warnings & Confirmation */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-amber)", fontSize: "0.8rem" }}>
            <AlertTriangle size={16} />
            <span>Authorization required. Strike execution will trigger immediate BDA damage evaluation.</span>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              className="action-btn"
              style={{ flex: 1 }}
              onClick={() => setStrikeTarget(null)}
              disabled={isLaunching}
            >
              Cancel
            </button>

            <button
              className="action-btn danger"
              style={{ flex: 2, padding: "12px", fontSize: "0.95rem" }}
              onClick={handleLaunch}
              disabled={isLaunching}
            >
              {isLaunching ? (
                <span className="flex items-center gap-2">
                  <Crosshair className="animate-spin" size={18} /> LAUNCHING MISSILE...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Flame size={18} /> AUTHORIZE & LAUNCH STRIKE
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
