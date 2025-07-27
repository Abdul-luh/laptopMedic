// lib/validations.ts
import { z } from "zod";

export const diagnosisSchema = z.object({
  brand: z.string().min(1, "Please select a laptop brand"),
  issueCategory: z.string().min(1, "Please select an issue category"),
  symptoms: z.array(z.string()).min(1, "Please select at least one symptom"),
  description: z
    .string()
    .min(10, "Please provide a detailed description (minimum 10 characters)"),
  urgency: z.enum(["low", "medium", "high"]),
});

export const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  problemDescription: z
    .string()
    .min(20, "Please provide a detailed description (minimum 20 characters)"),
  file: z.instanceof(File).optional(),
});

export type DiagnosisFormData = z.infer<typeof diagnosisSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
