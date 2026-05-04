export default function ReviewsSection({ reviews, rating, reviewCount }: { reviews: any[]; rating: number; reviewCount: number }) {
  return (
    <section id="avis" className="scroll-mt-28 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-2">Avis clients</h2>
          <p className="text-text-muted font-medium">{reviewCount} avis vérifiés</p>
        </div>

        {/* Aggregate Score */}
        <div className="flex items-center gap-4 glass rounded-[1.5rem] p-4 md:p-5 border border-surface-border shadow-lg">
          <div className="text-4xl font-black text-foreground tracking-tight">{rating}</div>
          <div>
            <div className="flex items-center gap-0.5 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" fill={i < Math.round(rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${i < Math.round(rating) ? "text-amber-400" : "text-surface-border"}`}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <div className="text-xs font-bold text-text-muted">sur {reviewCount} avis</div>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="glass rounded-[2rem] p-12 md:p-16 flex flex-col items-center justify-center text-center border border-dashed border-surface-border">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-5 text-text-muted shadow-inner border border-surface-border">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Pas encore d&apos;avis</h3>
          <p className="text-text-muted text-sm font-medium">Les premiers avis apparaîtront ici bientôt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {reviews.map(review => (
            <div key={review.id} className="glass rounded-[1.5rem] p-6 border border-surface-border flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-surface-border to-surface flex items-center justify-center font-bold text-foreground shadow-inner">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">{review.author}</div>
                    <div className="text-xs font-medium text-text-muted">{review.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400" : "text-surface-border"}`}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium text-text-secondary leading-relaxed flex-1">
                « {review.comment} »
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
