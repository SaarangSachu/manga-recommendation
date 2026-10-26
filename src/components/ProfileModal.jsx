import React, { useState } from "react";
import { X, User, Shield, Check, Heart, Sparkles } from "lucide-react";
import { useLibrary } from "../context/LibraryContext";
import { GENRE_LIST } from "../data/mangaData";

const AVATAR_OPTIONS = ["⚔️", "🌸", "👑", "🌿", "⚡", "☕", "🕵️", "🔥", "🐺", "🎯", "🖤", "🐉"];

export function ProfileModal({ isOpen, onClose }) {
  const { profile, setProfile, showToast } = useLibrary();

  const [displayName, setDisplayName] = useState(profile.displayName || "Raven");
  const [username, setUsername] = useState(profile.username || "RavenReader");
  const [avatarEmoji, setAvatarEmoji] = useState(profile.avatarEmoji || "⚔️");
  const [bio, setBio] = useState(profile.bio || "");
  const [nsfwFilter, setNsfwFilter] = useState(profile.nsfwFilter || false);
  const [selectedGenres, setSelectedGenres] = useState(profile.preferredDemographics || ["Seinen"]);

  if (!isOpen) return null;

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      displayName,
      username,
      avatarEmoji,
      bio,
      nsfwFilter,
      preferredDemographics: selectedGenres
    }));
    showToast("Profile settings updated successfully!", "success");
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content-wrap" 
        style={{ maxWidth: "580px", padding: "2.2rem" }}
        onClick={e => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
          <div className="brand-icon-badge" style={{ width: "32px", height: "32px", fontSize: "1rem" }}>
            <User size={16} />
          </div>
          <h3 style={{ fontSize: "1.45rem", fontWeight: 800 }}>Profile & Taste Preferences</h3>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Configure your reader persona, explicit content filters, and favorite genres for tailored recommendations.
        </p>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Avatar Emoji Selector */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
              Choose Avatar
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {AVATAR_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatarEmoji(emoji)}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "1.3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: avatarEmoji === emoji ? "var(--accent-crimson)" : "var(--bg-surface)",
                    border: "1px solid",
                    borderColor: avatarEmoji === emoji ? "var(--accent-crimson)" : "var(--border-subtle)",
                    boxShadow: avatarEmoji === emoji ? "0 2px 10px var(--accent-crimson-glow)" : "none",
                    cursor: "pointer",
                    transition: "var(--transition-fast)"
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Names Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                required
                style={{
                  width: "100%",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.55rem 0.8rem",
                  fontSize: "0.88rem"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                Username (@handle)
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                style={{
                  width: "100%",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.55rem 0.8rem",
                  fontSize: "0.88rem"
                }}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.3rem" }}>
              Reader Bio
            </label>
            <textarea
              rows="2"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell others what kind of stories move you..."
              style={{
                width: "100%",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "0.55rem 0.8rem",
                fontSize: "0.88rem"
              }}
            />
          </div>

          {/* Favorite Genres Selection */}
          <div>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.4rem" }}>
              Favorite Genres (Informs Taste Vectors)
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {GENRE_LIST.map(g => {
                const isSelected = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    style={{
                      padding: "0.25rem 0.65rem",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: isSelected ? "var(--accent-crimson)" : "var(--bg-surface)",
                      color: isSelected ? "#fff" : "var(--text-muted)",
                      border: "1px solid",
                      borderColor: isSelected ? "var(--accent-crimson)" : "var(--border-subtle)"
                    }}
                  >
                    {isSelected ? `✓ ${g}` : g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explicit Content Filter Toggle */}
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)",
            padding: "0.85rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Shield size={18} color="var(--accent-cyan)" />
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>Explicit Content Filter (NSFW)</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                  Hide titles with graphic gore or mature themes
                </div>
              </div>
            </div>

            <input
              type="checkbox"
              checked={nsfwFilter}
              onChange={e => setNsfwFilter(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "var(--accent-crimson)", cursor: "pointer" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={15} />
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
