import { TimelineChart } from "@/components/TimelineChart";
import { WeekCard } from "@/components/WeekCard";
import { getMoodWeeks } from "@/lib/data";

export default async function TimelinePage() {
  const weeks = await getMoodWeeks();

  return (
    <main>
      <p className="eyebrow">Linha do tempo</p>
      <h1>Semana a semana, o pulso aparece.</h1>
      <p className="lede">
        A curva principal mostra o match geral. As linhas secundarias ajudam a
        notar quando filmes escuros ou musica energetica puxam o resultado.
      </p>

      <section className="section panel">
        <div className="chart-wrap">
          <TimelineChart weeks={weeks} />
        </div>
      </section>

      <section className="section week-list">
        {weeks.map((week) => (
          <WeekCard key={`${week.year}-${week.week}`} week={week} />
        ))}
      </section>
    </main>
  );
}
