import React, { useState } from "react";
import { useTactical } from "../context/TacticalContext";
import { Search, Filter, Database, Flame, MapPin, ShieldAlert } from "lucide-react";
import { soundEngine } from "../utils/audio";
import { THREAT_CLASSES, ARSENAL_WEAPONS } from "../data/initialData";

export const TargetBank = () => {
  const {
    enemies,
    selectedEnemyId,
    setSelectedEnemyId,
    selectedWeaponId,
    fireWeapon,
    setActiveTab,
    ammo,
    cooldowns
  } = useTactical();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const selectedWeapon = ARSENAL_WEAPONS.find(w => w.id === selectedWeaponId) || ARSENAL_WEAPONS[0];

  const filteredEnemies = enemies.filter(enemy => {
    const threatInfo = THREAT_CLASSES[enemy.type] || { name: "Hostile" };
    const matchesSearch =
      enemy.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enemy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threatInfo.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "ALL" || enemy.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || enemy.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="hud-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="filter-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Database size={20} className="text-cyan-400" style={{ color: "var(--accent-cyan)" }} />
          <h3 style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "#fff" }}>
            Hostile Threat Intelligence Directory
          </h3>
          <span className="hud-badge">{filteredEnemies.length} Identified Threats</span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="filter-bar" style={{ background: "rgba(6, 10, 18, 0.5)", padding: "10px", borderRadius: "8px" }}>
        <div className="search-input-wrapper">
          <Search size={16} className="text-slate-400" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            className="hud-input"
            placeholder="Search Threat ID, Callsign, or Class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <select
            className="hud-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Threat Classes</option>
            <option value="foot_squad">Foot Patrol / Cell</option>
            <option value="motorcycle">Motorcycle Scout</option>
            <option value="technical_vehicle">Armed Technical</option>
            <option value="sniper_nest">Sniper Nest</option>
            <option value="rocket_launcher">Rocket Launcher</option>
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
          </select>
        </div>
      </div>

      {/* Threat Data Table */}
      <div className="table-wrapper" style={{ flex: 1, marginTop: "12px" }}>
        <table className="hud-table">
          <thead>
            <tr>
              <th>Threat ID</th>
              <th>Class & Icon</th>
              <th>Callsign</th>
              <th>HP Status</th>
              <th>Distance (Base)</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Engage Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnemies.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  No hostile threats match search filter.
                </td>
              </tr>
            ) : (
              filteredEnemies.map(enemy => {
                const threatInfo = THREAT_CLASSES[enemy.type] || { icon: "⚠️", name: "Hostile", points: 100 };
                const isSelected = selectedEnemyId === enemy.id;
                const hpPct = Math.round((enemy.hp / enemy.maxHp) * 100);

                return (
                  <tr
                    key={enemy.id}
                    className={isSelected ? "selected" : ""}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedEnemyId(enemy.id);
                    }}
                  >
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: "bold", color: "var(--accent-cyan)" }}>
                      {enemy.id}
                    </td>
                    <td style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "1.2rem" }}>{threatInfo.icon}</span>
                      <span>{threatInfo.name}</span>
                    </td>
                    <td style={{ fontWeight: "600" }}>{enemy.name}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                        <div style={{ width: "60px", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${hpPct}%`, height: "100%", background: hpPct < 40 ? "var(--accent-crimson)" : "var(--accent-emerald)" }}></div>
                        </div>
                        <span>{enemy.hp}/{enemy.maxHp}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", color: "var(--accent-amber)" }}>
                      {enemy.distance ? `${enemy.distance.toFixed(1)} km` : "?"}
                    </td>
                    <td>
                      <span className={`badge-status ${enemy.status}`}>
                        {enemy.status.replace("_", " ")}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        <button
                          className="action-btn"
                          style={{ padding: "4px 8px" }}
                          onClick={() => {
                            setSelectedEnemyId(enemy.id);
                            setActiveTab("map");
                          }}
                          title="Locate on Map"
                        >
                          <MapPin size={14} />
                        </button>
                        {enemy.status !== "destroyed" && (
                          <button
                            className="action-btn danger"
                            style={{ padding: "4px 8px" }}
                            onClick={() => fireWeapon(enemy.lat, enemy.lon, enemy.id)}
                            disabled={cooldowns[selectedWeapon.id] > 0 || ammo[selectedWeapon.id] <= 0}
                            title={`Fire ${selectedWeapon.name}`}
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
