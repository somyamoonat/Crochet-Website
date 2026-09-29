"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { ProductCard } from "@/components/product/product-card";
import {
  Container,
  Button,
  Badge,
  SectionHeading,
  StitchDivider,
  InstagramIcon,
} from "@/components/ui";
import { sampleCategories, sampleProducts, SeedCategory, SeedProduct } from "@/lib/sample-data";
import { INSTAGRAM_POSTS } from "@/lib/instagram";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Clock,
  MessageCircle,
} from "lucide-react";

interface HomeViewProps {
  initialProducts?: SeedProduct[];
  initialCategories?: SeedCategory[];
}

export function HomeView({ initialProducts, initialCategories }: HomeViewProps) {
  const [products, setProducts] = React.useState<SeedProduct[]>(
    initialProducts || sampleProducts
  );
  const [categories, setCategories] = React.useState<SeedCategory[]>(
    initialCategories || sampleCategories
  );

  React.useEffect(() => {
    if (initialProducts) setProducts(initialProducts);
  }, [initialProducts]);

  React.useEffect(() => {
    if (initialCategories) setCategories(initialCategories);
  }, [initialCategories]);

  React.useEffect(() => {
    let isCancelled = false;
    async function loadFreshData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products?limit=50", { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);
        if (prodRes.ok && !isCancelled) {
          const prodData = await prodRes.json();
          if (prodData.success && Array.isArray(prodData.data)) {
            setProducts(prodData.data);
          }
        }
        if (catRes.ok && !isCancelled) {
          const catData = await catRes.json();
          if (catData.success && Array.isArray(catData.data)) {
            setCategories(catData.data);
          }
        }
      } catch {
        // fallback to initial
      }
    }
    loadFreshData();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Filter featured products
  const featuredProducts = products.filter((p) => p.isFeatured && p.isActive);


  return (
    <div className="min-h-screen bg-[#FBF6EF] text-[#2B2420] flex flex-col selection:bg-[#E8B4B8]/40 selection:text-[#2B2420]">
      {/* Navigation Header */}
      <StoreHeader />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20">
          <Container size="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Text & CTA with Framer Motion slide-in */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="lg:col-span-6 space-y-6 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-[#FAECE8] border border-[#F2D7D0] px-4 py-1 text-xs font-semibold text-[#9E5740]">
                  <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
                  <span>Handcrafted with Love</span>
                </div>

                <div className="space-y-3">
                  <span className="block font-handwriting text-3xl sm:text-4xl lg:text-5xl text-brand-primary font-bold">
                    Handcrafted with Love
                  </span>
                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-text leading-[1.12]">
                    Whimsical crochet treasures made one stitch at a time.
                  </h1>
                </div>

                <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Welcome to Nitika Tanted&apos;s home-based studio. From cuddly amigurumi plushies to aesthetic daisy totes and everlasting bouquets — lovingly handmade for you.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link href="/shop" className="w-full sm:w-auto">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto shadow-md hover:shadow-lg"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Shop All Creations
                    </Button>
                  </Link>
                  <a href="#meet-the-maker" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Meet the Maker
                    </Button>
                  </a>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-6 pt-3 text-xs text-stone-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-brand-secondary" />
                    <span>Doorstep Hand-Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-brand-primary" />
                    <span>Custom Orders Welcome</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Visual Product Collage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="lg:col-span-6 relative flex justify-center"
              >
                <div className="relative w-full max-w-lg aspect-4/3 sm:aspect-square">
                  {/* Backdrop organic glow */}
                  <div className="absolute inset-0 bg-radial from-[#F5D8CE]/50 via-transparent to-transparent rounded-full filter blur-2xl transform scale-110" />

                  {/* Primary Featured Image */}
                  <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-2 border-[#ECE2D2] shadow-xl bg-white">
                    <Image
                      src="/images/hero-showcase.jpg"
                      alt="Handmade Pastel Crochet Bouquet crafted by Nitika Tanted"
                      fill
                      priority
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Floating Micro Badge 1: 100% Handmade */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="absolute -bottom-4 -left-3 sm:-left-6 z-20 bg-white/95 backdrop-blur-xs border border-[#ECE2D2] rounded-2xl p-3.5 shadow-lg flex items-center gap-3"
                  >
                    <div className="h-10 w-10 rounded-full bg-[#FAF1EA] flex items-center justify-center text-brand-primary">
                      <Heart className="h-5 w-5 fill-current" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-brand-text">100% Handcrafted</p>
                      <p className="text-[11px] text-stone-500">Premium Cotton Yarn</p>
                    </div>
                  </motion.div>

                  {/* Floating Micro Badge 2: Local Ratlam pickup */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute -top-4 -right-3 sm:-right-4 z-20 bg-white/95 backdrop-blur-xs border border-[#ECE2D2] rounded-2xl p-3 shadow-lg flex items-center gap-2.5"
                  >
                    <div className="h-8 w-8 rounded-full bg-[#EBF2EA] flex items-center justify-center text-[#3B4D36]">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-brand-text">Doorstep Delivery</p>
                      <p className="text-[10px] text-stone-500">Or Studio Pickup</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Brand Promise Banner */}
        <section className="border-y border-[#ECE2D2] bg-[#F7EFE4]/60 py-6">
          <Container size="lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <span className="text-lg sm:text-xl">🧶</span>
                <p className="text-xs sm:text-sm font-bold text-brand-text">Quality Yarn</p>
                <p className="text-[11px] text-stone-500">Soft, hypoallergenic cotton</p>
              </div>
              <div className="space-y-1">
                <span className="text-lg sm:text-xl">✨</span>
                <p className="text-xs sm:text-sm font-bold text-brand-text">Made to Order</p>
                <p className="text-[11px] text-stone-500">Customized color palettes</p>
              </div>
              <div className="space-y-1">
                <span className="text-lg sm:text-xl">📦</span>
                <p className="text-xs sm:text-sm font-bold text-brand-text">Carefully Packaged</p>
                <p className="text-[11px] text-stone-500">With personalized notes</p>
              </div>
              <div className="space-y-1">
                <span className="text-lg sm:text-xl">📍</span>
                <p className="text-xs sm:text-sm font-bold text-brand-text">Artisan Made</p>
                <p className="text-[11px] text-stone-500">Support a passionate maker</p>
              </div>
            </div>
          </Container>
        </section>

        {/* 2. MEET THE MAKER (Nitika Tanted) */}
        <section id="meet-the-maker" className="py-16 md:py-24 bg-white/70">
          <Container size="lg">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center">
              {/* Photo & Founder badge */}
              <div className="md:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-sm aspect-4/5 rounded-3xl overflow-hidden border border-[#ECE2D2] shadow-md bg-[#FAF1EA]">
                  <Image
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800"
                    alt="Nitika Tanted, founder and crochet artisan of The Crochet Diaryy"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                    <p className="font-handwriting text-2xl text-[#FAF1EA]">Nitika Tanted</p>
                    <p className="text-xs text-white/90">Artisan &amp; Founder</p>
                  </div>
                </div>
              </div>

              {/* Story Content */}
              <div className="md:col-span-7 space-y-5 text-left">
                <SectionHeading
                  align="left"
                  tagline="Behind the Stitches"
                  title="Meet Nitika &amp; Her Crochet Diary"
                />

                <div className="space-y-4 text-sm sm:text-base text-stone-600 leading-relaxed">
                  <p>
                    What started as a quiet evening hobby with a single aluminium hook and a skein of cotton yarn blossomed into <strong>The Crochet Diaryy</strong>. Nitika crafts every plushie, bag, and keepsake by hand with patience, love, and meticulous attention to every loop.
                  </p>
                  <p>
                    &ldquo;In a world of mass-manufactured plastic, holding something made with genuine human warmth brings a different kind of joy. Each knot is a little page in my diary — created to brighten your everyday life.&rdquo;
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link href="/about">
                    <Button variant="secondary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Read Our Full Story
                    </Button>
                  </Link>

                  <a
                    href="https://wa.me/919770124355?text=Hi%20Nitika!%20I%20love%20your%20crochet%20work%20and%20would%20like%20to%20ask%20about%20a%20custom%20piece."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="md"
                      className="border-[#25D366] text-[#1FA952] hover:bg-[#E8F8EE]"
                      leftIcon={<MessageCircle className="h-4 w-4 text-[#25D366]" />}
                    >
                      Chat on WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. CATEGORIES SHOWCASE */}
        <section className="py-14 md:py-20">
          <Container size="lg" className="space-y-10">
            <SectionHeading
              align="center"
              tagline="Browse Our Collection"
              title="Shop by Category"
              description="Discover handcrafted pieces lovingly made for every corner of your life."
            />

            <div className="flex gap-3 overflow-x-auto no-scrollbar sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-4 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/shop/${category.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-[#ECE2D2] bg-white p-3 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/50 hover:shadow-md shrink-0 w-[145px] sm:w-auto"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F6EFE6]">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="pt-3 pb-1">
                    <h3 className="font-heading text-sm sm:text-base font-bold text-brand-text group-hover:text-brand-primary transition">
                      {category.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        <StitchDivider variant="loops" color="accent" />

        {/* 4. FEATURED PRODUCTS */}
        <section id="featured-products" className="py-10">
          <Container size="lg" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <SectionHeading
                align="left"
                tagline="Boutique Favorites"
                title="Featured Handmade Pieces"
                description="Our most cherished creations, freshly hooked and ready to bring smiles."
              />
              <Badge variant="Ready to Ship" className="self-start md:self-end text-xs py-1 px-3">
                Ready to Ship Stock Available
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {featuredProducts.map((product) => {
                const category = categories.find((c) => c.slug === product.categorySlug);
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    compareAtPrice={product.compareAtPrice}
                    images={product.images}
                    stockType={product.stockType}
                    leadTimeDays={product.leadTimeDays}
                    categoryName={category?.name}
                  />
                );
              })}
            </div>

            <div className="text-center pt-4">
              <Link href="/shop">
                <Button variant="outline" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Explore All Handcrafted Items
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* 5. INSTAGRAM GALLERY GRID */}
        <section className="py-14 md:py-20 bg-[#F7EFE4]/40 border-t border-[#ECE2D2]">
          <Container size="lg" className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <span className="font-handwriting text-2xl text-brand-primary">Follow Along</span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text flex items-center gap-2">
                  <InstagramIcon className="h-6 w-6 text-[#E1306C]" />
                  Moments from the Diary
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Behind-the-scenes stitch tutorials, new handmade drops, and daily yarn joy on Instagram.
                </p>
              </div>

              <a
                href="https://www.instagram.com/the_crochetdiaryy"
                target="_blank"
                rel="noopener noreferrer"
                className="self-start sm:self-auto"
              >
                <Button variant="outline" size="sm" leftIcon={<InstagramIcon className="h-4 w-4" />}>
                  Follow @the_crochetdiaryy
                </Button>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {INSTAGRAM_POSTS.map((post) => (
                <a
                  key={post.id}
                  href={post.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-white border border-[#E7DED0] shadow-2xs hover:shadow-md transition-all duration-300"
                  title={`${post.title} — View on Instagram`}
                >
                  <Image
                    src={post.image}
                    alt={post.caption}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  {/* Subtle always-visible bottom badge for clarity */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2.5 pt-6 text-white text-left transition-opacity duration-300 group-hover:opacity-0">
                    <p className="text-[11px] font-bold truncate leading-tight drop-shadow-xs">
                      {post.title}
                    </p>
                  </div>
                  {/* Hover interactive overlay */}
                  <div className="absolute inset-0 bg-[#2B2420]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-white text-center">
                    <div className="flex items-center gap-1.5 mb-1.5 text-rose-300">
                      <Heart className="h-4 w-4 fill-rose-300" />
                      <span className="text-xs font-bold">{post.likes}</span>
                    </div>
                    <span className="text-[11px] font-bold line-clamp-1 text-white">
                      {post.title}
                    </span>
                    <span className="text-[10px] text-stone-200 line-clamp-2 mt-1 leading-snug">
                      {post.caption}
                    </span>
                    <span className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-secondary bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-xs border border-white/20">
                      Open Post ↗
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>
      </main>

      {/* Footer */}
      <StoreFooter />
    </div>
  );
}
