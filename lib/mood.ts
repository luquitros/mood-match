import type { MoodKey, MoodVector } from "./types";

export const moodKeys: MoodKey[] = [
  "dark",
  "romantic",
  "energetic",
  "melancholic",
  "dreamy",
  "tense",
  "warm",
];

const emptyMood = (): MoodVector => ({
  dark: 0,
  romantic: 0,
  energetic: 0,
  melancholic: 0,
  dreamy: 0,
  tense: 0,
  warm: 0,
});

const lexicon: Record<string, Partial<MoodVector>> = {
  action: { energetic: 0.8, tense: 0.5 },
  adventure: { energetic: 0.5, warm: 0.3 },
  ambient: { dreamy: 0.9, melancholic: 0.25 },
  animation: { warm: 0.7, dreamy: 0.3 },
  black: { dark: 0.5 },
  comedy: { warm: 0.7, energetic: 0.25 },
  crime: { dark: 0.65, tense: 0.75 },
  dance: { energetic: 0.95, warm: 0.25 },
  documentary: { melancholic: 0.25, warm: 0.2 },
  drama: { melancholic: 0.55, warm: 0.25 },
  dream: { dreamy: 0.8 },
  electronic: { energetic: 0.7, dreamy: 0.35 },
  experimental: { dreamy: 0.45, tense: 0.35 },
  family: { warm: 0.75 },
  fantasy: { dreamy: 0.8, warm: 0.25 },
  folk: { warm: 0.65, melancholic: 0.3 },
  horror: { dark: 0.9, tense: 0.9 },
  indie: { melancholic: 0.45, dreamy: 0.35 },
  jazz: { warm: 0.45, dreamy: 0.35 },
  metal: { dark: 0.7, energetic: 0.75, tense: 0.4 },
  mystery: { tense: 0.7, dark: 0.35 },
  noir: { dark: 0.8, melancholic: 0.45 },
  pop: { energetic: 0.55, warm: 0.45 },
  punk: { energetic: 0.9, tense: 0.35 },
  romance: { romantic: 0.9, warm: 0.45 },
  romantic: { romantic: 0.9, warm: 0.35 },
  sad: { melancholic: 0.9 },
  "sci-fi": { dreamy: 0.45, tense: 0.4 },
  shoegaze: { dreamy: 0.85, melancholic: 0.45 },
  soul: { warm: 0.8, romantic: 0.35 },
  thriller: { tense: 0.9, dark: 0.45 },
  war: { dark: 0.6, tense: 0.65, melancholic: 0.45 },
};

export function vectorFromTerms(terms: string[], weight = 1): MoodVector {
  const mood = emptyMood();

  for (const term of terms) {
    const normalized = term.toLowerCase().trim();
    const direct = lexicon[normalized];
    const partial =
      direct ??
      Object.entries(lexicon).find(([key]) => normalized.includes(key))?.[1];

    if (!partial) {
      continue;
    }

    for (const key of moodKeys) {
      mood[key] += (partial[key] ?? 0) * weight;
    }
  }

  return normalize(mood);
}

export function averageVectors(vectors: MoodVector[]): MoodVector {
  if (vectors.length === 0) {
    return emptyMood();
  }

  const total = emptyMood();
  for (const vector of vectors) {
    for (const key of moodKeys) {
      total[key] += vector[key];
    }
  }

  for (const key of moodKeys) {
    total[key] = total[key] / vectors.length;
  }

  return normalize(total);
}

export function normalize(vector: MoodVector): MoodVector {
  const max = Math.max(...moodKeys.map((key) => vector[key]), 1);
  const normalized = emptyMood();

  for (const key of moodKeys) {
    normalized[key] = Number((vector[key] / max).toFixed(3));
  }

  return normalized;
}

export function correlationScore(left: MoodVector, right: MoodVector): number {
  const dot = moodKeys.reduce((sum, key) => sum + left[key] * right[key], 0);
  const leftMag = Math.sqrt(moodKeys.reduce((sum, key) => sum + left[key] ** 2, 0));
  const rightMag = Math.sqrt(moodKeys.reduce((sum, key) => sum + right[key] ** 2, 0));

  if (!leftMag || !rightMag) {
    return 0;
  }

  return Math.round((dot / (leftMag * rightMag)) * 100);
}

export function topMoodLabels(vector: MoodVector, limit = 3): MoodKey[] {
  return [...moodKeys].sort((a, b) => vector[b] - vector[a]).slice(0, limit);
}
