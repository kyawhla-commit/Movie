import Image from "next/image";
import { Tv, ShoppingCart, Ticket } from "lucide-react";

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

interface WatchProvidersProps {
  providers: {
    flatrate?: Provider[];
    rent?: Provider[];
    buy?: Provider[];
    link?: string;
  } | null;
}

export default function WatchProviders({ providers }: WatchProvidersProps) {
  if (!providers || (!providers.flatrate && !providers.rent && !providers.buy)) {
    return null;
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Tv className="h-5 w-5" />
        Where to Watch
      </h3>
      
      <div className="space-y-4">
        {/* Streaming */}
        {providers.flatrate && providers.flatrate.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
              <Tv className="h-4 w-4" />
              Stream
            </p>
            <div className="flex flex-wrap gap-2">
              {providers.flatrate.map((p) => (
                <a
                  key={p.provider_id}
                  href={providers.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  title={p.provider_name}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shadow-md transition-transform group-hover:scale-110">
                    <Image
                      src={`http://image.tmdb.org/t/p/w92${p.logo_path}`}
                      alt={p.provider_name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Rent */}
        {providers.rent && providers.rent.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
              <Ticket className="h-4 w-4" />
              Rent
            </p>
            <div className="flex flex-wrap gap-2">
              {providers.rent.map((p) => (
                <a
                  key={p.provider_id}
                  href={providers.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  title={p.provider_name}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shadow-md transition-transform group-hover:scale-110">
                    <Image
                      src={`http://image.tmdb.org/t/p/w92${p.logo_path}`}
                      alt={p.provider_name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Buy */}
        {providers.buy && providers.buy.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1.5">
              <ShoppingCart className="h-4 w-4" />
              Buy
            </p>
            <div className="flex flex-wrap gap-2">
              {providers.buy.map((p) => (
                <a
                  key={p.provider_id}
                  href={providers.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                  title={p.provider_name}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shadow-md transition-transform group-hover:scale-110">
                    <Image
                      src={`http://image.tmdb.org/t/p/w92${p.logo_path}`}
                      alt={p.provider_name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Data provided by JustWatch
      </p>
    </div>
  );
}
