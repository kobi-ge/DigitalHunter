import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTactical } from "../context/TacticalContext";
import { soundEngine } from "../utils/audio";
import { Flame, ShieldAlert, Crosshair, MapPin } from "lucide-react";

// Fix standard Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to dynamically re-center map when target selected
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
};

// Create custom tactical div icon for target
const createTargetIcon = (target, isSelected) => {
  const getPriorityColor = (p) => {
    switch (p) {
      case 1: return "#ff0055"; // P1 Red
      case 2: return "#ff7700"; // P2 Orange
      case 3: return "#ffb700"; // P3 Yellow
      case 4: return "#00f3ff"; // P4 Cyan
      default: return "#64748b"; // P5 Gray
    }
  };

  const color = target.status === "destroyed" ? "#475569" : getPriorityColor(target.priority_level);
  const isP1 = target.priority_level === 1 && target.status !== "destroyed";

  const html = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
    ">
      ${isP1 ? `<div style="
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 2px solid ${color};
        animation: pulseRing 1.5s infinite ease-out;
      "></div>` : ""}
      <div style="
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: rgba(8, 13, 24, 0.9);
        border: 2px solid ${color};
        box-shadow: 0 0 ${isSelected ? "15px" : "8px"} ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-family: var(--font-mono);
        font-size: 10px;
        font-weight: bold;
        transform: scale(${isSelected ? 1.25 : 1});
        transition: transform 0.2s ease;
      ">
        ${target.status === "destroyed" ? "✕" : `P${target.priority_level}`}
      </div>
    </div>
  `;

  return L.divAnchor ? L.divIcon({
    html,
    className: "tactical-marker-div",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  }) : L.divIcon({
    html,
    className: "tactical-marker-div",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

// Create custom icon for HQ Command
const createHQIcon = () => {
  const html = `
    <div style="
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(0, 243, 255, 0.2);
      border: 2px solid #00f3ff;
      box-shadow: 0 0 15px #00f3ff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00f3ff;
      font-weight: bold;
      font-size: 12px;
    ">
      HQ
    </div>
  `;
  return L.divIcon({
    html,
    className: "hq-marker-div",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export const TacticalMap = () => {
  const {
    targets,
    selectedTarget,
    setSelectedTargetId,
    setStrikeTarget,
    baseHQ
  } = useTactical();

  const centerPos = [31.90, 35.00];

  return (
    <div className="hud-panel map-container">
      {/* Dark Tactical Layer Overlay Header */}
      <div style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 500,
        background: "rgba(9, 13, 24, 0.85)",
        backdropFilter: "blur(8px)",
        padding: "6px 14px",
        borderRadius: "6px",
        border: "1px solid rgba(0, 243, 255, 0.2)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        color: "var(--accent-cyan)",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <Crosshair size={14} className="animate-spin" />
        TACTICAL GIS RADAR • ZONE 36N
      </div>

      <MapContainer
        center={centerPos}
        zoom={9}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <MapRecenter center={selectedTarget ? [selectedTarget.lat, selectedTarget.lon] : null} />

        {/* CartoDB Dark Matter Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Base HQ Command Marker & Defense Ranges */}
        <Marker position={[baseHQ.lat, baseHQ.lon]} icon={createHQIcon()}>
          <Popup>
            <div style={{ padding: "4px", fontFamily: "var(--font-mono)" }}>
              <div style={{ fontWeight: "bold", color: "#00f3ff" }}>{baseHQ.name}</div>
              <div style={{ fontSize: "0.8rem" }}>Lat: {baseHQ.lat}, Lon: {baseHQ.lon}</div>
            </div>
          </Popup>
        </Marker>
        <Circle
          center={[baseHQ.lat, baseHQ.lon]}
          radius={50000} // 50 km range
          pathOptions={{ color: "#00f3ff", weight: 1, dashArray: "4, 6", fillOpacity: 0.03 }}
        />
        <Circle
          center={[baseHQ.lat, baseHQ.lon]}
          radius={100000} // 100 km range
          pathOptions={{ color: "#a855f7", weight: 1, dashArray: "2, 8", fillOpacity: 0.02 }}
        />

        {/* Target Entity Markers & Lines to HQ */}
        {targets.map(target => {
          const isSelected = selectedTarget && selectedTarget.entity_id === target.entity_id;
          return (
            <React.Fragment key={target.entity_id}>
              {/* Optional trajectory vector trail */}
              {target.history && target.history.length > 1 && (
                <Polyline
                  positions={target.history.map(h => [h.lat, h.lon])}
                  pathOptions={{ color: target.priority_level === 1 ? "#ff0055" : "#00f3ff", weight: 2, opacity: 0.5, dashArray: "3, 3" }}
                />
              )}

              <Marker
                position={[target.lat, target.lon]}
                icon={createTargetIcon(target, isSelected)}
                eventHandlers={{
                  click: () => {
                    soundEngine.playClick();
                    setSelectedTargetId(target.entity_id);
                  }
                }}
              >
                <Popup>
                  <div style={{ padding: "6px", fontFamily: "var(--font-mono)", color: "#1e293b", minWidth: "180px" }}>
                    <div style={{ fontWeight: "bold", fontSize: "0.95rem", display: "flex", justifyContent: "space-between" }}>
                      <span>{target.name}</span>
                      <span style={{ color: target.priority_level === 1 ? "#dc2626" : "#2563eb" }}>P{target.priority_level}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", margin: "4px 0" }}>
                      ID: <b>{target.entity_id}</b> ({target.type})
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#334155" }}>
                      Coords: {target.lat.toFixed(4)}, {target.lon.toFixed(4)}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#334155" }}>
                      Distance: <b>{target.distance} km</b>
                    </div>
                    <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => {
                          setSelectedTargetId(target.entity_id);
                        }}
                        style={{
                          flex: 1,
                          padding: "4px 8px",
                          background: "#0284c7",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.75rem"
                        }}
                      >
                        Inspect
                      </button>
                      {target.status !== "destroyed" && (
                        <button
                          onClick={() => setStrikeTarget(target)}
                          style={{
                            flex: 1,
                            padding: "4px 8px",
                            background: "#dc2626",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          Strike
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};
