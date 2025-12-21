"use client";

import { useEffect } from "react";

interface RecentlyViewedTrackerProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    vote_average?: number;
  };
}

export default function RecentlyViewedTracker({ movie }: RecentlyViewedTrackerProps) {
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    const filtered = recent.filter((m: { id: number }) => m.id !== movie.id);
    filtered.unshift(movie);
    localStorage.setItem("recentlyViewed", JSON.stringify(filtered.slice(0, 10)));
  }, [movie]);

  return null;
}
