import React, { useState } from 'react';
import { Layout, Breadcrumbs } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Star, ThumbsUp } from 'lucide-react';

const REVIEWS = [
  { id: 1, name: 'Priya S.', rating: 5, date: '25 Sep 2026', text: 'The Butter Chicken was absolutely divine! Best Indian food I\'ve had in Bangalore. Fast delivery too!', helpful: 12, avatar: 'P' },
  { id: 2, name: 'Arjun M.', rating: 5, date: '22 Sep 2026', text: 'Dal Makhani was outstanding – rich, creamy and perfectly spiced. The Garlic Naan complemented it perfectly.', helpful: 8, avatar: 'A' },
  { id: 3, name: 'Kavya R.', rating: 4, date: '18 Sep 2026', text: 'Really enjoyed the Hyderabadi Biryani. Great portion size and amazing aroma. Delivery was on time!', helpful: 5, avatar: 'K' },
  { id: 4, name: 'Rahul T.', rating: 5, date: '15 Sep 2026', text: 'Paneer Tikka was perfectly charred with the right amount of spice. Will definitely order again!', helpful: 15, avatar: 'R' },
];

const RATINGS_DIST = [
  { stars: 5, count: 856, pct: 72 }, { stars: 4, count: 210, pct: 18 }, { stars: 3, count: 71, pct: 6 },
  { stars: 2, count: 24, pct: 2 }, { stars: 1, count: 24, pct: 2 },
];

function StarRating({ value, onChange, size = 24 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange?.(s)} className="transition-transform hover:scale-110">
          <Star size={size} className={`${(hover || value) >= s ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
        </button>
      ))}
    </div>
  );
}

export default function Reviews() {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [helpful, setHelpful] = useState({});

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: 'Reviews' }]} />
        <h1 className="text-4xl font-black font-serif mb-8">⭐ Reviews & Ratings</h1>

        {/* Summary */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-8">
          <div className="text-center sm:text-left">
            <div className="text-6xl font-black text-primary">4.8</div>
            <StarRating value={5} size={20} />
            <p className="text-sm text-muted-foreground mt-1">1,185 reviews</p>
          </div>
          <div className="flex-1 space-y-2">
            {RATINGS_DIST.map(r => (
              <div key={r.stars} className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground w-10">{r.stars} ⭐</span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-muted-foreground w-8">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write a Review */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-black mb-4">Write a Review</h2>
          {submitted ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-2">🙏</div>
              <p className="font-bold">Thank you for your review!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold mb-2 block">Your Rating *</label>
                <StarRating value={rating} onChange={setRating} size={32} />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Your Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"
                  className="w-full border-2 border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm font-bold mb-2 block">Your Review *</label>
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={4}
                  placeholder="Share your experience with us..."
                  className="w-full border-2 border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition resize-none" />
              </div>
              <Button onClick={() => reviewText && rating && setSubmitted(true)} className="w-full h-12 font-bold rounded-xl">Submit Review</Button>
            </div>
          )}
        </div>

        {/* Review List */}
        <div className="space-y-4">
          {REVIEWS.map(r => (
            <div key={r.id} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-black">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-bold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({length: r.rating}).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{r.text}</p>
              <button onClick={() => setHelpful(h => ({...h, [r.id]: true}))}
                className={`flex items-center gap-1.5 text-xs font-semibold ${helpful[r.id] ? 'text-primary' : 'text-muted-foreground'} hover:text-primary transition`}>
                <ThumbsUp size={13} /> Helpful ({helpful[r.id] ? r.helpful + 1 : r.helpful})
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
