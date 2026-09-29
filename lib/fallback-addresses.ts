import fs from "fs";
import path from "path";

export interface FallbackAddress {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  label: string; // e.g. "Default Delivery", "Home", "Work"
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const ADDRESSES_FILE = path.join(process.cwd(), ".addresses-store.json");

function loadAddressesFromFile(): FallbackAddress[] {
  try {
    if (fs.existsSync(ADDRESSES_FILE)) {
      const data = fs.readFileSync(ADDRESSES_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn("Could not read .addresses-store.json:", err);
  }
  return [];
}

function persistAddressesToFile(addresses: FallbackAddress[]) {
  try {
    fs.writeFileSync(ADDRESSES_FILE, JSON.stringify(addresses, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist to .addresses-store.json:", err);
  }
}

let memoryAddresses: FallbackAddress[] = loadAddressesFromFile();

/**
 * Get addresses for a specific user ID or email.
 * If user has no saved addresses, creates and returns a default initial address.
 */
export function getFallbackAddressesByUserId(
  userId: string,
  userEmail?: string | null,
  userName?: string | null,
  userPhone?: string | null
): FallbackAddress[] {
  memoryAddresses = loadAddressesFromFile();
  const normalizedId = userId || userEmail || "default_customer";

  const userAddrs = memoryAddresses.filter(
    (a) =>
      a.userId === normalizedId ||
      (userEmail && a.userId === userEmail) ||
      (userId && a.userId === userId)
  );

  if (userAddrs.length > 0) {
    return userAddrs;
  }

  // Create an initial default address for seamless first-time experience
  const defaultAddr: FallbackAddress = {
    id: `addr_${Date.now()}_def`,
    userId: normalizedId,
    recipientName: userName || "Somya Moonat",
    phone: userPhone || "+91 98765 43210",
    label: "Default Delivery",
    line1: "Local Address",
    line2: "Near Clock Tower",
    city: "Ratlam",
    state: "Madhya Pradesh",
    pincode: "457001",
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryAddresses.push(defaultAddr);
  persistAddressesToFile(memoryAddresses);
  return [defaultAddr];
}

/**
 * Save or update a fallback address
 */
export function saveFallbackAddress(addr: Omit<FallbackAddress, "createdAt" | "updatedAt"> & { createdAt?: string }): FallbackAddress {
  memoryAddresses = loadAddressesFromFile();
  const now = new Date().toISOString();

  // If this address is set as default, mark all other addresses of this user as non-default
  if (addr.isDefault) {
    memoryAddresses = memoryAddresses.map((existing) => {
      if (existing.userId === addr.userId) {
        return { ...existing, isDefault: false, updatedAt: now };
      }
      return existing;
    });
  }

  const existingIdx = memoryAddresses.findIndex((a) => a.id === addr.id);

  const saved: FallbackAddress = {
    ...addr,
    createdAt: addr.createdAt || (existingIdx >= 0 ? memoryAddresses[existingIdx].createdAt : now),
    updatedAt: now,
  };

  if (existingIdx >= 0) {
    memoryAddresses[existingIdx] = saved;
  } else {
    memoryAddresses.unshift(saved);
  }

  persistAddressesToFile(memoryAddresses);
  return saved;
}

/**
 * Delete a fallback address
 */
export function deleteFallbackAddress(id: string, userId: string): boolean {
  memoryAddresses = loadAddressesFromFile();
  const initialLen = memoryAddresses.length;
  memoryAddresses = memoryAddresses.filter(
    (a) => !(a.id === id && (a.userId === userId || !a.userId))
  );

  if (memoryAddresses.length !== initialLen) {
    persistAddressesToFile(memoryAddresses);
    return true;
  }
  return false;
}
