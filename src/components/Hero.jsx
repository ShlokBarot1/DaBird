import { heroCopy } from '../content/siteContent';
import { siteImages } from '../lib/siteImages';
import './Hero.css';

const Hero = () => {
  const lines = heroCopy.lines || ['SHOP NOW', 'EXPLORE OUR FIRST', 'COLLECTION'];
  return (
    <section className="hero">
      <div className="hero-background">
        <img
          className="hero-lcp-image"
          src={siteImages.hero}
          alt="Da Bird collection hero"
          width="1920"
          height="1072"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content-bottom-left">
        <div className="hero-text-wrapper">
          <h1 className="hero-title">
            <a href={heroCopy.shopHref || '#shop'} className="hero-massive-link">
              {lines.join('\n')}
            </a>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default Hero;
