import { MovieType } from "@/types/global";
import { ArrowLeft, Calendar, MapPin, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
}

interface MovieCredit extends MovieType {
  character?: string;
  job?: string;
  release_date: string;
}

async function fetchPerson(id: string): Promise<PersonDetails> {
  const res = await fetch(`https://api.themoviedb.org/3/person/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  return await res.json();
}

async function fetchCredits(id: string): Promise<MovieCredit[]> {
  const res = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  const data = await res.json();
  
  // Combine cast and crew, sort by release date (newest first)
  const allCredits = [...(data.cast || []), ...(data.crew || [])];
  const uniqueCredits = allCredits.reduce((acc: MovieCredit[], curr) => {
    if (!acc.find(m => m.id === curr.id)) {
      acc.push(curr);
    }
    return acc;
  }, []);
  
  return uniqueCredits
    .filter(m => m.poster_path)
    .sort((a, b) => {
      const dateA = a.release_date || "0000";
      const dateB = b.release_date || "0000";
      return dateB.localeCompare(dateA);
    })
    .slice(0, 24);
}

function calculateAge(birthday: string, deathday?: string | null): number {
  const birth = new Date(birthday);
  const end = deathday ? new Date(deathday) : new Date();
  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [person, credits] = await Promise.all([
    fetchPerson(id),
    fetchCredits(id),
  ]);

  const age = person.birthday ? calculateAge(person.birthday, person.deathday) : null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Movies
        </Link>
      </Button>

      {/* Person Info */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        {/* Profile Image */}
        <div className="w-48 sm:w-56 md:w-64 shrink-0 mx-auto sm:mx-0">
          <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-xl relative bg-muted">
            {person.profile_path ? (
              <Image
                src={`http://image.tmdb.org/t/p/w342${person.profile_path}`}
                alt={person.name}
                fill
                priority
                sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground">No Photo</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            {person.name}
          </h1>
          
          <p className="text-muted-foreground mb-4">
            {person.known_for_department}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-6">
            {person.birthday && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(person.birthday).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {age !== null && ` (${age} years${person.deathday ? " old at death" : " old"})`}
                </span>
              </div>
            )}
            {person.place_of_birth && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{person.place_of_birth}</span>
              </div>
            )}
          </div>

          {/* Biography */}
          {person.biography && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Biography</h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {person.biography.length > 800
                  ? person.biography.slice(0, 800) + "..."
                  : person.biography}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Filmography */}
      {credits.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b">
            Known For
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {credits.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`} className="group block">
                <div className="relative overflow-hidden rounded-lg bg-muted aspect-[2/3] shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]">
                  <Image
                    src={`http://image.tmdb.org/t/p/w342${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {movie.vote_average && (
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="mt-2 px-1">
                  <h3 className="font-medium text-sm line-clamp-2 leading-tight">{movie.title}</h3>
                  {movie.character && (
                    <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">
                      as {movie.character}
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {movie.release_date?.split("-")[0] || "TBA"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
