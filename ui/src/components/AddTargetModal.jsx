import React, { useState } from "react";
import { useTactical } from "../context/TacticalContext";
import { X, PlusCircle, Target, MapPin } from "lucide-react";

export const AddTargetModal = () => {
  const { isAddTargetModalOpen, setIsAddTargetModalOpen, addNewTarget, targets } = useTactical();

  const nextIdNum = targets.length + 1;
  const defaultEntityId = `TGT-${nextIdNum.toString().padStart(3, "0")}`;

  const [entityId, setEntityId] = useState(defaultEntityId);
  const [name, setName] = useState("");
  const [type, setType] = useState("mobile_vehicle");
  const [lat, setLat] = useState("31.8500");
  const [lon, setLon] = useState("34.9000");
  const [priorityLevel, setPriorityLevel] = useState("2");

  if (!isAddTargetModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    addNewTarget({
      entity_id: entityId || defaultEntityId,
      name,
      type,
      lat: parseFloat(lat) || 31.85,
      lon: parseFloat(lon) || 34.90,
      priority_level: parseInt(priorityLevel, 10),
      status: "active"
    });

    setIsAddTargetModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAddTargetModalOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: "var(--accent-cyan)" }}>
            <PlusCircle /> REGISTER NEW TARGET ENTITY
          </div>
          <button
            onClick={() => setIsAddTargetModalOpen(false)}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>TARGET ID DESIGNATION</label>
            <input
              type="text"
              className="hud-input"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>TARGET NAME / CALLSIGN</label>
            <input
              type="text"
              className="hud-input"
              placeholder="e.g. Convoy Delta, Radar Station"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>ENTITY CLASS TYPE</label>
              <select
                className="hud-select"
                style={{ width: "100%" }}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="mobile_vehicle">Mobile Vehicle</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="human_squad">Human Squad</option>
                <option value="launcher">Launcher</option>
              </select>
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>PRIORITY LEVEL</label>
              <select
                className="hud-select"
                style={{ width: "100%" }}
                value={priorityLevel}
                onChange={(e) => setPriorityLevel(e.target.value)}
              >
                <option value="1">P1 - Critical Threat</option>
                <option value="2">P2 - High Threat</option>
                <option value="3">P3 - Medium Threat</option>
                <option value="4">P4 - Low Threat</option>
                <option value="5">P5 - Minimal Threat</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>LATITUDE (N)</label>
              <input
                type="number"
                step="0.0001"
                className="hud-input"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>LONGITUDE (E)</label>
              <input
                type="number"
                step="0.0001"
                className="hud-input"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              type="button"
              className="action-btn"
              style={{ flex: 1 }}
              onClick={() => setIsAddTargetModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-btn primary"
              style={{ flex: 1.5, padding: "10px" }}
            >
              Add Target Entity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
