import { toUnix } from "./dates";
import type { ArtistChartItem } from "./types";

type LastFmArtist = {
  name: string;
  playcount: string;
};

type LastFmTag = {
  name: string;
};

export async function fetchWeeklyArtists(
  user: string,
  apiKey: string,
  from: Date,
  to: Date,
): Promise<ArtistChartItem[]> {
  const params = new URLSearchParams({
    method: "user.getWeeklyArtistChart",
    user,
    api_key: apiKey,
    from: String(toUnix(from)),
    to: String(toUnix(to)),
    format: "json",
  });

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
    next: { revalidate: 60 * 60 * 6 },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  const artists = (data.weeklyartistchart?.artist ?? [])
    .slice(0, 8)
    .map((artist: LastFmArtist) => ({
      name: artist.name,
      playcount: Number(artist.playcount),
      tags: [],
    }));

  return Promise.all(
    artists.map(async (artist: ArtistChartItem) => ({
      ...artist,
      tags: await fetchArtistTags(artist.name, apiKey),
    })),
  );
}

async function fetchArtistTags(artist: string, apiKey: string): Promise<string[]> {
  const params = new URLSearchParams({
    method: "artist.getTopTags",
    artist,
    api_key: apiKey,
    format: "json",
  });

  const response = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
    next: { revalidate: 60 * 60 * 24 },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return (data.toptags?.tag ?? []).slice(0, 6).map((tag: LastFmTag) => tag.name);
}
