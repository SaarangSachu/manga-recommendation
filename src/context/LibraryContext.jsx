import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { MANGA_DATA } from "../data/mangaData";
import { COMMUNITY_REVIEWS, CURATED_LISTS } from "../data/communityData";

const LibraryContext = createContext();

const STORAGE_KEY_LIB = "mangarec_library_v1";
const STORAGE_KEY_PROFILE = "mangarec_profile_v1";
const STORAGE_KEY_REVIEWS = "mangarec_reviews_v1";
const STORAGE_KEY_LISTS = "mangarec_user_lists_v1";
const STORAGE_KEY_VOTES = "mangarec_review_votes_v1";

// Initial seed library for an engaging experience on first visit
const DEFAULT_INITIAL_LIBRARY = {
  "berserk": {
    status: "Reading",
    chapter: 250,
    volume: 28,
    score: 10,
    favorite: true,
    notes: "The Golden Age arc was unmatched fiction. Currently at Conviction arc.",
    reReadCount: 1,
    updatedAt: new Date().toISOString()
  },
  "frieren": {
    status: "Completed",
    chapter: 135,
    volume: 13,
    score: 10,
    favorite: true,
    notes: "Profoundly peaceful and touching. Himmel's legacy shines.",
    reReadCount: 0,
    updatedAt: new Date().toISOString()
  },
  "solo-leveling": {
    status: "Completed",
    chapter: 200,
    volume: 9,
    score: 9,
    favorite: true,
    notes: "Legendary hype. The Jeju Island arc was peak.",
    reReadCount: 2,
    updatedAt: new Date().toISOString()
  },
  "monster": {
    status: "Plan to Read",
    chapter: 0,
    volume: 0,
    score: 0,
    favorite: false,
    notes: "Recommended by multiple friends for psychological suspense.",
    reReadCount: 0,
    updatedAt: new Date().toISOString()
  }
};

const DEFAULT_PROFILE = {
  username: "RavenReader",
  displayName: "Raven",
  avatarEmoji: "⚔️",
  bio: "Seinen connoisseur, dark fantasy lover, and manhwa speed-reader.",
  preferredDemographics: ["Seinen", "Shounen"],
  nsfwFilter: false,
  joinedDate: "October 2025"
};

export function LibraryProvider({ children }) {
  // 1. Library State
  const [library, setLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIB);
      return saved ? JSON.parse(saved) : DEFAULT_INITIAL_LIBRARY;
    } catch {
      return DEFAULT_INITIAL_LIBRARY;
    }
  });

  // 2. Profile State
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // 3. Reviews State (Community + User)
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
      return saved ? JSON.parse(saved) : COMMUNITY_REVIEWS;
    } catch {
      return COMMUNITY_REVIEWS;
    }
  });

  // 4. Custom User Lists
  const [userLists, setUserLists] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LISTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Review Upvotes tracker
  const [reviewVotes, setReviewVotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOTES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 6. Active Toast notification
  const [toast, setToast] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LIB, JSON.stringify(library));
  }, [library]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LISTS, JSON.stringify(userLists));
  }, [userLists]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VOTES, JSON.stringify(reviewVotes));
  }, [reviewVotes]);

  // Toast Helper
  const showToast = (message, type = "success") => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Confetti trigger
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff3366", "#9d4edd", "#00f0ff", "#ffb703"]
      });
    } catch (e) {
      console.warn("Confetti error", e);
    }
  };

  // Library mutation helpers
  const updateStatus = (mangaId, newStatus) => {
    const meta = MANGA_DATA.find(m => m.id === mangaId);
    setLibrary(prev => {
      const current = prev[mangaId] || {
        chapter: 0,
        volume: 0,
        score: 0,
        favorite: false,
        notes: "",
        reReadCount: 0
      };

      const updated = {
        ...current,
        status: newStatus,
        chapter: newStatus === "Completed" && meta?.chapters ? meta.chapters : current.chapter,
        updatedAt: new Date().toISOString()
      };

      return { ...prev, [mangaId]: updated };
    });

    if (newStatus === "Completed") {
      triggerCelebration();
      showToast(`🎉 Marked "${meta?.title || mangaId}" as Completed!`, "success");
    } else {
      showToast(`Updated "${meta?.title || mangaId}" status to ${newStatus}`, "info");
    }
  };

  const incrementChapter = (mangaId, maxChapters = null) => {
    setLibrary(prev => {
      const current = prev[mangaId] || {
        status: "Reading",
        chapter: 0,
        volume: 0,
        score: 0,
        favorite: false,
        notes: ""
      };

      const nextChapter = current.chapter + 1;
      let newStatus = current.status;
      if (maxChapters && nextChapter >= maxChapters) {
        newStatus = "Completed";
        triggerCelebration();
        showToast(`🎉 Completed all ${maxChapters} chapters!`, "success");
      }

      return {
        ...prev,
        [mangaId]: {
          ...current,
          chapter: nextChapter,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const decrementChapter = (mangaId) => {
    setLibrary(prev => {
      const current = prev[mangaId];
      if (!current || current.chapter <= 0) return prev;
      return {
        ...prev,
        [mangaId]: {
          ...current,
          chapter: current.chapter - 1,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const setChapter = (mangaId, newChapter) => {
    const chapNum = Math.max(0, parseInt(newChapter, 10) || 0);
    setLibrary(prev => {
      const current = prev[mangaId] || {
        status: "Reading",
        volume: 0,
        score: 0,
        favorite: false,
        notes: ""
      };
      return {
        ...prev,
        [mangaId]: {
          ...current,
          chapter: chapNum,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const setScore = (mangaId, score) => {
    setLibrary(prev => {
      const current = prev[mangaId] || {
        status: "Reading",
        chapter: 0,
        volume: 0,
        favorite: false,
        notes: ""
      };
      return {
        ...prev,
        [mangaId]: {
          ...current,
          score: Number(score),
          updatedAt: new Date().toISOString()
        }
      };
    });
    showToast(`Rated ${score}/10!`, "success");
  };

  const toggleFavorite = (mangaId) => {
    setLibrary(prev => {
      const current = prev[mangaId] || {
        status: "Plan to Read",
        chapter: 0,
        volume: 0,
        score: 0,
        notes: ""
      };
      const isFav = !current.favorite;
      showToast(isFav ? "Added to Favorites ❤️" : "Removed from Favorites", "info");
      return {
        ...prev,
        [mangaId]: {
          ...current,
          favorite: isFav,
          updatedAt: new Date().toISOString()
        }
      };
    });
  };

  const saveNotes = (mangaId, notes) => {
    setLibrary(prev => {
      const current = prev[mangaId] || {
        status: "Plan to Read",
        chapter: 0,
        volume: 0,
        score: 0,
        favorite: false
      };
      return {
        ...prev,
        [mangaId]: {
          ...current,
          notes,
          updatedAt: new Date().toISOString()
        }
      };
    });
    showToast("Notes saved successfully", "info");
  };

  const removeFromLibrary = (mangaId) => {
    setLibrary(prev => {
      const copy = { ...prev };
      delete copy[mangaId];
      return copy;
    });
    showToast("Removed from your library", "warning");
  };

  // Custom Lists
  const createCustomList = ({ title, description, mangaIds, icon = "📁" }) => {
    const newList = {
      id: `custom-${Date.now()}`,
      title,
      description,
      creator: profile.displayName || "You",
      badge: "Custom",
      icon,
      mangaIds,
      createdAt: new Date().toISOString()
    };
    setUserLists(prev => [newList, ...prev]);
    showToast(`Created custom list "${title}"!`, "success");
    return newList;
  };

  const deleteCustomList = (listId) => {
    setUserLists(prev => prev.filter(l => l.id !== listId));
    showToast("Deleted list", "info");
  };

  // Review Submissions & Voting
  const addReview = ({ mangaId, rating, text, hasSpoilers }) => {
    const newRev = {
      id: `user-rev-${Date.now()}`,
      mangaId,
      author: profile.displayName || "You",
      avatar: profile.avatarEmoji || "👤",
      rating: Number(rating),
      date: "Just now",
      upvotes: 1,
      downvotes: 0,
      hasSpoilers: Boolean(hasSpoilers),
      text
    };
    setReviews(prev => [newRev, ...prev]);
    showToast("Your review has been published!", "success");
  };

  const voteReview = (reviewId, direction) => {
    const currentVote = reviewVotes[reviewId];
    if (currentVote === direction) {
      // Toggle off
      setReviewVotes(prev => {
        const copy = { ...prev };
        delete copy[reviewId];
        return copy;
      });
      setReviews(prev => prev.map(r => {
        if (r.id !== reviewId) return r;
        return {
          ...r,
          upvotes: direction === "up" ? r.upvotes - 1 : r.upvotes,
          downvotes: direction === "down" ? r.downvotes - 1 : r.downvotes
        };
      }));
      return;
    }

    setReviewVotes(prev => ({ ...prev, [reviewId]: direction }));
    setReviews(prev => prev.map(r => {
      if (r.id !== reviewId) return r;
      let up = r.upvotes;
      let down = r.downvotes;
      if (currentVote === "up") up--;
      if (currentVote === "down") down--;
      if (direction === "up") up++;
      if (direction === "down") down++;
      return { ...r, upvotes: Math.max(0, up), downvotes: Math.max(0, down) };
    }));
  };

  // Import / Export
  const exportToJSON = () => {
    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      profile,
      library,
      customLists: userLists
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mangarec-library-${profile.username.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Library exported to JSON", "success");
  };

  const importFromJSON = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.library) {
        setLibrary(prev => ({ ...prev, ...data.library }));
      }
      if (data.customLists && Array.isArray(data.customLists)) {
        setUserLists(prev => [...data.customLists, ...prev]);
      }
      if (data.profile) {
        setProfile(prev => ({ ...prev, ...data.profile }));
      }
      showToast("Library successfully imported!", "success");
      return true;
    } catch (err) {
      showToast("Failed to parse JSON file. Please check the format.", "error");
      return false;
    }
  };

  // Aggregate user statistics
  const trackedItems = Object.entries(library);
  const totalTracked = trackedItems.length;
  const completedCount = trackedItems.filter(([_, v]) => v.status === "Completed").length;
  const readingCount = trackedItems.filter(([_, v]) => v.status === "Reading").length;
  const totalChaptersRead = trackedItems.reduce((acc, [_, v]) => acc + (v.chapter || 0), 0);
  
  const ratedItems = trackedItems.filter(([_, v]) => v.score > 0);
  const averageScore = ratedItems.length > 0 
    ? (ratedItems.reduce((acc, [_, v]) => acc + v.score, 0) / ratedItems.length).toFixed(1)
    : "—";

  return (
    <LibraryContext.Provider
      value={{
        library,
        profile,
        reviews,
        reviewVotes,
        userLists,
        allLists: [...CURATED_LISTS, ...userLists],
        toast,
        stats: {
          totalTracked,
          completedCount,
          readingCount,
          totalChaptersRead,
          averageScore
        },
        updateStatus,
        incrementChapter,
        decrementChapter,
        setChapter,
        setScore,
        toggleFavorite,
        saveNotes,
        removeFromLibrary,
        setProfile,
        createCustomList,
        deleteCustomList,
        addReview,
        voteReview,
        exportToJSON,
        importFromJSON,
        showToast
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}
