// app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const { login, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = loginSchema.parse(formData);
      const result = await login(validatedData.email, validatedData.password);

      console.log('Login result:', result);

      if (result.success) {
        router.push("/");
      } else {
        setErrors({ general: result.error || "Login failed. Please try again." });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            validationErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(validationErrors);
      } else {
        setErrors({ general: "Login failed. Please try again." });
      }
    }
  };

  return (
    <div className="min-h-screen flex  bg-gray-50">

    <div className="flex flex-col-reverse md:flex-row max-w-4xl mx-auto my-12 overflow-hidden items-center">

      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 py-12">
        {/* Logo */}
        <div className="flex items-center mb-12">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-blue-600 mr-3">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-800">Laptop Medic</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-md w-full space-y-6">
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 text-sm text-red-700 rounded-lg">
              {errors.general}
            </div>
          )}

          <div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-600 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-600 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            {isLoading ? "Signing in..." : "Log in"}
          </button>

          <p className="text-center text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>

      {/* Right side: Illustration */}
      <section className="lg:flex w-1/2 bg-gray-50 items-center justify-center ">
        <Image
          height={500}
          width={500}
          src="/illustrations/login-illustration.svg"
          alt="Login Illustration"
          className="min-w-56 min-h-86 object-contain mx-auto"
        />
      </section>
    </div>
    </div>
  );
}
