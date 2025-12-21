"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MovieType } from "@/types/global";

interface WatchlistButtonProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    release_date?: string;
    vote_average?: number;
  };
  variant?: "icon" | "full";
}

export default function WatchlistButton({ movie, variant = "full" }: WatchlistButtonProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setIsInWatchlist(watchlist.some((m: MovieType) => m.id === movie.id));
  }, [movie.id]);

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    
    if (isInWatchlist) {
      const newWatchlist = watchlist.filter((m: MovieType) => m.id !== movie.id);
      localStorage.setItem("watchlist", JSON.stringify(newWatchlist));
      setIsInWatchlist(false);
      toast.success("Removed from watchlist", {
        description: movie.title,
      });
    } else {
      watchlist.unshift(movie);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      setIsInWatchlist(true);
      toast.success("Added to watchlist", {
        description: movie.title,
      });
    }
    
    // Dispatch event for other components to update
    window.dispatchEvent(new Event("watchlist-updated"));
  };

  if (!mounted) {
    return variant === "icon" ? (
      <Button variant="secondary" size="icon" className="h-10 w-10">
        <Heart className="h-5 w-5" />
      </Button>
    ) : (
      <Button variant="secondary" className="gap-2">
        <Heart className="h-5 w-5" />
        Add to Watchlist
      </Button>
    );
  }

  if (variant === "icon") {
    return (
      <Button
        variant="secondary"
        size="icon"
        className="h-10 w-10"
        onClick={toggleWatchlist}
        aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      >
        <Heart className={`h-5 w-5 transition-colors ${isInWatchlist ? "fill-red-500 text-red-500" : ""}`} />
      </Button>
    );
  }

  return (
    <Button
      variant={isInWatchlist ? "default" : "secondary"}
      className="gap-2"
      onClick={toggleWatchlist}
    >
      <Heart className={`h-5 w-5 transition-colors ${isInWatchlist ? "fill-current" : ""}`} />
      {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
    </Button>
  );
}
