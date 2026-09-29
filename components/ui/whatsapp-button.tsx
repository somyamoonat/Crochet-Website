"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const whatsappUrl =
    "https://wa.me/919770124355?text=Hi%20Nitika!%20I'm%20reaching%20out%20from%20The%20Crochet%20Diaryy%20website%20%F0%9F%A7%B6";

  const isDraggingRef = useRef(false);
  const [constraints, setConstraints] = useState({
    left: -800,
    right: 0,
    top: -800,
    bottom: 0,
  });

  useEffect(() => {
    const updateConstraints = () => {
      if (typeof window !== "undefined") {
        setConstraints({
          left: -(window.innerWidth - 88),
          right: 0,
          top: -(window.innerHeight - 88),
          bottom: 0,
        });
      }
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    // Prevent opening WhatsApp when releasing a drag
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <motion.aside
      drag
      dragMomentum={false}
      dragElastic={0.08}
      dragConstraints={constraints}
      whileDrag={{ scale: 1.1, cursor: "grabbing" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDragEnd={() => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 120);
      }}
      aria-label="Draggable WhatsApp Contact"
      className="fixed z-40 touch-none select-none cursor-grab active:cursor-grabbing hidden md:flex items-center"
      style={{
        bottom: "24px",
        right: "24px",
      }}
      title="Chat with Nitika on WhatsApp (Drag anywhere)"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Chat with Nitika on WhatsApp"
        className="relative flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-[0_6px_24px_rgba(37,211,102,0.45)] transition-shadow duration-200 hover:shadow-[0_8px_32px_rgba(37,211,102,0.65)]"
      >
        {/* Subtle breathing ripple */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 pointer-events-none" />
        <MessageCircle className="h-7 w-7 relative z-10 fill-white stroke-none pointer-events-none" />
      </a>
    </motion.aside>
  );
}
