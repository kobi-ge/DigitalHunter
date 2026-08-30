import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  INITIAL_TARGET_BANK,
  INITIAL_INTEL_SIGNALS,
  INITIAL_ATTACKS,
  INITIAL_DAMAGE_REPORTS,
  SIGNAL_TYPES,
  WEAPON_TYPES
} from "../data/initialData";
import { haversineKm, BASE_HQ } from "../utils/haversine";
import { soundEngine } from "../utils/audio";

const TacticalContext = createContext(null);

export const TacticalProvider = ({ children }) => {
  // Target Bank State
  const [targets, setTargets] = useState(() => {
    return INITIAL_TARGET_BANK.map(t => ({
      ...t,
      distance: haversineKm(BASE_HQ.lat, BASE_HQ.lon, t.lat, t.lon),
      lastSignalTime: new Date().toISOString(),
      signalCount: 1,
      history: [{ lat: t.lat, lon: t.lon, timestamp: new Date().toISOString() }]
    }));
  });

  // Telemetry Signals State
  const [signals, setSignals] = useState(INITIAL_INTEL_SIGNALS);

  // Attack Operations & Damage Reports State
  const [attacks, setAttacks] = useState(INITIAL_ATTACKS);
  const [damageReports, setDamageReports] = useState(INITIAL_DAMAGE_REPORTS);

  // Selected Target for Detailed Drawer/Modal
  const [selectedTargetId, setSelectedTargetId] = useState("TGT-001");
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, map, targetbank, telemetry, strikes, analytics

  // Simulation Controls
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 5x
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Strike Modal target state
  const [strikeTarget, setStrikeTarget] = useState(null);
  const [isAddTargetModalOpen, setIsAddTargetModalOpen] = useState(false);

  // Notification Toast System
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString();
    setNotifications(prev => [{ id, message, type, time: new Date() }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  // Dispatch Strike action
  const dispatchStrike = useCallback((targetId, weaponType) => {
    const attackId = `atk-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-2)}`;
    const newAttack = {
      attack_id: attackId,
      timestamp: new Date().toISOString(),
      entity_id: targetId,
      weapon_type: weaponType,
      status: "in_flight"
    };

    soundEngine.playStrikeLaunch();
    setAttacks(prev => [newAttack, ...prev]);

    // Update target status to pending strike / targeted
    setTargets(prev => prev.map(t => {
      if (t.entity_id === targetId) {
        return { ...t, status: t.status === "destroyed" ? "destroyed" : "strike_pending" };
      }
      return t;
    }));

    addNotification(`Strike dispatched against ${targetId} using ${weaponType}`, "warning");

    // Auto simulate damage assessment after 3.5 seconds
    setTimeout(() => {
      const results = ["destroyed", "damaged", "damaged", "no_damage"];
      const chosenResult = results[Math.floor(Math.random() * results.length)];

      const newDamageReport = {
        id: Date.now(),
        attack_id: attackId,
        entity_id: targetId,
        result: chosenResult,
        timestamp: new Date().toISOString(),
        assessedBy: "Satellite BDA Automation"
      };

      setDamageReports(prev => [newDamageReport, ...prev]);
      setAttacks(prev => prev.map(a => a.attack_id === attackId ? { ...a, status: "completed" } : a));

      // Update target entity status
      setTargets(prev => prev.map(t => {
        if (t.entity_id === targetId) {
          const finalStatus = chosenResult === "destroyed" ? "destroyed" : (chosenResult === "damaged" ? "damaged" : "active");
          return { ...t, status: finalStatus };
        }
        return t;
      }));

      if (chosenResult === "destroyed") {
        soundEngine.playAlert();
        addNotification(`TARGET NEUTRALIZED: ${targetId} destroyed!`, "danger");
      } else {
        soundEngine.playBeep(900, 0.1);
        addNotification(`BDA Result for ${targetId}: ${chosenResult.toUpperCase()}`, chosenResult === "damaged" ? "warning" : "info");
      }
    }, 3500);

  }, [addNotification]);

  // Add target manually
  const addNewTarget = useCallback((newTargetData) => {
    const distance = haversineKm(BASE_HQ.lat, BASE_HQ.lon, newTargetData.lat, newTargetData.lon);
    const targetObj = {
      ...newTargetData,
      distance,
      lastSignalTime: new Date().toISOString(),
      signalCount: 1,
      history: [{ lat: newTargetData.lat, lon: newTargetData.lon, timestamp: new Date().toISOString() }]
    };

    setTargets(prev => [targetObj, ...prev]);
    setSelectedTargetId(newTargetData.entity_id);
    addNotification(`New entity ${newTargetData.entity_id} added to Targets Bank`, "success");
    soundEngine.playClick();
  }, [addNotification]);

  // Telemetry simulation loop (simulates incoming Kafka signals)
  useEffect(() => {
    if (!isSimulating) return;

    const intervalMs = (4000 / simSpeed);
    const timer = setInterval(() => {
      // Pick random active target
      const activeTargets = targets.filter(t => t.status !== "destroyed");
      if (activeTargets.length === 0) return;

      const randomTarget = activeTargets[Math.floor(Math.random() * activeTargets.length)];
      const signalTypeObj = SIGNAL_TYPES[Math.floor(Math.random() * SIGNAL_TYPES.length)];

      // Jitter coordinates slightly
      const jitterLat = randomTarget.lat + (Math.random() - 0.5) * 0.008;
      const jitterLon = randomTarget.lon + (Math.random() - 0.5) * 0.008;
      const roundedLat = Math.round(jitterLat * 10000) / 10000;
      const roundedLon = Math.round(jitterLon * 10000) / 10000;

      const signalId = `sig-${Math.random().toString(36).substring(2, 7)}-${Math.random().toString(36).substring(2, 6)}`;
      const timestamp = new Date().toISOString();

      const newSignal = {
        signal_id: signalId,
        timestamp,
        entity_id: randomTarget.entity_id,
        reported_lat: roundedLat,
        reported_lon: roundedLon,
        signal_type: signalTypeObj.id,
        priority_level: randomTarget.priority_level,
        source: `Kafka / ${signalTypeObj.id}_STREAM`
      };

      soundEngine.playSignalPing();

      setSignals(prev => [newSignal, ...prev.slice(0, 49)]); // Keep last 50 signals

      // Update target location & history
      setTargets(prev => prev.map(t => {
        if (t.entity_id === randomTarget.entity_id) {
          const newDist = haversineKm(BASE_HQ.lat, BASE_HQ.lon, roundedLat, roundedLon);
          const updatedHistory = [{ lat: roundedLat, lon: roundedLon, timestamp }, ...(t.history || []).slice(0, 9)];
          return {
            ...t,
            lat: roundedLat,
            lon: roundedLon,
            distance: newDist,
            lastSignalTime: timestamp,
            signalCount: (t.signalCount || 1) + 1,
            history: updatedHistory
          };
        }
        return t;
      }));

    }, intervalMs);

    return () => clearInterval(timer);
  }, [isSimulating, simSpeed, targets]);

  const toggleSound = () => {
    const newState = soundEngine.toggleSound();
    setSoundEnabled(newState);
  };

  const selectedTarget = targets.find(t => t.entity_id === selectedTargetId) || targets[0];

  return (
    <TacticalContext.Provider value={{
      targets,
      signals,
      attacks,
      damageReports,
      selectedTarget,
      selectedTargetId,
      setSelectedTargetId,
      activeTab,
      setActiveTab,
      isSimulating,
      setIsSimulating,
      simSpeed,
      setSimSpeed,
      soundEnabled,
      toggleSound,
      dispatchStrike,
      strikeTarget,
      setStrikeTarget,
      isAddTargetModalOpen,
      setIsAddTargetModalOpen,
      addNewTarget,
      notifications,
      addNotification,
      baseHQ: BASE_HQ
    }}>
      {children}
    </TacticalContext.Provider>
  );
};

export const useTactical = () => {
  const context = useContext(TacticalContext);
  if (!context) {
    throw new Error("useTactical must be used within a TacticalProvider");
  }
  return context;
};
