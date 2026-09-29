export interface InstagramPost {
  id: number;
  title: string;
  image: string;
  caption: string;
  likes: number;
  postUrl: string;
}

/**
 * Curated Instagram posts displayed on the homepage.
 * You can update 'postUrl' with the direct link to each specific Instagram post or Reel
 * (e.g. "https://www.instagram.com/p/C-exampleCode/" or "https://www.instagram.com/reel/C-exampleCode/").
 */
export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 1,
    title: "Strawberry Bunny Plushie",
    image: "/images/instagram/strawberry-bunny.jpg",
    caption: "Finishing up this sweet made-to-order strawberry bunny for a special birthday! 🍓🐰",
    likes: 246,
    postUrl: "https://www.instagram.com/the_crochetdiaryy/p/strawberry-bunny/",
  },
  {
    id: 2,
    title: "Daisy Charm Tote Bag",
    image: "/images/instagram/daisy-tote.jpg",
    caption: "Sunny mornings and handmade daisy totes. 100% organic milk cotton perfection 🌿🌼",
    likes: 318,
    postUrl: "https://www.instagram.com/the_crochetdiaryy/p/daisy-tote-bag/",
  },
  {
    id: 3,
    title: "Eternal Tulip Bouquet",
    image: "/images/instagram/tulip-bouquet.jpg",
    caption: "Everlasting blooms that never wither. Wrapped with craft paper and ready for anniversary gifting! 💐",
    likes: 289,
    postUrl: "https://www.instagram.com/the_crochetdiaryy/p/tulip-bouquet/",
  },
  {
    id: 4,
    title: "Granny Square Bucket Hat",
    image: "/images/instagram/granny-hat.jpg",
    caption: "Pastel granny squares in progress. Soft, breathable, and retro-chic 👒✨",
    likes: 215,
    postUrl: "https://www.instagram.com/the_crochetdiaryy/p/bucket-hat/",
  },
  {
    id: 5,
    title: "Sunflower Coaster Set",
    image: "/images/instagram/sunflower-coasters.jpg",
    caption: "Morning chai just tastes better over a hand-stitched sunflower coaster ☕💛",
    likes: 194,
    postUrl: "https://www.instagram.com/the_crochetdiaryy/p/sunflower-coasters/",
  },
  {
    id: 6,
    title: "Avocado Keychain Charm",
    image: "/images/instagram/avocado-keychain.jpg",
    caption: "Pocket-sized happiness! Our tiny avocado bag charms are back in stock 🥑",
    likes: 342,
    postUrl: "https://www.instagram.com/the_crochetdiaryy/p/avocado-keychain/",
  },
];
