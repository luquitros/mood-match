import { getIsoWeek, getWeekRange, toDateInput } from "./dates";
import { fetchLastFmSafe, fetchLetterboxdSafe, fetchMovieMoodSafe } from "./safe-fetch";
import { averageVectors, correlationScore, topMoodLabels, vectorFromTerms } from "./mood";
import { sampleWeeks } from "./sample-data";
import type { ArtistChartItem, DiaryEntry, MovieMood, WeekMoodMatch } from "./types";

const hasLiveConfig = Boolean(
  process.env.LETTERBOXD_USERNAME &&
    process.env.LASTFM_USER &&
    process.env.LASTFM_API_KEY &&
    process.env.TMDB_API_KEY,
);

export async function getMoodWeeks(): Promise<WeekMoodMatch[]> {
  if (!hasLiveConfig) {
    return sampleWeeks;
  }

  const entries = await fetchLetterboxdSafe(process.env.LETTERBOXD_USERNAME!);
  const byWeek = groupDiaryEntries(entries);
  const weeks = await Promise.all(
    [...byWeek.entries()].slice(0, 12).map(async ([key, diaryEntries]) => {
      const [year, week] = key.split("-").map(Number);
      return buildWeekMatch(year, week, diaryEntries);
    }),
  );

  return weeks.filter((week): week is WeekMoodMatch => Boolean(week));
}

export async function getMoodWeek(year: number, week: number): Promise<WeekMoodMatch | undefined> {
  const weeks = await getMoodWeeks();
  return weeks.find((item) => item.year === year && item.week === week);
}

export function getInsights(weeks: WeekMoodMatch[]) {
  const strongMatches = weeks.filter((week) => week.score >= 75);
  const dissonantWeeks = weeks.filter((week) => week.score <= 45);
  const darkMovieWeeks = weeks.filter((week) => week.movieMood.dark > 0.65);
  const warmMusicWeeks = weeks.filter((week) => week.musicMood.warm > 0.65);

  return [
    {
      title: "Horror e musica pesada andam juntos",
      body: `${darkMovieWeeks.length} semana(s) com filmes escuros tambem puxaram tags como darkwave, industrial, metal ou shoegaze.`,
      score: averageScore(darkMovieWeeks),
    },
    {
      title: "Semanas romanticas pedem textura sonhadora",
      body: `${warmMusicWeeks.length} semana(s) tiveram musica mais calorosa, geralmente perto de romance, drama ou fantasia.`,
      score: averageScore(warmMusicWeeks),
    },
    {
      title: "Dissonancia como padrao interessante",
      body: `${dissonantWeeks.length} semana(s) mostram contraste claro entre a energia dos filmes e a atmosfera musical.`,
      score: averageScore(dissonantWeeks),
    },
    {
      title: "Match alto quando a tensao sobe",
      body: `${strongMatches.length} semana(s) passaram de 75 pontos de correlacao emocional.`,
      score: averageScore(strongMatches),
    },
  ];
}

function groupDiaryEntries(entries: DiaryEntry[]) {
  return entries.reduce((groups, entry) => {
    const { year, week } = getIsoWeek(new Date(`${entry.watchedDate}T00:00:00Z`));
    const key = `${year}-${week}`;
    groups.set(key, [...(groups.get(key) ?? []), entry]);
    return groups;
  }, new Map<string, DiaryEntry[]>());
}

async function buildWeekMatch(
  year: number,
  week: number,
  diaryEntries: DiaryEntry[],
): Promise<WeekMoodMatch | undefined> {
  const { start, end } = getWeekRange(year, week);
  const [movies, artists] = await Promise.all([
    Promise.all(
      diaryEntries.map((entry) => fetchMovieMoodSafe(entry, process.env.TMDB_API_KEY!)),
    ),
    fetchLastFmSafe(process.env.LASTFM_USER!, process.env.LASTFM_API_KEY!, start, end),
  ]);

  if (movies.length === 0 && artists.length === 0) {
    return undefined;
  }

  const movieMood = averageVectors(movies.map((movie) => movie.mood));
  const musicMood = buildMusicMood(artists);
  const score = correlationScore(movieMood, musicMood);
  const sharedMoods = topMoodLabels(movieMood).filter((label) =>
    topMoodLabels(musicMood).includes(label),
  );

  return {
    year,
    week,
    startDate: toDateInput(start),
    endDate: toDateInput(end),
    score,
    movieMood,
    musicMood,
    movies,
    artists,
    highlights: sharedMoods.length ? sharedMoods : topMoodLabels(movieMood),
  };
}

function buildMusicMood(artists: ArtistChartItem[]) {
  const weighted = artists.flatMap((artist) => {
    const repeats = Math.max(1, Math.round(artist.playcount / 10));
    return Array.from({ length: repeats }, () => vectorFromTerms(artist.tags));
  });

  return averageVectors(weighted);
}

function averageScore(weeks: WeekMoodMatch[]) {
  if (weeks.length === 0) {
    return 0;
  }

  return Math.round(weeks.reduce((sum, week) => sum + week.score, 0) / weeks.length);
}

export function summarizeWeek(week: WeekMoodMatch) {
  const movieMood = topMoodLabels(week.movieMood, 2).join(" + ");
  const musicMood = topMoodLabels(week.musicMood, 2).join(" + ");
  return `Filmes: ${movieMood}. Musica: ${musicMood}.`;
}
