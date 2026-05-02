import { getInsights, getMoodWeeks } from "@/lib/data";

export default async function InsightsPage() {
  const weeks = await getMoodWeeks();
  const insights = getInsights(weeks);

  return (
    <main>
      <p className="eyebrow">Padroes encontrados</p>
      <h1>Quando seus filmes mudam, sua musica responde.</h1>
      <p className="lede">
        Insights iniciais calculados a partir do score de correlacao e dos moods
        dominantes em cada semana.
      </p>

      <section className="section grid">
        {insights.map((insight) => (
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
