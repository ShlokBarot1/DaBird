import './BrandPillars.css';

const BrandPillars = () => {
  return (
    <section className="brand-pillars">
      <div className="pillars-header">
        <span className="side-tag">( DA BIRD )</span>
        <h2 className="main-title">our brand pillars</h2>
        <span className="side-tag">( &copy;2026 )</span>
      </div>

      <div className="pillars-content">
        <div className="pillar-row">
          <div className="pillar-label">community</div>
          <p className="pillar-text hover-neon">
            at da bird, we believe in the power of the collective. our brand is a testament to the streets that raised us, forging a global family bound by culture and unapologetic expression.
          </p>
        </div>

        <div className="pillar-row">
          <div className="pillar-label">creativity</div>
          <p className="pillar-text hover-neon">
            every thread woven is a canvas of innovation. we disrupt traditional fashion paradigms by exploring bold silhouettes and redefining what aesthetic streetwear can achieve.
          </p>
        </div>

        <div className="pillar-row">
          <div className="pillar-label">craft</div>
          <p className="pillar-text hover-neon">
            obsessive attention to detail is our standard. from our heavyweight cotton to our meticulously stitched insignias, we engineer garments built to outlast the trends.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandPillars;
