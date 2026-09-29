import React from "react";
import Link from "next/link";
import Image from "next/image";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { Container, Card, Button, StitchDivider } from "@/components/ui";
import {
  Heart,
  Sparkles,
  MapPin,
  ArrowRight,
  MessageCircle,
  Scissors,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export const metadata = {
  title: "About Nitika Tanted & The Crochet Diaryy | Handcrafted Keepsakes",
  description:
    "Learn about Nitika Tanted, founder of The Crochet Diaryy. Discover the story, passion, and meticulous care woven into every handmade amigurumi, bag, and keepsake.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FBF6EF] flex flex-col justify-between">
      <StoreHeader />

      <main className="py-10 sm:py-16">
        <Container size="lg" className="space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF1EA] px-3.5 py-1 text-xs font-bold text-brand-primary border border-brand-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Meet the Founder &amp; Maker</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-brand-text tracking-tight">
              One Stitch, One Heart, One Keepsake at a Time
            </h1>

            <p className="font-handwriting text-2xl sm:text-3xl text-brand-primary font-bold">
              Welcome to The Crochet Diaryy
            </p>
          </div>

          {/* Founder Story Block with Photo Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Founder Photo Placeholder with [EDIT ME] */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#ECE2D2] shadow-md bg-stone-100 aspect-4/5 group">
                <Image
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800"
                  alt="Nitika Tanted crocheting in her studio [EDIT ME]"
                  fill
                  className="object-cover group-hover:scale-102 transition duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="rounded-full bg-amber-500/90 text-white text-[11px] font-mono font-bold px-2.5 py-0.5 w-max mb-2">
                    [EDIT ME — Replace with photo of Nitika]
                  </span>
                  <strong className="font-heading text-xl font-bold">Nitika Tanted</strong>
                  <span className="text-xs text-stone-200">
                    Founder, Artisan &amp; Yarn Lover
                  </span>
                </div>
              </div>
            </div>

            {/* Right: The Story */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
                  How The Diary Began
                </h2>

                <p>
                  Hello! I&apos;m <strong>Nitika Tanted</strong>, the hands and heart behind{" "}
                  <strong>The Crochet Diaryy</strong>. What started as a quiet evening hobby
                  with a single metal crochet hook and a skein of pastel yarn, blossomed into a lifelong
                  obsession with handcrafting pieces that bring genuine warmth and smiles into people&apos;s
                  lives.
                </p>

                <p>
                  In a world dominated by mass production, fast fashion, and machine-knitted imitations,
                  crochet remains uniquely magical:{" "}
                  <em>machines cannot replicate true crochet stitches</em>. Every single loop, knot, and
                  petal in our store is hooked entirely by hand, with patience, rhythm, and intention.
                </p>

                <p>
                  I created <strong>The Crochet Diaryy</strong> as a living journal of my creations — from
                  whimsical animal amigurumi that accompany children to bed, to stylish textured tote
                  bags, to everlasting crochet florals that brighten up dining tables without ever
                  withering.
                </p>
              </div>

              {/* Local Connection Strip */}
              <div className="rounded-2xl border border-brand-primary/20 bg-[#FAF1EA] p-5 space-y-2 text-xs sm:text-sm text-stone-700">
                <div className="flex items-center gap-2 font-bold text-brand-text">
                  <MapPin className="h-4 w-4 text-brand-primary" />
                  <span>Proudly Handcrafted with Care</span>
                </div>
                <p className="leading-relaxed text-stone-600 text-xs">
                  I hand-deliver all finished orders with delicate care, or welcome customers for free
                  studio pickups. Meeting the people who cherish my handmade pieces is my favorite part of
                  the journey.
                </p>
              </div>
            </div>
          </div>

          <StitchDivider variant="loops" color="secondary" />

          {/* Philosophy / Values Grid */}
          <div className="space-y-8">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
                What Makes Our Stitches Special
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Three core principles behind every single piece created in Nitika&apos;s studio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-3 shadow-xs">
                <div className="h-12 w-12 rounded-2xl bg-[#FAF1EA] flex items-center justify-center text-brand-primary">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-bold text-brand-text">
                  Hypoallergenic &amp; Safe
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  We use premium 100% milk cotton and velvet chenille yarns. They are exceptionally soft to
                  touch, lint-free, and safe for infants, children, and sensitive skin.
                </p>
              </Card>

              <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-3 shadow-xs">
                <div className="h-12 w-12 rounded-2xl bg-[#EBF2EA] flex items-center justify-center text-[#3B4D36]">
                  <Scissors className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-bold text-brand-text">
                  100% Handcrafted Intention
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  No shortcuts, no factory lines. Each flower bouquet or cardigan requires hours of
                  focused handcrafting. When you hold it, you can feel the human touch in every stitch.
                </p>
              </Card>

              <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-3 shadow-xs">
                <div className="h-12 w-12 rounded-2xl bg-[#FAECE8] flex items-center justify-center text-[#9E5740]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-base font-bold text-brand-text">
                  Custom &amp; Personal Touches
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Want a pastel lilac instead of pink? Need a custom birth year charm? Nitika customizes colors
                  and designs so your gift feels uniquely tailored for your loved one.
                </p>
              </Card>
            </div>
          </div>

          {/* The Journey Steps */}
          <Card className="p-8 sm:p-10 border border-[#ECE2D2] bg-white rounded-3xl space-y-8 shadow-xs">
            <div className="text-center space-y-1 max-w-md mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Behind the Scenes
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
                From Skein to Keepsake
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2 p-3">
                <span className="font-mono text-2xl font-extrabold text-brand-primary">01</span>
                <h4 className="font-heading text-sm font-bold text-brand-text">Hand-Selecting Yarn</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Curating palette colors and ensuring tension consistency across the yarn ball.
                </p>
              </div>

              <div className="space-y-2 p-3">
                <span className="font-mono text-2xl font-extrabold text-brand-primary">02</span>
                <h4 className="font-heading text-sm font-bold text-brand-text">Hooking Stitches</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Stitching row by row with precision and tight tension so plushies never lose their shape.
                </p>
              </div>

              <div className="space-y-2 p-3">
                <span className="font-mono text-2xl font-extrabold text-brand-primary">03</span>
                <h4 className="font-heading text-sm font-bold text-brand-text">Finishing &amp; Embellishing</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Hand-embroidering sweet facial expressions, attaching wooden buttons, or lining tote bags.
                </p>
              </div>

              <div className="space-y-2 p-3">
                <span className="font-mono text-2xl font-extrabold text-brand-primary">04</span>
                <h4 className="font-heading text-sm font-bold text-brand-text">Delivered with Love</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Wrapped in delicate tissue, tagged with care instructions, and delivered directly to you.
                </p>
              </div>
            </div>
          </Card>

          {/* Social Proof & Contact Callout */}
          <div className="rounded-3xl border border-[#D98E73]/30 bg-[#FAF1EA] p-8 sm:p-12 text-center space-y-6">
            <span className="font-handwriting text-3xl sm:text-4xl text-brand-primary font-bold">
              Let&apos;s Create Something Beautiful Together
            </span>

            <p className="text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
              Whether you are looking for a personalized birthday gift, a cozy baby shower plushie, or
              have a custom color palette in mind, I would love to hear from you.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link href="/shop">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Explore The Collection
                </Button>
              </Link>

              <a
                href="https://wa.me/919770124355?text=Hi%20Nitika!%20I%20read%20your%20story%20and%20would%20love%20to%20know%20more."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#25D366] text-[#1FA952] hover:bg-[#E8F8EE]"
                  leftIcon={<MessageCircle className="h-4 w-4 text-[#25D366]" />}
                >
                  Chat with Nitika on WhatsApp
                </Button>
              </a>

              <a
                href="https://instagram.com/the_crochetdiaryy"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  leftIcon={<InstagramIcon className="h-4 w-4 text-brand-primary" />}
                >
                  Follow @the_crochetdiaryy
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </main>

      <StoreFooter />
    </div>
  );
}
