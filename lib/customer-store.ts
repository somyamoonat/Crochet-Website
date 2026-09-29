import bcrypt from "bcryptjs";

export interface FallbackUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "CUSTOMER" | "ADMIN";
  phone?: string;
  createdAt: Date;
}

// In-memory user store fallback for development environments
const globalForUsers = globalThis as unknown as {
  fallbackUsers: FallbackUser[] | undefined;
};

export const fallbackUsers: FallbackUser[] = globalForUsers.fallbackUsers ?? [];
if (process.env.NODE_ENV !== "production") {
  globalForUsers.fallbackUsers = fallbackUsers;
}

// Ensure default admin is present
export async function getSeededAdmin(): Promise<FallbackUser> {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@thecrochetdiaryy.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "supersecretadminpassword";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  return {
    id: "user_admin_nitika",
    name: "Nitika Tanted (Founder & Admin)",
    email: adminEmail,
    passwordHash,
    role: "ADMIN",
    phone: "+919770124355",
    createdAt: new Date(),
  };
}

// Add a test regular customer if not present
export async function getSampleCustomer(): Promise<FallbackUser> {
  const passwordHash = await bcrypt.hash("customer123", 10);
  return {
    id: "user_customer_test",
    name: "Pooja Sharma",
    email: "customer@example.com",
    passwordHash,
    role: "CUSTOMER",
    phone: "+919876543210",
    createdAt: new Date(),
  };
}

export async function findFallbackUserByEmail(email: string): Promise<FallbackUser | null> {
  const normalized = email.toLowerCase().trim();
  const admin = await getSeededAdmin();
  if (admin.email.toLowerCase() === normalized) {
    return admin;
  }

  const sampleCustomer = await getSampleCustomer();
  if (sampleCustomer.email.toLowerCase() === normalized) {
    return sampleCustomer;
  }

  const found = fallbackUsers.find((u) => u.email.toLowerCase() === normalized);
  return found || null;
}

export function saveFallbackUser(user: FallbackUser) {
  const existingIdx = fallbackUsers.findIndex(
    (u) => u.email.toLowerCase() === user.email.toLowerCase()
  );
  if (existingIdx >= 0) {
    fallbackUsers[existingIdx] = user;
  } else {
    fallbackUsers.push(user);
  }
}
