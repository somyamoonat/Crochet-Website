"use client";

import React, { useState } from "react";
import { StoreHeader } from "@/components/layout/store-header";
import { StoreFooter } from "@/components/layout/store-footer";
import { Container, Card, Button, Input, Textarea } from "@/components/ui";
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit message. Please try again or message via WhatsApp.");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      console.error("Contact form error:", err);
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong while sending your note."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF6EF] flex flex-col justify-between">
      <StoreHeader />

      <main className="py-10 sm:py-16">
        <Container size="lg" className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FAF1EA] px-3.5 py-1 text-xs font-bold text-brand-primary border border-brand-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>We&apos;d Love to Hear From You</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-brand-text tracking-tight">
              Get in Touch
            </h1>

            <p className="font-handwriting text-2xl text-brand-primary font-bold">
              Chat directly with founder &amp; maker Nitika Tanted
            </p>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed pt-1">
              Have a question about a product, want to customize colors, or need a gift delivered in Ratlam?
              Choose the fastest way to connect below or leave us a message.
            </p>
          </div>

          {/* Quick Connect Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* WhatsApp */}
            <a
              href="https://wa.me/919770124355?text=Hi%20Nitika!%20I%20have%20a%20question%20about%20The%20Crochet%20Diaryy"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="p-6 border border-[#EAE1D3] bg-white rounded-3xl space-y-3 shadow-xs hover:border-[#25D366] hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#E8F8EE] text-[#25D366] flex items-center justify-center group-hover:scale-105 transition">
                    <MessageCircle className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-brand-text">WhatsApp</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Fastest response for quick questions &amp; custom orders</p>
                  </div>
                </div>
                <div className="pt-2 text-xs font-bold text-[#1FA952] group-hover:underline flex items-center gap-1">
                  <span>+91 97701 24355</span>
                  <span>&rarr;</span>
                </div>
              </Card>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/the_crochetdiaryy"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="p-6 border border-[#EAE1D3] bg-white rounded-3xl space-y-3 shadow-xs hover:border-brand-primary hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#FAF1EA] text-brand-primary flex items-center justify-center group-hover:scale-105 transition">
                    <InstagramIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-brand-text">Instagram</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Explore behind-the-scenes reels &amp; new drops</p>
                  </div>
                </div>
                <div className="pt-2 text-xs font-bold text-brand-primary group-hover:underline flex items-center gap-1">
                  <span>@the_crochetdiaryy</span>
                  <span>&rarr;</span>
                </div>
              </Card>
            </a>

            {/* Email */}
            <a
              href="mailto:admin@thecrochetdiaryy.com"
              className="group block"
            >
              <Card className="p-6 border border-[#EAE1D3] bg-white rounded-3xl space-y-3 shadow-xs hover:border-stone-400 hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-11 w-11 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:scale-105 transition">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-brand-text">Email</h3>
                    <p className="text-xs text-stone-500 mt-0.5">Inquiries, collaborations, and bulk gifting</p>
                  </div>
                </div>
                <div className="pt-2 text-xs font-bold text-stone-700 group-hover:underline flex items-center gap-1">
                  <span>admin@thecrochetdiaryy.com</span>
                  <span>&rarr;</span>
                </div>
              </Card>
            </a>

            {/* Studio / Delivery Area */}
            <Card className="p-6 border border-[#EAE1D3] bg-white rounded-3xl space-y-3 shadow-xs h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-11 w-11 rounded-2xl bg-[#EBF2EA] text-[#3B4D36] flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-brand-text">Studio &amp; Delivery</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Ratlam, Madhya Pradesh, India</p>
                </div>
              </div>
              <div className="pt-2 text-xs text-stone-600 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-stone-400" />
                <span>Local hand delivery &amp; pickup</span>
              </div>
            </Card>
          </div>

          {/* Form & Support Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <Card className="p-6 sm:p-8 border border-[#EAE1D3] bg-white rounded-3xl shadow-sm space-y-6">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-brand-text">
                    Send a Note to Nitika
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    Fill out the form below. Messages are routed directly to the founder&apos;s inbox via Resend.
                  </p>
                </div>

                {status === "success" ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading text-lg font-bold text-emerald-900">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                        Thank you for reaching out! Nitika reads every message personally and will reply via email or phone within 24 hours.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatus("idle")}
                      className="border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {status === "error" && (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 flex items-start gap-2.5">
                        <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
                        <div>
                          <strong>Failed to send: </strong>
                          <span>{errorMessage}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                          Your Name <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Priyal Sharma"
                          disabled={status === "submitting"}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          disabled={status === "submitting"}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                          Phone / WhatsApp (Optional)
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +91 98260 00000"
                          disabled={status === "submitting"}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                          Subject <span className="text-rose-500">*</span>
                        </label>
                        <Input
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="e.g. Custom Color Request or Delivery"
                          disabled={status === "submitting"}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                        Message <span className="text-rose-500">*</span>
                      </label>
                      <Textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us what piece you have in mind, color preferences, or any questions about timelines..."
                        disabled={status === "submitting"}
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={status === "submitting"}
                      className="w-full sm:w-auto"
                      rightIcon={
                        status === "submitting" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )
                      }
                    >
                      {status === "submitting" ? "Sending note..." : "Send Message to Nitika"}
                    </Button>
                  </form>
                )}
              </Card>
            </div>

            {/* Right Column: Helpful notes */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="p-6 border border-[#EAE1D3] bg-[#FAF1EA] rounded-3xl space-y-4 shadow-xs">
                <h3 className="font-heading text-lg font-bold text-brand-text flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-primary" />
                  Custom Color &amp; Bulk Orders
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Looking for custom party favors, wedding return gifts, or a specific shade of yarn to match a baby nursery?
                </p>
                <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside">
                  <li>Custom colors available for bouquets and plushies</li>
                  <li>Lead time is generally 5–14 days depending on quantity</li>
                  <li>WhatsApp is ideal if you have reference photos to share</li>
                </ul>
                <div className="pt-2">
                  <a
                    href="https://wa.me/919770124355?text=Hi%20Nitika!%20I'm%20interested%20in%20a%20custom%20crochet%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#25D366] text-[#1FA952] hover:bg-[#E8F8EE] w-full"
                      leftIcon={<MessageCircle className="h-3.5 w-3.5 text-[#25D366]" />}
                    >
                      Message Reference Photos on WhatsApp
                    </Button>
                  </a>
                </div>
              </Card>

              <Card className="p-6 border border-[#EAE1D3] bg-white rounded-3xl space-y-3 shadow-xs">
                <h3 className="font-heading text-base font-bold text-brand-text">
                  Delivery Zone Reminder
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We currently operate exclusively in <strong>Ratlam, Madhya Pradesh</strong>. Orders can be hand-delivered to your door in Ratlam or picked up from our studio.
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </main>

      <StoreFooter />
    </div>
  );
}
