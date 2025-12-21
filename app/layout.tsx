import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import BackToTop from "@/components/back-to-top";
import Footer from "@/components/footer";
import { ToasterProvider } from "@/components/toaster-provider";

import { Clapperboard, Play, Search, Heart, Tv, TrendingUp, Compass, Library } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Movie",
  description: "Discover and explore movies",
};

import { GenreType } from "@/types/global";
import { redirect } from "next/navigation";
import MobileNav from "@/components/mobile-nav";

async function fetchGneres(): Promise<GenreType[]> {
  try {
    const res = await fetch("https://api.themoviedb.org/3/genre/movie/list", {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });

    const data = await res.json();
    return data.genres || [];
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const genres = await fetchGneres();

  async function search(formData: FormData) {
    "use server";

    const q = formData.get("q");
    redirect(`/search?q=${q}`);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <div className="flex h-14 sm:h-16 items-center justify-between px-4 lg:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl lg:text-2xl shrink-0">
                  <Clapperboard className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="hidden sm:inline">Next Movie</span>
                </Link>

                {/* Desktop Search */}
                <form action={search} className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4 lg:mx-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      name="q" 
                      placeholder="Search movies..." 
                      className="pl-9 w-full"
                    />
                  </div>
                  <Button type="submit" size="sm">Search</Button>
                </form>

                {/* Right side actions */}
                <div className="flex items-center gap-1">
                  <ThemeToggle />
                  <MobileNav genres={genres} searchAction={search} />
                </div>
              </div>

              {/* Mobile Search - Below header on small screens */}
              <form action={search} className="md:hidden px-4 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    name="q" 
                    placeholder="Search movies..." 
                    className="pl-9 w-full"
                  />
                </div>
              </form>
            </header>

            {/* Main Content */}
            <div className="flex flex-1">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:flex w-56 xl:w-64 shrink-0 border-r bg-muted/30">
                <nav className="flex flex-col gap-1 p-4 w-full sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin">
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start gap-2 h-10"
                  >
                    <Link href="/">
                      <Play className="h-4 w-4" />
                      All Movies
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start gap-2 h-10"
                  >
                    <Link href="/tv">
                      <Tv className="h-4 w-4" />
                      TV Shows
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start gap-2 h-10"
                  >
                    <Link href="/trending">
                      <TrendingUp className="h-4 w-4" />
                      Trending
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start gap-2 h-10"
                  >
                    <Link href="/discover">
                      <Compass className="h-4 w-4" />
                      Discover
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start gap-2 h-10"
                  >
                    <Link href="/collections">
                      <Library className="h-4 w-4" />
                      Collections
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start gap-2 h-10"
                  >
                    <Link href="/watchlist">
                      <Heart className="h-4 w-4" />
                      My Watchlist
                    </Link>
                  </Button>
                  <div className="my-2 border-t" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                    Genres
                  </p>
                  {(genres || []).map((genre) => (
                    <Button 
                      asChild 
                      key={genre.id} 
                      variant="ghost"
                      className="justify-start gap-2 h-9 text-sm"
                    >
                      <Link href={`/genre/${genre.name}/${genre.id}`}>
                        <Play className="h-3 w-3" />
                        {genre.name}
                      </Link>
                    </Button>
                  ))}
                </nav>
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 min-w-0">
                <div className="p-4 sm:p-6 lg:p-8">
                  {children}
                </div>
              </main>
            </div>
            <Footer />
          </div>
          <BackToTop />
          <ToasterProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
