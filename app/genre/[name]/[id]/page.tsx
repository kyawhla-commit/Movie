import MovieGrid from "@/components/movie-grid";
import { MovieType } from "@/types/global";

async function fetchGenre(id: string): Promise<MovieType[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?with_genres=${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    }
  );
  const data = await res.json();
  return data.results || [];
}

export default async function Genre({
  params,
}: {
  params: Promise<{ name: string; id: string }>;
}) {
  const { id, name } = await params;
  const movies = await fetchGenre(id);
  const decodedName = decodeURIComponent(name);

  return (
    <div className="space-y-6">
      <MovieGrid movies={movies} title={decodedName} />
    </div>
  );
}
