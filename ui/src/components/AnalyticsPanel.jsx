import React from "react";
import { useTactical } from "../context/TacticalContext";
import { BarChart3, ShieldCheck, Target, Crosshair, Award, Flame, Skull } from "lucide-react";
import { THREAT_CLASSES } from "../data/initialData";

export const AnalyticsPanel = () => {
  const { player, enemies, currentWaveNum } = useTactical();

  const totalEnemies = enemies.length;
  const destroyedEnemies = enemies.filter(e => e.status === "destroyed").length;
  const accuracy = player.shotsFired > 0 ? Math.round((player.shotsHit / player.shotsFired) * 100) : 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%", overflowY: "auto" }}>
      <div className="filter-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <BarChart3 size={20} className="text-cyan-400" style={{ color: "var(--accent-cyan)" }} />
          <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "#fff" }}>
            Combat Performance & Engagement Analytics
          </h3>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {/* Mission Summary Card */}
        <div className="hud-panel" style={{ padding: "20px" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={18} className="text-amber-400" />
            Operator Performance Rating
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontFamily: "var(--font-mono)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Total Score</span>
              <b style={{ color: "var(--accent-amber)", fontSize: "1.2rem" }}>{player.score.toLocaleString()} PTS</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Kill Count</span>
              <b style={{ color: "var(--accent-emerald)", fontSize: "1.2rem" }}>{player.kills} ELIMINATED</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Combat Accuracy</span>
              <b style={{ color: "var(--accent-cyan)", fontSize: "1.2rem" }}>{accuracy}% ({player.shotsHit}/{player.shotsFired} Hits)</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Sector Wave</span>
              <b style={{ color: "var(--accent-crimson)", fontSize: "1.2rem" }}>Wave {currentWaveNum} of 5</b>
            </div>
          </div>
        </div>

        {/* Threat Class Breakdown */}
        <div className="hud-panel" style={{ padding: "20px" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Skull size={18} className="text-crimson-400" />
            Hostile Class Target Ledger
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {Object.keys(THREAT_CLASSES).map(typeKey => {
              const info = THREAT_CLASSES[typeKey];
              const totalOfType = enemies.filter(e => e.type === typeKey).length;
              const destroyedOfType = enemies.filter(e => e.type === typeKey && e.status === "destroyed").length;

              return (
                <div key={typeKey} style={{ background: "rgba(6, 10, 18, 0.6)", padding: "10px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>
                    <span>{info.icon} {info.name}</span>
                    <span style={{ color: "var(--accent-emerald)" }}>{destroyedOfType} / {totalOfType} Down</span>
                  </div>
                  <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${totalOfType > 0 ? (destroyedOfType / totalOfType) * 100 : 0}%`, background: info.color }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
