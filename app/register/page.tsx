"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import axios from "axios";
import { RegisterRequest } from "@/types";
import { registerSchema } from "@/lib/validation";
import Image from "next/image";
import Logo from "@/components/logo";


type RegisterFormData = z.infer<typeof registerSchema>;
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RegisterPage() {
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({
    role: "user",
    service_time: undefined, // Add new fields
    picture_url: undefined, // Add new fields
    location: undefined, // Add location to state
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = registerSchema.parse(formData); // Prepare data for backend

      const registerData: RegisterRequest = {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
        role: validatedData.role,
        location: validatedData.location, // Include location in the payload
      }; // Call your backend API using axios

      const response = await axios.post(
        `${baseURL}/auth/register`,
        registerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log(response);

      if (response.status === 200 || response.status === 201) {
        setRegistrationSuccess(true); // Optionally redirect to login page after success
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Handle axios errors (network, HTTP errors)
        if (error.response) {
          // Server responded with error status
          const result = error.response.data;
          if (result.message) {
            setErrors({ general: result.message });
          } else if (result.errors && Array.isArray(result.errors)) {
            // Handle field-specific errors from backend
            const backendErrors: Record<string, string> = {};
            result.errors.forEach(
              (error: { field: string; message: string }) => {
                backendErrors[error.field] = error.message;
              }
            );
            setErrors(backendErrors);
          } else {
            setErrors({
              general: `Registration failed: ${error.response.status} ${error.response.statusText}`,
            });
          }
        } else if (error.request) {
          // Network error
          setErrors({
            general:
              "Network error. Please check your connection and try again.",
          });
        } else {
          // Other axios error
          setErrors({
            general: "An unexpected error occurred. Please try again.",
          });
        }
      } else if (
        typeof error === "object" &&
        error !== null &&
        "errors" in error &&
        Array.isArray((error as { errors: unknown }).errors)
      ) {
        // Handle Zod validation errors
        const validationErrors: Record<string, string> = {};
        (
          error as { errors: Array<{ path: [string]; message: string }> }
        ).errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      } else {
        // Handle other errors
        setErrors({
          general: "Registration failed. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. Redirecting to login
              page...
            </p>
            <Link
              href="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex flex-col-reverse md:flex-row max-w-4xl mx-auto my-12 overflow-hidden items-center">
        {/* Left side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 py-12">
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start mb-12">
            <Logo />
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 flex items-center p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm">
              <svg
                className="w-5 h-5 mr-2 text-red-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-md w-full space-y-6">
            {/* Full Name */}
            <div>
              <input
                id="name"
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#2218DE] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Full name"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#2218DE] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Email Address"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password || ""}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#2218DE] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Password"
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

            {/* Confirm Password */}
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword || ""}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="w-full px-4 py-3 border-2 border-[#2218DE] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Role Selection (kept as dropdown but styled to match) */}
            <div>
              <select
                id="role"
                value={formData.role || "user"}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#2218DE] rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none bg-white"
              >
                <option value="user">User</option>
                <option value="engineer">Engineer</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {formData.role === "engineer" && (
              <>
                {/* Service Time */}
                <div>
                  <input
                    id="service_time"
                    type="number"
                    value={formData.service_time || ""}
                    onChange={(e) =>
                      handleInputChange("service_time", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-[#2218DE] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Service Time (hours)"
                    required
                  />
                  {errors.service_time && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.service_time}
                    </p>
                  )}
                </div>

                {/* Picture URL */}
                <div>
                  <input
                    id="picture_url"
                    type="url"
                    value={formData.picture_url || ""}
                    onChange={(e) =>
                      handleInputChange("picture_url", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-[#2218DE] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Profile Picture URL"
                    required
                  />
                  {errors.picture_url && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.picture_url}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <input
                    id="location"
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-4 py-3 border-2 border-[#2218DE] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Location"
                    required
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.location}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-[#2218DE] hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold transition text-lg"
            >
              {isLoading ? "Creating Account..." : "Sign up"}
            </button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#2218DE] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Right side: Illustration */}
        <section className="md:flex min-w-1/2 bg-gray-50 items-center justify-center">
          <Image
            height={500}
            width={500}
            src="/illustrations/register-illustration.svg"
            alt="Register Illustration"
            className="min-w-86 min-h-86 object-contain mx-auto"
          />
        </section>
      </div>
    </div>
  );
}