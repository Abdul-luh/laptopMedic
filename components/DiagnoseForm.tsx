"use client";
import { useState } from "react";
import { DiagnosisResponse } from "../types";
import { diagnosisSchema } from "@/lib/validation";

export default function DiagnosisFormNew({
  onDiagnosisComplete,
}: {
  onDiagnosisComplete: (response: DiagnosisResponse) => void;
}) {
  const [laptopBrand, setLaptopBrand] = useState("");
  const [laptopModel, setLaptopModel] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const brands = ["Dell", "HP", "Lenovo", "ASUS", "Acer", "Apple", "MSI", "Other"];

  const handleSubmit = async () => {
    // Validate with zod
    const result = diagnosisSchema.safeParse({
      laptop_brand: laptopBrand,
      laptop_model: laptopModel,
      description,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock response
    const mockDiagnosis: DiagnosisResponse = {
      problem: `Issue with ${laptopBrand} ${laptopModel}`,
      cause: `The laptop is not powering on. Possible hardware or power-related issue.`,
      solution: [
        "Check if the charger and power cable are working",
        "Remove battery and reconnect power",
        "Inspect RAM and SSD connections",
        "If unresolved, contact a technician",
      ],
      estimatedTime: "30-60 minutes",
      difficulty: "medium" as const,
      requiredTools: ["Screwdriver set", "Multimeter"],
      additionalTips: [
        "Ensure the power outlet is working",
        "Try a different charger if available",
      ],
      warningLevel: "warning" as const,
    };

    onDiagnosisComplete(mockDiagnosis);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8 mt-16">
      <div>
        <h1 className="text-4xl lg:text-5xl font-bold text-[#2218DE] mb-4">
          Start a Diagnosis
        </h1>
        <p className="text-lg text-gray-600">
          Get instant AI-powered solutions for your laptop issues
        </p>
      </div>

      <div className="space-y-6">
        {/* Laptop Brand */}
        <div>
          <select
            value={laptopBrand}
            onChange={(e) => setLaptopBrand(e.target.value)}
            className="w-full px-4 py-4 text-gray-900 text-lg border-2 border-[#2218DE] rounded-xl focus:border-[#080198] focus:ring-0 outline-none transition-colors"
          >
            <option value="" className="bg-white/50 backdrop-blur-sm">Choose your laptop brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand} className="bg-transparent/50 backdrop-blur-sm">
                {brand}
              </option>
            ))}
          </select>
          {errors.laptop_brand && (
            <p className="text-red-500 text-sm mt-1">{errors.laptop_brand}</p>
          )}
        </div>

        {/* Laptop Model */}
        <div>
          <input
            type="text"
            placeholder="Enter your laptop model"
            value={laptopModel}
            onChange={(e) => setLaptopModel(e.target.value)}
            className="w-full px-4 py-4 text-gray-900 text-lg border-2 border-[#2218DE] rounded-xl focus:border-[#080198] focus:ring-0 outline-none transition-colors"
          />
          {errors.laptop_model && (
            <p className="text-red-500 text-sm mt-1">{errors.laptop_model}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            placeholder="Describe the issue with your laptop..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-4 text-gray-900 text-lg border-2 border-[#2218DE] rounded-xl focus:border-[#080198] focus:ring-0 outline-none transition-colors"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#2218DE] hover:bg-[#080198] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Run Diagnosis</span>
          )}
        </button>
      </div>
    </div>
  );
}
