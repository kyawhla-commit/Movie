import { ReviewType } from "@/types/global";
import { Star, ExternalLink, User } from "lucide-react";
import Image from "next/image";

interface ReviewsProps {
  reviews: ReviewType[];
}

export default function Reviews({ reviews }: ReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b">
        Reviews ({reviews.length})
      </h2>
      <div className="space-y-4">
        {reviews.slice(0, 5).map((review) => (
          <div
            key={review.id}
            className="bg-muted/50 rounded-lg p-4 sm:p-6"
          >
            {/* Author info */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                {review.author_details.avatar_path ? (
                  <Image
                    src={
                      review.author_details.avatar_path.startsWith("/https")
                        ? review.author_details.avatar_path.slice(1)
                        : `http://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`
                    }
                    alt={review.author}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">{review.author}</span>
                  {review.author_details.rating && (
                    <div className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                      <Star className="h-3 w-3 fill-current" />
                      {review.author_details.rating}/10
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Review content */}
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p className="line-clamp-4 whitespace-pre-line">
                {review.content.length > 500
                  ? review.content.slice(0, 500) + "..."
                  : review.content}
              </p>
            </div>

            {/* Read more link */}
            {review.url && (
              <a
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-3"
              >
                Read full review
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
