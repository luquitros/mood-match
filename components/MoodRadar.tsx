"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { moodKeys } from "@/lib/mood";
import type { MoodVector } from "@/lib/types";

type MoodRadarProps = {
  movieMood: MoodVector;
  musicMood: MoodVector;
};

export function MoodRadar({ movieMood, musicMood }: MoodRadarProps) {
  const data = moodKeys.map((key) => ({
    mood: key,
    Filmes: Math.round(movieMood[key] * 100),
    Musica: Math.round(musicMood[key] * 100),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart data={data}>
        <PolarGrid stroke="#ded4c5" />
        <PolarAngleAxis dataKey="mood" tick={{ fill: "#676056", fontSize: 12 }} />
        <Tooltip />
        <Radar
          dataKey="Filmes"
          stroke="#d74f2a"
          fill="#d74f2a"
          fillOpacity={0.22}
          strokeWidth={2}
        />
        <Radar
          dataKey="Musica"
          stroke="#0f7b68"
          fill="#0f7b68"
          fillOpacity={0.22}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
