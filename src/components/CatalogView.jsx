import React, { useState, useMemo } from "react";
import { Filter, Star, Sparkles, TrendingUp, SlidersHorizontal, RotateCcw } from "lucide-react";
import { MANGA_DATA, GENRE_LIST, DEMOGRAPHIC_LIST, FORMAT_LIST, STATUS_LIST } from "../data/mangaData";
import { MangaCard } from "./MangaCard";
import { useLibrary } from "../context/LibraryContext";
import { getPersonalizedRecommendations } from "../utils/recommendationEngine";

export function CatalogView({ onSelectManga, searchQuery, setSearchQuery, onNavigateTab }) {
  const { library, profile } = useLibrary();

  // Faceted Search State
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [selectedDemographic, setSelectedDemographic] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState("score"); // score | popularity | year | title

  // Personalized algorithmic recommendations generated from user's library
  const personalizedRecs = useMemo(() => {
    return getPersonalizedRecommendations(library, 5);
  }, [library]);

  const toggleGenreFilter = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const resetAllFilters = () => {
    setSelectedFormat("All");
    setSelectedDemographic("All");
    setSelectedStatus("All");
    setSelectedGenres([]);
    setMinScore(0);
    setSortBy("score");
    setSearchQuery("");
  };

  const hasActiveFilters = 
    selectedFormat !== "All" ||
    selectedDemographic !== "All" ||
    selectedStatus !== "All" ||
    selectedGenres.length > 0 ||
    minScore > 0 ||
    searchQuery.trim().length > 0;

  // Filtered & Sorted Manga catalog
  const filteredCatalog = useMemo(() => {
    return MANGA_DATA.filter(manga => {
      // NSFW / Explicit filter toggle
      if (profile.nsfwFilter && manga.contentRating === "Mature (17+)") {
        return false;
      }

      // Format filter
      if (selectedFormat !== "All" && manga.format !== selectedFormat) {
        return false;
      }

      // Demographic filter
      if (selectedDemographic !== "All" && manga.demographic !== selectedDemographic) {
        return false;
      }

      // Status filter
      if (selectedStatus !== "All" && manga.status !== selectedStatus) {
        return false;
      }

      // Score filter
      if (minScore > 0 && manga.score < minScore) {
        return false;
      }

      // Genre filter (Must contain all selected genres)
      if (selectedGenres.length > 0) {
        const hasAllGenres = selectedGenres.every(g => manga.genres.includes(g));
        if (!hasAllGenres) return false;
      }

      // Text Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = manga.title.toLowerCase().includes(q);
        const matchesJp = manga.japaneseTitle?.toLowerCase().includes(q);
        const matchesAuthor = manga.author?.toLowerCase().includes(q);
        const matchesArtist = manga.artist?.toLowerCase().includes(q);
        const matchesGenres = manga.genres.some(g => g.toLowerCase().includes(q));
        const matchesThemes = manga.themes?.some(t => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesJp && !matchesAuthor && !matchesArtist && !matchesGenres && !matchesThemes) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "score") return b.score - a.score;
      if (sortBy === "popularity") return a.popularityRank - b.popularityRank;
      if (sortBy === "year") return b.year - a.year;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [selectedFormat, selectedDemographic, selectedStatus, minScore, selectedGenres, searchQuery, sortBy, profile.nsfwFilter]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Hero Showcase Banner */}
      {!hasActiveFilters && (
        <section className="hero-banner" id="hero-showcase">
          <img
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop"
            alt="Hero Manga Art"
            className="hero-backdrop-img"
          />
          <div className="hero-overlay">
            <div className="hero-pill-tag">
              <Sparkles size={14} />
              Intelligent Vector Discovery
            </div>
            <h1 className="hero-title">
              Find Your Next Obsession Across Worlds.
            </h1>
            <p className="hero-description">
              MangaRec powers high-accuracy content similarity, 12-dimensional semantic vector embeddings, 
              real-time progress tracking, and curated community discussions.
            </p>

            <div className="hero-actions-row">
              <button
                type="button"
                className="btn-primary"
                onClick={() => onNavigateTab("matcher")}
              >
                <Sparkles size={16} />
                Try Mood Matcher
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onNavigateTab("library")}
              >
                View My Reading Tracker
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Personalized AI Recommendations Shelf (FR-3.1 to FR-3.2) */}
      {!hasActiveFilters && personalizedRecs.length > 0 && (
        <section>
          <div className="section-header-row">
            <div className="section-title-wrap">
              <h2>
                <Sparkles size={22} color="var(--accent-crimson)" />
                <span>Recommended For Your Taste</span>
              </h2>
              <div className="section-subtitle">
                Synthesized from your ratings, favorites, and completed reading patterns
              </div>
            </div>
          </div>

          <div className="manga-grid">
            {personalizedRecs.map(({ manga, affinityScore, reasons }) => (
              <MangaCard 
                key={`rec-${manga.id}`} 
                manga={manga} 
                onSelect={onSelectManga}
                fitScore={affinityScore}
              />
            ))}
          </div>
        </section>
      )}

      {/* Faceted Search & Filter Toolbar (FR-2.2) */}
      <section className="filter-toolbar" id="catalog-filters">
        {/* Row 1: Format & Demographics */}
        <div className="filter-row">
          <span className="filter-group-label">Format:</span>
          {FORMAT_LIST.map(format => (
            <button
              key={format}
              type="button"
              className={`filter-tag-pill ${selectedFormat === format ? 'active' : ''}`}
              onClick={() => setSelectedFormat(format)}
            >
              {format}
            </button>
          ))}

          <div style={{ width: "1px", height: "20px", background: "var(--border-subtle)", margin: "0 0.5rem" }} />

          <span className="filter-group-label">Demographic:</span>
          {DEMOGRAPHIC_LIST.map(demo => (
            <button
              key={demo}
              type="button"
              className={`filter-tag-pill ${selectedDemographic === demo ? 'active' : ''}`}
              onClick={() => setSelectedDemographic(demo)}
            >
              {demo}
            </button>
          ))}
        </div>

        {/* Row 2: Status, Min Score, & Sort */}
        <div className="filter-row" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span className="filter-group-label">Status:</span>
            {STATUS_LIST.map(status => (
              <button
                key={status}
                type="button"
                className={`filter-tag-pill ${selectedStatus === status ? 'active' : ''}`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </button>
            ))}

            <div style={{ width: "1px", height: "20px", background: "var(--border-subtle)", margin: "0 0.5rem" }} />

            <span className="filter-group-label">Min Rating:</span>
            <select
              value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-full)",
                padding: "0.35rem 0.85rem",
                fontSize: "0.8rem",
                color: minScore > 0 ? "var(--accent-amber)" : "var(--text-main)",
                fontWeight: 600
              }}
            >
              <option value="0">Any Rating</option>
              <option value="8.0">★ 8.0 & Above</option>
              <option value="8.5">★ 8.5 & Above</option>
              <option value="9.0">★ 9.0 (Masterpieces)</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 700 }}>SORT:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-full)",
                padding: "0.35rem 0.85rem",
                fontSize: "0.8rem",
                color: "var(--text-main)",
                fontWeight: 600
              }}
            >
              <option value="score">Highest Rated</option>
              <option value="popularity">Most Popular</option>
              <option value="year">Newest Release</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Row 3: Genres Multi-select Chips */}
        <div className="filter-row">
          <span className="filter-group-label">Genres:</span>
          {GENRE_LIST.map(genre => {
            const isSelected = selectedGenres.includes(genre);
            return (
              <button
                key={genre}
                type="button"
                className={`filter-tag-pill ${isSelected ? 'active' : ''}`}
                onClick={() => toggleGenreFilter(genre)}
              >
                {isSelected ? `✓ ${genre}` : genre}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                color: "var(--accent-crimson)",
                fontWeight: 600,
                marginLeft: "auto"
              }}
            >
              <RotateCcw size={13} />
              Reset All Filters
            </button>
          )}
        </div>
      </section>

      {/* Catalog Results Grid */}
      <section>
        <div className="section-header-row">
          <div className="section-title-wrap">
            <h2>
              <span>Browse Catalog</span>
              <span style={{ fontSize: "0.9rem", color: "var(--text-dim)", fontFamily: "var(--font-mono)" }}>
                ({filteredCatalog.length} titles)
              </span>
            </h2>
            {searchQuery && (
              <div className="section-subtitle">
                Showing results matching search: "<strong>{searchQuery}</strong>"
              </div>
            )}
          </div>
        </div>

        {filteredCatalog.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", background: "var(--bg-card)", borderRadius: "var(--radius-xl)" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
              No manga match your current combination of filters.
            </p>
            <button type="button" className="btn-primary" onClick={resetAllFilters} style={{ marginTop: "1rem" }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="manga-grid">
            {filteredCatalog.map(manga => (
              <MangaCard 
                key={manga.id} 
                manga={manga} 
                onSelect={onSelectManga} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
