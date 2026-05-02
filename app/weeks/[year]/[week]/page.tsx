import { notFound } from "next/navigation";
import { MoodRadar } from "@/components/MoodRadar";
import { getMoodWeek } from "@/lib/data";

type WeekDetailPageProps = {
  params: {
    year: string;
    week: string;
  };
};

export default async function WeekDetailPage({ params }: WeekDetailPageProps) {
  const year = Number(params.year);
  const weekNumber = Number(params.week);
  const week = await getMoodWeek(year, weekNumber);

  if (!week) {
    notFound();
  }

  return (
    <main>
      <p className="eyebrow">Detalhe semanal</p>
      <h1>
        Semana {week.week}, {week.year}: {week.score} pontos.
      </h1>
      <p className="lede">
        {week.startDate} a {week.endDate}. O radar compara o mood agregado dos
        filmes com as tags dos artistas mais ouvidos.
      </p>

      <section className="section split">
        <div className="panel">
          <h2>Radar de humor</h2>
          <div className="chart-wrap">
            <MoodRadar movieMood={week.movieMood} musicMood={week.musicMood} />
          </div>
        </div>
        <div className="panel">
          <h2>Highlights</h2>
          <div className="pill-row">
            {week.highlights.map((highlight) => (
              <span className="pill" key={highlight}>
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section split">
        <div className="detail-block">
          <h2>Filmes</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Generos</th>
              </tr>
            </thead>
            <tbody>
              {week.movies.map((movie) => (
                <tr key={`${movie.title}-${movie.year}`}>
                  <td>{movie.title}</td>
                  <td>{movie.genres.join(", ") || movie.keywords.slice(0, 3).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="detail-block">
          <h2>Musica</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Artista</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {week.artists.map((artist) => (
                <tr key={artist.name}>
                  <td>{artist.name}</td>
                  <td>{artist.tags.slice(0, 4).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
