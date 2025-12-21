import TVCard from "@/components/tv-card";
import { TVShowType } from "@/types/global";

interface TVGridProps {
  shows: TVShowType[];
  title?: string;
}

export default function TVGrid({ shows, title }: TVGridProps) {
  return (
    <section className="mb-8 sm:mb-12">
      {title && (
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {shows.map((show) => (
          <TVCard key={show.id} show={show} />
        ))}
      </div>
    </section>
  );
}
