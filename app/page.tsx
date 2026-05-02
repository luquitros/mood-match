import { MoodRadar } from "@/components/MoodRadar";
import { TimelineChart } from "@/components/TimelineChart";
import { WeekCard } from "@/components/WeekCard";
import { getInsights, getMoodWeeks } from "@/lib/data";

export default async function Home() {
  const weeks = await getMoodWeeks();
  const latest = weeks[0];
  const insights = getInsights(weeks);
  const averageScore = Math.round(
    weeks.reduce((sum, week) => sum + week.score, 0) / Math.max(weeks.length, 1),
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Correlacao filmes x musica na mesma semana</p>
          <h1>O clima que atravessa sua tela e seus scrobbles.</h1>
          <p className="lede">
            Um painel em Next.js que cruza diario do Letterboxd, charts semanais do
            Last.fm e metadados do TMDB para descobrir quando cinema e musica puxam
            o mesmo humor.
          </p>
        </div>
        {latest ? (
          <div className="hero-panel">
            <div className="signal">
              <strong>{latest.score}</strong>
              <span>
                match da semana {latest.week}/{latest.year}
              </span>
            </div>
            <div className="bar" />
            <div className="chart-wrap">
              <MoodRadar movieMood={latest.movieMood} musicMood={latest.musicMood} />
            </div>
          </div>
        ) : null}
      </section>

      <section className="section grid">
        <div className="metric">
          <span>Semanas analisadas</span>
          <strong>{weeks.length}</strong>
        </div>
        <div className="metric">
          <span>Score medio</span>
          <strong>{averageScore}</strong>
        </div>
        <div className="metric">
          <span>Maior match</span>
          <strong>{Math.max(...weeks.map((week) => week.score))}</strong>
        </div>
      </section>

      <section className="section panel">
        <h2>Timeline emocional</h2>
        <p className="muted">
          O score compara vetores de humor derivados de generos, keywords e tags.
        </p>
        <div className="chart-wrap">
          <TimelineChart weeks={weeks} />
        </div>
      </section>

      <section className="section">
        <h2>Semanas recentes</h2>
        <div className="week-list">
          {weeks.slice(0, 4).map((week) => (
            <WeekCard key={`${week.year}-${week.week}`} week={week} />
          ))}
        </div>
      </section>

      <section className="section grid">
        {insights.slice(0, 3).map((insight) => (
          <article className="insight" key={insight.title}>
            <span>{insight.score} de score medio</span>
            <h3>{insight.title}</h3>
            <p className="muted">{insight.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
