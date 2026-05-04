export default function ReviewsSection({ reviews, rating, reviewCount }: { reviews: any[]; rating: number; reviewCount: number }) {
  return (
    <section id="avis" className="scroll-mt-28 space-y-12 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="display text-3xl md:text-4xl font-medium text-foreground tracking-tight mb-3">Avis clients</h2>
          <p className="text-text-muted font-medium text-lg italic display">{reviewCount} expériences vérifiées</p>
        </div>

        <div className="flex items-center gap-6 card !p-6 border-surface-border group hover:border-foreground/10 transition-colors">
          <div className="display text-5xl font-medium text-foreground tracking-tighter">{rating}</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 24 24" fill={i < Math.round(rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" className={`w-4 h-4 ${i < Math.round(rating) ? "text-amber-400" : "text-surface-border"}`}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
            </div>
            <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Score global</div>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="card p-16 flex flex-col items-center justify-center text-center border-dashed group hover:border-foreground/10 transition-colors">
          <div className="w-16 h-16 rounded-full bg-surface-light border border-surface-border flex items-center justify-center mb-6 text-text-muted transition-transform duration-500 group-hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3 className="display text-xl font-medium text-foreground mb-2">Premiers avis à venir</h3>
          <p className="text-text-muted text-sm font-medium italic display">La réputation de votre chauffeur se construit ici.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map(review => (
            <div key={review.id} className="card p-8 group hover:shadow-xl transition-all duration-500 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-light border border-surface-border flex items-center justify-center font-bold text-foreground text-xs">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-sm">{review.author}</div>
                    <div className="text-[9px] font-black text-text-muted uppercase tracking-widest">{review.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" className={`w-3 h-3 ${i < review.rating ? "text-amber-400" : "text-surface-border"}`}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-base text-text-muted leading-relaxed flex-1 italic display">
                &ldquo;{review.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
