import { Clapperboard, Github, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
                <Clapperboard className="h-5 w-5" />
                Next Movie
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover and explore movies. Find where to watch, view trailers, and browse cast information.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3">Discover</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Popular Movies
                  </Link>
                </li>
                <li>
                  <Link href="/genre/Action/28" className="text-muted-foreground hover:text-foreground transition-colors">
                    Action
                  </Link>
                </li>
                <li>
                  <Link href="/genre/Comedy/35" className="text-muted-foreground hover:text-foreground transition-colors">
                    Comedy
                  </Link>
                </li>
                <li>
                  <Link href="/genre/Drama/18" className="text-muted-foreground hover:text-foreground transition-colors">
                    Drama
                  </Link>
                </li>
              </ul>
            </div>

            {/* More Genres */}
            <div>
              <h4 className="font-semibold mb-3">Genres</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/genre/Horror/27" className="text-muted-foreground hover:text-foreground transition-colors">
                    Horror
                  </Link>
                </li>
                <li>
                  <Link href="/genre/Science%20Fiction/878" className="text-muted-foreground hover:text-foreground transition-colors">
                    Sci-Fi
                  </Link>
                </li>
                <li>
                  <Link href="/genre/Animation/16" className="text-muted-foreground hover:text-foreground transition-colors">
                    Animation
                  </Link>
                </li>
                <li>
                  <Link href="/genre/Thriller/53" className="text-muted-foreground hover:text-foreground transition-colors">
                    Thriller
                  </Link>
                </li>
              </ul>
            </div>

            {/* Credits */}
            <div>
              <h4 className="font-semibold mb-3">Credits</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Data by TMDB
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.justwatch.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Streaming by JustWatch
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using Next.js
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
