import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { siteImages } from '../lib/siteImages';
import './AboutScrollSection.css';

const AboutScrollSection = () => {
  const containerRef = useRef(null);
  
  // Natural scroll mapping across the 250vh white canvas
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Photo 1: Left wall (Tall portrait)
  // Base structural anchor
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  
  // Photo 2: Right cafe (Wide landscape)
  // Higher velocity slides past photo 1
  const y2 = useTransform(scrollYProgress, [0, 1], ["20%", "-40%"]);
  
  // Photo 3: Center huge black/white
  // Aggressive parallax overlap flying rapidly through the frame
  const y3 = useTransform(scrollYProgress, [0, 1], ["50%", "-150%"]);
  
  // Photo 4: Bottom left, walking with tote bag
  // Counter-drift
  const y4 = useTransform(scrollYProgress, [0, 1], ["80%", "-20%"]);

  // We are adding a floating brand icon layer flying at insane velocity
  const overlayY = useTransform(scrollYProgress, [0, 1], ["150%", "-300%"]);

  return (
    <section ref={containerRef} className="about-collage-container">
        
        {/* Photo 1: Deep left portrait */}
        <motion.img 
          src={siteImages.about.fishing} 
          alt="Collage 1" 
          className="collage-img collage-img-1" 
          style={{ y: y1 }} 
        />

        {/* Photo 2: Upper right wide shot */}
        <motion.img 
          src={siteImages.about.grandpa} 
          alt="Collage 2" 
          className="collage-img collage-img-2" 
          style={{ y: y2 }} 
        />

        {/* Photo 3: Center — post 3 */}
        <motion.img 
          src={siteImages.about.post3} 
          alt="Collage 3" 
          className="collage-img collage-img-3" 
          style={{ y: y3 }} 
        />

        {/* Photo 4: Lower trailing shot */}
        <motion.img 
          src={siteImages.about.tennis} 
          alt="Collage 4" 
          className="collage-img collage-img-4" 
          style={{ y: y4 }} 
        />

        {/* Floating high-velocity brand asset duplicating Odd Ritual's floating icons */}
        <motion.div 
          style={{ y: overlayY, position: 'absolute', top: '10%', right: '15%', zIndex: 10, fontSize: '6rem', color: '#000', pointerEvents: 'none' }}
        >
          𓅃
        </motion.div>
        
    </section>
  );
};

export default AboutScrollSection;
