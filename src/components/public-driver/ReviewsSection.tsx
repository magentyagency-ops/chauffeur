export default function ReviewsSection({ reviews, rating, reviewCount }: { reviews: any[]; rating: number; reviewCount: number }) {
  if (reviews.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Avis clients</h2>
        <div className="flex items-center gap-2 text-[13px] font-semibold text-muted">
          <span className="text-accent font-bold">★ {rating}</span>
          <span>· {reviewCount} avis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map(review => (
          <div key={review.id} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-alt border border-border flex items-center justify-center font-bold text-[11px]">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-[13px]">{review.author}</div>
                  <div className="text-[11px] text-muted">{review.date}</div>
                </div>
              </div>
              <span className="text-accent text-[12px] font-bold">★ {review.rating}</span>
            </div>
            <p className="text-[13px] text-muted leading-relaxed">
              « {review.comment} »
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
