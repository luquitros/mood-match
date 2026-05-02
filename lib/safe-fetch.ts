import { fetchLetterboxdDiary } from "./letterboxd";
import { fetchWeeklyArtists } from "./lastfm";
import { fetchMovieMood } from "./tmdb";
import type { DiaryEntry } from "./types";

export async function fetchLetterboxdSafe(username: string) {
  try {
    return await fetchLetterboxdDiary(username);
  } catch {
    return [];
  }
}

export async function fetchLastFmSafe(user: string, apiKey: string, from: Date, to: Date) {
  try {
    return await fetchWeeklyArtists(user, apiKey, from, to);
  } catch {
    return [];
  }
}

export async function fetchMovieMoodSafe(entry: DiaryEntry, apiKey: string) {
  try {
    return await fetchMovieMood(entry, apiKey);
  } catch {
    return {
      title: entry.title,
      year: entry.year,
      genres: [],
      keywords: [],
      mood: {
        dark: 0,
        romantic: 0,
        energetic: 0,
        melancholic: 0,
        dreamy: 0,
        tense: 0,
        warm: 0,
      },
    };
  }
}
