import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom est requis."),
  phone: z.string().min(8, "Le telephone est requis."),
  email: z.string().email("Email invalide.").optional().or(z.literal("")),
  city: z.string().optional(),
  country: z.string().optional(),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caracteres."),
});
