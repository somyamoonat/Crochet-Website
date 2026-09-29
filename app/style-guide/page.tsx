"use client";

import * as React from "react";
import {
  Button,
  Badge,
  Input,
  Textarea,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Container,
  SectionHeading,
  StitchDivider,
} from "@/components/ui";
import {
  Heart,
  ShoppingBag,
  Sparkles,
  Search,
  Mail,
  ArrowRight,
  Eye,
  CheckCircle2,
} from "lucide-react";

export default function StyleGuidePage() {
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [testInput, setTestInput] = React.useState("");

  const colorSwatches = [
    {
      name: "brand-bg",
      hex: "#FBF6EF",
      role: "Warm Neutral Canvas",
      textDark: true,
      classBg: "bg-brand-bg",
    },
    {
      name: "brand-text",
      hex: "#2B2420",
      role: "Near-black Warm Charcoal",
      textDark: false,
      classBg: "bg-brand-text",
    },
    {
      name: "brand-primary",
      hex: "#D98E73",
      role: "Warm Terracotta / Rust",
      textDark: false,
      classBg: "bg-brand-primary",
    },
    {
      name: "brand-secondary",
      hex: "#4A5D45",
      role: "Earthy Sage Green",
      textDark: false,
      classBg: "bg-brand-secondary",
    },
    {
      name: "brand-accent",
      hex: "#E8B4B8",
      role: "Soft Dusty Rose",
      textDark: true,
      classBg: "bg-brand-accent",
    },
    {
      name: "brand-cocoa",
      hex: "#5C4033",
      role: "Deep Cocoa Grounding",
      textDark: false,
      classBg: "bg-brand-cocoa",
    },
  ];

  return (
    <main className="py-12 md:py-20">
      <Container size="lg" className="space-y-16">
        {/* Intro Header */}
        <div className="text-center space-y-4">
          <Badge variant="Made to Order" className="px-4 py-1.5 text-xs">
            🎨 Design System & Component Library
          </Badge>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-text">
            The Crochet Diaryy
          </h1>
          <p className="font-handwriting text-2xl sm:text-3xl text-brand-primary">
            “Handcrafted with Love”
          </p>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-stone-600">
            A warm, cozy, boutique aesthetic celebrating handmade artisanal crochet.
            This guide validates design tokens, typography, and interactive components.
          </p>
        </div>

        <StitchDivider variant="loops" color="primary" />

        {/* 1. Color Palette Tokens */}
        <section className="space-y-6">
          <SectionHeading
            align="left"
            tagline="Curated Palette"
            title="Brand Color Tokens"
            description="Mapped directly to custom CSS variables and Tailwind classes. High-contrast, warm, and natural."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {colorSwatches.map((swatch) => (
              <div
                key={swatch.name}
                className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-xs transition hover:shadow-md"
              >
                <div
                  className={`h-24 w-full flex items-end p-2.5 ${swatch.classBg}`}
                >
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                      swatch.textDark
                        ? "bg-stone-900/10 text-stone-900"
                        : "bg-white/20 text-white backdrop-blur-xs"
                    }`}
                  >
                    {swatch.hex}
                  </span>
                </div>
                <div className="p-3">
                  <p className="font-mono text-xs font-semibold text-brand-text">
                    {swatch.name}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">{swatch.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <StitchDivider variant="shell" color="secondary" />

        {/* 2. Typography Showcase */}
        <section className="space-y-6">
          <SectionHeading
            align="left"
            tagline="Next/Font Integration"
            title="Typography Hierarchy"
            description="Loaded with Google Fonts: Fraunces (Headings), Nunito (Body), and Caveat (Artisan Accents)."
          />

          <Card className="space-y-6">
            <div className="border-b border-stone-100 pb-5 space-y-2">
              <span className="text-xs font-mono text-brand-primary">font-heading (Fraunces)</span>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-text">
                H1: Heirloom Crochet Treasures & Soft Amigurumi
              </h1>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
                H2: Handwoven Bags Crafted in Ratlam
              </h2>
              <h3 className="font-heading text-xl sm:text-2xl font-semibold text-brand-text">
                H3: Made to Order with Premium Cotton Yarn
              </h3>
            </div>

            <div className="border-b border-stone-100 pb-5 space-y-2">
              <span className="text-xs font-mono text-brand-primary">font-handwriting (Caveat)</span>
              <p className="font-handwriting text-3xl text-brand-primary leading-tight">
                “Every stitch tells a story of care, patience, and love.”
              </p>
              <p className="font-handwriting text-2xl text-brand-secondary">
                Personalized notes, lovingly packaged for your doorstep.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-brand-primary">font-body (Nunito)</span>
              <p className="text-base sm:text-lg text-brand-text leading-relaxed">
                Body Large: Welcome to our home crochet studio. Each piece is individually crafted
                by Nitika Tanted using soft, durable yarns. Because each item is handmade, no two
                pieces are identical.
              </p>
              <p className="text-sm text-stone-600 leading-relaxed">
                Body Regular: Local delivery within Ratlam, MP. Orders are carefully wrapped in
                eco-friendly kraft paper and tied with a handwritten tag.
              </p>
            </div>
          </Card>
        </section>

        <StitchDivider variant="loops" color="accent" />

        {/* 3. Buttons */}
        <section className="space-y-6">
          <SectionHeading
            align="left"
            tagline="Interactive Controls"
            title="Buttons & Actions"
            description="Primary (Terracotta), Secondary (Sage), Outline, and Ghost with loading and focus-visible states."
          />

          <Card className="space-y-8">
            {/* Variants */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Variants (Default & Hover)
              </h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" leftIcon={<ShoppingBag className="h-4 w-4" />}>
                  Primary Button
                </Button>
                <Button variant="secondary" leftIcon={<Heart className="h-4 w-4" />}>
                  Secondary Button
                </Button>
                <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Outline Button
                </Button>
                <Button variant="ghost" leftIcon={<Eye className="h-4 w-4" />}>
                  Ghost Button
                </Button>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Sizes (sm, md, lg)
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small Size (sm)</Button>
                <Button size="md">Medium Size (md)</Button>
                <Button size="lg" rightIcon={<Sparkles className="h-4 w-4" />}>
                  Large Size (lg)
                </Button>
              </div>
            </div>

            {/* States */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Loading & Disabled States
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  isLoading={btnLoading}
                  onClick={() => {
                    setBtnLoading(true);
                    setTimeout(() => setBtnLoading(false), 2000);
                  }}
                >
                  {btnLoading ? "Processing..." : "Click to Test Loading State"}
                </Button>
                <Button variant="secondary" disabled>
                  Disabled State
                </Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
              </div>
              <p className="text-xs text-stone-500">
                💡 Tip: Try keyboard navigating with <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-stone-700 font-mono text-xs">Tab</kbd> to inspect the ring focus state.
              </p>
            </div>
          </Card>
        </section>

        <StitchDivider variant="dash-stitch" color="primary" />

        {/* 4. Badges */}
        <section className="space-y-6">
          <SectionHeading
            align="left"
            tagline="Product Labels"
            title="Badges & Availability Tags"
            description="Specific business variants from PROJECT_CONTEXT.md: Ready to Ship, Made to Order, and Sold Out."
          />

          <Card className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Standard Business Badges
              </h4>
              <div className="flex flex-wrap gap-3">
                <Badge variant="Ready to Ship" />
                <Badge variant="Made to Order" />
                <Badge variant="Sold Out" />
                <Badge variant="accent">New Drop</Badge>
              </div>
            </div>

            <div className="space-y-3 border-t border-stone-100 pt-5">
              <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400">
                Without Icons
              </h4>
              <div className="flex flex-wrap gap-3">
                <Badge variant="Ready to Ship" showIcon={false}>
                  In-Stock in Ratlam
                </Badge>
                <Badge variant="Made to Order" showIcon={false}>
                  Lead time: 4-6 days
                </Badge>
                <Badge variant="Sold Out" showIcon={false}>
                  Out of Stock
                </Badge>
              </div>
            </div>
          </Card>
        </section>

        <StitchDivider variant="loops" color="muted" />

        {/* 5. Form Fields */}
        <section className="space-y-6">
          <SectionHeading
            align="left"
            tagline="Interactive Forms"
            title="Form Inputs & Selects"
            description="Designed for mobile checkout and inquiry forms with clear active, hover, error, and focus rings."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="space-y-5">
              <CardTitle>Standard Input Fields</CardTitle>

              <Input
                label="Full Name"
                placeholder="e.g. Nitika Tanted"
                helperText="Required for local delivery order confirmation."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="hello@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
              />

              <Input
                label="Search Crochet Products"
                placeholder="Plushies, tote bags..."
                leftIcon={<Search className="h-4 w-4" />}
              />

              <Input
                label="Disabled Input"
                value="Ratlam Local Delivery (Locked)"
                disabled
              />

              <Input
                label="Input With Error State"
                defaultValue="invalid_phone"
                error="Please enter a valid 10-digit Indian phone number."
              />
            </Card>

            <Card className="space-y-5">
              <CardTitle>Selects & Textareas</CardTitle>

              <Select
                label="Delivery Option"
                options={[
                  { label: "Doorstep Delivery (Ratlam City Only)", value: "delivery" },
                  { label: "Self-Pickup at Workshop (Free)", value: "pickup" },
                ]}
                helperText="Founder handles local deliveries personally."
              />

              <Select
                label="Product Category"
                options={[
                  { label: "Amigurumi & Plush Toys", value: "plushies" },
                  { label: "Bags & Totes", value: "bags" },
                  { label: "Cardigans & Wearables", value: "wearables" },
                  { label: "Home Decor & Bouquets", value: "decor" },
                ]}
              />

              <Textarea
                label="Customization Request / Note"
                placeholder="Specify preferred yarn colors, size adjustments, or gift note for Nitika..."
                rows={4}
                helperText="Handmade to order — leave any special requests here."
              />

              <Select
                label="Disabled Select"
                disabled
                options={[{ label: "Shipping outside Ratlam (Unavailable)", value: "na" }]}
              />
            </Card>
          </div>
        </section>

        <StitchDivider variant="shell" color="primary" />

        {/* 6. Cards & Containers */}
        <section className="space-y-6">
          <SectionHeading
            align="left"
            tagline="Surface Architecture"
            title="Cards & Elevation"
            description="Soft rounded corners (rounded-3xl), subtle warm shadows, and smooth hover elevation."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Static Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center mb-1">
                  <Badge variant="Ready to Ship" />
                  <span className="text-xs font-semibold text-stone-400">#01</span>
                </div>
                <CardTitle>Daisy Tote Bag</CardTitle>
                <CardDescription>Hand-stitched vintage floral motif.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-600">
                  Made with 100% breathable organic milk cotton yarn. Reinforced straps designed to comfortably hold a 13-inch laptop and daily essentials.
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-brand-text">₹1,499</span>
                  <span className="text-xs text-stone-400 line-through">₹1,799</span>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" variant="primary" leftIcon={<ShoppingBag className="h-3.5 w-3.5" />}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>

            {/* Interactive Card */}
            <Card interactive>
              <CardHeader>
                <div className="flex justify-between items-center mb-1">
                  <Badge variant="Made to Order" />
                  <span className="text-xs font-semibold text-brand-primary">Interactive ✨</span>
                </div>
                <CardTitle>Strawberry Bunny Plushie</CardTitle>
                <CardDescription>Hover over this card to see elevation.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-600">
                  Ultra-soft chenille yarn amigurumi with safety eyes and a hand-crocheted strawberry hat. Perfect baby shower or birthday keepsake.
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-brand-text">₹899</span>
                  <span className="text-xs text-brand-secondary font-medium">Takes ~3 days</span>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button size="sm" variant="ghost" leftIcon={<Heart className="h-3.5 w-3.5 text-rose-500" />}>
                  Wishlist
                </Button>
                <Button size="sm" variant="primary">
                  Order Now
                </Button>
              </CardFooter>
            </Card>

            {/* Sold Out Card */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center mb-1">
                  <Badge variant="Sold Out" />
                  <span className="text-xs font-semibold text-stone-400">Archived</span>
                </div>
                <CardTitle>Lavender Bucket Hat</CardTitle>
                <CardDescription>Past seasonal collection.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-stone-500">
                  Summer pastel granny square bucket hat. Restocking soon in our upcoming monsoon drop.
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-stone-400">₹799</span>
                  <span className="text-xs text-stone-400 font-medium">Sold Out</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline" className="w-full" disabled>
                  Notify When Back
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <StitchDivider variant="loops" color="secondary" />

        {/* 7. Section Heading Variants */}
        <section className="space-y-8">
          <div className="text-center">
            <Badge variant="accent" className="mb-2">Typography & Layout</Badge>
            <h3 className="font-heading text-2xl font-bold text-brand-text">
              SectionHeading Alignment Variants
            </h3>
          </div>

          <div className="space-y-8 rounded-3xl border border-stone-200 bg-white/70 p-6 md:p-10">
            <SectionHeading
              align="center"
              tagline="Handcrafted with Love"
              title="Centered Section Heading"
              description="Ideal for featured collections, story sections, and customer testimonial quotes on the homepage."
            />

            <StitchDivider variant="loops" color="primary" />

            <SectionHeading
              align="left"
              tagline="Locally Made in Ratlam"
              title="Left-Aligned Section Heading"
              description="Great for product listing grids, category showcases, and two-column feature layouts."
            />

            <StitchDivider variant="dash-stitch" color="accent" />

            <SectionHeading
              align="right"
              tagline="Artisan Details"
              title="Right-Aligned Section Heading"
              description="Useful for asymmetrical layout breaks, lookbook highlights, or special announcement banners."
            />
          </div>
        </section>

        <StitchDivider variant="loops" color="primary" />

        {/* 8. Stitch Dividers Showcase */}
        <section className="space-y-6">
          <SectionHeading
            align="center"
            tagline="Handmade Touch"
            title="StitchDivider Variants & Palette Colors"
            description="Decorative SVG dividers resembling crochet stitches (loops, shells, dash-stitches) between sections."
          />

          <Card className="space-y-8">
            <div className="space-y-2">
              <span className="text-xs font-mono text-stone-500">Variant: &apos;loops&apos; | Color: &apos;primary&apos; (Terracotta)</span>
              <StitchDivider variant="loops" color="primary" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-stone-500">Variant: &apos;shell&apos; | Color: &apos;secondary&apos; (Sage)</span>
              <StitchDivider variant="shell" color="secondary" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-stone-500">Variant: &apos;dash-stitch&apos; | Color: &apos;accent&apos; (Dusty Rose)</span>
              <StitchDivider variant="dash-stitch" color="accent" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-stone-500">Variant: &apos;loops&apos; | Color: &apos;muted&apos; | without center accent</span>
              <StitchDivider variant="loops" color="muted" withCenterAccent={false} />
            </div>
          </Card>
        </section>

        {/* Footer info banner */}
        <div className="rounded-3xl border border-brand-accent/40 bg-[#FAF1EA] p-6 sm:p-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-brand-secondary font-semibold text-sm">
            <CheckCircle2 className="h-5 w-5 text-brand-secondary" />
            Design System Sanity Check Complete
          </div>
          <p className="text-sm text-stone-700 max-w-lg mx-auto">
            All components are styled mobile-first with accessible hover, active, and focus rings using
            the authentic brand palette from <code className="font-mono text-xs bg-white px-2 py-0.5 rounded">PROJECT_CONTEXT.md</code>.
          </p>
        </div>
      </Container>
    </main>
  );
}
