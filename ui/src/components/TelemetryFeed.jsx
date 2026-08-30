import React, { useState } from "react";
import { useTactical } from "../context/TacticalContext";
import { Radio, Code, Filter, RefreshCw, Layers } from "lucide-react";
import { SIGNAL_TYPES } from "../data/initialData";

export const TelemetryFeed = () => {
  const { signals, enemies, setSelectedEnemyId, setActiveTab } = useTactical();
  const [filterType, setFilterType] = useState("ALL");
  const [expandedSignalId, setExpandedSignalId] = useState(null);

  const filteredSignals = filterType === "ALL" 
    ? signals 
    : signals.filter(s => s.signal_type === filterType);

  const getSignalColor = (type) => {
    const s = SIGNAL_TYPES.find(st => st.id === type);
    return s ? s.color : "var(--accent-cyan)";
  };

  return (
    <div className="hud-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="filter-bar" style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Radio size={20} className="text-cyan-400 animate-pulse" style={{ color: "var(--accent-cyan)" }} />
          <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "#fff" }}>
            Live Multi-Source Sensor Interception Feed
          </h3>
          <span className="hud-badge">{signals.length} Signals Captured</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Filter size={16} className="text-slate-400" />
          <select
            className="hud-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Signal Streams</option>
            {SIGNAL_TYPES.map(st => (
              <option key={st.id} value={st.id}>{st.id} - {st.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="stream-log-list" style={{ flex: 1 }}>
        {filteredSignals.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
            Scanning frequencies... No incoming intelligence signals at this moment.
          </div>
        ) : (
          filteredSignals.map(sig => {
            const enemy = enemies.find(e => e.id === sig.entity_id);
            const color = getSignalColor(sig.signal_type);
            const isExpanded = expandedSignalId === sig.signal_id;

            return (
              <div key={sig.signal_id} className="stream-item">
                <div className="stream-meta">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: `${color}22`,
                      border: `1px solid ${color}`,
                      color: color,
                      fontWeight: "bold",
                      fontSize: "0.7rem"
                    }}>
                      {sig.signal_type}
                    </span>

                    <span
                      style={{ color: "var(--accent-cyan)", cursor: "pointer", fontWeight: "bold" }}
                      onClick={() => {
                        setSelectedEnemyId(sig.entity_id);
                        setActiveTab("map");
                      }}
                      title="Inspect and locate target"
                    >
                      {sig.entity_id} {enemy ? `(${enemy.name})` : ""}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.75rem" }}>
                    <span>{new Date(sig.timestamp).toLocaleTimeString()}</span>
                    <button
                      onClick={() => setExpandedSignalId(isExpanded ? null : sig.signal_id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: isExpanded ? "var(--accent-cyan)" : "var(--text-muted)",
                        cursor: "pointer"
                      }}
                      title="Toggle Raw Payload"
                    >
                      <Code size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", color: "var(--text-main)", marginTop: "4px" }}>
                  <span>Lat: <b>{sig.reported_lat.toFixed(4)}</b></span>
                  <span>Lon: <b>{sig.reported_lon.toFixed(4)}</b></span>
                  <span style={{ color: "var(--text-muted)" }}>Stream: Kafka Broker / {sig.signal_type}</span>
                </div>

                {isExpanded && (
                  <pre style={{
                    marginTop: "8px",
                    padding: "10px",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "4px",
                    color: "var(--accent-emerald)",
                    fontSize: "0.75rem",
                    overflowX: "auto"
                  }}>
                    {JSON.stringify(sig, null, 2)}
                  </pre>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
