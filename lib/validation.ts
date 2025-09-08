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

// Validation schema matching backend requirements
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["user", "engineer", "admin"]).default("user"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  // Login validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type DiagnosisFormData = z.infer<typeof diagnosisSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export { registerSchema, loginSchema };