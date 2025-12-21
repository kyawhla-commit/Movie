"use client";

import { useState, useEffect } from "react";
import { MovieType } from "@/types/global";
import Link from "next/link";
import Image from "next/image";
import { Star, History } from "lucide-react";

export function useRecentlyViewed(movie?: { id: number; title: string; poster_path: string; vote_average?: number }) {
  useEffect(() => {
    if (!movie) return;
    
    const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = recent.filter((m: MovieType) => m.id !== movie.id);
    filtered.unshift(movie);
    localStorage.setItem("recentlyViewed", JSON.stringify(filtered.slice(0, 10)));
  }, [movie]);
}

export default function RecentlyViewed() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    setMovies(recent);
  }, []);

  if (!mounted || movies.length === 0) return null;

  return (
    <section className="mb-8 sm:mb-12">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b flex items-center gap-2">
        <History className="h-5 w-5" />
        Recently Viewed
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="group shrink-0 w-32 sm:w-36"
          >
            <div className="relative overflow-hidden rounded-lg bg-muted aspect-[2/3] shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
              {movie.poster_path ? (
                <Image
                  src={`http://image.tmdb.org/t/p/w185${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">No Image</span>
                </div>
              )}
              {movie.vote_average && (
                <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                  {movie.vote_average.toFixed(1)}
                </div>
              )}
            </div>
            <p className="mt-1.5 text-xs font-medium line-clamp-2">{movie.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
