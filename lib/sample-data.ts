export interface SeedCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface SeedVariant {
  name: string;
  value: string;
  priceDelta?: number;
  stockQty?: number;
}

export interface SeedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price?: number | null;
  compareAtPrice?: number | null;
  categorySlug: string;
  images: string[];
  stockType: "READY_TO_SHIP" | "MADE_TO_ORDER";
  stockQty?: number | null;
  leadTimeDays?: number | null;
  isFeatured: boolean;
  isActive: boolean;
  isCustom?: boolean;
  variants?: SeedVariant[];
}

export const sampleCategories: SeedCategory[] = [
  {
    id: "cat_amigurumi",
    name: "Amigurumi & Toys",
    slug: "amigurumi-toys",
    description: "Cute handcrafted plushies, safe for all ages made with hypoallergenic soft yarn.",
    image: "https://placehold.co/600x600/FAF1EA/D98E73?text=Amigurumi+%26+Toys",
  },
  {
    id: "cat_bags",
    name: "Bags & Pouches",
    slug: "bags-pouches",
    description: "Aesthetic crochet shoulder bags, granny square totes, and zippered coin pouches.",
    image: "https://placehold.co/600x600/FAF1EA/4A5D45?text=Bags+%26+Pouches",
  },
  {
    id: "cat_decor",
    name: "Home Decor",
    slug: "home-decor",
    description: "Handmade everlasting flower bouquets, coasters, and cozy botanical accents.",
    image: "https://placehold.co/600x600/FAF1EA/E8B4B8?text=Home+Decor",
  },
  {
    id: "cat_apparel",
    name: "Apparel & Accessories",
    slug: "apparel-accessories",
    description: "Crochet bucket hats, bandanas, fingerless mitts, and lightweight tops.",
    image: "https://placehold.co/600x600/FAF1EA/5C4033?text=Apparel+%26+Accessories",
  },
  {
    id: "cat_keychains",
    name: "Keychains & Gifting",
    slug: "keychains-gifting",
    description: "Charming handcrafted bag charms, keyrings, and miniature gifting keepsakes.",
    image: "https://placehold.co/600x600/FAF1EA/D98E73?text=Keychains+%26+Gifting",
  },
];

export const sampleProducts: SeedProduct[] = [
  {
    id: "prod_daisy_tote",
    name: "Daisy Charm Tote Bag",
    slug: "daisy-charm-tote-bag",
    description: "Hand-stitched vintage floral motif tote bag made with 100% breathable organic milk cotton yarn. Reinforced straps designed to comfortably hold daily essentials and a 13-inch laptop.",
    price: 1499,
    compareAtPrice: 1799,
    categorySlug: "bags-pouches",
    images: [
      "/images/instagram/daisy-tote.jpg",
    ],
    stockType: "READY_TO_SHIP",
    stockQty: 5,
    leadTimeDays: null,
    isFeatured: true,
    isActive: true,
    variants: [
      { name: "Color", value: "Natural Cream", priceDelta: 0, stockQty: 3 },
      { name: "Color", value: "Sage Green", priceDelta: 0, stockQty: 2 },
    ],
  },
  {
    id: "prod_strawberry_bunny",
    name: "Strawberry Bunny Plushie",
    slug: "strawberry-bunny-plushie",
    description: "Ultra-soft plush amigurumi bunny featuring safety eyes and a hand-crocheted strawberry hat. Irresistibly cuddly gift for birthdays or keepsakes.",
    price: 899,
    compareAtPrice: 1099,
    categorySlug: "amigurumi-toys",
    images: [
      "/images/instagram/strawberry-bunny.jpg",
    ],
    stockType: "MADE_TO_ORDER",
    stockQty: null,
    leadTimeDays: 4,
    isFeatured: true,
    isActive: true,
    variants: [
      { name: "Size", value: "Classic (15cm)", priceDelta: 0 },
      { name: "Size", value: "Mini Keychain (8cm)", priceDelta: -300 },
    ],
  },
  {
    id: "prod_granny_hat",
    name: "Pastel Granny Square Bucket Hat",
    slug: "pastel-granny-square-bucket-hat",
    description: "Cozy artisanal bucket hat composed of nostalgic granny squares in dreamy pastel hues. Breathable cotton yarn keeps your head cool and stylish.",
    price: 799,
    compareAtPrice: null,
    categorySlug: "apparel-accessories",
    images: ["/images/instagram/granny-hat.jpg"],
    stockType: "READY_TO_SHIP",
    stockQty: 3,
    leadTimeDays: null,
    isFeatured: true,
    isActive: true,
    variants: [
      { name: "Colorway", value: "Lavender & Buttercup", priceDelta: 0, stockQty: 2 },
      { name: "Colorway", value: "Terracotta Earth", priceDelta: 0, stockQty: 1 },
    ],
  },
  {
    id: "prod_tulip_bouquet",
    name: "Everlasting Crochet Tulip Bouquet (6 Stems)",
    slug: "everlasting-crochet-tulip-bouquet",
    description: "Handcrafted forever flower bouquet wrapped in premium craft paper with ribbon. Never withers, making it a thoughtful keepsake for anniversaries and graduations.",
    price: 1299,
    compareAtPrice: 1599,
    categorySlug: "home-decor",
    images: [
      "/images/instagram/tulip-bouquet.jpg",
    ],
    stockType: "MADE_TO_ORDER",
    stockQty: null,
    leadTimeDays: 5,
    isFeatured: true,
    isActive: true,
    variants: [
      { name: "Color Theme", value: "Blush Pink & White", priceDelta: 0 },
      { name: "Color Theme", value: "Sunrise Yellow & Coral", priceDelta: 0 },
    ],
  },
  {
    id: "prod_boba_bear",
    name: "Sleepy Boba Bear Amigurumi",
    slug: "sleepy-boba-bear-amigurumi",
    description: "Adorable chubby bear hugging a mini bubble tea cup with felt pearls. Stuffed with clean hypo-allergenic fiberfill.",
    price: 649,
    compareAtPrice: null,
    categorySlug: "amigurumi-toys",
    images: ["https://placehold.co/600x600/FAF1EA/5C4033?text=Sleepy+Boba+Bear"],
    stockType: "READY_TO_SHIP",
    stockQty: 4,
    leadTimeDays: null,
    isFeatured: false,
    isActive: true,
  },
  {
    id: "prod_sunflower_coasters",
    name: "Boho Sunflower Coaster Set (4 pcs)",
    slug: "boho-sunflower-coaster-set",
    description: "Set of 4 absorbent cotton sunflower drink coasters with textured center and delicate petal rims. Protects tables with handmade warmth.",
    price: 499,
    compareAtPrice: 650,
    categorySlug: "home-decor",
    images: ["/images/instagram/sunflower-coasters.jpg"],
    stockType: "READY_TO_SHIP",
    stockQty: 8,
    leadTimeDays: null,
    isFeatured: false,
    isActive: true,
  },
  {
    id: "prod_avocado_charm",
    name: "Mini Avocado Bag Charm & Keychain",
    slug: "mini-avocado-bag-charm",
    description: "Pocket-sized crochet avocado with cute embroidered smile and metallic key hook. Great for backpacks and car keys.",
    price: 249,
    compareAtPrice: null,
    categorySlug: "keychains-gifting",
    images: ["/images/instagram/avocado-keychain.jpg"],
    stockType: "READY_TO_SHIP",
    stockQty: 15,
    leadTimeDays: null,
    isFeatured: false,
    isActive: true,
  },
  {
    id: "prod_checkered_bag",
    name: "Cozy Hand-Knitted Checkered Shoulder Bag",
    slug: "cozy-checkered-shoulder-bag",
    description: "Statement checkered bag crocheted in double-thick stitch for structure and durability. Wide strap sits comfortably on the shoulder.",
    price: 1699,
    compareAtPrice: 1999,
    categorySlug: "bags-pouches",
    images: ["https://placehold.co/600x600/FAF1EA/5C4033?text=Checkered+Shoulder+Bag"],
    stockType: "MADE_TO_ORDER",
    stockQty: null,
    leadTimeDays: 7,
    isFeatured: true,
    isActive: true,
    variants: [
      { name: "Color", value: "Terracotta & Cream", priceDelta: 0 },
      { name: "Color", value: "Sage Green & Ivory", priceDelta: 0 },
    ],
  },
  {
    id: "prod_chick_eggshell",
    name: "Baby Chick in an Eggshell Plush",
    slug: "baby-chick-in-an-eggshell",
    description: "Little sunny yellow baby chick that tucks right into its detachable white eggshell nest.",
    price: 449,
    compareAtPrice: null,
    categorySlug: "amigurumi-toys",
    images: ["https://placehold.co/600x600/FAF1EA/D98E73?text=Baby+Chick+in+Eggshell"],
    stockType: "READY_TO_SHIP",
    stockQty: 6,
    leadTimeDays: null,
    isFeatured: false,
    isActive: true,
  },
  {
    id: "prod_crochet_headband",
    name: "Artisan Twist Headband",
    slug: "artisan-twist-headband",
    description: "Soft rib-stitch turban headband designed to keep flyaways back with effortless chic. Stretchy and gentle on hair.",
    price: 399,
    compareAtPrice: 499,
    categorySlug: "apparel-accessories",
    images: ["https://placehold.co/600x600/FAF1EA/E8B4B8?text=Twist+Headband"],
    stockType: "READY_TO_SHIP",
    stockQty: 10,
    leadTimeDays: null,
    isFeatured: false,
    isActive: true,
    variants: [
      { name: "Color", value: "Oatmeal Beige", priceDelta: 0, stockQty: 4 },
      { name: "Color", value: "Dusty Rose", priceDelta: 0, stockQty: 3 },
      { name: "Color", value: "Forest Sage", priceDelta: 0, stockQty: 3 },
    ],
  },
  {
    id: "prod_mini_succulent",
    name: "Potted Mini Succulent Decor",
    slug: "potted-mini-succulent-decor",
    description: "Maintenance-free crocheted succulent in a tiny terracotta-colored yarn pot with embroidered happy face.",
    price: 549,
    compareAtPrice: null,
    categorySlug: "home-decor",
    images: ["https://placehold.co/600x600/FAF1EA/4A5D45?text=Mini+Succulent+Decor"],
    stockType: "MADE_TO_ORDER",
    stockQty: null,
    leadTimeDays: 3,
    isFeatured: false,
    isActive: true,
  },
  {
    id: "prod_couple_keychains",
    name: "Strawberry & Heart Best Friends Keychain Pair",
    slug: "strawberry-heart-keychain-pair",
    description: "Pair of matching mini charms — one sweet strawberry and one puffed blush heart. Hand-stitched with love.",
    price: 399,
    compareAtPrice: 499,
    categorySlug: "keychains-gifting",
    images: ["https://placehold.co/600x600/FAF1EA/E8B4B8?text=Couple+Keychain+Pair"],
    stockType: "READY_TO_SHIP",
    stockQty: 12,
    leadTimeDays: null,
    isFeatured: false,
    isActive: true,
  },
  {
    id: "prod_custom_portrait_doll",
    name: "Bespoke Custom Portrait Doll (Personalized)",
    slug: "bespoke-custom-portrait-doll",
    description: "Dreaming of a unique handmade crochet replica of yourself, a loved one, or a favorite character? Hand-hooked to match your photos, outfits, and hair colors. Message Nitika directly to discuss your dream piece!",
    price: null,
    compareAtPrice: null,
    categorySlug: "amigurumi-toys",
    images: [
      "https://placehold.co/600x600/FAF1EA/D98E73?text=Bespoke+Custom+Doll",
      "https://placehold.co/600x600/FAF1EA/5C4033?text=Doll+Outfit+Details",
    ],
    stockType: "MADE_TO_ORDER",
    stockQty: null,
    leadTimeDays: 14,
    isFeatured: true,
    isActive: true,
    isCustom: true,
  },
];
