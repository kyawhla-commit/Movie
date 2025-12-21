import MovieGrid from "@/components/movie-grid";
import { MovieType } from "@/types/global";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trending Movies | Next Movie",
  description: "Discover what's trending in movies today and this week.",
};

async function fetchTrending(timeWindow: "day" | "week"): Promise<MovieType[]> {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/${timeWindow}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    }
  );
  const data = await res.json();
  return data.results || [];
}

export default async function TrendingPage({
  searchParams,
}: {
  searchParams: Promise<{ time?: string }>;
}) {
  const { time } = await searchParams;
  const timeWindow = time === "week" ? "week" : "day";
  const movies = await fetchTrending(timeWindow);

  return (
    <div className="space-y-6">
      {/* Time Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Trending:</span>
        <div className="flex bg-muted rounded-lg p-1">
          <Link
            href="/trending?time=day"
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              timeWindow === "day"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Today
          </Link>
          <Link
            href="/trending?time=week"
            className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
              timeWindow === "week"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            This Week
          </Link>
        </div>
      </div>

      <MovieGrid
        movies={movies}
        title={`🔥 Trending ${timeWindow === "day" ? "Today" : "This Week"}`}
      />
    </div>
  );
}
