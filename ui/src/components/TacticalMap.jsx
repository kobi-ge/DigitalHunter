import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTactical } from "../context/TacticalContext";
import { soundEngine } from "../utils/audio";
import { THREAT_CLASSES, ARSENAL_WEAPONS } from "../data/initialData";
import { Crosshair, Flame, Shield, Radio, Zap, AlertTriangle } from "lucide-react";

// Fix standard Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map Recenter Helper
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.panTo(center, { animate: true });
    }
  }, [center, map]);
  return null;
};

// Create Player Soldier Avatar Icon
const createPlayerSoldierIcon = () => {
  const html = `
    <div class="player-soldier-marker">
      <div class="soldier-pulse-ring"></div>
      <div class="soldier-icon-core">
        <span style="font-size: 16px;">🎖️</span>
      </div>
      <div class="soldier-callsign">YOU (HQ)</div>
    </div>
  `;
  return L.divIcon({
    html,
    className: "player-div-icon",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

// Create Hostile Enemy Div Icon
const createEnemyIcon = (enemy, isSelected) => {
  const threatInfo = THREAT_CLASSES[enemy.type] || { icon: "⚠️", color: "#ff0055" };
  const isDestroyed = enemy.status === "destroyed";
  const isAttacking = enemy.status === "attacking_base";
  const hpPct = Math.round((enemy.hp / enemy.maxHp) * 100);

  const html = `
    <div class="enemy-marker-wrapper ${isAttacking ? 'attacking' : ''} ${isSelected ? 'selected' : ''}">
      ${isAttacking ? `<div class="threat-attack-pulse"></div>` : ''}
      <div class="enemy-marker-body" style="border-color: ${isDestroyed ? '#64748b' : threatInfo.color}; background: ${isDestroyed ? '#1e293b' : 'rgba(15, 23, 42, 0.95)'};">
        <span class="threat-emoji">${isDestroyed ? '💀' : (enemy.visible ? threatInfo.icon : '❓')}</span>
      </div>
      ${!isDestroyed ? `
        <div class="enemy-hp-bar">
          <div class="enemy-hp-fill" style="width: ${hpPct}%; background: ${hpPct < 40 ? '#ff0055' : '#00ff9d'};"></div>
        </div>
      ` : ''}
    </div>
  `;

  return L.divIcon({
    html,
    className: "enemy-div-icon",
    iconSize: [36, 42],
    iconAnchor: [18, 21],
    popupAnchor: [0, -22],
  });
};

export const TacticalMap = () => {
  const {
    player,
    enemies,
    selectedEnemy,
    setSelectedEnemyId,
    projectiles,
    explosions,
    craters,
    selectedWeaponId,
    setSelectedWeaponId,
    ammo,
    cooldowns,
    fireWeapon
  } = useTactical();

  const selectedWeapon = ARSENAL_WEAPONS.find(w => w.id === selectedWeaponId) || ARSENAL_WEAPONS[0];

  return (
    <div className="hud-panel map-container">
      {/* Radar Overlay Header */}
      <div className="map-radar-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Crosshair size={15} className="animate-spin text-cyan-400" />
          <span>TACTICAL GROUND RADAR • SECTOR 36N</span>
        </div>
        <div className="radar-status-dot">
          <span className="dot"></span>
          <span>15 KM SENSORY SWEEP ACTIVE</span>
        </div>
      </div>

      <MapContainer
        center={[player.lat, player.lon]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Player Soldier Avatar Marker */}
        <Marker position={[player.lat, player.lon]} icon={createPlayerSoldierIcon()}>
          <Popup>
            <div style={{ fontFamily: "var(--font-mono)", padding: "4px" }}>
              <b style={{ color: "#00ff9d" }}>{player.callsign}</b>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Forward Base Command</div>
              <div style={{ fontSize: "0.75rem" }}>Health: <b>{player.hp}/{player.maxHealth} HP</b></div>
            </div>
          </Popup>
        </Marker>

        {/* Radar Sensory Range Circle & Perimeter Defense Zone */}
        <Circle
          center={[player.lat, player.lon]}
          radius={player.radarRadiusKm * 1000} // 15 km in meters
          pathOptions={{ color: "#00f3ff", weight: 1.5, dashArray: "4, 8", fillOpacity: 0.04 }}
        />
        <Circle
          center={[player.lat, player.lon]}
          radius={1200} // 1.2 km Danger Perimeter
          pathOptions={{ color: "#ff0055", weight: 2, dashArray: "2, 4", fillOpacity: 0.08 }}
        />

        {/* Residual Impact Craters */}
        {craters.map((crater) => (
          <Circle
            key={crater.id}
            center={[crater.lat, crater.lon]}
            radius={250}
            pathOptions={{ color: "#78350f", fillColor: "#000", fillOpacity: 0.4, weight: 1 }}
          />
        ))}

        {/* Active Explosion Blast Shockwaves */}
        {explosions.map((expl) => (
          <React.Fragment key={expl.id}>
            <Circle
              center={[expl.lat, expl.lon]}
              radius={expl.radius * 1000}
              pathOptions={{ color: "#ff0055", fillColor: "#ffb700", fillOpacity: 0.6, weight: 3 }}
            />
          </React.Fragment>
        ))}

        {/* Active In-flight Projectiles */}
        {projectiles.map((proj) => {
          const currentLat = proj.startPos.lat + (proj.targetPos.lat - proj.startPos.lat) * proj.progress;
          const currentLon = proj.startPos.lon + (proj.targetPos.lon - proj.startPos.lon) * proj.progress;

          return (
            <React.Fragment key={proj.id}>
              {/* Flight Line Vector */}
              <Polyline
                positions={[
                  [proj.startPos.lat, proj.startPos.lon],
                  [currentLat, currentLon]
                ]}
                pathOptions={{ color: "#00f3ff", weight: 3, dashArray: "2, 6" }}
              />
              {/* Projectile Icon */}
              <Marker
                position={[currentLat, currentLon]}
                icon={L.divIcon({
                  html: `<div class="projectile-sprite ${proj.weaponId}">💥</div>`,
                  className: "proj-div",
                  iconSize: [20, 20],
                  iconAnchor: [10, 10]
                })}
              />
            </React.Fragment>
          );
        })}

        {/* Hostile Threat Markers */}
        {enemies.map((enemy) => {
          const isSelected = selectedEnemy && selectedEnemy.id === enemy.id;
          const threatInfo = THREAT_CLASSES[enemy.type] || { name: "Hostile", points: 100 };

          return (
            <Marker
              key={enemy.id}
              position={[enemy.lat, enemy.lon]}
              icon={createEnemyIcon(enemy, isSelected)}
              eventHandlers={{
                click: () => {
                  soundEngine.playClick();
                  setSelectedEnemyId(enemy.id);
                }
              }}
            >
              <Popup>
                <div className="quick-strike-popup">
                  <div className="popup-header">
                    <span className="threat-tag">{threatInfo.name}</span>
                    <span className="threat-hp">{enemy.hp} / {enemy.maxHp} HP</span>
                  </div>
                  <div className="popup-body">
                    <div>Callsign: <b>{enemy.name}</b></div>
                    <div>Distance: <b>{enemy.distance ? enemy.distance.toFixed(1) : "?"} km</b></div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{threatInfo.description}</div>
                  </div>

                  {enemy.status !== "destroyed" && (
                    <div className="popup-actions">
                      <div style={{ fontSize: "0.75rem", color: "#00f3ff", marginBottom: "6px", fontFamily: "var(--font-mono)" }}>
                        ARMED: {selectedWeapon.name} ({ammo[selectedWeapon.id]} rnds)
                      </div>
                      <button
                        className="quick-fire-btn"
                        onClick={() => fireWeapon(enemy.lat, enemy.lon, enemy.id)}
                        disabled={cooldowns[selectedWeapon.id] > 0 || ammo[selectedWeapon.id] <= 0}
                      >
                        <Flame size={14} /> ENGAGE TARGET
                      </button>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
