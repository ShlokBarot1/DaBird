import { AboutZoomParallax } from './AboutZoomParallax';
import { aboutCopy } from '../content/siteContent';
import { aboutParallaxImages } from '../lib/siteImages';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-page">
      {/* Intro block pulling exact architectural text ratios from the provided visual mock */}
      <section className="about-intro">
        <div className="about-intro-story-label">
          {aboutCopy.label}
        </div>
        <div className="about-intro-main">
          <h1 className="about-intro-title">
            {aboutCopy.title}
          </h1>
          <div className="about-intro-body">
            <div className="about-intro-col">
              {aboutCopy.columns[0].map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="about-intro-col">
              {aboutCopy.columns[1].map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deep immersive cinematic GSAP-layer equivalent scroll section */}
      <AboutZoomParallax images={aboutParallaxImages} />
    </div>
  );
};

export default AboutUs;
