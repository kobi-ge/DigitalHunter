import React from "react";
import { useTactical } from "../context/TacticalContext";
import { BarChart3, PieChart, TrendingUp, ShieldAlert, Cpu, Radio } from "lucide-react";
import { SIGNAL_TYPES } from "../data/initialData";

export const AnalyticsPanel = () => {
  const { targets, signals, attacks, damageReports } = useTactical();

  // Compute Priority Distribution
  const pCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  targets.forEach(t => {
    pCounts[t.priority_level] = (pCounts[t.priority_level] || 0) + 1;
  });

  // Compute Entity Class Distribution
  const classCounts = {};
  targets.forEach(t => {
    classCounts[t.type] = (classCounts[t.type] || 0) + 1;
  });

  // Compute Signal Types Distribution
  const signalCounts = {};
  signals.forEach(s => {
    signalCounts[s.signal_type] = (signalCounts[s.signal_type] || 0) + 1;
  });

  // Strike Success Ratio
  const totalDamageEvaluated = damageReports.length;
  const destroyedCount = damageReports.filter(d => d.result === "destroyed").length;
  const damagedCount = damageReports.filter(d => d.result === "damaged").length;
  const successRatio = totalDamageEvaluated > 0 
    ? Math.round(((destroyedCount + damagedCount) / totalDamageEvaluated) * 100) 
    : 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "100%", overflowY: "auto" }}>
      <div className="filter-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <BarChart3 size={20} className="text-cyan-400" style={{ color: "var(--accent-cyan)" }} />
          <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "#fff" }}>
            Threat Intelligence & Performance Analytics
          </h3>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
        {/* Priority Level Breakdown Card */}
        <div className="hud-panel" style={{ padding: "20px" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldAlert size={18} className="text-crimson-500" style={{ color: "var(--accent-crimson)" }} />
            Priority Threat Spectrum
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[1, 2, 3, 4, 5].map(p => {
              const count = pCounts[p] || 0;
              const pct = targets.length > 0 ? Math.round((count / targets.length) * 100) : 0;
              const color = p === 1 ? "#ff0055" : (p === 2 ? "#ff7700" : (p === 3 ? "#ffb700" : (p === 4 ? "#00f3ff" : "#64748b")));

              return (
                <div key={p}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontFamily: "var(--font-mono)", marginBottom: "4px" }}>
                    <span>P{p} Priority</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "4px", transition: "width 0.5s ease" }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Signal Volume Breakdown */}
        <div className="hud-panel" style={{ padding: "20px" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Radio size={18} className="text-purple-400" style={{ color: "var(--accent-purple)" }} />
            Telemetry Signal Composition
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {SIGNAL_TYPES.map(st => {
              const count = signalCounts[st.id] || 0;
              const pct = signals.length > 0 ? Math.round((count / signals.length) * 100) : 0;

              return (
                <div key={st.id} style={{ background: "rgba(6, 10, 18, 0.6)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontWeight: "bold", color: st.color, fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
                      {st.id} ({st.name})
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{count} signals</span>
                  </div>
                  <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: st.color, borderRadius: "3px" }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strike Efficiency Metrics */}
        <div className="hud-panel" style={{ padding: "20px" }}>
          <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "#fff", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingUp size={18} className="text-emerald-400" style={{ color: "var(--accent-emerald)" }} />
            Strike & Ordnance Effectiveness
          </h4>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", flexDirection: "column" }}>
            <div style={{ fontSize: "3rem", fontWeight: "900", color: "var(--accent-emerald)", fontFamily: "var(--font-mono)" }}>
              {successRatio}%
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Battle Damage Effectiveness Rating
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px", borderTop: "1px solid var(--border-subtle)", paddingTop: "12px", fontSize: "0.8rem", fontFamily: "var(--font-mono)" }}>
            <div>Destroyed Targets: <b>{destroyedCount}</b></div>
            <div>Damaged Targets: <b>{damagedCount}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
};
