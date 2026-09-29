import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  street: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(6, "Valid postal code is required"),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const checkoutOrderSchema = z
  .object({
    name: z.string().min(2, "Full name is required (at least 2 characters)"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^[0-9+\s-]{10,15}$/, "Please enter a valid phone number (10 digits)"),
    deliveryType: z.enum(["DELIVERY", "PICKUP"]),
    paymentMethod: z.enum(["RAZORPAY", "PAY_ON_DELIVERY"]),
    line1: z.string().optional(),
    line2: z.string().optional(),
    city: z.string().optional(),
    pincode: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === "DELIVERY") {
      if (!data.line1 || data.line1.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter your street address / house number",
          path: ["line1"],
        });
      }
      if (!data.pincode || !/^\d{6}$/.test(data.pincode.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid 6-digit pincode (e.g. 457001)",
          path: ["pincode"],
        });
      }
    }
  });

export type CheckoutOrderInput = z.infer<typeof checkoutOrderSchema>;

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  categoryId: z.string().min(1, "Please select a category"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  stockType: z.enum(["READY_TO_SHIP", "MADE_TO_ORDER"]).default("READY_TO_SHIP"),
  stockQty: z.coerce.number().int().nonnegative().optional().nullable(),
  leadTimeDays: z.coerce.number().int().positive().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;
