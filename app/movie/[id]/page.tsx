import { MovieType, PersonType, ReviewType } from "@/types/global";
import CastCard from "@/components/cast-card";
import TrailerModal from "@/components/trailer-modal";
import WatchProviders from "@/components/watch-providers";
import WatchlistButton from "@/components/watchlist-button";
import ShareButton from "@/components/share-button";
import RecentlyViewedTracker from "@/components/recently-viewed-tracker";
import Reviews from "@/components/reviews";
import { Star, Clock, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  const movie = await res.json();
  const year = movie.release_date?.split("-")[0] || "";

  return {
    title: `${movie.title} (${year}) | Next Movie`,
    description: movie.overview?.slice(0, 160) || `Watch ${movie.title} - Find where to stream, rent, or buy.`,
    openGraph: {
      title: `${movie.title} (${year})`,
      description: movie.overview?.slice(0, 160),
      images: movie.backdrop_path
        ? [`http://image.tmdb.org/t/p/w1280${movie.backdrop_path}`]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${movie.title} (${year})`,
      description: movie.overview?.slice(0, 160),
    },
  };
}

interface VideoResult {
  key: string;
  site: string;
  type: string;
  official: boolean;
}

async function fetchCast(id: string): Promise<PersonType[]> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  const data = await res.json();
  return data.cast || [];
}

async function fetchMovie(id: string): Promise<MovieType> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  return await res.json();
}

async function fetchTrailer(id: string): Promise<string | null> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  const data = await res.json();
  const videos: VideoResult[] = data.results || [];
  
  // Find official YouTube trailer
  const trailer = videos.find(
    (v) => v.site === "YouTube" && v.type === "Trailer" && v.official
  ) || videos.find(
    (v) => v.site === "YouTube" && v.type === "Trailer"
  ) || videos.find(
    (v) => v.site === "YouTube"
  );
  
  return trailer?.key || null;
}

async function fetchSimilar(id: string): Promise<MovieType[]> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  const data = await res.json();
  return data.results?.slice(0, 12) || [];
}

interface WatchProviderData {
  flatrate?: { provider_id: number; provider_name: string; logo_path: string }[];
  rent?: { provider_id: number; provider_name: string; logo_path: string }[];
  buy?: { provider_id: number; provider_name: string; logo_path: string }[];
  link?: string;
}

async function fetchWatchProviders(id: string): Promise<WatchProviderData | null> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  const data = await res.json();
  // Try US first, then fall back to other regions
  return data.results?.US || data.results?.GB || data.results?.CA || Object.values(data.results || {})[0] || null;
}

async function fetchReviews(id: string): Promise<ReviewType[]> {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/reviews`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  const data = await res.json();
  return data.results || [];
}

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [movie, cast, trailerKey, similar, watchProviders, reviews] = await Promise.all([
    fetchMovie(id),
    fetchCast(id),
    fetchTrailer(id),
    fetchSimilar(id),
    fetchWatchProviders(id),
    fetchReviews(id),
  ]);
  const year = movie.release_date?.split("-")[0] || "N/A";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Track recently viewed */}
      <RecentlyViewedTracker
        movie={{
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
        }}
      />

      {/* Back Button */}
      <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Movies
        </Link>
      </Button>

      {/* Hero Section */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8">
        {/* Backdrop Image */}
        <div className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden">
          {movie.backdrop_path ? (
            <Image
              src={`http://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/30" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            {/* Poster (hidden on mobile, shown on tablet+) */}
            <div className="hidden sm:block w-32 md:w-40 lg:w-48 shrink-0 -mb-16 md:-mb-20 lg:-mb-24 relative z-10">
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl relative">
                {movie.poster_path ? (
                  <Image
                    src={`http://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">No Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Title and Meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg line-clamp-2">
                {movie.title}
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">{year}</p>

              {/* Meta badges */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
                {movie.vote_average && (
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    {movie.vote_average.toFixed(1)}
                  </div>
                )}
                {movie.runtime && (
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    {movie.runtime} min
                  </div>
                )}
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  {year}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                {trailerKey && (
                  <TrailerModal videoKey={trailerKey} title={movie.title} />
                )}
                <WatchlistButton
                  movie={{
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                  }}
                />
                <ShareButton title={`${movie.title} (${year})`} text={movie.overview} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="sm:pl-40 md:pl-48 lg:pl-56 pt-4 sm:pt-8 md:pt-12">
        {/* Genres */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre: { id: number; name: string }) => (
              <Link
                key={genre.id}
                href={`/genre/${genre.name}/${genre.id}`}
                className="text-xs sm:text-sm px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        )}

        {/* Overview */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Overview</h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {movie.overview || "No overview available."}
          </p>
        </div>

        {/* Where to Watch */}
        <WatchProviders providers={watchProviders} />
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b">
            Cast
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 sm:gap-4">
            {cast.slice(0, 16).map((person) => (
              <CastCard key={person.id} person={person} />
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <Reviews reviews={reviews} />

      {/* Similar Movies Section */}
      {similar.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b">
            Similar Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {similar.map((m) => (
              <Link key={m.id} href={`/movie/${m.id}`} className="group block">
                <div className="relative overflow-hidden rounded-lg bg-muted aspect-[2/3] shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
                  {m.poster_path ? (
                    <Image
                      src={`http://image.tmdb.org/t/p/w342${m.poster_path}`}
                      alt={m.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">No Image</span>
                    </div>
                  )}
                  {m.vote_average && (
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {m.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="mt-2 px-1">
                  <h3 className="font-medium text-sm line-clamp-2 leading-tight">{m.title}</h3>
                  <p className="text-muted-foreground text-xs mt-1">
                    {m.release_date?.split("-")[0] || "N/A"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
