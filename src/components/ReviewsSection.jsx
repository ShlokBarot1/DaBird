import './ReviewsSection.css';

const reviews = [
  {
    id: 1,
    name: "Zara K.",
    location: "New York, USA",
    rating: 5,
    title: "Best streetwear drop of the year",
    body: "Got the oversized tee in midnight blue and I literally haven't taken it off. The fabric is insanely soft and the fit is perfect. Da Bird is the real deal.",
    date: "March 2025",
  },
  {
    id: 2,
    name: "Marcus T.",
    location: "New York, USA",
    rating: 5,
    title: "Unreal quality for the price",
    body: "Ordered two pieces and they arrived faster than expected. The stitching is immaculate and the colourways are super unique. Already planning my next order.",
    date: "February 2025",
  },
  {
    id: 3,
    name: "Priya R.",
    location: "Chicago, USA",
    rating: 5,
    title: "Finally a brand that gets it",
    body: "The aesthetic is exactly what I've been searching for — clean but bold. The hoodie is heavyweight without being stiff. Washed it three times, holds up perfectly.",
    date: "March 2025",
  },
  {
    id: 4,
    name: "Theo A.",
    location: "Atlanta, USA",
    rating: 5,
    title: "Shipped worldwide, no hassle",
    body: "International shipping was smooth. The packaging itself is premium — felt like opening a gift. These pieces photograph incredibly well too.",
    date: "January 2025",
  },
  {
    id: 5,
    name: "Sofia M.",
    location: "Los Angeles, USA",
    rating: 4,
    title: "Obsessed with the collab drop",
    body: "My third purchase from Da Bird. Every drop feels intentional and curated. The sizing runs slightly large but I prefer the oversized look anyway.",
    date: "March 2025",
  },
  {
    id: 6,
    name: "Jordan L.",
    location: "Miami, USA",
    rating: 5,
    title: "Joined the flock and never looking back",
    body: "Stumbled on Da Bird through TikTok and instantly ordered. The vibe is unlike anything else out there right now. Already got three friends to order too.",
    date: "February 2025",
  },
];

const Stars = ({ count }) => (
  <div className="review-stars" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`star-icon ${i < count ? "star-filled" : "star-empty"}`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

export default function ReviewsSection() {
  const totalReviews = reviews.length;
  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
  ).toFixed(1);

  return (
    <section className="reviews-section">
      {/* Header */}
      <div className="reviews-header">
        <div className="reviews-header-left">
          <h2 className="reviews-title">WHAT THE FLOCK SAYS</h2>
          <p className="reviews-subtitle">Verified community reviews</p>
        </div>
        <div className="reviews-summary">
          <span className="reviews-avg">{avgRating}</span>
          <div className="reviews-summary-right">
            <Stars count={5} />
            <span className="reviews-count">Based on {totalReviews} reviews</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="reviews-grid">
        {reviews.map((review) => (
          <article key={review.id} className="review-card">
            <div className="review-card-top">
              <Stars count={review.rating} />
              <span className="review-date">{review.date}</span>
            </div>
            <h3 className="review-title">"{review.title}"</h3>
            <p className="review-body">{review.body}</p>
            <div className="review-author">
              <div className="review-avatar">
                {review.name.charAt(0)}
              </div>
              <div className="review-author-info">
                <span className="review-name">{review.name}</span>
                <span className="review-location">{review.location}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
