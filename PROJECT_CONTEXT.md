We are building an e-commerce website for The Crochet Diary, a home-based crochet
business run by Nitika Tanted, selling handmade crochet items (amigurumi/toys,
bags & accessories, home decor, apparel — a mix of categories).

BUSINESS RULES:
- Delivery is LOCAL ONLY, within Ratlam. No courier/shipping API needed.
  The founder delivers orders herself, or customers can self-pickup.
- Products are either "Ready to Ship" (in-stock, quick delivery) or
  "Made to Order" (handmade after ordering, with a lead time in days).
- Currency: INR (₹). Payment via Razorpay (UPI/cards/netbanking) or
  "Pay on Delivery/Pickup" (cash or UPI at handover).
- No live shipment tracking — just an internal order status the founder
  updates manually: Received → Confirmed → Making → Ready →
  Out for Delivery / Ready for Pickup → Delivered → (or Cancelled).

TECH STACK:
- Next.js 15, App Router, TypeScript, Tailwind CSS
- Prisma + PostgreSQL
- Auth.js (NextAuth v5) — customer accounts + guest checkout + admin role
- Razorpay for payments
- Cloudinary for product images
- Resend for transactional email
- Zustand for cart state (persisted to localStorage)
- Framer Motion for tasteful animation
- Deploy target: Vercel

BRAND:
- Tagline: "Handcrafted with Love"
Vibe: warm, cozy, handcrafted — think small boutique, not a big-box store
Palette: a warm neutral background (
#FBF6EF cream), one soft accent (
#D98E73 terracotta/rust or 
#E8B4B8 dusty rose), one deeper grounding tone (
#4A5D45 sage or 
#5C4033 cocoa brown), text in a near-black warm charcoal (
#2B2420)
Fonts: a rounded/handwritten-feel display font for headings (e.g. "Fraunces" or "Caveat" for accents) paired with a clean, readable sans-serif for body text (e.g. "Inter" or "Nunito")
Texture: soft shadows, rounded corners, a subtle stitch/yarn-loop motif as a section divider — avoid sharp corners and cold, corporate spacing
Tone of copy: personal and warm ("made just for you") rather than generic e-commerce ("add to cart now")
- Tone: warm, personal, handmade — never generic corporate e-commerce copy
- Instagram: @the_crochetdiaryy , WhatsApp:+91 97701 24355

CONVENTIONS:
- TypeScript strict mode, no `any` unless unavoidable
- Components in /components, grouped by feature (ui/, product/, cart/, admin/)
- Server actions or route handlers under /app/api for all data mutations
- Mobile-first responsive design — most customers arrive from Instagram on phones
- Always run the app and fix errors before ending a task
