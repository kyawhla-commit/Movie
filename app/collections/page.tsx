import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movie Collections | Next Movie",
  description: "Browse popular movie franchises and collections.",
};

// Popular collection IDs from TMDB
const popularCollections = [
  { id: 131296, name: "Marvel Cinematic Universe" },
  { id: 10, name: "Star Wars Collection" },
  { id: 528, name: "The Godfather Collection" },
  { id: 2150, name: "Shrek Collection" },
  { id: 1241, name: "Harry Potter Collection" },
  { id: 119, name: "The Lord of the Rings Collection" },
  { id: 87359, name: "Mission: Impossible Collection" },
  { id: 748, name: "X-Men Collection" },
  { id: 9485, name: "The Fast and the Furious Collection" },
  { id: 86311, name: "The Avengers Collection" },
  { id: 263, name: "The Dark Knight Collection" },
  { id: 328, name: "Jurassic Park Collection" },
  { id: 2344, name: "The Matrix Collection" },
  { id: 1570, name: "Die Hard Collection" },
  { id: 8091, name: "Alien Collection" },
  { id: 8650, name: "Transformers Collection" },
];

interface CollectionData {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

async function fetchCollection(id: number): Promise<CollectionData | null> {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/collection/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function CollectionsPage() {
  const collections = await Promise.all(
    popularCollections.map((c) => fetchCollection(c.id))
  );

  const validCollections = collections.filter(Boolean) as CollectionData[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Movie Collections</h1>
      <p className="text-muted-foreground">
        Browse popular movie franchises and series
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {validCollections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collection/${collection.id}`}
            className="group relative overflow-hidden rounded-lg aspect-video bg-muted"
          >
            {collection.backdrop_path ? (
              <Image
                src={`http://image.tmdb.org/t/p/w780${collection.backdrop_path}`}
                alt={collection.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-lg line-clamp-2 drop-shadow-lg">
                {collection.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
