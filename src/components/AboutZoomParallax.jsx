import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { siteImages } from '../lib/siteImages';
import './AboutZoomParallax.css';

export function AboutZoomParallax({ images }) {
  const container = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // --- PAUSE LOGIC ---
  // Zoom happens from 0 to 0.4.
  // Pause at scale from 0.4 to 1.0.
  // This removes the 'useless white space' (the 100vh of sliding past) 
  // because the viewport stays frozen on the final collage frame.
  const p = [0, 0.4, 1];

  const s4 = useTransform(scrollYProgress, p, [1, 3.5, 3.5]);
  const s5 = useTransform(scrollYProgress, p, [1, 5, 5]);
  const s6 = useTransform(scrollYProgress, p, [1, 6, 6]);
  const s8 = useTransform(scrollYProgress, p, [1, 8, 8]);
  const s9 = useTransform(scrollYProgress, p, [1, 9, 9]);

  const scaleTemplates = [s4, s5, s6, s5, s6, s8, s9];
  const scales = images.map((_, index) =>
    scaleTemplates[Math.min(index, scaleTemplates.length - 1)]
  );

  return (
    <div ref={container} className="zoom-parallax-container" style={{
      height: isMobile ? '200vh' : '250vh', // Reduced height for snappiness
      marginBottom: isMobile ? '-100vh' : '-150vh' // Pulls footer UP to meet the pause
    }}>
      <div className="zoom-sticky-viewport">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index];

          return (
            <motion.div
              key={index}
              style={{
                scale,
                // Logo (Layer 1) always on top, others stacked underneath
                zIndex: 10 - index
              }}
              className={`zoom-layer zoom-layer-${index + 1}`}
            >
              <div className="zoom-image-wrapper">
                <img
                  src={src || siteImages.newsletter}
                  alt={alt || `Parallax image ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
