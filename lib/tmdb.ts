import { vectorFromTerms } from "./mood";
import type { DiaryEntry, MovieMood } from "./types";

type TmdbSearchResult = {
  id: number;
  title: string;
  release_date?: string;
  genre_ids?: number[];
};

type TmdbGenre = {
  id: number;
  name: string;
};

type TmdbKeyword = {
  name: string;
};

let genreCache: Map<number, string> | undefined;

export async function fetchMovieMood(entry: DiaryEntry, apiKey: string): Promise<MovieMood> {
  const movie = await findMovie(entry, apiKey);
  const genres = movie ? await getGenreNames(movie.genre_ids ?? [], apiKey) : [];
  const keywords = movie ? await getKeywords(movie.id, apiKey) : [];
  const terms = [...genres, ...keywords, entry.title];

  return {
    title: entry.title,
    year: entry.year ?? yearFromReleaseDate(movie?.release_date),
    genres,
    keywords,
    mood: vectorFromTerms(terms),
  };
}

async function findMovie(entry: DiaryEntry, apiKey: string): Promise<TmdbSearchResult | undefined> {
  const params = new URLSearchParams({
    api_key: apiKey,
    query: entry.title,
    include_adult: "false",
    language: "en-US",
  });

  if (entry.year) {
    params.set("year", String(entry.year));
  }

  const response = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`, {
    next: { revalidate: 60 * 60 * 24 * 14 },
  });

  if (!response.ok) {
    return undefined;
  }

  const data = await response.json();
  return data.results?.[0];
}

async function getGenreNames(ids: number[], apiKey: string): Promise<string[]> {
  if (!genreCache) {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`,
      { next: { revalidate: 60 * 60 * 24 * 30 } },
    );
    const data = response.ok ? await response.json() : { genres: [] };
    genreCache = new Map(
      (data.genres ?? []).map((genre: TmdbGenre) => [genre.id, genre.name]),
    );
  }

  return ids.map((id) => genreCache?.get(id)).filter((name): name is string => Boolean(name));
}

async function getKeywords(id: number, apiKey: string): Promise<string[]> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/keywords?api_key=${apiKey}`,
    { next: { revalidate: 60 * 60 * 24 * 14 } },
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return (data.keywords ?? []).slice(0, 10).map((keyword: TmdbKeyword) => keyword.name);
}

function yearFromReleaseDate(releaseDate?: string): number | undefined {
  return releaseDate ? Number(releaseDate.slice(0, 4)) : undefined;
}
