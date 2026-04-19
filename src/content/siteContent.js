import { siteImages } from '../lib/siteImages';

/**
 * Edit this file to change marketing copy and home highlight cards.
 *
 * Shopify tags (for search/filter/featured): Admin → Products → open a product
 * → right column "Organization" → Tags. Comma-separated. Our shop filters also
 * read "Product type" in the same block.
 *
 * Featured carousel: add tag "featured" (or set VITE_SHOPIFY_FEATURED_COLLECTION
 * in .env to a collection handle — see ProductGrid).
 */

export const heroCopy = {
  lines: ['SHOP NOW', 'EXPLORE OUR FIRST', 'COLLECTION'],
  shopHref: '#shop',
};

export const homeHighlights = [
  {
    title: 'OUR PRODUCTS',
    image: siteImages.homeOurProducts,
    link: '#shop',
    isExternal: false,
  },
  {
    title: 'OUR STORY',
    image: siteImages.homeOurStory,
    link: '#about',
    isExternal: false,
  },
  {
    title: 'JOIN THE FLOCK',
    image: siteImages.homeJoinFlock,
    link: 'https://www.instagram.com/dabirddotnet?igsh=MWZubXdsd2FkZ3JlZA==',
    isExternal: true,
  },
];

export const aboutCopy = {
  label: '( OUR STORY )',
  title:
    "Meet The Flip, Flying straight outta Chicago",
  columns: [
    [
      "Da Bird started in Chicago, a city known for grit, humor, and iconic originals like Da Bears and Da Cubs. We wanted to create something with that same spirit. Something a little bold. A little funny. A little rebellious. That idea became Flip, a blue bird with attitude and a personality of his own.",
      "Da Bird is not a clothing brand in the traditional sense. When you pick up one of our pieces, you are not buying a shirt. You are adopting Flip. Every adoption comes with his own unique birth certificate. Flip becomes part of your story the moment you wear him.",
    ],
    [
      "We built Da Bird on simple principles. Make apparel that speaks for you. Make it comfortable. Make it with intention. Every design has character. Every piece is meant to start a conversation.",
      "Chicago born. Chicago proud. Da Bird is for people who like a little edge, a little humor, and a lot of personality. Flip is more than a mascot. He is a reminder that life is better when you smile.",
    ],
  ],
};

export const contactCopy = {
  title: "let's talk.",
  subtitle:
    'got a question about an order? want to collaborate or connect with da bird? drop us a line below.',
  support: {
    heading: 'support',
    email: 'dabird.net@gmail.com',
    hours: 'mon - fri: 9am - 5pm est',
  },
  press: {
    heading: 'press & collabs',
    email: 'dabird.net@gmail.com',
  },
  hq: {
    heading: 'hq',
    lines: ['Chicago, Illinois', 'United States'],
  },
};
