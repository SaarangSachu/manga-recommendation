import React, { useState } from "react";
import { Users, Plus, Award, Share2, Trash2, BookOpen, ThumbsUp, ThumbsDown, Eye, EyeOff } from "lucide-react";
import { useLibrary } from "../context/LibraryContext";
import { MANGA_DATA } from "../data/mangaData";
import { MangaCard } from "./MangaCard";

export function CommunityView({ onSelectManga }) {
  const { allLists, createCustomList, deleteCustomList, reviews, reviewVotes, voteReview } = useLibrary();

  const [selectedListId, setSelectedListId] = useState(allLists[0]?.id || null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState({});

  // New List Form State
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [newListSelectedIds, setNewListSelectedIds] = useState([]);

  const activeList = allLists.find(l => l.id === selectedListId) || allLists[0];

  const handleCreateListSubmit = (e) => {
    e.preventDefault();
    if (!newListTitle.trim() || newListSelectedIds.length === 0) return;

    const created = createCustomList({
      title: newListTitle,
      description: newListDesc || "A custom community list.",
      mangaIds: newListSelectedIds,
      icon: "✨"
    });

    setSelectedListId(created.id);
    setIsCreatingList(false);
    setNewListTitle("");
    setNewListDesc("");
    setNewListSelectedIds([]);
  };

  const toggleSelectMangaForList = (id) => {
    setNewListSelectedIds(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const toggleSpoiler = (id) => {
    setRevealedSpoilers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Intro Banner */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div className="hero-pill-tag" style={{ marginBottom: "0.5rem" }}>
            <Users size={14} />
            FR-5.3 Thematic Community Lists
          </div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>Community & Curated Lists</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Discover user-curated selections, explore editorial picks, or assemble your own custom reading tier-list.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsCreatingList(true)}
        >
          <Plus size={16} />
          Create Custom List
        </button>
      </div>

      {/* Modal for Creating Custom List */}
      {isCreatingList && (
        <div className="modal-backdrop" onClick={() => setIsCreatingList(false)}>
          <div className="modal-content-wrap" style={{ maxWidth: "680px", padding: "2rem" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>Create New Thematic List</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Curate a collection of titles to organize your personal favorites or share with others.
            </p>

            <form onSubmit={handleCreateListSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  List Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Top 10 Underrated Mystery Manga"
                  value={newListTitle}
                  onChange={e => setNewListTitle(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.6rem 0.85rem",
                    fontSize: "0.9rem"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.3rem" }}>
                  Description
                </label>
                <textarea
                  rows="2"
                  placeholder="What brings these titles together?"
                  value={newListDesc}
                  onChange={e => setNewListDesc(e.target.value)}
                  style={{
                    width: "100%",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.6rem 0.85rem",
                    fontSize: "0.9rem"
                  }}
                />
              </div>

              {/* Multi-select manga pills */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                  Select Titles to Include ({newListSelectedIds.length} selected) *
                </label>
                <div style={{
                  maxHeight: "220px",
                  overflowY: "auto",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.75rem",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.4rem"
                }}>
                  {MANGA_DATA.map(manga => {
                    const isSelected = newListSelectedIds.includes(manga.id);
                    return (
                      <button
                        key={manga.id}
                        type="button"
                        onClick={() => toggleSelectMangaForList(manga.id)}
                        style={{
                          padding: "0.3rem 0.65rem",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          background: isSelected ? "var(--accent-crimson)" : "var(--bg-surface-elevated)",
                          color: isSelected ? "#fff" : "var(--text-muted)",
                          border: "1px solid",
                          borderColor: isSelected ? "var(--accent-crimson)" : "var(--border-subtle)"
                        }}
                      >
                        {isSelected ? `✓ ${manga.title}` : `+ ${manga.title}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsCreatingList(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!newListTitle.trim() || newListSelectedIds.length === 0}
                >
                  Publish List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List Badges Slider / Strip */}
      <div style={{
        display: "flex",
        gap: "0.75rem",
        overflowX: "auto",
        paddingBottom: "0.5rem"
      }}>
        {allLists.map(list => {
          const isSelected = activeList?.id === list.id;
          return (
            <button
              key={list.id}
              type="button"
              onClick={() => setSelectedListId(list.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.75rem 1.25rem",
                borderRadius: "var(--radius-lg)",
                background: isSelected ? "linear-gradient(135deg, var(--bg-surface-elevated), var(--bg-card-hover))" : "var(--bg-card)",
                border: "1px solid",
                borderColor: isSelected ? "var(--accent-crimson)" : "var(--border-subtle)",
                boxShadow: isSelected ? "0 4px 16px var(--accent-crimson-glow)" : "none",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "var(--transition-fast)"
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>{list.icon || "📚"}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: isSelected ? "#fff" : "var(--text-main)" }}>
                  {list.title}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                  {list.mangaIds.length} titles • By {list.creator}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active List Detail Banner */}
      {activeList && (
        <div style={{
          background: "linear-gradient(135deg, rgba(26, 34, 56, 0.7), rgba(15, 19, 32, 0.95))",
          border: "1px solid var(--border-medium)",
          borderRadius: "var(--radius-xl)",
          padding: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
              <span style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "0.2rem 0.55rem",
                borderRadius: "var(--radius-full)",
                background: "rgba(255, 51, 102, 0.15)",
                color: "var(--accent-crimson)",
                border: "1px solid rgba(255, 51, 102, 0.3)"
              }}>
                {activeList.badge || "Curated"}
              </span>
              <span style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
                Curated by <strong>{activeList.creator}</strong>
              </span>
            </div>

            <h3 style={{ fontSize: "1.8rem", color: "#fff" }}>
              {activeList.icon} {activeList.title}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.98rem", marginTop: "0.4rem", maxWidth: "760px", lineHeight: 1.6 }}>
              {activeList.description}
            </p>
          </div>

          {activeList.badge === "Custom" && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => deleteCustomList(activeList.id)}
              style={{ color: "#ef4444", fontSize: "0.82rem" }}
            >
              <Trash2 size={14} />
              Delete List
            </button>
          )}
        </div>
      )}

      {/* Grid of Manga in this List */}
      <div>
        <div className="section-header-row">
          <div className="section-title-wrap">
            <h2>Titles in this Collection</h2>
          </div>
        </div>

        <div className="manga-grid">
          {activeList?.mangaIds.map(id => {
            const manga = MANGA_DATA.find(m => m.id === id);
            if (!manga) return null;
            return (
              <MangaCard 
                key={manga.id} 
                manga={manga} 
                onSelect={onSelectManga} 
              />
            );
          })}
        </div>
      </div>

      {/* Global Community Reviews Feed */}
      <div style={{ marginTop: "1rem" }}>
        <div className="section-header-row">
          <div className="section-title-wrap">
            <h2>Recent Community Discussions & Reviews</h2>
            <div className="section-subtitle">
              Unfiltered community insights, critique, and spoiler-protected impressions
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {reviews.slice(0, 6).map(review => {
            const manga = MANGA_DATA.find(m => m.id === review.mangaId);
            const isSpoilerHidden = review.hasSpoilers && !revealedSpoilers[review.id];
            const userVote = reviewVotes[review.id];

            return (
              <div
                key={review.id}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem"
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ fontSize: "1.4rem" }}>{review.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{review.author}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                        Reviewed <strong style={{ color: "var(--accent-cyan)", cursor: "pointer" }} onClick={() => manga && onSelectManga(manga)}>{manga?.title || review.mangaId}</strong>
                      </div>
                    </div>
                  </div>

                  <span style={{ color: "var(--accent-amber)", fontWeight: 700, fontSize: "0.85rem" }}>
                    ★ {review.rating}/10
                  </span>
                </div>

                {/* Spoiler Mask Toggle */}
                {review.hasSpoilers && (
                  <button
                    type="button"
                    onClick={() => toggleSpoiler(review.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontSize: "0.72rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      background: "rgba(239, 68, 68, 0.15)",
                      color: "#f87171",
                      width: "fit-content"
                    }}
                  >
                    {isSpoilerHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                    {isSpoilerHidden ? "Contains Spoilers (Click to reveal)" : "Hide Spoilers"}
                  </button>
                )}

                {/* Text */}
                <p style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  color: "var(--text-main)",
                  filter: isSpoilerHidden ? "blur(5px)" : "none",
                  userSelect: isSpoilerHidden ? "none" : "auto"
                }}>
                  {review.text}
                </p>

                {/* Upvotes */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginTop: "auto", fontSize: "0.78rem", color: "var(--text-dim)" }}>
                  <button
                    type="button"
                    onClick={() => voteReview(review.id, "up")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      color: userVote === "up" ? "var(--accent-emerald)" : "var(--text-muted)"
                    }}
                  >
                    <ThumbsUp size={13} />
                    <span>{review.upvotes}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => voteReview(review.id, "down")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      color: userVote === "down" ? "#ef4444" : "var(--text-muted)"
                    }}
                  >
                    <ThumbsDown size={13} />
                    <span>{review.downvotes}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
