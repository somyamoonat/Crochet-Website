"use client";

import React, { useState, useEffect } from "react";
import { Button, Input } from "@/components/ui";
import { X, MapPin, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { FallbackAddress } from "@/lib/fallback-addresses";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (address: FallbackAddress) => void;
  initialAddress?: FallbackAddress | null;
  defaultName?: string;
  defaultPhone?: string;
}

export function AddressModal({
  isOpen,
  onClose,
  onSaved,
  initialAddress,
  defaultName = "",
  defaultPhone = "",
}: AddressModalProps) {
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [label, setLabel] = useState("Default Delivery");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("Ratlam");
  const [state, setState] = useState("Madhya Pradesh");
  const [pincode, setPincode] = useState("457001");
  const [isDefault, setIsDefault] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state whenever modal opens or initialAddress changes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      if (initialAddress) {
        setRecipientName(initialAddress.recipientName || defaultName || "");
        setPhone(initialAddress.phone || defaultPhone || "");
        setLabel(initialAddress.label || "Default Delivery");
        setLine1(initialAddress.line1 || "");
        setLine2(initialAddress.line2 || "");
        setCity(initialAddress.city || "Ratlam");
        setState(initialAddress.state || "Madhya Pradesh");
        setPincode(initialAddress.pincode || "457001");
        setIsDefault(initialAddress.isDefault !== false);
      } else {
        setRecipientName(defaultName || "");
        setPhone(defaultPhone || "");
        setLabel("Default Delivery");
        setLine1("");
        setLine2("");
        setCity("Ratlam");
        setState("Madhya Pradesh");
        setPincode("457001");
        setIsDefault(true);
      }
    }
  }, [isOpen, initialAddress, defaultName, defaultPhone]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!recipientName.trim()) {
      setErrorMessage("Please enter the recipient's name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!line1.trim() || line1.trim().length < 5) {
      setErrorMessage("Please provide a valid street address (at least 5 characters).");
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      setErrorMessage("Please enter a valid 6-digit postal pincode.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        id: initialAddress?.id,
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        label: label.trim() || "Default Delivery",
        line1: line1.trim(),
        line2: line2.trim() || null,
        city: city.trim() || "Ratlam",
        state: state.trim() || "Madhya Pradesh",
        pincode: pincode.trim(),
        isDefault,
      };

      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save address. Please try again.");
      }

      onSaved(data.address);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving address";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#ECE2D2] shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-[#FAF1EA] flex items-center justify-center text-brand-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-brand-text">
                {initialAddress ? "Edit Saved Address" : "Add Delivery Address"}
              </h3>
              <p className="text-xs text-stone-500">
                Drop-off location for your handcraft deliveries
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Address Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                Recipient Name <span className="text-brand-primary">*</span>
              </label>
              <Input
                placeholder="e.g. Somya Moonat"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                required
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                Phone (WhatsApp) <span className="text-brand-primary">*</span>
              </label>
              <Input
                placeholder="10-digit mobile"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Label selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">
              Address Label
            </label>
            <div className="flex gap-2">
              {["Default Delivery", "Home", "Work / Studio"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLabel(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                    label === item
                      ? "bg-[#FAF1EA] border-brand-primary text-brand-primary font-bold shadow-xs"
                      : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Street Address Line 1 */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">
              Street Address / House No. <span className="text-brand-primary">*</span>
            </label>
            <Input
              placeholder="e.g. 402, Shanti Heights, Station Road"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              required
              className="rounded-xl text-sm"
            />
          </div>

          {/* Landmark / Line 2 */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">
              Landmark / Colony <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <Input
              placeholder="e.g. Near Clock Tower / Nagar Nigam"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              className="rounded-xl text-sm"
            />
          </div>

          {/* City & Pincode Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">City</label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ratlam"
                className="rounded-xl text-sm bg-stone-50/70"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">
                Pincode <span className="text-brand-primary">*</span>
              </label>
              <Input
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="457001"
                maxLength={6}
                required
                className="rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Make Default Checkbox */}
          <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-brand-primary focus:ring-brand-primary/20 accent-[#D98E73]"
            />
            <span className="text-xs font-medium text-stone-700">
              Set as primary address for future orders
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              leftIcon={
                isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )
              }
            >
              {isSubmitting ? "Saving Address..." : "Save Address"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
