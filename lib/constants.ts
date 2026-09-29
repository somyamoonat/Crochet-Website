export const DELIVERY_FEE = 50; // ₹50 flat local delivery fee
export const FREE_DELIVERY_THRESHOLD = 999; // Free delivery for orders at or above ₹999

export const FOUNDER_NAME = "Nitika Tanted";
export const CITY_NAME = "Ratlam";
export const STATE_NAME = "Madhya Pradesh";
export const WHATSAPP_NUMBER = "+91 97701 24355";
export const WHATSAPP_RAW_NUMBER = "919770124355";
export const WHATSAPP_URL = "https://wa.me/919770124355";
export const INSTAGRAM_HANDLE = "@the_crochetdiaryy";

export const PICKUP_STUDIO_ADDRESS = {
  name: "The Crochet Diaryy Studio",
  founder: "Nitika Tanted",
  city: "Ratlam",
  state: "Madhya Pradesh",
  note: "Free studio self-pickup available. Exact address and pickup timing will be coordinated with Nitika via WhatsApp once your pieces are ready.",
};

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }
  return "https://the-crochet-diaryy.vercel.app";
}
