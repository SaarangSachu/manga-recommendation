import React, { useState, useEffect } from "react";
import { X, Sparkles, RotateCw, Star, Heart, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";
import { MANGA_DATA } from "../data/mangaData";
import { getSurpriseManga } from "../utils/recommendationEngine";

export function SurpriseModal({ isOpen, onClose, onSelectManga }) {
  const [selectedManga, setSelectedManga] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);

  const rollRoulette = () => {
    setIsSpinning(true);
    let count = 0;
    const maxCycles = 18;
    const intervalTime = 60;

    const interval = setInterval(() => {
      count++;
      const randIdx = Math.floor(Math.random() * MANGA_DATA.length);
      setSpinIndex(randIdx);

      if (count >= maxCycles) {
        clearInterval(interval);
        const finalPick = getSurpriseManga();
        setSelectedManga(finalPick);
        setIsSpinning(false);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.55 },
            colors: ["#ff3366", "#00f0ff", "#ffb703"]
          });
        } catch (e) {}
      }
    }, intervalTime);
  };

  useEffect(() => {
    if (isOpen) {
      rollRoulette();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentDisplay = isSpinning ? MANGA_DATA[spinIndex] : selectedManga;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content-wrap" 
        style={{ maxWidth: "560px", padding: "2.5rem 2rem", textAlign: "center" }}
        onClick={e => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="hero-pill-tag" style={{ margin: "0 auto 0.75rem auto" }}>
          <Sparkles size={14} />
          FR-3.4 Curated Randomizer
        </div>

        <h3 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Surprise Recommendation</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.75rem" }}>
          Weighted by world-class ratings and diverse genres to unveil a masterpiece you may have missed.
        </p>

        {currentDisplay && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.25rem",
            transform: isSpinning ? "scale(0.97)" : "scale(1)",
            transition: "transform 0.15s ease"
          }}>
            {/* Poster Card with Neon Border */}
            <div style={{
              width: "180px",
              aspectRatio: "2 / 2.9",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: isSpinning ? "0 0 30px var(--accent-cyan-glow)" : "0 0 35px var(--accent-crimson-glow)",
              border: isSpinning ? "2px solid var(--accent-cyan)" : "2px solid var(--accent-crimson)",
              position: "relative"
            }}>
              <img 
                src={currentDisplay.coverImage} 
                alt={currentDisplay.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Title & Metadata */}
            <div>
              <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <span className={`badge-format ${(currentDisplay.format || 'manga').toLowerCase()}`}>
                  {currentDisplay.format}
                </span>
                <span style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#ffb703"
                }}>
                  <Star size={12} fill="#ffb703" /> {currentDisplay.score.toFixed(1)}
                </span>
              </div>

              <h4 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff" }}>
                {currentDisplay.title}
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.3rem", maxWidth: "420px", margin: "0.3rem auto 0 auto" }}>
                {currentDisplay.genres.join(" • ")}
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={rollRoulette}
                disabled={isSpinning}
              >
                <RotateCw size={15} className={isSpinning ? "spin" : ""} />
                Roll Again
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  onClose();
                  if (selectedManga) onSelectManga(selectedManga);
                }}
                disabled={isSpinning}
              >
                View Details
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
