import { z } from "zod";

export const PRODUCT_CATEGORIES = ["Café", "Infusiones", "Accesorios & Máquinas"] as const;

export const productCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive("El precio debe ser mayor a 0"),
  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .nonnegative("El stock no puede ser negativo"),
  imageUrl: z.string().optional(),
  categories: z.array(z.string()).default([]),
  location: z.string().max(200).optional(),
});

export const productUpdateSchema = z
  .object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).nullable(),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    imageUrl: z.string().nullable(),
    categories: z.array(z.string()),
    location: z.string().max(200).nullable(),
  })
  .partial()
  .strict();

export const sellerProfileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  address: z.string().min(1, "La dirección es requerida").max(200),
  postalCode: z.string().min(1, "El código postal es requerido").max(10),
});

export const adminSellerCreateSchema = z.object({
  clerkId: z.string().min(1, "El clerkId es requerido"),
  name: z.string().min(1, "El nombre es requerido").max(100),
  address: z.string().min(1, "La dirección es requerida").max(200),
  postalCode: z.string().min(1, "El código postal es requerido").max(10),
});

export const adminSellerUpdateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  address: z.string().min(1, "La dirección es requerida").max(200),
  postalCode: z.string().min(1, "El código postal es requerido").max(10),
});

export const orderStatusSchema = z.enum([
  "PENDING",
  "PAYMENT_CONFIRMED",
  "PREPARING",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
]);
