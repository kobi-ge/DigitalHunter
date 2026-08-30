import React, { useEffect } from "react";
import { useTactical } from "../context/TacticalContext";
import { ARSENAL_WEAPONS } from "../data/initialData";
import { soundEngine } from "../utils/audio";
import {
  Shield,
  Heart,
  Target,
  Crosshair,
  Package,
  Eye,
  Flame,
  Zap,
  Radio,
  Clock,
  Sparkles
} from "lucide-react";

export const CombatHUD = () => {
  const {
    player,
    enemies,
    currentWaveNum,
    ammo,
    cooldowns,
    selectedWeaponId,
    setSelectedWeaponId,
    visionMode,
    changeVisionMode,
    resupplyCooldown,
    callResupply,
    selectedEnemy,
    fireWeapon
  } = useTactical();

  // Keyboard shortcut listener for weapon selection & fire
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "1") {
        soundEngine.playClick();
        setSelectedWeaponId("sniper");
      } else if (e.key === "2") {
        soundEngine.playClick();
        setSelectedWeaponId("drone");
      } else if (e.key === "3") {
        soundEngine.playClick();
        setSelectedWeaponId("mortar");
      } else if (e.key === "4") {
        soundEngine.playClick();
        setSelectedWeaponId("cas");
      } else if (e.key.toLowerCase() === "r") {
        callResupply();
      } else if (e.key.toLowerCase() === "n") {
        changeVisionMode(visionMode === "nvg" ? "tactical" : "nvg");
      } else if (e.key.toLowerCase() === "t") {
        changeVisionMode(visionMode === "flir" ? "tactical" : "flir");
      } else if (e.key === " " || e.key === "Enter") {
        // Quick strike targeted enemy
        if (selectedEnemy && selectedEnemy.status !== "destroyed") {
          fireWeapon(selectedEnemy.lat, selectedEnemy.lon, selectedEnemy.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEnemy, visionMode, setSelectedWeaponId, callResupply, changeVisionMode, fireWeapon]);

  const activeEnemies = enemies.filter(e => e.status !== "destroyed");
  const accuracyPct = player.shotsFired > 0 ? Math.round((player.shotsHit / player.shotsFired) * 100) : 100;
  const hpPct = Math.max(0, Math.round((player.hp / player.maxHealth) * 100));

  return (
    <div className="combat-hud-container">
      {/* Top Combat Status Header */}
      <div className="combat-status-bar hud-panel">
        {/* Base Health / Integrity */}
        <div className="hud-metric-group">
          <div className="hud-metric-header">
            <Shield size={16} className="text-cyan-400" />
            <span>BASE INTEGRITY</span>
            <span style={{ fontWeight: "bold", color: hpPct < 35 ? "var(--accent-crimson)" : "var(--accent-emerald)" }}>
              {player.hp} / {player.maxHealth} HP
            </span>
          </div>
          <div className="health-bar-track">
            <div
              className={`health-bar-fill ${hpPct < 35 ? "critical" : ""}`}
              style={{ width: `${hpPct}%` }}
            ></div>
          </div>
        </div>

        {/* Wave & Threat Counter */}
        <div className="hud-metric-group">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="wave-badge">WAVE {currentWaveNum} / 5</div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>ACTIVE THREATS</div>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--accent-crimson)", fontFamily: "var(--font-mono)" }}>
                {activeEnemies.length} HOSTILES
              </div>
            </div>
          </div>
        </div>

        {/* Score & Combat Accuracy */}
        <div className="hud-metric-group">
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>SCORE</div>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--accent-amber)", fontFamily: "var(--font-mono)" }}>
                {player.score.toLocaleString()} PTS
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>ACCURACY</div>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>
                {accuracyPct}% ({player.kills} KILLS)
              </div>
            </div>
          </div>
        </div>

        {/* Vision Optic Filters */}
        <div className="vision-mode-selector">
          <button
            className={`vision-btn ${visionMode === "tactical" ? "active" : ""}`}
            onClick={() => changeVisionMode("tactical")}
            title="Standard Tactical Display"
          >
            <Eye size={14} /> TACTICAL
          </button>
          <button
            className={`vision-btn nvg ${visionMode === "nvg" ? "active" : ""}`}
            onClick={() => changeVisionMode("nvg")}
            title="Night Vision Goggles (Key: N)"
          >
            <Sparkles size={14} /> NVG (N)
          </button>
          <button
            className={`vision-btn flir ${visionMode === "flir" ? "active" : ""}`}
            onClick={() => changeVisionMode("flir")}
            title="FLIR Thermal White-Hot (Key: T)"
          >
            <Flame size={14} /> FLIR (T)
          </button>
        </div>
      </div>

      {/* Bottom Arsenal Hotbar */}
      <div className="arsenal-hotbar hud-panel">
        <div className="weapons-grid">
          {ARSENAL_WEAPONS.map((weapon) => {
            const isSelected = selectedWeaponId === weapon.id;
            const currentAmmo = ammo[weapon.id] || 0;
            const currentCd = cooldowns[weapon.id] || 0;
            const isCoolingDown = currentCd > 0;
            const isDepleted = currentAmmo === 0;

            return (
              <div
                key={weapon.id}
                className={`weapon-slot ${isSelected ? "selected" : ""} ${isDepleted ? "depleted" : ""}`}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedWeaponId(weapon.id);
                }}
              >
                {/* Hotkey Badge */}
                <div className="hotkey-badge">[{weapon.key}]</div>

                <div className="weapon-icon-area">
                  <span className="weapon-icon">{weapon.icon}</span>
                  <div className="weapon-info">
                    <div className="weapon-title">{weapon.name}</div>
                    <div className="weapon-cat">{weapon.category}</div>
                  </div>
                </div>

                <div className="weapon-stats-row">
                  <div className="ammo-count">
                    <span>AMMO:</span>
                    <b style={{ color: currentAmmo <= 2 ? "var(--accent-crimson)" : "var(--accent-emerald)" }}>
                      {currentAmmo} / {weapon.maxAmmo}
                    </b>
                  </div>
                  <div className="dmg-badge">{weapon.damage} DMG</div>
                </div>

                {/* Cooldown Overlay Animation */}
                {isCoolingDown && (
                  <div className="cooldown-overlay">
                    <Clock size={16} className="animate-spin" />
                    <span>{currentCd}s</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Resupply Button */}
        <button
          className={`resupply-btn ${resupplyCooldown > 0 ? "cooling" : ""}`}
          onClick={callResupply}
          disabled={resupplyCooldown > 0}
          title="Call Aerial Munition Resupply Drop (Key: R)"
        >
          <Package size={20} />
          <div>
            <div style={{ fontWeight: "bold", fontSize: "0.85rem" }}>AIRDROP RESUPPLY (R)</div>
            <div style={{ fontSize: "0.7rem", opacity: 0.8 }}>
              {resupplyCooldown > 0 ? `Inbound in ${Math.round(resupplyCooldown)}s` : "READY FOR DROP"}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
