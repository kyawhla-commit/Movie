import TVGrid from "@/components/tv-grid";
import { TVShowType } from "@/types/global";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TV Shows | Next Movie",
  description: "Discover popular TV shows, trending series, and top-rated television programs.",
};

async function fetchTVShows(endpoint: string): Promise<TVShowType[]> {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  const data = await res.json();
  return data.results?.slice(0, 12) || [];
}

export default async function TVShowsPage() {
  const [airingToday, popular, topRated, onTheAir] = await Promise.all([
    fetchTVShows("airing_today"),
    fetchTVShows("popular"),
    fetchTVShows("top_rated"),
    fetchTVShows("on_the_air"),
  ]);

  return (
    <div className="space-y-8 sm:space-y-12">
      <TVGrid shows={airingToday} title="📺 Airing Today" />
      <TVGrid shows={popular} title="🔥 Popular Shows" />
      <TVGrid shows={onTheAir} title="📡 On The Air" />
      <TVGrid shows={topRated} title="⭐ Top Rated" />
    </div>
  );
}
