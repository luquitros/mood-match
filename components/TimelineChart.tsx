"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeekMoodMatch } from "@/lib/types";

type TimelineChartProps = {
  weeks: WeekMoodMatch[];
};

export function TimelineChart({ weeks }: TimelineChartProps) {
  const data = [...weeks]
    .reverse()
    .map((week) => ({
      label: `${week.week}/${week.year}`,
      score: week.score,
      filmesEscuros: Math.round(week.movieMood.dark * 100),
      musicaIntensa: Math.round(week.musicMood.energetic * 100),
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#ded4c5" strokeDasharray="4 4" />
        <XAxis dataKey="label" tick={{ fill: "#676056", fontSize: 12 }} />
        <YAxis tick={{ fill: "#676056", fontSize: 12 }} domain={[0, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#0f7b68" strokeWidth={3} dot />
        <Line type="monotone" dataKey="filmesEscuros" stroke="#d74f2a" strokeWidth={2} />
        <Line type="monotone" dataKey="musicaIntensa" stroke="#344f9f" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
