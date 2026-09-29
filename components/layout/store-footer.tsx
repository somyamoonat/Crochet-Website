import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heart, MapPin, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export function StoreFooter() {
  return (
    <footer className="border-t border-[#EAE1D3] bg-[#FAF3EA] pt-12 pb-8 text-stone-700">
      <Container size="lg" className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand column */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl font-bold tracking-tight text-brand-text">
                🧶 The Crochet Diaryy
              </span>
              <span className="block font-handwriting text-lg text-brand-primary -mt-1">
                Handcrafted with Love
              </span>
            </Link>
            <p className="text-sm text-stone-600 max-w-sm leading-relaxed">
              Handcrafted crochet treasures by Nitika Tanted. Creating soft, beautiful, and lasting keepsakes one stitch at a time.
            </p>

            {/* Local Delivery Notice */}
            <div className="rounded-2xl border border-brand-primary/20 bg-white/80 p-3.5 text-xs text-stone-700 space-y-1 max-w-md">
              <div className="flex items-center gap-1.5 font-bold text-brand-text">
                <MapPin className="h-4 w-4 text-brand-primary" />
                Local Delivery Notice
              </div>
              <p>
                Hand-delivered with delicate packaging to your doorstep, or available for studio self-pickup.
              </p>
            </div>
          </div>

          {/* Explore Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-heading text-sm font-bold text-brand-text uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <Link href="/shop" className="hover:text-brand-primary transition">
                  Shop Boutique
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-primary transition">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-brand-primary transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/#featured-products" className="hover:text-brand-primary transition">
                  Featured Pieces
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-brand-primary transition">
                  Shopping Basket
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-heading text-sm font-bold text-brand-text uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <Link href="/faq" className="hover:text-brand-primary transition">
                  Help &amp; FAQs
                </Link>
              </li>
              <li>
                <Link href="/policies" className="hover:text-brand-primary transition">
                  Store Policies
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-primary transition">
                  Contact Nitika
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-brand-primary transition">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading text-sm font-bold text-brand-text uppercase tracking-wider">
              Connect with Nitika
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Have a question about a product or want to customize colors? Reach out directly:
            </p>

            <div className="space-y-2 pt-1 text-sm">
              <a
                href="https://wa.me/919770124355"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-medium text-brand-text hover:text-brand-primary transition"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                <span>WhatsApp: +91 97701 24355</span>
              </a>

              <a
                href="https://instagram.com/the_crochetdiaryy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-medium text-brand-text hover:text-brand-primary transition"
              >
                <InstagramIcon className="h-4 w-4 text-brand-primary" />
                <span>Instagram: @the_crochetdiaryy</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex text-xs font-bold text-brand-primary hover:underline pt-1"
              >
                Send a Message via Contact Form &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="border-t border-stone-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© 2026 The Crochet Diaryy. Handcrafted with love in India.</p>
          <p className="flex items-center gap-1 font-handwriting text-lg text-brand-primary">
            Stitched with <Heart className="h-3.5 w-3.5 fill-current text-rose-500" /> by Nitika Tanted
          </p>
        </div>
      </Container>
    </footer>
  );
}
