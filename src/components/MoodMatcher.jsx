import React, { useState, useMemo } from "react";
import { Sparkles, Sliders, ShieldAlert, Filter, RotateCcw } from "lucide-react";
import { MOOD_VIBE_PRESETS } from "../data/communityData";
import { getMangaByMood } from "../utils/recommendationEngine";
import { MangaCard } from "./MangaCard";

const TROPE_BLACKLIST_OPTIONS = [
  "Dark Fantasy",
  "Gore",
  "Tragedy",
  "Demons",
  "Revenge",
  "High School",
  "Dungeons & Gates",
  "Conspiracy"
];

export function MoodMatcher({ onSelectManga }) {
  const [selectedPresetId, setSelectedPresetId] = useState("mood-dark-seinen");
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Custom slider weights (0 to 1)
  const [sliderAction, setSliderAction] = useState(0.8);
  const [sliderDark, setSliderDark] = useState(0.8);
  const [sliderWholesome, setSliderWholesome] = useState(0.2);
  const [sliderMindGames, setSliderMindGames] = useState(0.5);
  const [sliderRomance, setSliderRomance] = useState(0.2);

  // Negative filters
  const [blacklistedThemes, setBlacklistedThemes] = useState([]);
  const [allowMature, setAllowMature] = useState(true);

  // Determine current target vector
  const currentTargetVector = useMemo(() => {
    if (isCustomMode) {
      // 12 dimensions:
      // [0: Action, 1: Dark/Psych, 2: Fantasy, 3: Romance/Drama, 4: Comedy, 
      //  5: Mystery, 6: Adventure, 7: MindGames, 8: Wholesome, 9: GrittyViolence, 10: Sci-Fi, 11: Sports]
      return [
        sliderAction,
        sliderDark,
        0.5,
        sliderRomance,
        sliderWholesome * 0.7,
        sliderMindGames * 0.8,
        0.6,
        sliderMindGames,
        sliderWholesome,
        sliderDark * 0.9,
        0.2,
        0.1
      ];
    }

    const preset = MOOD_VIBE_PRESETS.find(p => p.id === selectedPresetId);
    return preset ? preset.targetVector : MOOD_VIBE_PRESETS[0].targetVector;
  }, [isCustomMode, selectedPresetId, sliderAction, sliderDark, sliderWholesome, sliderMindGames, sliderRomance]);

  // Compute matched manga
  const matchedResults = useMemo(() => {
    return getMangaByMood({
      targetVector: currentTargetVector,
      blacklistedThemes,
      allowMature,
      count: 12
    });
  }, [currentTargetVector, blacklistedThemes, allowMature]);

  const toggleBlacklistTheme = (theme) => {
    setBlacklistedThemes(prev => 
      prev.includes(theme) ? prev.filter(t => t !== theme) : [...prev, theme]
    );
  };

  const resetFilters = () => {
    setSelectedPresetId("mood-dark-seinen");
    setIsCustomMode(false);
    setBlacklistedThemes([]);
    setAllowMature(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header intro */}
      <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto" }}>
        <div className="hero-pill-tag" style={{ margin: "0 auto 0.75rem auto" }}>
          <Sparkles size={14} />
          FR-3.3 Dynamic Discovery
        </div>
        <h2 style={{ fontSize: "2.4rem", fontWeight: 800 }}>Mood & Vibe Matcher</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "1.05rem" }}>
          Tell us the exact mood or vibe you crave. Our vector embedding model computes semantic 
          similarity and immediately applies your blacklisted tropes and content filters.
        </p>
      </div>

      {/* Preset Cards Selection */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>Curated Vibe Archetypes</span>
          </h3>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsCustomMode(!isCustomMode)}
            style={{ fontSize: "0.82rem", padding: "0.4rem 0.9rem" }}
          >
            <Sliders size={14} />
            {isCustomMode ? "Switch to Preset Cards" : "Fine-Tune Custom Sliders"}
          </button>
        </div>

        {!isCustomMode ? (
          <div className="mood-presets-grid">
            {MOOD_VIBE_PRESETS.map(preset => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  className={`mood-preset-card ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedPresetId(preset.id)}
                >
                  <span className="mood-preset-emoji">{preset.emoji}</span>
                  <div>
                    <h4 className="mood-preset-title">{preset.label}</h4>
                    <p className="mood-preset-desc">{preset.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Custom Slider Controls */
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-medium)",
            borderRadius: "var(--radius-xl)",
            padding: "1.75rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem"
          }}>
            {/* Slider 1: Action */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
                <span>💥 Action & Adrenaline</span>
                <span style={{ color: "var(--accent-crimson)", fontFamily: "var(--font-mono)" }}>
                  {Math.round(sliderAction * 100)}%
                </span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05"
                value={sliderAction} 
                onChange={e => setSliderAction(parseFloat(e.target.value))}
                style={{ accentColor: "var(--accent-crimson)", cursor: "pointer" }}
              />
            </div>

            {/* Slider 2: Dark / Gritty */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
                <span>🩸 Dark & Psychological Depth</span>
                <span style={{ color: "var(--accent-crimson)", fontFamily: "var(--font-mono)" }}>
                  {Math.round(sliderDark * 100)}%
                </span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05"
                value={sliderDark} 
                onChange={e => setSliderDark(parseFloat(e.target.value))}
                style={{ accentColor: "var(--accent-crimson)", cursor: "pointer" }}
              />
            </div>

            {/* Slider 3: Wholesome / Comfort */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
                <span>☕ Wholesomeness & Cozy Comfort</span>
                <span style={{ color: "var(--accent-emerald)", fontFamily: "var(--font-mono)" }}>
                  {Math.round(sliderWholesome * 100)}%
                </span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05"
                value={sliderWholesome} 
                onChange={e => setSliderWholesome(parseFloat(e.target.value))}
                style={{ accentColor: "var(--accent-emerald)", cursor: "pointer" }}
              />
            </div>

            {/* Slider 4: Mind Games */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
                <span>🧠 Mind Games & Deductive Chess</span>
                <span style={{ color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>
                  {Math.round(sliderMindGames * 100)}%
                </span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05"
                value={sliderMindGames} 
                onChange={e => setSliderMindGames(parseFloat(e.target.value))}
                style={{ accentColor: "var(--accent-cyan)", cursor: "pointer" }}
              />
            </div>

            {/* Slider 5: Romance */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700 }}>
                <span>💖 Romance & Emotional Heart</span>
                <span style={{ color: "var(--accent-amber)", fontFamily: "var(--font-mono)" }}>
                  {Math.round(sliderRomance * 100)}%
                </span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.05"
                value={sliderRomance} 
                onChange={e => setSliderRomance(parseFloat(e.target.value))}
                style={{ accentColor: "var(--accent-amber)", cursor: "pointer" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Negative Filters Box (FR-3.3 Negative Filters) */}
      <div style={{
        background: "rgba(22, 28, 46, 0.5)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.85rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.88rem", fontWeight: 700, color: "var(--text-highlight)" }}>
            <ShieldAlert size={16} color="#ef4444" />
            <span>Negative Filters (Blacklist Specific Tropes / Content)</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", cursor: "pointer", color: "var(--text-muted)" }}>
              <input
                type="checkbox"
                checked={!allowMature}
                onChange={e => setAllowMature(!e.target.checked)}
              />
              <span>Filter Mature (17+)</span>
            </label>

            {(blacklistedThemes.length > 0 || !allowMature || isCustomMode) && (
              <button
                type="button"
                onClick={resetFilters}
                style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--text-dim)" }}
              >
                <RotateCcw size={12} />
                Reset
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {TROPE_BLACKLIST_OPTIONS.map(trope => {
            const isBlacklisted = blacklistedThemes.includes(trope);
            return (
              <button
                key={trope}
                type="button"
                onClick={() => toggleBlacklistTheme(trope)}
                style={{
                  padding: "0.3rem 0.75rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  background: isBlacklisted ? "rgba(239, 68, 68, 0.2)" : "var(--bg-surface)",
                  color: isBlacklisted ? "#fca5a5" : "var(--text-muted)",
                  border: "1px solid",
                  borderColor: isBlacklisted ? "rgba(239, 68, 68, 0.6)" : "var(--border-subtle)",
                  transition: "var(--transition-fast)"
                }}
              >
                {isBlacklisted ? `✕ Excluded: ${trope}` : `Exclude ${trope}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matched Results Header */}
      <div>
        <div className="section-header-row">
          <div className="section-title-wrap">
            <h2>
              <span>Top Vibe Matches</span>
              <span style={{ fontSize: "0.9rem", color: "var(--accent-cyan)", fontFamily: "var(--font-mono)" }}>
                ({matchedResults.length} titles)
              </span>
            </h2>
            <div className="section-subtitle">
              Ranked in descending order of vector similarity and quality weighting
            </div>
          </div>
        </div>

        {matchedResults.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", background: "var(--bg-card)", borderRadius: "var(--radius-lg)" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
              No titles match all these criteria and negative filters!
            </p>
            <button type="button" className="btn-primary" onClick={resetFilters} style={{ marginTop: "1rem" }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="manga-grid">
            {matchedResults.map(({ manga, fitScore }) => (
              <MangaCard 
                key={manga.id} 
                manga={manga} 
                onSelect={onSelectManga}
                fitScore={fitScore}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
