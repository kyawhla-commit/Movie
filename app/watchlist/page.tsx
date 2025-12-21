"use client";

import { useState, useEffect } from "react";
import { MovieType } from "@/types/global";
import Link from "next/link";
import Image from "next/image";
import { Star, Trash2, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<MovieType[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadWatchlist();

    const handleUpdate = () => loadWatchlist();
    window.addEventListener("watchlist-updated", handleUpdate);
    return () => window.removeEventListener("watchlist-updated", handleUpdate);
  }, []);

  const loadWatchlist = () => {
    const saved = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setWatchlist(saved);
  };

  const removeFromWatchlist = (movie: MovieType) => {
    const newWatchlist = watchlist.filter((m) => m.id !== movie.id);
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
    setWatchlist(newWatchlist);
    toast.success("Removed from watchlist", { description: movie.title });
  };

  const clearWatchlist = () => {
    localStorage.setItem("watchlist", JSON.stringify([]));
    setWatchlist([]);
    toast.success("Watchlist cleared");
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Film className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
        <p className="text-muted-foreground mb-6">
          Start adding movies you want to watch later
        </p>
        <Button asChild>
          <Link href="/">Browse Movies</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">
          My Watchlist ({watchlist.length})
        </h1>
        <Button variant="outline" size="sm" onClick={clearWatchlist} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {watchlist.map((movie) => (
          <div key={movie.id} className="group relative">
            <Link href={`/movie/${movie.id}`} className="block">
              <div className="relative overflow-hidden rounded-lg bg-muted aspect-[2/3] shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
                {movie.poster_path ? (
                  <Image
                    src={`http://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">No Image</span>
                  </div>
                )}
                {movie.vote_average && (
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {movie.vote_average.toFixed(1)}
                  </div>
                )}
              </div>
            </Link>
            
            {/* Remove button */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeFromWatchlist(movie)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="mt-2 px-1">
              <h3 className="font-medium text-sm line-clamp-2 leading-tight">{movie.title}</h3>
              <p className="text-muted-foreground text-xs mt-1">
                {movie.release_date?.split("-")[0] || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
