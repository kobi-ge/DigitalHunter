export const INITIAL_TARGET_BANK = [
  { entity_id: "TGT-001", name: "Convoy Alpha", type: "mobile_vehicle", lat: 31.52, lon: 34.45, priority_level: 1, status: "active" },
  { entity_id: "TGT-002", name: "Depot Bravo", type: "infrastructure", lat: 31.78, lon: 34.63, priority_level: 2, status: "active" },
  { entity_id: "TGT-003", name: "Squad Charlie", type: "human_squad", lat: 32.05, lon: 34.78, priority_level: 1, status: "active" },
  { entity_id: "TGT-004", name: "Launcher Delta", type: "launcher", lat: 31.90, lon: 35.20, priority_level: 1, status: "active" },
  { entity_id: "TGT-005", name: "Transport Echo", type: "mobile_vehicle", lat: 32.30, lon: 35.50, priority_level: 3, status: "active" },
  { entity_id: "TGT-006", name: "Bunker Foxtrot", type: "infrastructure", lat: 31.65, lon: 34.35, priority_level: 2, status: "active" },
  { entity_id: "TGT-007", name: "Patrol Golf", type: "human_squad", lat: 32.45, lon: 35.10, priority_level: 4, status: "active" },
  { entity_id: "TGT-008", name: "Launcher Hotel", type: "launcher", lat: 31.40, lon: 34.90, priority_level: 1, status: "active" },
  { entity_id: "TGT-009", name: "Rover India", type: "mobile_vehicle", lat: 32.10, lon: 35.80, priority_level: 5, status: "active" },
  { entity_id: "TGT-010", name: "Outpost Juliet", type: "infrastructure", lat: 31.85, lon: 34.55, priority_level: 3, status: "active" },
  { entity_id: "TGT-011", name: "Squad Kilo", type: "human_squad", lat: 32.60, lon: 35.30, priority_level: 2, status: "active" },
  { entity_id: "TGT-012", name: "Launcher Lima", type: "launcher", lat: 31.55, lon: 35.65, priority_level: 1, status: "active" },
  { entity_id: "TGT-013", name: "Jeep Mike", type: "mobile_vehicle", lat: 32.25, lon: 34.80, priority_level: 4, status: "active" },
  { entity_id: "TGT-014", name: "Compound November", type: "infrastructure", lat: 31.70, lon: 35.40, priority_level: 3, status: "active" },
  { entity_id: "TGT-015", name: "Squad Oscar", type: "human_squad", lat: 32.00, lon: 35.00, priority_level: 2, status: "active" },
];

export const SIGNAL_TYPES = [
  { id: "SIGINT", name: "Signals Intelligence", color: "#a855f7" },
  { id: "VISINT", name: "Visual Intelligence", color: "#00f3ff" },
  { id: "HUMINT", name: "Human Intelligence", color: "#ffb700" },
];

export const WEAPON_TYPES = [
  { id: "AGM-114 Hellfire", category: "Air-to-Surface Missile", range: "11 km", payload: "8 kg Tandem High Explosive", precision: "0.5m CEP", suitableFor: ["mobile_vehicle", "human_squad"] },
  { id: "GBU-39 SDB", category: "Small Diameter Bomb", range: "110 km", payload: "93 kg Penetration/Blast", precision: "1.0m CEP", suitableFor: ["infrastructure", "bunker", "launcher"] },
  { id: "Delilah Missile", category: "Stand-off Cruise Missile", range: "250 km", payload: "30 kg High Explosive", precision: "1.0m CEP", suitableFor: ["launcher", "infrastructure"] },
  { id: "SPICE-250", category: "Autonomous Precision Bomb", range: "100 km", payload: "113 kg Smart Warhead", precision: "3.0m CEP", suitableFor: ["infrastructure", "mobile_vehicle"] },
  { id: "Popeye AGM", category: "Heavy Stand-off Missile", range: "78 km", payload: "340 kg Penetration", precision: "2.0m CEP", suitableFor: ["bunker", "infrastructure"] },
  { id: "Griffin LGM", category: "Miniature Laser Bomb", range: "6 km", payload: "5.9 kg Micro Blast", precision: "0.2m CEP", suitableFor: ["human_squad", "mobile_vehicle"] },
];

export const INITIAL_INTEL_SIGNALS = [
  {
    signal_id: "sig-9021a-412f",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    entity_id: "TGT-001",
    reported_lat: 31.5204,
    reported_lon: 34.4512,
    signal_type: "SIGINT",
    priority_level: 1,
    source: "Kafka / Consumer-1"
  },
  {
    signal_id: "sig-8812c-091a",
    timestamp: new Date(Date.now() - 90000).toISOString(),
    entity_id: "TGT-004",
    reported_lat: 31.9015,
    reported_lon: 35.2008,
    signal_type: "VISINT",
    priority_level: 1,
    source: "Recon Drone / Optics"
  },
  {
    signal_id: "sig-1193d-772b",
    timestamp: new Date(Date.now() - 45000).toISOString(),
    entity_id: "TGT-008",
    reported_lat: 31.4002,
    reported_lon: 34.8995,
    signal_type: "HUMINT",
    priority_level: 1,
    source: "Field Agent 44"
  }
];

export const INITIAL_ATTACKS = [
  {
    attack_id: "atk-7731-01",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    entity_id: "TGT-006",
    weapon_type: "GBU-39 SDB",
    status: "evaluated"
  }
];

export const INITIAL_DAMAGE_REPORTS = [
  {
    id: 1,
    attack_id: "atk-7731-01",
    entity_id: "TGT-006",
    result: "damaged",
    timestamp: new Date(Date.now() - 250000).toISOString(),
    assessedBy: "BDA Imagery Cell"
  }
];
