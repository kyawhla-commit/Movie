import { PersonType } from "@/types/global";
import Link from "next/link";
import Image from "next/image";

interface CastCardProps {
  person: PersonType;
}

export default function CastCard({ person }: CastCardProps) {
  return (
    <Link href={`/person/${person.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-muted aspect-[2/3] shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]">
        {person.profile_path ? (
          <Image
            src={`http://image.tmdb.org/t/p/w185${person.profile_path}`}
            alt={person.name}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            <span className="text-muted-foreground text-xs text-center px-2">No Photo</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="mt-2 px-1">
        <h4 className="font-medium text-sm line-clamp-1">{person.name}</h4>
        {person.character && (
          <p className="text-muted-foreground text-xs line-clamp-1 mt-0.5">
            {person.character}
          </p>
        )}
      </div>
    </Link>
  );
}
