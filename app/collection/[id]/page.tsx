import { MovieType } from "@/types/global";
import MovieGrid from "@/components/movie-grid";
import Image from "next/image";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  parts: MovieType[];
}

async function fetchCollection(id: string): Promise<Collection> {
  const res = await fetch(`https://api.themoviedb.org/3/collection/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  return await res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const collection = await fetchCollection(id);

  return {
    title: `${collection.name} | Next Movie`,
    description: collection.overview?.slice(0, 160) || `Browse all movies in the ${collection.name}.`,
    openGraph: {
      title: collection.name,
      description: collection.overview?.slice(0, 160),
      images: collection.backdrop_path
        ? [`http://image.tmdb.org/t/p/w1280${collection.backdrop_path}`]
        : [],
    },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { id } = await params;
  const collection = await fetchCollection(id);

  // Sort movies by release date
  const sortedMovies = [...(collection.parts || [])].sort((a, b) => {
    const dateA = a.release_date || "9999";
    const dateB = b.release_date || "9999";
    return dateA.localeCompare(dateB);
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8">
        <div className="relative h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden">
          {collection.backdrop_path ? (
            <Image
              src={`http://image.tmdb.org/t/p/w1280${collection.backdrop_path}`}
              alt={collection.name}
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
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
            {collection.name}
          </h1>
          <p className="text-white/80 text-sm mt-1">
            {sortedMovies.length} movies in collection
          </p>
        </div>
      </div>

      {/* Overview */}
      {collection.overview && (
        <div className="max-w-3xl">
          <p className="text-muted-foreground leading-relaxed">{collection.overview}</p>
        </div>
      )}

      {/* Movies */}
      <MovieGrid movies={sortedMovies} title="Movies in Collection" />
    </div>
  );
}
