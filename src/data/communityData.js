// Community Reviews, Curated Thematic Lists, and Mood Matcher Presets

export const COMMUNITY_REVIEWS = [
  {
    id: "rev-1",
    mangaId: "berserk",
    author: "GutsAppreciator",
    avatar: "⚔️",
    rating: 10,
    date: "2 days ago",
    upvotes: 428,
    downvotes: 12,
    hasSpoilers: true,
    text: "Kentaro Miura's art is unmatched in the entire comic medium. The Eclipse is one of the most gut-wrenching sequences in fiction, but what makes Berserk truly immortal is Guts' sheer refusal to yield to fate. He isn't just an edgy guy with a huge sword; he is an embodiment of human resilience against impossible odds."
  },
  {
    id: "rev-2",
    mangaId: "frieren",
    author: "ElvenMage",
    avatar: "🌿",
    rating: 10,
    date: "1 week ago",
    upvotes: 312,
    downvotes: 5,
    hasSpoilers: false,
    text: "Frieren does something so few fantasy stories attempt: it begins where traditional epic stories end. The pacing is deliberate, melancholy, and overflowing with quiet tenderness. Every single chapter leaves you with a warm ache in your chest and a desire to call up an old friend."
  },
  {
    id: "rev-3",
    mangaId: "solo-leveling",
    author: "ShadowMonarch_99",
    avatar: "👑",
    rating: 9,
    date: "3 weeks ago",
    upvotes: 285,
    downvotes: 34,
    hasSpoilers: false,
    text: "Pure dopamine from chapter 1 to 200. DUBU's art set the gold standard for modern webtoons that hundreds of imitators have tried to emulate. If you want hyper-stylized action, relentless pacing, and an unstoppable main character, look no further."
  },
  {
    id: "rev-4",
    mangaId: "monster",
    author: "PsychProfiler",
    avatar: "🕵️",
    rating: 10,
    date: "4 days ago",
    upvotes: 512,
    downvotes: 8,
    hasSpoilers: true,
    text: "Johan Liebert remains the greatest psychological villain in manga history. He doesn't need superpowers; he simply uncovers the dormant nihilism inside normal people. Naoki Urasawa's historical research into 1990s reunited Germany is breathtakingly atmospheric."
  },
  {
    id: "rev-5",
    mangaId: "vagabond",
    author: "RoninSpirit",
    avatar: "🌸",
    rating: 10,
    date: "5 days ago",
    upvotes: 367,
    downvotes: 4,
    hasSpoilers: false,
    text: "Reading Vagabond feels like meditating before a shrine. Takehiko Inoue's brushwork is so visceral you can feel the humidity of the bamboo forests and the cold bite of the blade. Musashi's transformation from a rabid dog to a philosopher farmer is pure poetry."
  },
  {
    id: "rev-6",
    mangaId: "kaguya-sama",
    author: "StudentCouncilRep",
    avatar: "🎯",
    rating: 9.5,
    date: "2 weeks ago",
    upvotes: 194,
    downvotes: 7,
    hasSpoilers: false,
    text: "Death Note if Light and L were deeply in love with each other and too cowardly to admit it! Aka Akasaka's comedy timing is world-class, but the character progression and genuine emotional maturity in the later arcs elevate it to an absolute classic."
  }
];

export const CURATED_LISTS = [
  {
    id: "list-peak-fiction",
    title: "Peak Fiction: S-Tier Masterpieces",
    description: "The universally revered gold standards of storytelling, profound character studies, and legendary art.",
    creator: "MangaRec Editorial",
    badge: "Staff Pick",
    icon: "🏆",
    mangaIds: ["berserk", "vagabond", "vinland-saga", "monster", "frieren", "fullmetal-alchemist"]
  },
  {
    id: "list-god-tier-manhwa",
    title: "God-Tier Manhwa: Peak Power & Lore",
    description: "The top-tier Korean webtoons featuring jaw-dropping art, limitless progression, and intricate survival systems.",
    creator: "WebtoonVault",
    badge: "Trending",
    icon: "⚡",
    mangaIds: ["solo-leveling", "omniscient-reader", "tower-of-god", "the-boxer", "sss-revival-hunter"]
  },
  {
    id: "list-psychological-chess",
    title: "Psychological Chess: Battles of Pure Intellect",
    description: "Stories where battles are won not with fists or swords, but through deductive deduction, deceit, and mind games.",
    creator: "Masterminds",
    badge: "Curated",
    icon: "♟️",
    mangaIds: ["monster", "death-note", "20th-century-boys", "kaguya-sama", "omniscient-reader"]
  },
  {
    id: "list-heart-warmers",
    title: "Wholesome & Soul-Healing Comfort Reads",
    description: "Gentle pacing, found families, heartfelt romance, and soothing emotional journeys for a cozy evening.",
    creator: "WarmTeaReader",
    badge: "Comfort",
    icon: "☕",
    mangaIds: ["frieren", "spy-x-family", "witch-hat-atelier", "blue-box", "grand-blue"]
  },
  {
    id: "list-dark-visceral",
    title: "Dark, Gritty & Uncompromising",
    description: "Unflinching depictions of human survival, existential horror, and relentless struggle against destiny.",
    creator: "NoMercyReviews",
    badge: "Mature",
    icon: "🩸",
    mangaIds: ["berserk", "chainsaw-man", "goodnight-punpun", "the-horizon", "jujutsu-kaisen"]
  }
];

export const MOOD_VIBE_PRESETS = [
  {
    id: "mood-wholesome",
    label: "Wholesome & Cozy Comfort",
    emoji: "☕",
    description: "Warm emotions, gentle pacing, heartwarming bonds, and soothing moments.",
    targetVector: [0.2, 0.1, 0.4, 0.8, 0.8, 0.1, 0.6, 0.3, 1.0, 0.0, 0.0, 0.2]
  },
  {
    id: "mood-dark-seinen",
    label: "Dark, Gritty & Visceral Epic",
    emoji: "⚔️",
    description: "Unflinching struggles, moral ambiguity, bloody combat, and deep philosophical themes.",
    targetVector: [0.95, 0.95, 0.6, 0.2, 0.05, 0.6, 0.85, 0.6, 0.0, 0.95, 0.0, 0.1]
  },
  {
    id: "mood-op-hype",
    label: "Zero to Hero / God-Tier Hype",
    emoji: "⚡",
    description: "Insane power scaling, high-octane battles, leveling mechanics, and triumph.",
    targetVector: [1.0, 0.5, 0.9, 0.1, 0.2, 0.4, 0.8, 0.5, 0.2, 0.6, 0.2, 0.3]
  },
  {
    id: "mood-mind-games",
    label: "High-IQ Mind Games & Suspense",
    emoji: "🧠",
    description: "Cat-and-mouse deductive chess, dark conspiracies, tension, and unpredictable twists.",
    targetVector: [0.3, 0.85, 0.1, 0.1, 0.1, 1.0, 0.4, 1.0, 0.1, 0.5, 0.2, 0.0]
  },
  {
    id: "mood-tearjerker",
    label: "Profound Emotional Tearjerker",
    emoji: "💧",
    description: "Poignant melancholy, existential depth, human vulnerability, and lasting bittersweet memories.",
    targetVector: [0.2, 0.9, 0.3, 0.7, 0.2, 0.4, 0.7, 0.5, 0.4, 0.6, 0.1, 0.0]
  },
  {
    id: "mood-laugh-out-loud",
    label: "Unhinged Comedy & Shenanigans",
    emoji: "🤣",
    description: "Belly laughs, wild facial expressions, comedic chaos, and high-energy fun.",
    targetVector: [0.3, 0.1, 0.2, 0.5, 1.0, 0.2, 0.4, 0.4, 0.8, 0.1, 0.2, 0.3]
  }
];
