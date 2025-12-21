import { MovieType } from "@/types/global";
import MovieGrid from "@/components/movie-grid";
import { SearchX } from "lucide-react";

async function fetchSearch(q: string): Promise<MovieType[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${q}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    }
  );

  return (await res.json()).results || [];
}

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const q = (await searchParams).q;
  const movies = await fetchSearch(q);

  return (
    <div className="space-y-6">
      {movies.length > 0 ? (
        <MovieGrid movies={movies} title={`Search results for "${q}"`} />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-muted-foreground">
            We couldn&apos;t find any movies matching &quot;{q}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
