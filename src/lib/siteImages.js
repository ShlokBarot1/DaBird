/**
 * All static art lives under /public/images (served as /images/...).
 * Paths use encodeURIComponent per segment so spaces in filenames work.
 */
function imgPath(...segments) {
  return '/images/' + segments.map(encodeURIComponent).join('/');
}

export const siteImages = {
  hero: imgPath('optimized', 'hero-section-2.webp'),
  homeOurProducts: imgPath('optimized', 'our-products.webp'),
  homeOurStory: imgPath('optimized', 'grandpa-2.webp'),
  homeJoinFlock: imgPath('optimized', 'join-the-flock.webp'),
  newsletter: imgPath('optimized', 'newsletter.webp'),
  certificate: imgPath('optimized', 'flip-certi.webp'),
  about: {
    fishing: imgPath('about us', 'Fishing.png'),
    grandpa: imgPath('about us', 'Grandpa.png'),
    oldLadyCouple: imgPath('about us', 'old lady couple.png'),
    post3: imgPath('about us', 'Untitled design (5).png'),
    tennis: imgPath('about us', 'tennis.png'),
    rep1: imgPath('about us', 'replacement_1.png'),
    rep2: imgPath('about us', 'replacement_2.png'),
  },
};

export const aboutParallaxImages = [
  { src: siteImages.about.post3, alt: 'Da Bird Logo' },
  { src: siteImages.about.grandpa, alt: 'Grandpa' },
  { src: siteImages.about.oldLadyCouple, alt: 'Old lady couple' },
  { src: siteImages.about.fishing, alt: 'Fishing' },
  { src: siteImages.about.tennis, alt: 'Tennis' },
  { src: siteImages.about.rep1, alt: 'Replacement 1' },
  { src: siteImages.about.rep2, alt: 'Replacement 2' },
];

/** Placeholder grid when Shopify is offline */
export const fallbackProductVisuals = [
  { image: siteImages.homeOurProducts, hoverImage: siteImages.hero },
  { image: siteImages.homeOurStory, hoverImage: siteImages.homeJoinFlock },
  { image: siteImages.homeJoinFlock, hoverImage: siteImages.newsletter },
  { image: siteImages.newsletter, hoverImage: siteImages.homeOurProducts },
];
