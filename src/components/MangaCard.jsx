import React from "react";
import { Star, Heart, Plus, Bookmark } from "lucide-react";
import { useLibrary } from "../context/LibraryContext";

export function MangaCard({ manga, onSelect, fitScore = null }) {
  const { library, updateStatus, incrementChapter, toggleFavorite } = useLibrary();
  const tracked = library[manga.id];

  const handleCardClick = () => {
    if (onSelect) onSelect(manga);
  };

  const handleFavClick = (e) => {
    e.stopPropagation();
    toggleFavorite(manga.id);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (!tracked) {
      updateStatus(manga.id, "Reading");
    } else {
      incrementChapter(manga.id, manga.chapters);
    }
  };

  const formatClass = (manga.format || "manga").toLowerCase();

  return (
    <div className="manga-card" onClick={handleCardClick} id={`manga-card-${manga.id}`}>
      {/* Poster Image Container */}
      <div className="card-poster-wrap">
        <img 
          src={manga.coverImage} 
          alt={manga.title} 
          className="card-poster-img"
          loading="lazy"
          onError={(e) => {
            // Elegant fallback gradient if remote image fails
            e.target.style.display = 'none';
            e.target.parentElement.style.background = `linear-gradient(135deg, ${manga.accentColor || '#334155'}, #090a10)`;
          }}
        />
        <div className="card-gradient-overlay" />

        {/* Top Badges */}
        <div className="card-badges-top">
          <span className={`badge-format ${formatClass}`}>
            {manga.format}
          </span>
          <div className="badge-score">
            <Star size={12} fill="#ffb703" color="#ffb703" />
            <span>{manga.score.toFixed(1)}</span>
          </div>
        </div>

        {/* Quick Action Floating Buttons */}
        <div className="card-quick-actions">
          <button 
            type="button"
            className={`card-icon-btn ${tracked?.favorite ? 'is-fav' : ''}`}
            onClick={handleFavClick}
            title={tracked?.favorite ? "In Favorites" : "Add to Favorites"}
            id={`fav-btn-${manga.id}`}
          >
            <Heart size={15} fill={tracked?.favorite ? "#ff3366" : "none"} />
          </button>
          
          <button 
            type="button"
            className="card-icon-btn"
            onClick={handleQuickAdd}
            title={!tracked ? "Add to Library (Reading)" : "Increment Chapter (+1)"}
            id={`quick-add-${manga.id}`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="card-body">
        {fitScore && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.75rem",
            fontWeight: 800,
            color: "var(--accent-cyan)",
            background: "rgba(0, 240, 255, 0.1)",
            padding: "0.15rem 0.5rem",
            borderRadius: "4px",
            width: "fit-content",
            fontFamily: "var(--font-mono)"
          }}>
            ⚡ {fitScore}% Vibe Match
          </div>
        )}

        <h3 className="card-title" title={manga.title}>{manga.title}</h3>
        
        <div className="card-subinfo">
          <span>{manga.year}</span>
          <span>•</span>
          <span>{manga.demographic}</span>
          <span>•</span>
          <span>{manga.chapters ? `${manga.chapters} ch` : 'Ongoing'}</span>
        </div>

        {/* Genre Chips */}
        <div className="card-tags">
          {manga.genres.slice(0, 2).map(genre => (
            <span key={genre} className="genre-chip">{genre}</span>
          ))}
          {manga.themes && manga.themes[0] && (
            <span className="genre-chip" style={{ color: "var(--accent-amber)" }}>
              {manga.themes[0]}
            </span>
          )}
        </div>

        {/* Tracker Footer Strip if User has item in library */}
        {tracked && (
          <div className="card-tracker-strip">
            <span className={`card-status-pill ${tracked.status.toLowerCase().replace(/\s+/g, '')}`}>
              {tracked.status}
            </span>
            <button 
              type="button" 
              className="card-chap-inc-btn" 
              onClick={handleQuickAdd}
              title="Click to increment chapter"
            >
              Ch. {tracked.chapter}{manga.chapters ? `/${manga.chapters}` : ''}
              <Plus size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
