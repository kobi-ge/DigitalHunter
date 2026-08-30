import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  PLAYER_SOLDIER,
  THREAT_CLASSES,
  ARSENAL_WEAPONS,
  INITIAL_GAME_ENEMIES,
  WAVE_DEFINITIONS,
  SIGNAL_TYPES
} from "../data/initialData";
import { haversineKm } from "../utils/haversine";
import { soundEngine } from "../utils/audio";

const TacticalContext = createContext(null);

export const TacticalProvider = ({ children }) => {
  // Player & Base State
  const [player, setPlayer] = useState({
    ...PLAYER_SOLDIER,
    hp: PLAYER_SOLDIER.maxHealth,
    score: 0,
    shotsFired: 0,
    shotsHit: 0,
    kills: 0,
  });

  // Current Game Wave
  const [currentWaveNum, setCurrentWaveNum] = useState(1);
  const [gameState, setGameState] = useState("playing"); // 'playing', 'wave_cleared', 'game_over', 'victory'

  // Enemies Collection
  const [enemies, setEnemies] = useState(INITIAL_GAME_ENEMIES);

  // Arsenal Ammo & Cooldowns
  const [selectedWeaponId, setSelectedWeaponId] = useState("sniper");
  const [ammo, setAmmo] = useState({
    sniper: ARSENAL_WEAPONS.find(w => w.id === "sniper").maxAmmo,
    drone: ARSENAL_WEAPONS.find(w => w.id === "drone").maxAmmo,
    mortar: ARSENAL_WEAPONS.find(w => w.id === "mortar").maxAmmo,
    cas: ARSENAL_WEAPONS.find(w => w.id === "cas").maxAmmo,
  });
  const [cooldowns, setCooldowns] = useState({
    sniper: 0,
    drone: 0,
    mortar: 0,
    cas: 0,
  });

  // Active Projectiles in flight
  const [projectiles, setProjectiles] = useState([]);

  // Active Explosions & Impact Craters on map
  const [explosions, setExplosions] = useState([]);
  const [craters, setCraters] = useState([]);

  // Live Intel Stream Signals
  const [signals, setSignals] = useState([]);

  // Vision Mode ('tactical' | 'nvg' | 'flir')
  const [visionMode, setVisionMode] = useState("tactical");

  // Selected Target on Map
  const [selectedEnemyId, setSelectedEnemyId] = useState(null);
  const [activeTab, setActiveTab] = useState("map"); // map, targetbank, telemetry, analytics

  // Resupply Cooldown
  const [resupplyCooldown, setResupplyCooldown] = useState(0);

  // Notifications
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString();
    setNotifications(prev => [{ id, message, type, time: new Date() }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  }, []);

  // Set Vision Mode with audio feedback
  const changeVisionMode = (mode) => {
    soundEngine.playOpticsSwitch();
    setVisionMode(mode);
    addNotification(`Optics switched to ${mode.toUpperCase()} mode`, "info");
  };

  // Cooldown countdown tick (every 100ms)
  useEffect(() => {
    const cdTimer = setInterval(() => {
      setCooldowns(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach(key => {
          if (next[key] > 0) {
            next[key] = Math.max(0, Math.round((next[key] - 0.1) * 10) / 10);
            changed = true;
          }
        });
        return changed ? next : prev;
      });

      setResupplyCooldown(prev => (prev > 0 ? Math.max(0, prev - 0.1) : 0));
    }, 100);

    return () => clearInterval(cdTimer);
  }, []);

  // Projectile Flight Animation Tick
  useEffect(() => {
    if (projectiles.length === 0) return;

    const projTimer = setInterval(() => {
      setProjectiles(prev => {
        const remaining = [];
        prev.forEach(p => {
          const newProgress = p.progress + p.speed;
          if (newProgress >= 1) {
            // Impact triggered!
            handleProjectileImpact(p);
          } else {
            remaining.push({ ...p, progress: newProgress });
          }
        });
        return remaining;
      });
    }, 50);

    return () => clearInterval(projTimer);
  }, [projectiles]);

  // Handle impact damage & visual effects
  const handleProjectileImpact = useCallback((proj) => {
    const weapon = ARSENAL_WEAPONS.find(w => w.id === proj.weaponId);
    const targetPos = proj.targetPos;

    // Trigger audio explosion
    if (proj.weaponId === "cas") {
      soundEngine.playExplosion(1.5);
    } else if (proj.weaponId === "mortar") {
      soundEngine.playExplosion(1.1);
    } else if (proj.weaponId === "drone") {
      soundEngine.playExplosion(0.9);
    } else {
      soundEngine.playSniperShot();
    }

    // Add explosion VFX
    const explId = Date.now() + Math.random().toString();
    setExplosions(prev => [
      ...prev,
      { id: explId, lat: targetPos.lat, lon: targetPos.lon, weaponId: proj.weaponId, radius: weapon.aoeRadiusKm || 0.4 }
    ]);
    setTimeout(() => {
      setExplosions(prev => prev.filter(e => e.id !== explId));
    }, 1200);

    // Add lasting crater
    setCraters(prev => [
      { id: explId, lat: targetPos.lat, lon: targetPos.lon, weaponId: proj.weaponId },
      ...prev.slice(0, 15)
    ]);

    // Apply damage to enemies in radius
    let hitCount = 0;
    setEnemies(prev => {
      return prev.map(enemy => {
        if (enemy.status === "destroyed") return enemy;

        const distToImpact = haversineKm(targetPos.lat, targetPos.lon, enemy.lat, enemy.lon);
        const effectiveRadius = (weapon.aoeRadiusKm || 0.3) + 0.2;

        if (distToImpact <= effectiveRadius) {
          hitCount++;
          // Calculate falloff damage
          const dmgFactor = Math.max(0.4, 1 - (distToImpact / effectiveRadius));
          const actualDmg = Math.round(weapon.damage * dmgFactor);
          const newHp = Math.max(0, enemy.hp - actualDmg);
          const isDestroyed = newHp === 0;

          if (isDestroyed) {
            const threatDef = THREAT_CLASSES[enemy.type] || { points: 100 };
            setPlayer(pl => ({
              ...pl,
              kills: pl.kills + 1,
              score: pl.score + threatDef.points,
              shotsHit: pl.shotsHit + 1,
            }));
            addNotification(`HOSTILE NEUTRALIZED: ${enemy.name} (${threatDef.name})`, "success");
          } else {
            setPlayer(pl => ({ ...pl, shotsHit: pl.shotsHit + 1 }));
            addNotification(`DIRECT HIT: ${enemy.name} took ${actualDmg} damage`, "warning");
          }

          return {
            ...enemy,
            hp: newHp,
            status: isDestroyed ? "destroyed" : "damaged",
            visible: true,
          };
        }
        return enemy;
      });
    });

    if (hitCount === 0) {
      addNotification("Splash negative — Target evaded blast zone", "info");
    }
  }, [addNotification]);

  // Main Enemy Mobility & Combat Loop (Runs every 1000ms)
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = setInterval(() => {
      setEnemies(prev => {
        let baseDamageThisTick = 0;

        const updated = prev.map(enemy => {
          if (enemy.status === "destroyed") return enemy;

          // Compute distance to player soldier
          const distToPlayer = haversineKm(player.lat, player.lon, enemy.lat, enemy.lon);

          // If close to base (< 1.2 km), attack player base!
          if (distToPlayer <= 1.2) {
            baseDamageThisTick += enemy.type === "rocket_launcher" ? 20 : (enemy.type === "technical_vehicle" ? 12 : 6);
            soundEngine.playPerimeterAlert();
            return {
              ...enemy,
              status: "attacking_base",
              visible: true
            };
          }

          // Move enemy closer to player base coordinates
          const dLat = player.lat - enemy.lat;
          const dLon = player.lon - enemy.lon;
          const angle = Math.atan2(dLon, dLat);

          // Add slight erratic movement for motorcycles / foot patrols
          const erratic = (enemy.type === "motorcycle" || enemy.type === "foot_squad") ? (Math.random() - 0.5) * 0.4 : 0;
          const stepSize = enemy.type === "motorcycle" ? 0.0018 : (enemy.type === "technical_vehicle" ? 0.0012 : (enemy.type === "sniper_nest" ? 0 : 0.0007));

          const newLat = enemy.lat + Math.cos(angle + erratic) * stepSize;
          const newLon = enemy.lon + Math.sin(angle + erratic) * stepSize;

          // Check if enemy is within radar radius (15km)
          const newDist = haversineKm(player.lat, player.lon, newLat, newLon);
          const isWithinRadar = newDist <= player.radarRadiusKm;

          return {
            ...enemy,
            lat: newLat,
            lon: newLon,
            distance: newDist,
            visible: isWithinRadar || enemy.visible
          };
        });

        // Apply Base Damage if attacked
        if (baseDamageThisTick > 0) {
          setPlayer(p => {
            const nextHp = Math.max(0, p.hp - baseDamageThisTick);
            if (nextHp === 0) {
              setGameState("game_over");
              addNotification("CRITICAL BASE BREACH: FORWARD BASE COMPROMISED!", "danger");
            }
            return { ...p, hp: nextHp };
          });
        }

        // Check if all enemies in wave are destroyed
        const activeEnemies = updated.filter(e => e.status !== "destroyed");
        if (activeEnemies.length === 0 && updated.length > 0) {
          if (currentWaveNum >= 5) {
            setGameState("victory");
            addNotification("MISSION ACCOMPLISHED: All Sector Hostiles Neutralized!", "success");
          } else {
            setGameState("wave_cleared");
            addNotification(`WAVE ${currentWaveNum} CLEARED! Prepare for next threat escalation.`, "success");
          }
        }

        return updated;
      });
    }, 1200);

    return () => clearInterval(gameLoop);
  }, [gameState, player.lat, player.lon, player.radarRadiusKm, currentWaveNum, addNotification]);

  // Periodic Random Intel Signals (Kafka simulated telemetry)
  useEffect(() => {
    if (gameState !== "playing") return;

    const intelTimer = setInterval(() => {
      const activeEnemies = enemies.filter(e => e.status !== "destroyed");
      if (activeEnemies.length === 0) return;

      const randomTarget = activeEnemies[Math.floor(Math.random() * activeEnemies.length)];
      const signalType = SIGNAL_TYPES[Math.floor(Math.random() * SIGNAL_TYPES.length)];

      const newSig = {
        signal_id: `sig-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
        entity_id: randomTarget.id,
        target_name: randomTarget.name,
        reported_lat: randomTarget.lat + (Math.random() - 0.5) * 0.004,
        reported_lon: randomTarget.lon + (Math.random() - 0.5) * 0.004,
        signal_type: signalType.id,
        threat_class: randomTarget.type
      };

      soundEngine.playSignalPing();
      setSignals(prev => [newSig, ...prev.slice(0, 39)]);

      // VISINT reveals exact target visibility
      if (signalType.id === "VISINT") {
        setEnemies(prev => prev.map(e => e.id === randomTarget.id ? { ...e, visible: true } : e));
      }
    }, 3500);

    return () => clearInterval(intelTimer);
  }, [gameState, enemies]);

  // Fire Weapon Action
  const fireWeapon = useCallback((targetLat, targetLon, enemyId = null) => {
    const weapon = ARSENAL_WEAPONS.find(w => w.id === selectedWeaponId);
    if (!weapon) return false;

    // Check ammo
    if (ammo[selectedWeaponId] <= 0) {
      soundEngine.playBeep(400, 0.2);
      addNotification(`AMMO DEPLETED: No ${weapon.name} remaining! Call resupply.`, "warning");
      return false;
    }

    // Check cooldown
    if (cooldowns[selectedWeaponId] > 0) {
      soundEngine.playBeep(500, 0.1);
      addNotification(`${weapon.name} cooling down (${cooldowns[selectedWeaponId]}s)`, "info");
      return false;
    }

    // Deduct ammo & set cooldown
    setAmmo(prev => ({ ...prev, [selectedWeaponId]: prev[selectedWeaponId] - 1 }));
    setCooldowns(prev => ({ ...prev, [selectedWeaponId]: weapon.cooldownSec }));
    setPlayer(p => ({ ...p, shotsFired: p.shotsFired + 1 }));

    // Play launch sound
    if (weapon.sound === "cas") soundEngine.playCasLaunch();
    else if (weapon.sound === "mortar") soundEngine.playMortarLaunch();
    else if (weapon.sound === "drone") soundEngine.playDroneLaunch();
    else soundEngine.playSniperShot();

    // Create projectile flight animation
    const projId = Date.now() + Math.random().toString();
    const flightSpeed = 1 / (weapon.travelTimeSec * 20); // ticks

    setProjectiles(prev => [
      ...prev,
      {
        id: projId,
        weaponId: selectedWeaponId,
        startPos: { lat: player.lat, lon: player.lon },
        targetPos: { lat: targetLat, lon: targetLon },
        targetEnemyId: enemyId,
        progress: 0,
        speed: flightSpeed
      }
    ]);

    addNotification(`ORDNANCE DISPATCHED: ${weapon.name} inbound to target sector`, "warning");
    return true;
  }, [selectedWeaponId, ammo, cooldowns, player.lat, player.lon, addNotification]);

  // Call Ammo Resupply Airdrop
  const callResupply = useCallback(() => {
    if (resupplyCooldown > 0) {
      addNotification(`Resupply transport inbound (${Math.round(resupplyCooldown)}s remaining)`, "info");
      return;
    }

    soundEngine.playResupply();
    setAmmo({
      sniper: ARSENAL_WEAPONS.find(w => w.id === "sniper").maxAmmo,
      drone: ARSENAL_WEAPONS.find(w => w.id === "drone").maxAmmo,
      mortar: ARSENAL_WEAPONS.find(w => w.id === "mortar").maxAmmo,
      cas: ARSENAL_WEAPONS.find(w => w.id === "cas").maxAmmo,
    });
    setResupplyCooldown(25.0);
    addNotification("AIRDROP RESUPPLY RECEIVED: All munitions restocked!", "success");
  }, [resupplyCooldown, addNotification]);

  // Start Next Wave
  const startNextWave = useCallback(() => {
    const nextWaveNum = currentWaveNum + 1;
    const waveDef = WAVE_DEFINITIONS.find(w => w.waveNumber === nextWaveNum) || WAVE_DEFINITIONS[WAVE_DEFINITIONS.length - 1];

    setCurrentWaveNum(nextWaveNum);
    setGameState("playing");

    // Spawn new wave enemies
    const newEnemies = [];
    for (let i = 0; i < waveDef.enemyCount; i++) {
      const type = waveDef.types[i % waveDef.types.length];
      const threatInfo = THREAT_CLASSES[type];

      // Spawn in perimeter around base (10 - 22 km out)
      const angle = (i / waveDef.enemyCount) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
      const radiusKm = 12 + Math.random() * 8;
      const latOffset = (radiusKm / 111) * Math.cos(angle);
      const lonOffset = (radiusKm / (111 * Math.cos(player.lat * Math.PI / 180))) * Math.sin(angle);

      newEnemies.push({
        id: `THREAT-W${nextWaveNum}-${(i + 1).toString().padStart(2, "0")}`,
        name: `${threatInfo.name} #${i + 1}`,
        type: type,
        lat: player.lat + latOffset,
        lon: player.lon + lonOffset,
        hp: threatInfo.maxHp,
        maxHp: threatInfo.maxHp,
        status: "active",
        visible: false,
        signalType: ["SIGINT", "VISINT", "HUMINT"][i % 3]
      });
    }

    setEnemies(newEnemies);
    soundEngine.playAlert();
    addNotification(`WAVE ${nextWaveNum} INITIATED: ${waveDef.name}`, "danger");
  }, [currentWaveNum, player.lat, player.lon, addNotification]);

  // Restart Mission
  const restartGame = useCallback(() => {
    setPlayer({
      ...PLAYER_SOLDIER,
      hp: PLAYER_SOLDIER.maxHealth,
      score: 0,
      shotsFired: 0,
      shotsHit: 0,
      kills: 0
    });
    setCurrentWaveNum(1);
    setAmmo({
      sniper: ARSENAL_WEAPONS.find(w => w.id === "sniper").maxAmmo,
      drone: ARSENAL_WEAPONS.find(w => w.id === "drone").maxAmmo,
      mortar: ARSENAL_WEAPONS.find(w => w.id === "mortar").maxAmmo,
      cas: ARSENAL_WEAPONS.find(w => w.id === "cas").maxAmmo,
    });
    setCooldowns({ sniper: 0, drone: 0, mortar: 0, cas: 0 });
    setEnemies(INITIAL_GAME_ENEMIES);
    setProjectiles([]);
    setExplosions([]);
    setGameState("playing");
    addNotification("SIMULATION RESTARTED: Ready for engagement", "info");
  }, [addNotification]);

  const selectedEnemy = enemies.find(e => e.id === selectedEnemyId) || enemies.find(e => e.status !== "destroyed") || enemies[0];

  return (
    <TacticalContext.Provider value={{
      player,
      enemies,
      selectedEnemy,
      selectedEnemyId,
      setSelectedEnemyId,
      currentWaveNum,
      gameState,
      setGameState,
      ammo,
      cooldowns,
      selectedWeaponId,
      setSelectedWeaponId,
      projectiles,
      explosions,
      craters,
      signals,
      visionMode,
      changeVisionMode,
      resupplyCooldown,
      callResupply,
      fireWeapon,
      startNextWave,
      restartGame,
      activeTab,
      setActiveTab,
      notifications,
      addNotification,
      baseHQ: { name: "Forward Soldier Post", lat: player.lat, lon: player.lon }
    }}>
      {children}
    </TacticalContext.Provider>
  );
};

export const useTactical = () => {
  const context = useContext(TacticalContext);
  if (!context) {
    throw new Error("useTactical must be used within TacticalProvider");
  }
  return context;
};
