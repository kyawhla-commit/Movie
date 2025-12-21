import { TVShowType } from "@/types/global";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

export default function TVCard({ show }: { show: TVShowType }) {
  const year = show.first_air_date?.split("-")[0] || "N/A";

  return (
    <Link href={`/tv/${show.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-muted aspect-[2/3] shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
        {show.poster_path ? (
          <Image
            src={`http://image.tmdb.org/t/p/w342${show.poster_path}`}
            alt={show.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating badge */}
        {show.vote_average && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {show.vote_average.toFixed(1)}
          </div>
        )}

        {/* TV badge */}
        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-md">
          TV
        </div>

        {/* Title overlay on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-sm line-clamp-2 drop-shadow-lg">
            {show.name}
          </h3>
          <p className="text-white/80 text-xs mt-1">{year}</p>
        </div>
      </div>

      {/* Title below card */}
      <div className="mt-2 px-1">
        <h3 className="font-medium text-sm line-clamp-2 leading-tight">{show.name}</h3>
        <p className="text-muted-foreground text-xs mt-1">{year}</p>
      </div>
    </Link>
  );
}
