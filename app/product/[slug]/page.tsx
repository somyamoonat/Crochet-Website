import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductDetails } from "@/components/product/product-details";
import { ProductCard } from "@/components/product/product-card";
import { Container, StitchDivider, SectionHeading } from "@/components/ui";
import { getProductBySlug } from "@/lib/products";
import { ChevronRight, ArrowLeft } from "lucide-react";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | The Crochet Diaryy",
      robots: { index: false, follow: false },
    };
  }

  const priceText = product.price ? ` — ₹${product.price}` : "";
  const title = `${product.name}${priceText} | The Crochet Diaryy`;
  const description = `${product.description.slice(0, 140)}... Handcrafted with love by Nitika Tanted.`;
  const primaryImage = product.images && product.images.length > 0
    ? product.images[0]
    : "/images/hero-showcase.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/product/${slug}`,
      siteName: "The Crochet Diaryy",
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 800,
          alt: `${product.name} — Handcrafted Crochet by Nitika Tanted`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImage],
    },
    alternates: {
      canonical: `/product/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { product, relatedProducts } = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FBF6EF] text-[#2B2420] flex flex-col">
      <StoreHeader />

      <main className="flex-1 py-6 sm:py-10 pb-28 md:pb-10">
        <Container size="xl" className="space-y-8">
          {/* Breadcrumbs & Back Link */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto whitespace-nowrap"
          >
            <Link href="/" className="hover:text-brand-primary transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
            <Link href="/shop" className="hover:text-brand-primary transition">
              Shop
            </Link>
            {product.categorySlug && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                <Link
                  href={`/shop/${product.categorySlug}`}
                  className="hover:text-brand-primary transition"
                >
                  {product.categoryName || product.categorySlug}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5 text-stone-400 shrink-0" />
            <span className="font-semibold text-brand-text truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          {/* Main 2-Column Product Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Image Gallery (lg:col-span-6) */}
            <div className="lg:col-span-6 lg:sticky lg:top-24">
              <ProductGallery
                images={product.images}
                productName={product.name}
                stockType={product.stockType}
                leadTimeDays={product.leadTimeDays}
                stockQty={product.stockQty}
              />
            </div>

            {/* Right Column: Details & Add to Cart (lg:col-span-6) */}
            <div className="lg:col-span-6">
              <ProductDetails product={product} />
            </div>
          </div>

          {/* Divider */}
          <StitchDivider variant="shell" color="secondary" className="my-8" />

          {/* Related Products: "You may also like" */}
          {relatedProducts.length > 0 && (
            <section className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <SectionHeading
                  align="left"
                  tagline="More Handcrafted Treasures"
                  title="You May Also Like"
                  description="Lovingly made companion pieces hooked from the same cozy studio."
                />
                <Link
                  href={product.categorySlug ? `/shop/${product.categorySlug}` : "/shop"}
                  className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>View All in {product.categoryName || "Shop"}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
                {relatedProducts.map((relProduct) => (
                  <ProductCard
                    key={relProduct.id}
                    id={relProduct.id}
                    name={relProduct.name}
                    slug={relProduct.slug}
                    price={relProduct.price ?? 0}
                    compareAtPrice={relProduct.compareAtPrice}
                    images={relProduct.images}
                    stockType={relProduct.stockType}
                    leadTimeDays={relProduct.leadTimeDays}
                    categoryName={relProduct.categorySlug}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Back to Catalog Bottom Button */}
          <div className="pt-6 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-2.5 text-xs font-semibold text-stone-700 hover:border-brand-primary hover:text-brand-primary transition shadow-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Complete Collection</span>
            </Link>
          </div>
        </Container>
      </main>

      <StoreFooter />
    </div>
  );
}
