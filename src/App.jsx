import React, { useState } from "react";
import { LibraryProvider, useLibrary } from "./context/LibraryContext";
import { Navbar } from "./components/Navbar";
import { CatalogView } from "./components/CatalogView";
import { MoodMatcher } from "./components/MoodMatcher";
import { LibraryView } from "./components/LibraryView";
import { CommunityView } from "./components/CommunityView";
import { MangaDetailModal } from "./components/MangaDetailModal";
import { SurpriseModal } from "./components/SurpriseModal";
import { ProfileModal } from "./components/ProfileModal";

function MangaRecApp() {
  const { toast } = useLibrary();

  // Navigation State: 'browse' | 'matcher' | 'library' | 'community'
  const [currentTab, setCurrentTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [selectedManga, setSelectedManga] = useState(null);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Background ambient lighting */}
      <div className="ambient-glow" />

      {/* Global Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSurprise={() => setIsSurpriseOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main className="main-wrapper">
        {currentTab === "browse" && (
          <CatalogView
            onSelectManga={setSelectedManga}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === "matcher" && (
          <MoodMatcher onSelectManga={setSelectedManga} />
        )}

        {currentTab === "library" && (
          <LibraryView onSelectManga={setSelectedManga} />
        )}

        {currentTab === "community" && (
          <CommunityView onSelectManga={setSelectedManga} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: "auto",
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-glass)",
        padding: "2.5rem 1.75rem",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800, fontSize: "1.2rem" }}>
              <span>📖</span>
              <span>Manga<span className="brand-text-accent">Rec</span> Platform</span>
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginTop: "0.3rem" }}>
              Built strictly per IEEE 830 Software Requirements Specifications.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.82rem", color: "var(--text-muted)" }}>
            <span>Vector Cosine Similarity Engine</span>
            <span>•</span>
            <span>Collaborative Taste Filtering</span>
            <span>•</span>
            <span>Local Offline-First Library</span>
          </div>

          <div style={{ fontSize: "0.8rem", color: "var(--text-dim)" }}>
            © {new Date().getFullYear()} MangaRec. Official publisher redirects honored.
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedManga && (
        <MangaDetailModal
          manga={selectedManga}
          onClose={() => setSelectedManga(null)}
          onSelectManga={setSelectedManga}
        />
      )}

      {/* Surprise Roulette Modal */}
      <SurpriseModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
        onSelectManga={setSelectedManga}
      />

      {/* Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Toast Notification Renderer */}
      {toast && (
        <div className="toast-container">
          <div className={`toast-pill ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LibraryProvider>
      <MangaRecApp />
    </LibraryProvider>
  );
}
