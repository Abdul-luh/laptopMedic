// lib/validations.ts
import { z } from "zod";

export const diagnosisSchema = z.object({
  laptop_brand: z.string().min(1, "Please select a laptop brand"),
  laptop_model: z.string().min(1, "Please enter your laptop model"),
  description: z
    .string()
    .min(10, "Please provide a detailed description (minimum 10 characters)"),
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
// lib/validation.ts (Modified)

const registerSchema = z.object({
  name: z.string().min(1, "Full name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string(),
  role: z.enum(["user", "engineer"]),
  service_time: z.coerce.number().min(0, "Service time cannot be negative").optional(),
  location: z.string().min(1, "Location is required").optional(),
  picture_url: z.string().url("Invalid URL").optional(),
}).refine(
  (data) => {
    if (data.role === "engineer") {
      return data.service_time !== undefined && data.picture_url !== undefined && data.location;
    }
    return true;
  },
  {
    message: "Engineer registration requires service time and a picture URL.",
    path: ["role"], // This will associate the error with the role field
  }
).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

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