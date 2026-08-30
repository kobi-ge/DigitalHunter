import React, { useState } from "react";
import { useTactical } from "../context/TacticalContext";
import { Search, Filter, Database, Flame, Eye, MapPin, Plus } from "lucide-react";
import { soundEngine } from "../utils/audio";

export const TargetBank = () => {
  const {
    targets,
    selectedTargetId,
    setSelectedTargetId,
    setStrikeTarget,
    setIsAddTargetModalOpen,
    setActiveTab
  } = useTactical();

  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filteredTargets = targets.filter(target => {
    const matchesSearch =
      target.entity_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      target.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      target.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === "ALL" || target.priority_level === Number(priorityFilter);
    const matchesStatus = statusFilter === "ALL" || target.status === statusFilter;
    const matchesType = typeFilter === "ALL" || target.type === typeFilter;

    return matchesSearch && matchesPriority && matchesStatus && matchesType;
  });

  return (
    <div className="hud-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="filter-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Database size={20} className="text-cyan-400" style={{ color: "var(--accent-cyan)" }} />
          <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "#fff" }}>
            Target Bank Directory
          </h3>
          <span className="hud-badge">{filteredTargets.length} of {targets.length} Targets</span>
        </div>

        <button
          className="action-btn primary"
          onClick={() => setIsAddTargetModalOpen(true)}
        >
          <Plus size={16} /> Add Target Entity
        </button>
      </div>

      {/* Filter Controls Row */}
      <div className="filter-bar" style={{ background: "rgba(6, 10, 18, 0.5)", padding: "10px", borderRadius: "8px" }}>
        <div className="search-input-wrapper">
          <Search size={16} className="text-slate-400" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            className="hud-input"
            placeholder="Search Target ID, Name, or Entity Class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <select
            className="hud-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="1">P1 Critical</option>
            <option value="2">P2 High</option>
            <option value="3">P3 Medium</option>
            <option value="4">P4 Low</option>
            <option value="5">P5 Minimal</option>
          </select>

          <select
            className="hud-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active</option>
            <option value="damaged">Damaged</option>
            <option value="destroyed">Destroyed</option>
            <option value="strike_pending">Strike Pending</option>
          </select>

          <select
            className="hud-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Entity Types</option>
            <option value="mobile_vehicle">Mobile Vehicle</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="human_squad">Human Squad</option>
            <option value="launcher">Launcher</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-wrapper" style={{ flex: 1, marginTop: "12px" }}>
        <table className="hud-table">
          <thead>
            <tr>
              <th>Target ID</th>
              <th>Name</th>
              <th>Class Type</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Coordinates</th>
              <th>Distance (HQ)</th>
              <th>Signals</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTargets.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  No target entities match search criteria.
                </td>
              </tr>
            ) : (
              filteredTargets.map(t => {
                const isSelected = selectedTargetId === t.entity_id;
                return (
                  <tr
                    key={t.entity_id}
                    className={isSelected ? "selected" : ""}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedTargetId(t.entity_id);
                    }}
                  >
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", color: "var(--accent-cyan)" }}>
                      {t.entity_id}
                    </td>
                    <td style={{ fontWeight: "600" }}>{t.name}</td>
                    <td style={{ textTransform: "capitalize", color: "var(--text-muted)" }}>
                      {t.type.replace("_", " ")}
                    </td>
                    <td>
                      <span className={`badge-priority p${t.priority_level}`}>
                        P{t.priority_level}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${t.status}`}>
                        {t.status.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                      {t.lat.toFixed(4)}, {t.lon.toFixed(4)}
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)" }}>
                      {t.distance} km
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", color: "var(--accent-purple)" }}>
                      {t.signalCount || 1}
                    </td>
                    <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        <button
                          className="action-btn"
                          style={{ padding: "4px 8px" }}
                          onClick={() => {
                            setSelectedTargetId(t.entity_id);
                            setActiveTab("map");
                          }}
                          title="Locate on Map"
                        >
                          <MapPin size={14} />
                        </button>
                        {t.status !== "destroyed" && (
                          <button
                            className="action-btn danger"
                            style={{ padding: "4px 8px" }}
                            onClick={() => setStrikeTarget(t)}
                            title="Dispatch Ordnance Strike"
                          >
                            <Flame size={14} /> Strike
                          </button>
                        )}
                      </div>
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
