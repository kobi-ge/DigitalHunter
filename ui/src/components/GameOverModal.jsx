import React from "react";
import { useTactical } from "../context/TacticalContext";
import { Trophy, Skull, Flame, ArrowRight, RotateCcw, Crosshair, ShieldCheck } from "lucide-react";
import { WAVE_DEFINITIONS } from "../data/initialData";

export const GameOverModal = () => {
  const { gameState, currentWaveNum, player, startNextWave, restartGame } = useTactical();

  if (gameState === "playing") return null;

  const currentWaveDef = WAVE_DEFINITIONS.find(w => w.waveNumber === currentWaveNum) || WAVE_DEFINITIONS[0];
  const nextWaveDef = WAVE_DEFINITIONS.find(w => w.waveNumber === currentWaveNum + 1);
  const accuracy = player.shotsFired > 0 ? Math.round((player.shotsHit / player.shotsFired) * 100) : 100;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: "520px", textAlign: "center", border: gameState === "game_over" ? "2px solid var(--accent-crimson)" : "2px solid var(--accent-emerald)" }}>
        
        {/* Game Over Screen */}
        {gameState === "game_over" && (
          <div>
            <div style={{ display: "inline-flex", padding: "16px", background: "rgba(255, 0, 85, 0.15)", borderRadius: "50%", color: "var(--accent-crimson)", marginBottom: "16px" }}>
              <Skull size={48} className="animate-pulse" />
            </div>
            <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1.8rem", color: "var(--accent-crimson)", letterSpacing: "2px" }}>
              BASE COMPROMISED
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "8px 0 20px" }}>
              Hostile cells breached your tactical defense perimeter on Wave {currentWaveNum}.
            </p>

            <div style={{ background: "rgba(6, 10, 18, 0.8)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-subtle)", marginBottom: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", textAlign: "left" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>FINAL SCORE</span>
                <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--accent-amber)", fontFamily: "var(--font-mono)" }}>{player.score.toLocaleString()} PTS</div>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>HOSTILES NEUTRALIZED</span>
                <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#fff", fontFamily: "var(--font-mono)" }}>{player.kills} ELIMINATIONS</div>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>ACCURACY RATING</span>
                <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>{accuracy}%</div>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>WAVE REACHED</span>
                <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "var(--accent-crimson)", fontFamily: "var(--font-mono)" }}>WAVE {currentWaveNum} / 5</div>
              </div>
            </div>

            <button
              className="action-btn danger"
              style={{ width: "100%", padding: "14px", fontSize: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
              onClick={restartGame}
            >
              <RotateCcw size={18} /> RESTART MISSION OPERATION
            </button>
          </div>
        )}

        {/* Wave Cleared Screen */}
        {gameState === "wave_cleared" && (
          <div>
            <div style={{ display: "inline-flex", padding: "16px", background: "rgba(0, 255, 157, 0.15)", borderRadius: "50%", color: "var(--accent-emerald)", marginBottom: "16px" }}>
              <ShieldCheck size={48} />
            </div>
            <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1.8rem", color: "var(--accent-emerald)", letterSpacing: "2px" }}>
              SECTOR CLEARED!
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "8px 0 16px" }}>
              Wave {currentWaveNum} ({currentWaveDef.name}) successfully neutralized.
            </p>

            {nextWaveDef && (
              <div style={{ background: "rgba(255, 183, 0, 0.1)", border: "1px solid var(--accent-amber)", borderRadius: "8px", padding: "12px", marginBottom: "20px", textAlign: "left" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--accent-amber)", fontWeight: "bold" }}>
                  INCOMING INTEL: WAVE {nextWaveDef.waveNumber} — {nextWaveDef.name}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-main)", marginTop: "4px" }}>
                  {nextWaveDef.description}
                </div>
              </div>
            )}

            <button
              className="action-btn primary"
              style={{ width: "100%", padding: "14px", fontSize: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
              onClick={startNextWave}
            >
              <ArrowRight size={18} /> ENGAGE WAVE {currentWaveNum + 1}
            </button>
          </div>
        )}

        {/* Final Victory Screen */}
        {gameState === "victory" && (
          <div>
            <div style={{ display: "inline-flex", padding: "16px", background: "rgba(255, 183, 0, 0.15)", borderRadius: "50%", color: "var(--accent-amber)", marginBottom: "16px" }}>
              <Trophy size={48} className="animate-bounce" />
            </div>
            <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "1.8rem", color: "var(--accent-amber)", letterSpacing: "2px" }}>
              TOTAL SECTOR VICTORY
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "8px 0 20px" }}>
              All 5 hostile attack waves neutralized! Sector secured with full perimeter integrity.
            </p>

            <div style={{ background: "rgba(6, 10, 18, 0.8)", padding: "16px", borderRadius: "8px", border: "1px solid var(--accent-emerald)", marginBottom: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", textAlign: "left" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>VICTORY SCORE</span>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--accent-amber)", fontFamily: "var(--font-mono)" }}>{player.score.toLocaleString()} PTS</div>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>TOTAL ELIMINATIONS</span>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--accent-emerald)", fontFamily: "var(--font-mono)" }}>{player.kills} KILLS</div>
              </div>
            </div>

            <button
              className="action-btn primary"
              style={{ width: "100%", padding: "14px", fontSize: "1rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}
              onClick={restartGame}
            >
              <RotateCcw size={18} /> PLAY CAMPAIGN AGAIN
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
