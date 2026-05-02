export type MoodKey =
  | "dark"
  | "romantic"
  | "energetic"
  | "melancholic"
  | "dreamy"
  | "tense"
  | "warm";

export type MoodVector = Record<MoodKey, number>;

export type DiaryEntry = {
  watchedDate: string;
  title: string;
  year?: number;
  slug?: string;
  rating?: number;
};

export type ArtistChartItem = {
  name: string;
  playcount: number;
  tags: string[];
};

export type MovieMood = {
  title: string;
  year?: number;
  genres: string[];
  keywords: string[];
  mood: MoodVector;
};

export type WeekMoodMatch = {
  year: number;
  week: number;
  startDate: string;
  endDate: string;
  score: number;
  movieMood: MoodVector;
  musicMood: MoodVector;
  movies: MovieMood[];
  artists: ArtistChartItem[];
  highlights: string[];
};
