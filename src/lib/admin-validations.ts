import { z } from "zod";

export const adminSettingsSchema = z.object({
  companyName: z.string().min(2),
  slogan: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal("")).nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  compactLogoUrl: z.string().optional().nullable(),
  heroImageUrl: z.string().optional().nullable(),
  facebookUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  googleMapsUrl: z.string().optional().nullable(),
  openingHours: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export const adminServiceSchema = z.object({
  title: z.string().min(2),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  imageUrl: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  position: z.number().int().default(0),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export const adminServiceAreaSchema = z.object({
  city: z.string().min(2),
  country: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export const adminContactRequestUpdateSchema = z.object({
  isRead: z.boolean(),
});

export const adminProjectSchema = z.object({
  title: z.string().min(2),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  description: z.string().min(20),
  detailedDescription: z.string().optional().nullable(),
  problem: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  serviceId: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  position: z.number().int().default(0),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  images: z
    .array(
      z.object({
        url: z.string().min(1),
        alt: z.string().optional().nullable(),
        type: z.enum(["BEFORE", "DURING", "AFTER", "GENERAL"]),
        position: z.number().int().default(0),
      })
    )
    .default([]),
});

export const adminTestimonialSchema = z.object({
  clientName: z.string().min(2),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).default(5),
  message: z.string().min(10),
  isPublished: z.boolean().default(true),
  position: z.number().int().default(0),
});

export const adminGalleryItemSchema = z.object({
  title: z.string().min(2),
  imageUrl: z.string().min(1),
  isPublished: z.boolean().default(true),
  position: z.number().int().default(0),
});

export const adminBlogArticleSchema = z.object({
  title: z.string().min(2),
  intro: z.string().min(10),
  isPublished: z.boolean().default(true),
  position: z.number().int().default(0),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  blocks: z
    .array(
      z.object({
        content: z.string().min(1),
        imageUrl: z.string().optional().nullable(),
        position: z.number().int().default(0),
      })
    )
    .default([]),
});
