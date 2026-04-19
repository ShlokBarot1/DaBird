import './UGCSection.css';
import useInViewport from '../hooks/useInViewport';

const ugcSlots = [
  { id: 1, label: "COMMUNITY DROP 01", src: "/ugc_1.mp4" },
  { id: 2, label: "COMMUNITY DROP 02", src: "/ugc_2.mp4" },
  { id: 3, label: "COMMUNITY DROP 03", src: "/ugc_4.mp4" },
];

function UGCVideoCard({ slot }) {
  const [cardRef, shouldLoadVideo] = useInViewport({ rootMargin: '500px 0px' });

  return (
    <div ref={cardRef} className="ugc-card">
      <div className="ugc-video-placeholder">
        <video
          src={shouldLoadVideo ? slot.src : undefined}
          autoPlay={shouldLoadVideo}
          loop
          muted
          playsInline
          preload="none"
          className="ugc-video"
        />
      </div>

      <div className="ugc-card-footer">
        <span className="ugc-label">{slot.label}</span>
        <span className="ugc-tag">@dabird</span>
      </div>
    </div>
  );
}

export default function UGCSection() {
  return (
    <section className="ugc-section">
      <div className="ugc-header">
        <h2 className="ugc-title">IN THE WILD</h2>
        <p className="ugc-subtitle">Real people. Real fits.</p>
      </div>

      <div className="ugc-grid">
        {ugcSlots.map((slot) => (
          <UGCVideoCard key={slot.id} slot={slot} />
        ))}
      </div>
    </section>
  );
}
