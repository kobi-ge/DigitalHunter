import React from "react";
import { useTactical } from "../context/TacticalContext";
import { THREAT_CLASSES, ARSENAL_WEAPONS } from "../data/initialData";
import { Crosshair, Flame, ShieldAlert, Zap, Radio, Target, AlertTriangle } from "lucide-react";
import { soundEngine } from "../utils/audio";

export const TargetModal = () => {
  const {
    selectedEnemy,
    selectedWeaponId,
    setSelectedWeaponId,
    ammo,
    cooldowns,
    fireWeapon,
    signals
  } = useTactical();

  if (!selectedEnemy) {
    return (
      <div className="hud-panel" style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
        Select a target on the radar map to view tactical data.
      </div>
    );
  }

  const threatInfo = THREAT_CLASSES[selectedEnemy.type] || {
    name: "Unidentified Threat",
    icon: "⚠️",
    color: "#ff0055",
    points: 100,
    description: "Hostile movement detected in sector."
  };

  const selectedWeapon = ARSENAL_WEAPONS.find(w => w.id === selectedWeaponId) || ARSENAL_WEAPONS[0];
  const hpPct = Math.round((selectedEnemy.hp / selectedEnemy.maxHp) * 100);
  const isDestroyed = selectedEnemy.status === "destroyed";

  // Filter signals for this enemy
  const relatedSignals = signals.filter(s => s.entity_id === selectedEnemy.id);

  return (
    <div className="hud-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%", gap: "14px" }}>
      {/* Target Designation Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "2rem", padding: "6px", background: "rgba(255, 0, 85, 0.15)", borderRadius: "8px", border: `1px solid ${threatInfo.color}` }}>
            {isDestroyed ? "💀" : threatInfo.icon}
          </div>
          <div>
            <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "#fff" }}>
              {selectedEnemy.name}
            </h3>
            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--accent-cyan)" }}>
              ID: {selectedEnemy.id} • {threatInfo.name}
            </span>
          </div>
        </div>

        <span className={`badge-status ${selectedEnemy.status}`}>
          {selectedEnemy.status.replace("_", " ")}
        </span>
      </div>

      {/* Target Health & Distance Bar */}
      <div style={{ background: "rgba(6, 10, 18, 0.7)", padding: "12px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontFamily: "var(--font-mono)", marginBottom: "6px" }}>
          <span style={{ color: "var(--text-muted)" }}>HOSTILE DURABILITY</span>
          <b style={{ color: hpPct < 40 ? "var(--accent-crimson)" : "var(--accent-emerald)" }}>
            {selectedEnemy.hp} / {selectedEnemy.maxHp} HP
          </b>
        </div>
        <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${hpPct}%`, background: hpPct < 40 ? "var(--accent-crimson)" : "var(--accent-emerald)", transition: "width 0.3s ease" }}></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
          <div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>DISTANCE TO BASE:</span>
            <div style={{ color: "var(--accent-amber)", fontWeight: "bold", fontSize: "0.95rem" }}>
              {selectedEnemy.distance ? selectedEnemy.distance.toFixed(2) : "?"} km
            </div>
          </div>
          <div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>ELIMINATION VALUE:</span>
            <div style={{ color: "var(--accent-cyan)", fontWeight: "bold", fontSize: "0.95rem" }}>
              +{threatInfo.points} PTS
            </div>
          </div>
        </div>
      </div>

      {/* Weapon Selector for Direct Fire */}
      <div style={{ flex: 1 }}>
        <label style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: "8px", display: "block" }}>
          SELECT ARMED ORDNANCE:
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {ARSENAL_WEAPONS.map(w => {
            const isSelected = selectedWeaponId === w.id;
            const currentAmmo = ammo[w.id] || 0;
            const isCd = cooldowns[w.id] > 0;

            return (
              <div
                key={w.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedWeaponId(w.id);
                }}
                style={{
                  background: isSelected ? "rgba(0, 243, 255, 0.15)" : "rgba(8, 14, 26, 0.8)",
                  border: isSelected ? "1.5px solid var(--accent-cyan)" : "1px solid var(--border-subtle)",
                  borderRadius: "6px",
                  padding: "8px",
                  cursor: "pointer",
                  opacity: currentAmmo === 0 ? 0.4 : 1
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", fontSize: "0.8rem", color: isSelected ? "var(--accent-cyan)" : "#fff" }}>
                    {w.icon} {w.name.split(" ")[0]}
                  </span>
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: currentAmmo === 0 ? "var(--accent-crimson)" : "var(--accent-emerald)" }}>
                    {currentAmmo}
                  </span>
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {w.damage} DMG • {isCd ? `${cooldowns[w.id]}s CD` : "Ready"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      {!isDestroyed ? (
        <button
          className="action-btn danger"
          style={{ width: "100%", padding: "14px", fontSize: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
          onClick={() => fireWeapon(selectedEnemy.lat, selectedEnemy.lon, selectedEnemy.id)}
          disabled={cooldowns[selectedWeapon.id] > 0 || ammo[selectedWeapon.id] <= 0}
        >
          <Flame size={18} />
          <span>FIRE {selectedWeapon.name.toUpperCase()}</span>
        </button>
      ) : (
        <div style={{ textAlign: "center", padding: "12px", background: "rgba(100, 116, 139, 0.1)", borderRadius: "6px", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
          TARGET NEUTRALIZED
        </div>
      )}
    </div>
  );
};
