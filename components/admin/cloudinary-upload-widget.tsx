"use client";

import React, { useState } from "react";
import Script from "next/script";
import Image from "next/image";
import { Button } from "@/components/ui";
import {
  UploadCloud,
  X,
  ArrowLeft,
  ArrowRight,
  Star,
  Plus,
  Image as ImageIcon,
} from "lucide-react";

interface CloudinaryWidgetProps {
  images: string[];
  onChange: (images: string[]) => void;
}

interface CloudinaryUploadWidgetResult {
  event: string;
  info: {
    secure_url: string;
  };
}

interface CloudinaryWidgetInstance {
  open: () => void;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: Error | null, result: CloudinaryUploadWidgetResult) => void
      ) => CloudinaryWidgetInstance;
    };
  }
}

export function CloudinaryUploadWidget({ images, onChange }: CloudinaryWidgetProps) {
  const [manualUrl, setManualUrl] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your-cloudinary-cloud-name";

  const openCloudinary = () => {
    if (typeof window !== "undefined" && window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudName === "your-cloudinary-cloud-name" ? "demo" : cloudName,
          uploadPreset: "ml_default",
          folder: "crochet_diaryy",
          multiple: true,
          sources: ["local", "url", "camera"],
          clientAllowedFormats: ["image"],
          maxImageFileSize: 5000000,
          theme: "minimal",
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            const newUrl = result.info.secure_url;
            onChange([...images, newUrl]);
          }
        }
      );
      widget.open();
    } else {
      setShowManualInput(true);
    }
  };

  const handleAddManualUrl = () => {
    if (manualUrl.trim()) {
      onChange([...images, manualUrl.trim()]);
      setManualUrl("");
      setShowManualInput(false);
    }
  };

  const removeImage = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    onChange(next);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const setAsCover = (index: number) => {
    if (index === 0) return;
    moveImage(index, 0);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      moveImage(draggedIndex, index);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Cloudinary Upload Script */}
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="lazyOnload"
      />

      {/* Upload Actions Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openCloudinary}
          className="border-brand-primary/50 text-brand-primary hover:bg-[#FAF1EA] font-bold"
          leftIcon={<UploadCloud className="h-4 w-4" />}
        >
          Upload via Cloudinary
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-stone-600 text-xs"
          leftIcon={<Plus className="h-3.5 w-3.5" />}
        >
          {showManualInput ? "Hide URL Input" : "Add Image URL directly"}
        </Button>

        <span className="text-xs text-stone-400 font-medium">
          {images.length} {images.length === 1 ? "image" : "images"} uploaded
        </span>
      </div>

      {/* Manual URL Input drawer */}
      {showManualInput && (
        <div className="rounded-2xl border border-stone-200 bg-[#FAF6EF] p-3 flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 rounded-xl border border-stone-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAddManualUrl}
            disabled={!manualUrl.trim()}
          >
            Add Image
          </Button>
        </div>
      )}

      {/* Images List with Drag-and-Drop and Touch Controls */}
      {images.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 p-8 text-center space-y-2 bg-[#FAF6EF]/50">
          <div className="mx-auto h-10 w-10 rounded-full bg-[#FAF1EA] flex items-center justify-center text-brand-primary">
            <ImageIcon className="h-5 w-5" />
          </div>
          <p className="font-heading text-sm font-bold text-brand-text">No images yet</p>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Upload product photos via Cloudinary or enter an image URL. You can drag and drop to reorder images once added.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {images.map((url, idx) => {
            const isCover = idx === 0;
            return (
              <div
                key={`${url}-${idx}`}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(idx)}
                className={`group relative rounded-2xl overflow-hidden border transition shadow-xs bg-white ${
                  isCover
                    ? "border-brand-primary ring-2 ring-brand-primary/20"
                    : "border-stone-200 hover:border-stone-300"
                } ${draggedIndex === idx ? "opacity-40" : "opacity-100"}`}
              >
                {/* Image Preview */}
                <div className="relative aspect-square w-full bg-stone-100">
                  <Image
                    src={url}
                    alt={`Product image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />

                  {/* Primary Cover Badge */}
                  {isCover && (
                    <span className="absolute top-2 left-2 rounded-full bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 shadow-xs flex items-center gap-1">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      Cover
                    </span>
                  )}

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 rounded-full bg-black/60 hover:bg-rose-600 text-white p-1 transition shadow-xs"
                    title="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Mobile & Touch Controls Bar */}
                <div className="p-2 bg-white flex items-center justify-between border-t border-stone-100 text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, idx - 1)}
                      className="p-1 rounded-md text-stone-500 hover:text-brand-primary hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none"
                      title="Move left"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => moveImage(idx, idx + 1)}
                      className="p-1 rounded-md text-stone-500 hover:text-brand-primary hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none"
                      title="Move right"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  {!isCover && (
                    <button
                      type="button"
                      onClick={() => setAsCover(idx)}
                      className="text-[10px] font-bold text-stone-500 hover:text-brand-primary transition"
                    >
                      Make Cover
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
