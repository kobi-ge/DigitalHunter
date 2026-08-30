import React from "react";
import { useTactical } from "../context/TacticalContext";
import { Flame, CheckCircle, AlertOctagon, HelpCircle } from "lucide-react";

export const DamageLog = () => {
  const { attacks, damageReports, targets } = useTactical();

  return (
    <div className="hud-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="filter-bar" style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Flame size={20} className="text-amber-400" style={{ color: "var(--accent-amber)" }} />
          <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "#fff" }}>
            Air Strike & Battle Damage Assessment (BDA) Log
          </h3>
          <span className="hud-badge">{attacks.length} Operations Launched</span>
        </div>
      </div>

      <div className="table-wrapper" style={{ flex: 1 }}>
        <table className="hud-table">
          <thead>
            <tr>
              <th>Attack ID</th>
              <th>Target ID</th>
              <th>Target Name</th>
              <th>Ordnance Used</th>
              <th>Dispatch Time</th>
              <th>BDA Status</th>
              <th>Assessed Result</th>
            </tr>
          </thead>
          <tbody>
            {attacks.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  No air strikes dispatched yet.
                </td>
              </tr>
            ) : (
              attacks.map(atk => {
                const target = targets.find(t => t.entity_id === atk.entity_id);
                const bda = damageReports.find(d => d.attack_id === atk.attack_id);

                return (
                  <tr key={atk.attack_id}>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", color: "var(--accent-cyan)" }}>
                      {atk.attack_id}
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>
                      {atk.entity_id}
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      {target ? target.name : "Unknown Target"}
                    </td>
                    <td style={{ color: "var(--accent-amber)", fontFamily: "var(--font-mono)" }}>
                      {atk.weapon_type}
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {new Date(atk.timestamp).toLocaleTimeString()}
                    </td>
                    <td>
                      <span className={`badge-status ${atk.status === "in_flight" ? "strike_pending" : "active"}`}>
                        {atk.status.replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      {bda ? (
                        <span className={`badge-status ${bda.result}`}>
                          {bda.result.replace("_", " ")}
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                          Awaiting Satellite Imagery...
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
