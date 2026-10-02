"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/admin-header";
import { Container, Card, Button, Input, Textarea } from "@/components/ui";
import {
  Settings,
  Truck,
  CheckCircle2,
  Save,
  MapPin,
  Phone,
  ChevronLeft,
} from "lucide-react";
import { StoreSettings } from "@/lib/admin-store";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [cityName, setCityName] = useState("Ratlam");
  const [deliveryFee, setDeliveryFee] = useState("50");
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState("999");
  const [whatsappNumber, setWhatsappNumber] = useState("+91 97701 24355");
  const [founderName, setFounderName] = useState("Nitika Tanted");
  const [studioAddressNote, setStudioAddressNote] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok && !isCancelled) {
          const data = await res.json();
          if (data.success && data.settings) {
            const s: StoreSettings = data.settings;
            setCityName(s.cityName);
            setDeliveryFee(String(s.deliveryFee));
            setFreeDeliveryThreshold(String(s.freeDeliveryThreshold));
            setWhatsappNumber(s.whatsappNumber);
            setFounderName(s.founderName);
            setStudioAddressNote(s.studioAddressNote);
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }

    loadSettings();
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityName,
          deliveryFee: Number(deliveryFee) || 0,
          freeDeliveryThreshold: Number(freeDeliveryThreshold) || 0,
          whatsappNumber,
          founderName,
          studioAddressNote,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        throw new Error(data.error || "Failed to update settings.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error saving settings.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3EC]">
      <AdminHeader />

      <main className="py-6 sm:py-10">
        <Container size="md" className="space-y-6">
          {/* Back to Dashboard Navigation */}
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-primary bg-white hover:bg-[#FAF1EA] px-3.5 py-1.5 rounded-full border border-stone-200/90 shadow-2xs transition"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>

          {/* Header */}
          <div className="border-b border-stone-200 pb-5">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="h-5 w-5 text-brand-primary" />
              <span className="font-handwriting text-2xl text-brand-primary">Preferences</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-text">
              Store &amp; Delivery Settings
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Change your operating city, delivery fees, and free-delivery rules dynamically without touching any code.
            </p>
          </div>

          {success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Store settings have been saved and applied across the website!</span>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery & City Card */}
            <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-5 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <Truck className="h-5 w-5 text-brand-secondary" />
                <h2 className="font-heading text-base font-bold text-brand-text">
                  Local Delivery Rules
                </h2>
              </div>

              <div className="space-y-4">
                <Input
                  label="Local Delivery City *"
                  placeholder="e.g. Ratlam"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  helperText="Shown on trust strips, checkout headers, and delivery badges."
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Flat Delivery Fee (₹) *"
                    type="number"
                    placeholder="e.g. 50"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    helperText="Charged for local doorstep delivery below the free threshold."
                    required
                  />

                  <Input
                    label="Free Delivery Threshold (₹) *"
                    type="number"
                    placeholder="e.g. 999"
                    value={freeDeliveryThreshold}
                    onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                    helperText="Orders at or above this amount receive 100% free delivery."
                    required
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="rounded-2xl bg-[#FAF6EF] p-4 border border-stone-200/80 space-y-1.5 text-xs text-stone-700">
                <div className="flex items-center gap-1.5 font-bold text-brand-text">
                  <MapPin className="h-3.5 w-3.5 text-brand-primary" />
                  Live Delivery Policy Summary:
                </div>
                <p className="leading-relaxed">
                  Deliveries are restricted exclusively to <strong>{cityName}</strong>. Customers pay a flat fee of <strong>₹{deliveryFee}</strong>, or enjoy <strong>FREE delivery</strong> on orders of <strong>₹{freeDeliveryThreshold}</strong> and above. Self-pickup at the studio is always 100% free!
                </p>
              </div>
            </Card>

            {/* Founder Contact & Studio Address Card */}
            <Card className="p-6 border border-[#ECE2D2] bg-white rounded-3xl space-y-5 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <Phone className="h-5 w-5 text-brand-primary" />
                <h2 className="font-heading text-base font-bold text-brand-text">
                  Founder &amp; Studio Information
                </h2>
              </div>

              <div className="space-y-4">
                <Input
                  label="Founder Display Name"
                  placeholder="Nitika Tanted"
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                />

                <Input
                  label="WhatsApp Contact Number"
                  placeholder="+91 97701 24355"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  helperText="Used for customer WhatsApp inquiry links and prefilled messages."
                />

                <Textarea
                  label="Studio Address Instructions (For Pickup Orders)"
                  placeholder="e.g. Station Road Area, Ratlam, Madhya Pradesh - 457001"
                  rows={3}
                  value={studioAddressNote}
                  onChange={(e) => setStudioAddressNote(e.target.value)}
                  helperText="Displayed to customers who choose 'Self-Pickup at Studio'."
                />
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex items-center justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={saving}
                disabled={saving}
                className="w-full sm:w-auto shadow-md"
                leftIcon={<Save className="h-4 w-4" />}
              >
                Save Settings
              </Button>
            </div>
          </form>
        </Container>
      </main>
    </div>
  );
}
