import MovieGrid from "@/components/movie-grid";
import RecentlyViewed from "@/components/recently-viewed";
import { MovieType } from "@/types/global";

async function fetchMovies(endpoint: string): Promise<MovieType[]> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  const data = await res.json();
  return data.results?.slice(0, 12) || [];
}

export default async function Home() {
  const [nowPlaying, popular, upcoming, topRated] = await Promise.all([
    fetchMovies("now_playing"),
    fetchMovies("popular"),
    fetchMovies("upcoming"),
    fetchMovies("top_rated"),
  ]);

  return (
    <div className="space-y-8 sm:space-y-12">
      <RecentlyViewed />
      <MovieGrid movies={nowPlaying} title="🎬 Now Playing" />
      <MovieGrid movies={popular} title="🔥 Popular" />
      <MovieGrid movies={upcoming} title="📅 Coming Soon" />
      <MovieGrid movies={topRated} title="⭐ Top Rated" />
    </div>
  );
}
