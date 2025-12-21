"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Play, Clapperboard, Heart, Tv, TrendingUp, Compass, Library } from "lucide-react";
import Link from "next/link";
import { GenreType } from "@/types/global";

interface MobileNavProps {
  genres: GenreType[];
  searchAction: (formData: FormData) => Promise<void>;
}

export default function MobileNav({ genres }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg"
            onClick={() => setIsOpen(false)}
          >
            <Clapperboard className="h-5 w-5" />
            Next Movie
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1 p-4 overflow-y-auto h-[calc(100%-65px)] scrollbar-thin">
          <Button
            asChild
            variant="ghost"
            className="justify-start gap-2 h-11"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/">
              <Play className="h-4 w-4" />
              All Movies
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="justify-start gap-2 h-11"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/tv">
              <Tv className="h-4 w-4" />
              TV Shows
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="justify-start gap-2 h-11"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/trending">
              <TrendingUp className="h-4 w-4" />
              Trending
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="justify-start gap-2 h-11"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/discover">
              <Compass className="h-4 w-4" />
              Discover
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="justify-start gap-2 h-11"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/collections">
              <Library className="h-4 w-4" />
              Collections
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="justify-start gap-2 h-11"
            onClick={() => setIsOpen(false)}
          >
            <Link href="/watchlist">
              <Heart className="h-4 w-4" />
              My Watchlist
            </Link>
          </Button>

          <div className="my-3 border-t" />

          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Genres
          </p>

          {(genres || []).map((genre) => (
            <Button
              asChild
              key={genre.id}
              variant="ghost"
              className="justify-start gap-2 h-10 text-sm"
              onClick={() => setIsOpen(false)}
            >
              <Link href={`/genre/${genre.name}/${genre.id}`}>
                <Play className="h-3 w-3" />
                {genre.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </>
  );
}
