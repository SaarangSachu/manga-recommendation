import React, { useState, useMemo } from "react";
import { 
  X, Star, Heart, ExternalLink, Plus, Minus, Bookmark, 
  MessageSquare, ThumbsUp, ThumbsDown, Eye, EyeOff, Sparkles, BookOpen 
} from "lucide-react";
import { useLibrary } from "../context/LibraryContext";
import { getRecommendationsForManga } from "../utils/recommendationEngine";
import { MANGA_DATA } from "../data/mangaData";

export function MangaDetailModal({ manga, onClose, onSelectManga }) {
  const { 
    library, 
    updateStatus, 
    incrementChapter, 
    decrementChapter, 
    setChapter, 
    setScore, 
    toggleFavorite, 
    saveNotes, 
    removeFromLibrary,
    reviews,
    reviewVotes,
    addReview,
    voteReview
  } = useLibrary();

  const [activeTab, setActiveTab] = useState("overview"); // overview | recommendations | reviews
  const [revealedSpoilers, setRevealedSpoilers] = useState({});
  const [userNote, setUserNote] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // New review form state
  const [newReviewRating, setNewReviewRating] = useState(10);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewSpoilers, setNewReviewSpoilers] = useState(false);

  if (!manga) return null;

  const tracked = library[manga.id];
  const isFavorited = tracked?.favorite || false;

  // Recommendations calculated via content-based and vector similarity
  const recommendations = useMemo(() => {
    return getRecommendationsForManga(manga.id, 4);
  }, [manga.id]);

  // Filter reviews for this manga
  const mangaReviews = useMemo(() => {
    return reviews.filter(r => r.mangaId === manga.id);
  }, [reviews, manga.id]);

  const toggleSpoiler = (reviewId) => {
    setRevealedSpoilers(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const handleNotesSubmit = (e) => {
    e.preventDefault();
    saveNotes(manga.id, userNote);
    setIsEditingNotes(false);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;
    addReview({
      mangaId: manga.id,
      rating: newReviewRating,
      text: newReviewText,
      hasSpoilers: newReviewSpoilers
    });
    setNewReviewText("");
  };

  return (
    <div className="modal-backdrop" onClick={onClose} id="manga-detail-modal">
      <div className="modal-content-wrap" onClick={e => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Backdrop Banner */}
        <div style={{
          position: "relative",
          height: "220px",
          width: "100%",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${manga.accentColor || '#1e1b4b'}, #080a11)`
        }}>
          <img 
            src={manga.bannerImage || manga.coverImage} 
            alt={manga.title} 
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.35,
              filter: "blur(3px)"
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(0deg, var(--bg-card) 5%, transparent 100%)"
          }} />
        </div>

        {/* Main Content Area */}
        <div style={{ padding: "0 2rem 2rem 2rem", marginTop: "-70px", position: "relative", zIndex: 2 }}>
          {/* Top Info Header */}
          <div style={{ display: "flex", gap: "1.75rem", flexWrap: "wrap" }}>
            {/* Poster Card */}
            <div style={{
              width: "160px",
              aspectRatio: "2 / 2.9",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              boxShadow: "var(--shadow-lg)",
              border: "2px solid var(--border-medium)",
              flexShrink: 0,
              background: "#111422"
            }}>
              <img 
                src={manga.coverImage} 
                alt={manga.title} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Title & Metadata */}
            <div style={{ flex: 1, minWidth: "260px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <span className={`badge-format ${(manga.format || 'manga').toLowerCase()}`}>
                  {manga.format}
                </span>
                <span style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  background: "var(--bg-surface-elevated)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px"
                }}>
                  {manga.demographic}
                </span>
                <span style={{
                  fontSize: "0.75rem",
                  color: manga.status === "Ongoing" ? "var(--accent-cyan)" : "var(--accent-emerald)",
                  background: "var(--bg-surface-elevated)",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  fontWeight: 600
                }}>
                  ● {manga.status}
                </span>
              </div>

              <h2 style={{ fontSize: "1.85rem", marginTop: "0.4rem", color: "#fff", lineHeight: 1.2 }}>
                {manga.title}
              </h2>
              {manga.japaneseTitle && (
                <div style={{ color: "var(--text-dim)", fontSize: "0.9rem", marginTop: "0.15rem" }}>
                  {manga.japaneseTitle}
                </div>
              )}

              {/* Quick Meta Strip */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
                marginTop: "0.85rem",
                flexWrap: "wrap",
                fontSize: "0.88rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--accent-amber)", fontWeight: 700 }}>
                  <Star size={16} fill="var(--accent-amber)" />
                  <span>{manga.score.toFixed(2)}</span>
                  <span style={{ color: "var(--text-dim)", fontWeight: 400, fontSize: "0.75rem" }}>
                    (Rank #{manga.rank})
                  </span>
                </div>
                <div style={{ color: "var(--text-muted)" }}>
                  <strong>{manga.year}</strong>
                </div>
                <div style={{ color: "var(--text-muted)" }}>
                  {manga.chapters ? `${manga.chapters} Chapters` : 'Ongoing serialization'}
                </div>
                <div style={{ color: "var(--text-muted)" }}>
                  By <strong>{manga.author}</strong>
                </div>
              </div>

              {/* Action Buttons: Favorite & Official Links */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => toggleFavorite(manga.id)}
                  style={{ borderColor: isFavorited ? "var(--accent-crimson)" : "var(--border-subtle)" }}
                >
                  <Heart size={16} fill={isFavorited ? "var(--accent-crimson)" : "none"} color={isFavorited ? "var(--accent-crimson)" : "currentColor"} />
                  {isFavorited ? "Favorited" : "Favorite"}
                </button>

                {manga.officialLinks && manga.officialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{ fontSize: "0.82rem" }}
                  >
                    <BookOpen size={15} color="var(--accent-cyan)" />
                    Read on {link.name}
                    <ExternalLink size={12} color="var(--text-dim)" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Library Tracking Control Box */}
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-medium)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem 1.5rem",
            marginTop: "1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Bookmark size={18} color="var(--accent-crimson)" />
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>My Library Tracking</span>
              </div>

              {tracked && (
                <button
                  type="button"
                  onClick={() => removeFromLibrary(manga.id)}
                  style={{ fontSize: "0.78rem", color: "#ef4444", textDecoration: "underline" }}
                >
                  Remove from library
                </button>
              )}
            </div>

            {/* Tracking Status Pills */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["Reading", "Completed", "On Hold", "Plan to Read", "Dropped"].map(status => {
                const isActive = tracked?.status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateStatus(manga.id, status)}
                    style={{
                      padding: "0.4rem 0.9rem",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      background: isActive ? "var(--accent-crimson)" : "var(--bg-surface-elevated)",
                      color: isActive ? "#fff" : "var(--text-muted)",
                      border: "1px solid",
                      borderColor: isActive ? "var(--accent-crimson)" : "var(--border-subtle)",
                      boxShadow: isActive ? "0 2px 10px var(--accent-crimson-glow)" : "none",
                      transition: "var(--transition-fast)"
                    }}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            {/* Chapter Progress & Rating Row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.25rem",
              alignItems: "center",
              paddingTop: "0.5rem",
              borderTop: "1px solid var(--border-subtle)"
            }}>
              {/* Chapter Stepper */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>Chapters:</span>
                <button
                  type="button"
                  className="card-icon-btn"
                  onClick={() => decrementChapter(manga.id)}
                  title="Previous Chapter"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  min="0"
                  max={manga.chapters || 9999}
                  value={tracked?.chapter || 0}
                  onChange={e => setChapter(manga.id, e.target.value)}
                  style={{
                    width: "60px",
                    textAlign: "center",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.3rem",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)"
                  }}
                />
                <button
                  type="button"
                  className="card-icon-btn"
                  onClick={() => incrementChapter(manga.id, manga.chapters)}
                  title="Next Chapter (+1)"
                >
                  <Plus size={14} />
                </button>
                <span style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
                  / {manga.chapters ? manga.chapters : '∞'}
                </span>
              </div>

              {/* Personal Score Picker */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>My Score:</span>
                <select
                  value={tracked?.score || 0}
                  onChange={e => setScore(manga.id, e.target.value)}
                  style={{
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-sm)",
                    padding: "0.35rem 0.65rem",
                    fontSize: "0.85rem",
                    color: tracked?.score ? "var(--accent-amber)" : "var(--text-muted)",
                    fontWeight: 700
                  }}
                >
                  <option value="0">Not Rated</option>
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>★ {num} / 10</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              {isEditingNotes ? (
                <form onSubmit={handleNotesSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <textarea
                    rows="2"
                    placeholder="Add personal notes or thoughts on this series..."
                    value={userNote}
                    onChange={e => setUserNote(e.target.value)}
                    style={{
                      background: "var(--bg-surface-elevated)",
                      border: "1px solid var(--border-medium)",
                      borderRadius: "var(--radius-md)",
                      padding: "0.6rem",
                      fontSize: "0.85rem",
                      width: "100%",
                      resize: "vertical"
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="submit" className="btn-primary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.8rem" }}>
                      Save Notes
                    </button>
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      onClick={() => setIsEditingNotes(false)}
                      style={{ padding: "0.35rem 0.85rem", fontSize: "0.8rem" }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span style={{ color: tracked?.notes ? "var(--text-main)" : "var(--text-dim)", fontStyle: tracked?.notes ? "normal" : "italic" }}>
                    {tracked?.notes ? `📝 Note: "${tracked.notes}"` : "No personal notes added yet."}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUserNote(tracked?.notes || "");
                      setIsEditingNotes(true);
                    }}
                    style={{ color: "var(--accent-cyan)", fontSize: "0.8rem", fontWeight: 600 }}
                  >
                    {tracked?.notes ? "Edit" : "+ Add Note"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Sub-Tabs in Modal */}
          <div style={{
            display: "flex",
            gap: "1.5rem",
            borderBottom: "1px solid var(--border-subtle)",
            marginTop: "1.75rem",
            marginBottom: "1.25rem"
          }}>
            {[
              { id: "overview", label: "Overview & Synopsis" },
              { id: "recommendations", label: `Similar Recommendations (${recommendations.length})` },
              { id: "reviews", label: `Community Reviews (${mangaReviews.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "0.65rem 0",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  color: activeTab === tab.id ? "#fff" : "var(--text-muted)",
                  borderBottom: activeTab === tab.id ? "2px solid var(--accent-crimson)" : "2px solid transparent",
                  transition: "var(--transition-fast)"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Featured Quote */}
              {manga.featuredQuote && (
                <blockquote style={{
                  borderLeft: "3px solid var(--accent-crimson)",
                  padding: "0.75rem 1.25rem",
                  background: "rgba(255, 51, 102, 0.05)",
                  borderRadius: "0 var(--radius-md) var(--radius-md) 0",
                  fontStyle: "italic",
                  color: "var(--text-main)",
                  fontSize: "0.95rem"
                }}>
                  "{manga.featuredQuote}"
                </blockquote>
              )}

              {/* Synopsis */}
              <div>
                <h4 style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Synopsis
                </h4>
                <p style={{ color: "var(--text-main)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                  {manga.synopsis}
                </p>
              </div>

              {/* Genres & Themes */}
              <div>
                <h4 style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase" }}>
                  Genres & Tropes
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {manga.genres.map(g => (
                    <span key={g} className="filter-tag-pill">{g}</span>
                  ))}
                  {manga.themes && manga.themes.map(t => (
                    <span key={t} className="filter-tag-pill" style={{ color: "var(--accent-amber)", borderColor: "rgba(255, 183, 3, 0.3)" }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Warnings */}
              {manga.contentWarnings && manga.contentWarnings.length > 0 && (
                <div style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.82rem",
                  color: "#fca5a5"
                }}>
                  <strong>Content Advisory ({manga.contentRating}):</strong> {manga.contentWarnings.join(", ")}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Similar Recommendations */}
          {activeTab === "recommendations" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.88rem" }}>
                <Sparkles size={16} color="var(--accent-cyan)" />
                <span>
                  Mathematically matched via <strong>12-Dimensional Vector Cosine Similarity</strong> & Genre Overlap:
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                {recommendations.map(({ manga: recManga, similarityScore, reasons }) => (
                  <div
                    key={recManga.id}
                    onClick={() => onSelectManga(recManga)}
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      padding: "1rem",
                      display: "flex",
                      gap: "1rem",
                      cursor: "pointer",
                      transition: "var(--transition-fast)"
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent-crimson)"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-subtle)"}
                  >
                    <img 
                      src={recManga.coverImage} 
                      alt={recManga.title}
                      style={{
                        width: "60px",
                        height: "85px",
                        objectFit: "cover",
                        borderRadius: "var(--radius-sm)",
                        flexShrink: 0
                      }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h4 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#fff" }}>
                          {recManga.title}
                        </h4>
                        <span style={{
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          color: "var(--accent-cyan)",
                          background: "rgba(0, 240, 255, 0.12)",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          fontFamily: "var(--font-mono)"
                        }}>
                          {similarityScore}% Match
                        </span>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                        {recManga.format} • {recManga.demographic}
                      </span>
                      <div style={{ marginTop: "0.3rem" }}>
                        {reasons.map((r, i) => (
                          <div key={i} style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            • {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Community Reviews */}
          {activeTab === "reviews" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Write Review Form */}
              <form 
                onSubmit={handleReviewSubmit}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.25rem"
                }}
              >
                <h4 style={{ fontSize: "0.95rem", marginBottom: "0.75rem" }}>Write a Review</h4>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Rating:</span>
                    <select
                      value={newReviewRating}
                      onChange={e => setNewReviewRating(Number(e.target.value))}
                      style={{
                        background: "var(--bg-surface-elevated)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-sm)",
                        padding: "0.25rem 0.5rem",
                        color: "var(--accent-amber)",
                        fontWeight: 700
                      }}
                    >
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(n => (
                        <option key={n} value={n}>★ {n} / 10</option>
                      ))}
                    </select>
                  </div>

                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={newReviewSpoilers}
                      onChange={e => setNewReviewSpoilers(e.target.checked)}
                    />
                    <span>Contains Spoilers</span>
                  </label>
                </div>

                <textarea
                  rows="3"
                  placeholder="Share your thoughts on the plot, character development, and art..."
                  value={newReviewText}
                  onChange={e => setNewReviewText(e.target.value)}
                  style={{
                    width: "100%",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "var(--radius-md)",
                    padding: "0.65rem",
                    fontSize: "0.88rem",
                    marginBottom: "0.75rem"
                  }}
                />

                <button type="submit" className="btn-primary" style={{ fontSize: "0.85rem" }}>
                  <MessageSquare size={14} />
                  Publish Review
                </button>
              </form>

              {/* Reviews List */}
              {mangaReviews.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-dim)" }}>
                  No reviews yet for this title. Be the first to share your thoughts!
                </div>
              ) : (
                mangaReviews.map(review => {
                  const isSpoilerHidden = review.hasSpoilers && !revealedSpoilers[review.id];
                  const userVote = reviewVotes[review.id];

                  return (
                    <div
                      key={review.id}
                      style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-md)",
                        padding: "1.25rem"
                      }}
                    >
                      {/* Review Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <span style={{ fontSize: "1.4rem" }}>{review.avatar}</span>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{review.author}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>{review.date}</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--accent-amber)", fontWeight: 700 }}>
                          <Star size={14} fill="var(--accent-amber)" />
                          <span>{review.rating}/10</span>
                        </div>
                      </div>

                      {/* Spoiler Badge */}
                      {review.hasSpoilers && (
                        <div style={{ marginBottom: "0.5rem" }}>
                          <button
                            type="button"
                            onClick={() => toggleSpoiler(review.id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              fontSize: "0.75rem",
                              padding: "0.2rem 0.55rem",
                              borderRadius: "4px",
                              background: "rgba(239, 68, 68, 0.15)",
                              color: "#f87171",
                              fontWeight: 600
                            }}
                          >
                            {isSpoilerHidden ? <EyeOff size={13} /> : <Eye size={13} />}
                            {isSpoilerHidden ? "Contains Spoilers (Click to reveal)" : "Hide Spoilers"}
                          </button>
                        </div>
                      )}

                      {/* Review Text */}
                      <p style={{
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        color: "var(--text-main)",
                        filter: isSpoilerHidden ? "blur(5px)" : "none",
                        userSelect: isSpoilerHidden ? "none" : "auto",
                        transition: "filter 0.2s ease"
                      }}>
                        {review.text}
                      </p>

                      {/* Helpfulness Vote Footer */}
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-dim)" }}>
                        <span>Was this review helpful?</span>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
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
                            <ThumbsUp size={14} />
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
                            <ThumbsDown size={14} />
                            <span>{review.downvotes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
