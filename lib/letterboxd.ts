import * as cheerio from "cheerio";
import type { DiaryEntry } from "./types";

const monthNameToIndex: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export async function fetchLetterboxdDiary(username: string): Promise<DiaryEntry[]> {
  const entries: DiaryEntry[] = [];
  let page = 1;

  while (page <= 4) {
    const response = await fetch(`https://letterboxd.com/${username}/films/diary/page/${page}/`, {
      next: { revalidate: 60 * 60 * 6 },
      headers: { "User-Agent": "MoodMatch/0.1" },
    });

    if (!response.ok) {
      break;
    }

    const html = await response.text();
    const parsed = parseLetterboxdDiary(html);

    if (parsed.length === 0) {
      break;
    }

    entries.push(...parsed);
    page += 1;
  }

  return entries;
}

export function parseLetterboxdDiary(html: string): DiaryEntry[] {
  const $ = cheerio.load(html);
  const entries: DiaryEntry[] = [];

  $("table.diary-table tbody tr").each((_, row) => {
    const $row = $(row);
    const day = $row.find("td.td-day a").first().text().trim();
    const month = $row.find("td.td-month a").first().text().trim();
    const yearText = $row.find("td.td-year a").first().text().trim();
    const title = $row.find("td.td-film-details h2 a").first().text().trim();
    const filmHref = $row.find("td.td-film-details h2 a").first().attr("href");
    const ratingClass = $row.find(".rating").attr("class") ?? "";
    const ratingMatch = ratingClass.match(/rated-(\d+)/);

    if (!title || !day || !month || !yearText) {
      return;
    }

    const date = new Date(
      Date.UTC(Number(yearText), monthNameToIndex[month] ?? 0, Number(day)),
    );

    entries.push({
      watchedDate: date.toISOString().slice(0, 10),
      title,
      slug: filmHref?.split("/").filter(Boolean).at(-1),
      rating: ratingMatch ? Number(ratingMatch[1]) / 2 : undefined,
    });
  });

  return entries;
}
