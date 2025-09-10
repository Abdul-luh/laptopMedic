// app/contact/page.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ContactFormData, contactSchema } from "@/lib/validation";

export default function ContactPage() {
  const [formData, setFormData] = useState<Partial<ContactFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData({ ...formData, file });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-lg p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-green-600">
            Request Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for contacting us. A technician will review your request and get back to you soon.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full rounded-2xl overflow-hidden">
        {/* Left Form Section */}
        <div className="p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            Need help?
          </h1>
          <h2 className="text-2xl font-semibold text-blue-700 mb-8">
            Contact a Technician
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Full name"
              value={formData.fullName || ""}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className={`w-full text-gray-700 px-4 py-3 border rounded-md focus:outline-none ${
                errors.fullName ? "border-red-500" : "border-[#2218DE]"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}

            <input
              type="email"
              placeholder="Email address"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full text-gray-700 px-4 py-3 border rounded-md focus:outline-none ${
                errors.email ? "border-red-500" : "border-[#2218DE]"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <textarea
              placeholder="Problem Description"
              rows={5}
              value={formData.problemDescription || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  problemDescription: e.target.value,
                })
              }
              className={`w-full text-gray-700 px-4 py-3 border rounded-md focus:outline-none ${
                errors.problemDescription ? "border-red-500" : "border-[#2218DE]"
              }`}
            />
            {errors.problemDescription && (
              <p className="text-red-500 text-sm">
                {errors.problemDescription}
              </p>
            )}

            <div>
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 border border-[#2218DE] text-blue-600 rounded-md cursor-pointer hover:bg-blue-50"
              >
                Upload File
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              {formData.file && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {formData.file.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2218DE] hover:bg-blue-800 disabled:bg-gray-400 text-white font-semibold py-3 rounded-md transition"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        {/* Right Illustration Section */}
        <div className="hidden md:flex items-center justify-center ">
          <Image
            src="/illustrations/contact-page-illustration.svg"
            alt="Contact Illustration"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
