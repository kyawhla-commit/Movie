import { TVShowType, PersonType } from "@/types/global";
import CastCard from "@/components/cast-card";
import WatchlistButton from "@/components/watchlist-button";
import { Star, Calendar, ArrowLeft, Tv, Film } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(`https://api.themoviedb.org/3/tv/${id}`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_TOKEN}` },
  });
  const show = await res.json();
  const year = show.first_air_date?.split("-")[0] || "";

  return {
    title: `${show.name} (${year}) | Next Movie`,
    description: show.overview?.slice(0, 160) || `Watch ${show.name} TV series.`,
    openGraph: {
      title: `${show.name} (${year})`,
      description: show.overview?.slice(0, 160),
      images: show.backdrop_path ? [`http://image.tmdb.org/t/p/w1280${show.backdrop_path}`] : [],
    },
  };
}

async function fetchShow(id: string): Promise<TVShowType> {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${id}`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_TOKEN}` },
  });
  return await res.json();
}

async function fetchCast(id: string): Promise<PersonType[]> {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_TOKEN}` },
  });
  const data = await res.json();
  return data.cast || [];
}

async function fetchSimilar(id: string): Promise<TVShowType[]> {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${id}/similar`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_TOKEN}` },
  });
  const data = await res.json();
  return data.results?.slice(0, 12) || [];
}

export default async function TVShowPage({ params }: Props) {
  const { id } = await params;
  const [show, cast, similar] = await Promise.all([
    fetchShow(id),
    fetchCast(id),
    fetchSimilar(id),
  ]);
  const year = show.first_air_date?.split("-")[0] || "N/A";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2">
        <Link href="/tv">
          <ArrowLeft className="h-4 w-4" />
          Back to TV Shows
        </Link>
      </Button>

      {/* Hero Section */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8">
        <div className="relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden">
          {show.backdrop_path ? (
            <Image
              src={`http://image.tmdb.org/t/p/w1280${show.backdrop_path}`}
              alt={show.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            <div className="hidden sm:block w-32 md:w-40 lg:w-48 shrink-0 -mb-16 md:-mb-20 lg:-mb-24 relative z-10">
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-2xl relative">
                {show.poster_path ? (
                  <Image
                    src={`http://image.tmdb.org/t/p/w342${show.poster_path}`}
                    alt={show.name}
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

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">TV Series</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg line-clamp-2">
                {show.name}
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">{year}</p>

              <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
                {show.vote_average && (
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    {show.vote_average.toFixed(1)}
                  </div>
                )}
                {show.number_of_seasons && (
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                    <Tv className="h-3 w-3 sm:h-4 sm:w-4" />
                    {show.number_of_seasons} Season{show.number_of_seasons > 1 ? "s" : ""}
                  </div>
                )}
                {show.number_of_episodes && (
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                    <Film className="h-3 w-3 sm:h-4 sm:w-4" />
                    {show.number_of_episodes} Episodes
                  </div>
                )}
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  {year}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <WatchlistButton
                  movie={{
                    id: show.id,
                    title: show.name,
                    poster_path: show.poster_path,
                    release_date: show.first_air_date,
                    vote_average: show.vote_average,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="sm:pl-40 md:pl-48 lg:pl-56 pt-4 sm:pt-8 md:pt-12">
        {show.genres && show.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {show.genres.map((genre) => (
              <span
                key={genre.id}
                className="text-xs sm:text-sm px-3 py-1 bg-primary/10 text-primary rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">Overview</h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {show.overview || "No overview available."}
          </p>
        </div>
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b">Cast</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 sm:gap-4">
            {cast.slice(0, 16).map((person) => (
              <CastCard key={person.id} person={person} />
            ))}
          </div>
        </section>
      )}

      {/* Similar Shows */}
      {similar.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b">Similar Shows</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {similar.map((s) => (
              <Link key={s.id} href={`/tv/${s.id}`} className="group block">
                <div className="relative overflow-hidden rounded-lg bg-muted aspect-[2/3] shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
                  {s.poster_path ? (
                    <Image
                      src={`http://image.tmdb.org/t/p/w342${s.poster_path}`}
                      alt={s.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">No Image</span>
                    </div>
                  )}
                  {s.vote_average && (
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {s.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="mt-2 px-1">
                  <h3 className="font-medium text-sm line-clamp-2 leading-tight">{s.name}</h3>
                  <p className="text-muted-foreground text-xs mt-1">{s.first_air_date?.split("-")[0] || "N/A"}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
