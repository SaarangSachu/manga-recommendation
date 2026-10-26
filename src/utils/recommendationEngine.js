// Recommendation Engine: Vector Cosine Similarity, Hybrid Content-Based Filtering,
// Collaborative Taste Profile Synthesis, and Mood Matching.

import { MANGA_DATA } from "../data/mangaData";

/**
 * Calculates Cosine Similarity between two N-dimensional numerical vectors.
 * Returns value between 0.0 and 1.0.
 */
export function calculateCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Jaccard Index for two arrays of strings (e.g. genres or themes).
 */
export function calculateJaccardIndex(arrayA = [], arrayB = []) {
  if (!arrayA.length || !arrayB.length) return 0;
  const setA = new Set(arrayA.map(s => s.toLowerCase()));
  const setB = new Set(arrayB.map(s => s.toLowerCase()));
  
  let intersectionSize = 0;
  for (const item of setA) {
    if (setB.has(item)) intersectionSize++;
  }
  
  const unionSize = new Set([...setA, ...setB]).size;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

/**
 * Calculate comprehensive hybrid similarity score between two manga.
 * Returns { score: number (0 to 100), reasons: string[] }
 */
export function getHybridSimilarity(mangaA, mangaB) {
  if (!mangaA || !mangaB || mangaA.id === mangaB.id) {
    return { score: 0, reasons: [] };
  }

  // 1. Vector Cosine Similarity (Weight: 45%)
  const vectorSim = calculateCosineSimilarity(mangaA.vector, mangaB.vector);

  // 2. Genre Jaccard Similarity (Weight: 25%)
  const genreSim = calculateJaccardIndex(mangaA.genres, mangaB.genres);

  // 3. Theme Jaccard Similarity (Weight: 20%)
  const themeSim = calculateJaccardIndex(mangaA.themes, mangaB.themes);

  // 4. Demographic & Format Affinity (Weight: 5%)
  const demoMatch = mangaA.demographic === mangaB.demographic ? 1.0 : 0.4;
  const formatMatch = mangaA.format === mangaB.format ? 1.0 : 0.7;
  const metaSim = (demoMatch + formatMatch) / 2;

  // 5. Author/Artist Bonus (Weight: 5%)
  const authorMatch = (mangaA.author && mangaB.author && mangaA.author === mangaB.author) ? 1.0 : 0.0;

  // Weighted total
  const rawScore = (vectorSim * 0.45) + (genreSim * 0.25) + (themeSim * 0.20) + (metaSim * 0.05) + (authorMatch * 0.05);
  const normalizedScore = Math.min(99, Math.max(35, Math.round(rawScore * 100)));

  // Generate explainability breakdown
  const reasons = [];
  const sharedGenres = (mangaA.genres || []).filter(g => (mangaB.genres || []).includes(g));
  const sharedThemes = (mangaA.themes || []).filter(t => (mangaB.themes || []).includes(t));

  if (authorMatch) {
    reasons.push(`Created by the same mastermind (${mangaA.author})`);
  }
  if (sharedThemes.length > 0) {
    reasons.push(`Shared themes: ${sharedThemes.slice(0, 2).join(", ")}`);
  }
  if (sharedGenres.length > 0) {
    reasons.push(`Common genres: ${sharedGenres.slice(0, 2).join(", ")}`);
  }
  if (vectorSim > 0.85) {
    reasons.push("Extremely high semantic tone & pacing match");
  } else if (mangaA.demographic === mangaB.demographic) {
    reasons.push(`Targeted toward ${mangaA.demographic} readers`);
  }

  return {
    score: normalizedScore,
    reasons: reasons.slice(0, 3)
  };
}

/**
 * Get recommendations for a single manga title ("If you liked X, try Y").
 */
export function getRecommendationsForManga(targetMangaId, count = 6, excludedIds = []) {
  const target = MANGA_DATA.find(m => m.id === targetMangaId);
  if (!target) return [];

  const candidates = MANGA_DATA.filter(m => m.id !== targetMangaId && !excludedIds.includes(m.id));
  
  const scored = candidates.map(candidate => {
    const { score, reasons } = getHybridSimilarity(target, candidate);
    return {
      manga: candidate,
      similarityScore: score,
      reasons
    };
  });

  return scored
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, count);
}

/**
 * Mood/Vibe Matcher: Find manga that align with a desired vector profile
 * and respect negative filters (blacklisted tags/tropes).
 */
export function getMangaByMood({
  targetVector,
  blacklistedGenres = [],
  blacklistedThemes = [],
  allowMature = true,
  count = 8
}) {
  if (!targetVector || targetVector.length !== 12) return [];

  return MANGA_DATA
    .filter(manga => {
      // Content Rating filter
      if (!allowMature && manga.contentRating === "Mature (17+)") {
        return false;
      }

      // Negative filters: Exclude any title with blacklisted genres
      if (blacklistedGenres.some(g => manga.genres.includes(g))) {
        return false;
      }

      // Negative filters: Exclude any title with blacklisted themes
      if (blacklistedThemes.some(t => manga.themes.includes(t))) {
        return false;
      }

      return true;
    })
    .map(manga => {
      const cosineSim = calculateCosineSimilarity(targetVector, manga.vector);
      // Quality weighting: add slight boost for higher rated series
      const scoreBonus = (manga.score / 10) * 0.15;
      const finalFit = Math.min(99, Math.round((cosineSim * 0.85 + scoreBonus) * 100));

      return {
        manga,
        fitScore: finalFit,
        cosineSim
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, count);
}

/**
 * Personalized User Library Recommendations (Collaborative & Content Synthesis).
 * Analyzes the user's tracked library to build a personal taste profile vector,
 * then recommends fresh unread manga.
 */
export function getPersonalizedRecommendations(userLibrary = {}, count = 6) {
  const trackedIds = Object.keys(userLibrary);
  
  // Find entries the user enjoyed (Rated >= 7, or Completed/Reading with score > 6, or marked Favorite)
  const positiveEntries = trackedIds.map(id => {
    const item = userLibrary[id];
    const meta = MANGA_DATA.find(m => m.id === id);
    if (!meta) return null;

    let weight = 1.0;
    if (item.favorite) weight += 1.5;
    if (item.score) {
      if (item.score >= 9) weight += 2.0;
      else if (item.score >= 7) weight += 1.0;
      else if (item.score < 5) weight -= 1.0; // Negative feedback
    }
    if (item.status === "Completed") weight += 0.5;

    return { meta, weight };
  }).filter(e => e !== null && e.weight > 0);

  // If user hasn't tracked or liked enough, fall back to trending top-tier recommendations
  if (positiveEntries.length === 0) {
    return MANGA_DATA
      .slice(0, count)
      .map(manga => ({
        manga,
        affinityScore: Math.round(manga.score * 10),
        reasons: ["Popular on MangaRec", "Critically acclaimed masterpiece"]
      }));
  }

  // Synthesize User Taste Profile Vector
  const tasteVector = new Array(12).fill(0);
  let totalWeight = 0;

  for (const entry of positiveEntries) {
    const vec = entry.meta.vector;
    const w = entry.weight;
    totalWeight += w;
    for (let i = 0; i < 12; i++) {
      tasteVector[i] += vec[i] * w;
    }
  }

  // Normalize taste vector
  for (let i = 0; i < 12; i++) {
    tasteVector[i] = tasteVector[i] / totalWeight;
  }

  // Candidate pool: All manga NOT already marked Completed or Reading by user
  const candidates = MANGA_DATA.filter(m => {
    const tracking = userLibrary[m.id];
    return !tracking || tracking.status === "Plan to Read";
  });

  const scoredCandidates = candidates.map(manga => {
    const sim = calculateCosineSimilarity(tasteVector, manga.vector);
    
    // Check overlap with user's top rated titles
    const topOverlap = positiveEntries.find(p => {
      const gOverlap = p.meta.genres.some(g => manga.genres.includes(g));
      return gOverlap;
    });

    const affinityScore = Math.min(99, Math.round((sim * 0.8 + (manga.score / 10) * 0.2) * 100));

    const reasons = [];
    if (topOverlap) {
      reasons.push(`Because you loved ${topOverlap.meta.title}`);
    }
    if (sim > 0.8) {
      reasons.push("Perfect match for your reading taste profile");
    } else {
      reasons.push(`High affinity for ${manga.genres[0]} & ${manga.demographic}`);
    }

    return {
      manga,
      affinityScore,
      reasons: reasons.slice(0, 2)
    };
  });

  return scoredCandidates
    .sort((a, b) => b.affinityScore - a.affinityScore)
    .slice(0, count);
}

/**
 * Weighted Randomizer ("Surprise Me" roulette).
 * Chooses a manga with probability proportional to its score.
 */
export function getSurpriseManga(excludedIds = []) {
  const eligible = MANGA_DATA.filter(m => !excludedIds.includes(m.id));
  if (!eligible.length) return MANGA_DATA[0];

  // Weight by score exponentiated to favor top gems
  const weights = eligible.map(m => Math.pow(m.score, 2.5));
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  
  let randomVal = Math.random() * totalWeight;
  for (let i = 0; i < eligible.length; i++) {
    randomVal -= weights[i];
    if (randomVal <= 0) {
      return eligible[i];
    }
  }

  return eligible[0];
}
