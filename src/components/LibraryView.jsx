import React, { useState, useMemo, useRef } from "react";
import { 
  Bookmark, CheckCircle, Clock, BookOpen, Star, Heart, 
  Plus, Minus, Download, Upload, Trash2, Search, BarChart3, Edit3 
} from "lucide-react";
import { useLibrary } from "../context/LibraryContext";
import { MANGA_DATA } from "../data/mangaData";

export function LibraryView({ onSelectManga }) {
  const { 
    library, 
    stats, 
    updateStatus, 
    incrementChapter, 
    decrementChapter, 
    setScore, 
    toggleFavorite, 
    removeFromLibrary,
    exportToJSON,
    importFromJSON,
    profile
  } = useLibrary();

  const [activeFilter, setActiveFilter] = useState("All"); // All | Reading | Completed | On Hold | Plan to Read | Dropped | Favorites
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);

  // Combine library tracking data with canonical manga metadata
  const libraryEntries = useMemo(() => {
    return Object.entries(library).map(([mangaId, tracking]) => {
      const canonical = MANGA_DATA.find(m => m.id === mangaId);
      return {
        id: mangaId,
        tracking,
        canonical: canonical || {
          id: mangaId,
          title: mangaId.replace(/-/g, ' ').toUpperCase(),
          coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600",
          genres: ["Custom"],
          score: 8.0,
          format: "Manga"
        }
      };
    });
  }, [library]);

  // Filtered and searched library items
  const filteredItems = useMemo(() => {
    return libraryEntries.filter(({ canonical, tracking }) => {
      // Status/Favorite filter
      if (activeFilter === "Favorites" && !tracking.favorite) return false;
      if (activeFilter !== "All" && activeFilter !== "Favorites" && tracking.status !== activeFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = canonical.title.toLowerCase().includes(q);
        const matchesGenres = canonical.genres?.some(g => g.toLowerCase().includes(q));
        const matchesNotes = tracking.notes?.toLowerCase().includes(q);
        return matchesTitle || matchesGenres || matchesNotes;
      }

      return true;
    });
  }, [libraryEntries, activeFilter, searchQuery]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        importFromJSON(content);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header and Import/Export Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div className="hero-pill-tag" style={{ marginBottom: "0.5rem" }}>
            <Bookmark size={14} />
            FR-4.1 Reading Tracker
          </div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>
            {profile.displayName || "My"}'s Manga Library
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Centralized tracking, chapter progress, private scores, and backup sync.
          </p>
        </div>

        {/* Import/Export buttons */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,.xml"
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            title="Import library from JSON file"
          >
            <Upload size={15} />
            Import (.JSON)
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={exportToJSON}
            title="Export full library backup"
          >
            <Download size={15} />
            Export (.JSON)
          </button>
        </div>
      </div>

      {/* Aggregate Stats Dashboard Row */}
      <div className="stats-strip">
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ color: "var(--accent-crimson)" }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div className="stat-value">{stats.totalTracked}</div>
            <div className="stat-label">Total Titles</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ color: "var(--accent-cyan)" }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-value">{stats.readingCount}</div>
            <div className="stat-label">Currently Reading</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ color: "var(--accent-emerald)" }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="stat-value">{stats.completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ color: "var(--accent-amber)" }}>
            <BarChart3 size={22} />
          </div>
          <div>
            <div className="stat-value">{stats.totalChaptersRead}</div>
            <div className="stat-label">Chapters Read</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ color: "#f59e0b" }}>
            <Star size={22} fill="#f59e0b" />
          </div>
          <div>
            <div className="stat-value">{stats.averageScore}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        padding: "1rem 1.25rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {["All", "Reading", "Completed", "Plan to Read", "On Hold", "Dropped", "Favorites"].map(tab => {
            const count = tab === "All" 
              ? libraryEntries.length 
              : tab === "Favorites"
                ? libraryEntries.filter(e => e.tracking.favorite).length
                : libraryEntries.filter(e => e.tracking.status === tab).length;

            const isActive = activeFilter === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                style={{
                  padding: "0.35rem 0.85rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  background: isActive ? "var(--accent-crimson)" : "var(--bg-surface)",
                  color: isActive ? "#fff" : "var(--text-muted)",
                  border: "1px solid",
                  borderColor: isActive ? "var(--accent-crimson)" : "var(--border-subtle)",
                  transition: "var(--transition-fast)"
                }}
              >
                {tab === "Favorites" ? "❤️ Favorites" : tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Search within library */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-full)",
          padding: "0.35rem 0.85rem",
          minWidth: "220px"
        }}>
          <Search size={14} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search my library..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ background: "transparent", fontSize: "0.82rem", width: "100%" }}
          />
        </div>
      </div>

      {/* Library Table / List */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "var(--bg-card)", borderRadius: "var(--radius-xl)" }}>
          <Bookmark size={40} color="var(--text-dim)" style={{ marginBottom: "1rem", opacity: 0.5 }} />
          <h3 style={{ fontSize: "1.2rem", color: "var(--text-main)" }}>No titles in this category</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "0.25rem", fontSize: "0.9rem" }}>
            Explore the catalog or use the Mood Matcher to discover and add manga to your tracker.
          </p>
        </div>
      ) : (
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden"
        }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
                  <th style={{ padding: "1rem 1.25rem" }}>Title</th>
                  <th style={{ padding: "1rem" }}>Status</th>
                  <th style={{ padding: "1rem" }}>Progress</th>
                  <th style={{ padding: "1rem" }}>My Score</th>
                  <th style={{ padding: "1rem" }}>Notes</th>
                  <th style={{ padding: "1rem 1.25rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(({ id, canonical, tracking }) => (
                  <tr 
                    key={id}
                    style={{ borderBottom: "1px solid var(--border-subtle)", transition: "var(--transition-fast)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Title & Cover */}
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      <div 
                        style={{ display: "flex", alignItems: "center", gap: "0.85rem", cursor: "pointer" }}
                        onClick={() => onSelectManga(canonical)}
                      >
                        <img 
                          src={canonical.coverImage} 
                          alt={canonical.title}
                          style={{
                            width: "44px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "var(--radius-sm)"
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: "#fff" }}>{canonical.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                            {canonical.format} • {canonical.demographic}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Pill Dropdown */}
                    <td style={{ padding: "1rem" }}>
                      <select
                        value={tracking.status}
                        onChange={e => updateStatus(id, e.target.value)}
                        style={{
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "var(--radius-sm)",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: tracking.status === "Completed" ? "var(--accent-emerald)" : tracking.status === "Reading" ? "var(--accent-cyan)" : "var(--text-main)"
                        }}
                      >
                        <option value="Reading">Reading</option>
                        <option value="Completed">Completed</option>
                        <option value="Plan to Read">Plan to Read</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Dropped">Dropped</option>
                      </select>
                    </td>

                    {/* Chapter Progress Stepper */}
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <button
                          type="button"
                          className="card-icon-btn"
                          style={{ width: "24px", height: "24px" }}
                          onClick={() => decrementChapter(id)}
                          title="Decrement Chapter"
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, minWidth: "45px", textAlign: "center" }}>
                          {tracking.chapter}
                        </span>
                        <button
                          type="button"
                          className="card-icon-btn"
                          style={{ width: "24px", height: "24px" }}
                          onClick={() => incrementChapter(id, canonical.chapters)}
                          title="Increment Chapter (+1)"
                        >
                          <Plus size={12} />
                        </button>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                          / {canonical.chapters || '∞'}
                        </span>
                      </div>
                    </td>

                    {/* My Score Selector */}
                    <td style={{ padding: "1rem" }}>
                      <select
                        value={tracking.score || 0}
                        onChange={e => setScore(id, e.target.value)}
                        style={{
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "var(--radius-sm)",
                          padding: "0.25rem 0.45rem",
                          fontSize: "0.8rem",
                          color: tracking.score ? "var(--accent-amber)" : "var(--text-dim)",
                          fontWeight: 700
                        }}
                      >
                        <option value="0">—</option>
                        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(n => (
                          <option key={n} value={n}>★ {n}</option>
                        ))}
                      </select>
                    </td>

                    {/* Notes Snippet */}
                    <td style={{ padding: "1rem", maxWidth: "220px" }}>
                      <div 
                        style={{ 
                          fontSize: "0.78rem", 
                          color: tracking.notes ? "var(--text-muted)" : "var(--text-dim)",
                          fontStyle: tracking.notes ? "normal" : "italic",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}
                        title={tracking.notes || "Click title to add notes"}
                      >
                        {tracking.notes || "No notes"}
                      </div>
                    </td>

                    {/* Actions: Fav + Remove */}
                    <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                        <button
                          type="button"
                          className={`card-icon-btn ${tracking.favorite ? 'is-fav' : ''}`}
                          style={{ width: "30px", height: "30px" }}
                          onClick={() => toggleFavorite(id)}
                          title="Toggle Favorite"
                        >
                          <Heart size={14} fill={tracking.favorite ? "#ff3366" : "none"} />
                        </button>
                        <button
                          type="button"
                          className="card-icon-btn"
                          style={{ width: "30px", height: "30px" }}
                          onClick={() => removeFromLibrary(id)}
                          title="Delete from Library"
                        >
                          <Trash2 size={13} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
