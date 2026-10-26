import React, { useState } from "react";
import { Compass, Sparkles, Bookmark, Users, Search, Dice5, User } from "lucide-react";
import { useLibrary } from "../context/LibraryContext";

export function Navbar({ 
  currentTab, 
  onSelectTab, 
  onOpenSurprise, 
  onOpenProfile, 
  searchQuery, 
  setSearchQuery 
}) {
  const { profile, stats } = useLibrary();

  return (
    <header className="navbar-header">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <div 
          className="brand-logo" 
          onClick={() => onSelectTab("browse")}
          id="navbar-brand-logo"
        >
          <div className="brand-icon-badge">
            📖
          </div>
          <div>
            Manga<span className="brand-text-accent">Rec</span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="nav-links-desktop">
          <button
            type="button"
            className={`nav-item-btn ${currentTab === 'browse' ? 'active' : ''}`}
            onClick={() => onSelectTab("browse")}
            id="nav-tab-browse"
          >
            <Compass size={16} />
            <span>Catalog & Search</span>
          </button>

          <button
            type="button"
            className={`nav-item-btn ${currentTab === 'matcher' ? 'active' : ''}`}
            onClick={() => onSelectTab("matcher")}
            id="nav-tab-matcher"
          >
            <Sparkles size={16} color="var(--accent-cyan)" />
            <span>Mood Matcher</span>
          </button>

          <button
            type="button"
            className={`nav-item-btn ${currentTab === 'library' ? 'active' : ''}`}
            onClick={() => onSelectTab("library")}
            id="nav-tab-library"
          >
            <Bookmark size={16} color="var(--accent-crimson)" />
            <span>My Library</span>
            {stats.totalTracked > 0 && (
              <span style={{
                fontSize: "0.7rem",
                padding: "0.1rem 0.45rem",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-card-hover)",
                color: "var(--text-muted)"
              }}>
                {stats.totalTracked}
              </span>
            )}
          </button>

          <button
            type="button"
            className={`nav-item-btn ${currentTab === 'community' ? 'active' : ''}`}
            onClick={() => onSelectTab("community")}
            id="nav-tab-community"
          >
            <Users size={16} />
            <span>Community Lists</span>
          </button>
        </nav>

        {/* Global Search Bar */}
        <div className="nav-search-bar">
          <Search size={15} color="var(--text-dim)" />
          <input
            type="text"
            placeholder="Search titles, authors, genres..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              if (currentTab !== "browse" && e.target.value.trim()) {
                onSelectTab("browse");
              }
            }}
            id="nav-search-input"
          />
        </div>

        {/* Actions & Profile */}
        <div className="nav-actions">
          {/* Surprise Me Button */}
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenSurprise}
            title="Curated randomizer weighted by high ratings"
            id="surprise-me-btn"
          >
            <Dice5 size={16} />
            <span>Surprise Me</span>
          </button>

          {/* User Profile Pill */}
          <div 
            className="user-profile-pill" 
            onClick={onOpenProfile}
            title="Profile & Preferences"
            id="user-profile-button"
          >
            <div className="avatar-badge">
              {profile.avatarEmoji || "👤"}
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>
              {profile.displayName || "Profile"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
