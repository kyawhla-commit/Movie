import MovieGrid from "@/components/movie-grid";
import { MovieType } from "@/types/global";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Discover Movies | Next Movie",
  description: "Discover movies with advanced filters - by year, rating, and more.",
};

interface DiscoverParams {
  year?: string;
  rating?: string;
  sort?: string;
  language?: string;
}

async function fetchDiscover(params: DiscoverParams): Promise<MovieType[]> {
  const searchParams = new URLSearchParams();
  
  if (params.year) searchParams.set("primary_release_year", params.year);
  if (params.rating) searchParams.set("vote_average.gte", params.rating);
  if (params.language) searchParams.set("with_original_language", params.language);
  
  const sortMap: Record<string, string> = {
    popular: "popularity.desc",
    rating: "vote_average.desc",
    newest: "primary_release_date.desc",
    oldest: "primary_release_date.asc",
  };
  searchParams.set("sort_by", sortMap[params.sort || "popular"] || "popularity.desc");
  searchParams.set("vote_count.gte", "100");

  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    }
  );
  const data = await res.json();
  return data.results || [];
}

const years = Array.from({ length: 30 }, (_, i) => (2024 - i).toString());
const ratings = ["9", "8", "7", "6", "5"];
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];
const languages = [
  { value: "en", label: "English" },
  { value: "ko", label: "Korean" },
  { value: "ja", label: "Japanese" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "hi", label: "Hindi" },
];

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<DiscoverParams>;
}) {
  const params = await searchParams;
  const movies = await fetchDiscover(params);

  const buildUrl = (key: string, value: string) => {
    const newParams = new URLSearchParams();
    if (params.year) newParams.set("year", params.year);
    if (params.rating) newParams.set("rating", params.rating);
    if (params.sort) newParams.set("sort", params.sort);
    if (params.language) newParams.set("language", params.language);
    
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    
    return `/discover?${newParams.toString()}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Discover Movies</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Year Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Year</label>
          <div className="flex flex-wrap gap-1">
            <Link href={buildUrl("year", "")}>
              <Button
                variant={!params.year ? "default" : "outline"}
                size="sm"
                className="h-8"
              >
                All
              </Button>
            </Link>
            {years.slice(0, 8).map((year) => (
              <Link key={year} href={buildUrl("year", year)}>
                <Button
                  variant={params.year === year ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                >
                  {year}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Min Rating</label>
          <div className="flex gap-1">
            <Link href={buildUrl("rating", "")}>
              <Button
                variant={!params.rating ? "default" : "outline"}
                size="sm"
                className="h-8"
              >
                All
              </Button>
            </Link>
            {ratings.map((rating) => (
              <Link key={rating} href={buildUrl("rating", rating)}>
                <Button
                  variant={params.rating === rating ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                >
                  {rating}+
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Language Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Language</label>
          <div className="flex flex-wrap gap-1">
            <Link href={buildUrl("language", "")}>
              <Button
                variant={!params.language ? "default" : "outline"}
                size="sm"
                className="h-8"
              >
                All
              </Button>
            </Link>
            {languages.map((lang) => (
              <Link key={lang.value} href={buildUrl("language", lang.value)}>
                <Button
                  variant={params.language === lang.value ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                >
                  {lang.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Sort By</label>
          <div className="flex flex-wrap gap-1">
            {sortOptions.map((option) => (
              <Link key={option.value} href={buildUrl("sort", option.value)}>
                <Button
                  variant={
                    params.sort === option.value || (!params.sort && option.value === "popular")
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className="h-8"
                >
                  {option.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {movies.length > 0 ? (
        <MovieGrid movies={movies} title={`Found ${movies.length} movies`} />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          No movies found with these filters. Try adjusting your criteria.
        </div>
      )}
    </div>
  );
}
