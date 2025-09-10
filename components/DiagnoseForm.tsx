"use client";
import { useState } from "react";
import { DiagnosisResponse } from "../types";
import axios from "axios";
import { diagnosisSchema } from "@/lib/validation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TroubleshootStep {
  id: number;
  step_number: number;
  instruction: string;
  completed: boolean;
}

interface TroubleshootResponse {
  id: number;
  laptop_brand: string;
  laptop_model: string;
  description: string;
  steps: TroubleshootStep[];
}

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

  const brands = [
    "Dell",
    "HP",
    "Lenovo",
    "ASUS",
    "Acer",
    "Apple",
    "MSI",
    "Other",
  ];

  // Map backend response -> frontend DiagnosisResponse
  const transformApiResponse = (
    apiResponse: TroubleshootResponse
  ): DiagnosisResponse => {
    return {
      problem: `Issue with ${apiResponse.laptop_brand} ${apiResponse.laptop_model}`,
      cause: apiResponse.description,
      solution: apiResponse.steps.map((step) => step.instruction),
      estimatedTime: "30-60 minutes",
      difficulty: "medium",
      requiredTools: ["Basic tools"],
      additionalTips: [
        "Follow the steps in order",
        "If issues persist, contact a technician",
      ],
      warningLevel: "warning",
    };
  };

  const handleSubmit = async () => {
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

    try {
      const response = await axios.post(`${API_BASE_URL}/troubleshoot/`, {
        laptop_brand: laptopBrand,
        laptop_model: laptopModel,
        description,
      });

      const diagnosisResponse = transformApiResponse(response.data);
      onDiagnosisComplete(diagnosisResponse);
    } catch (error) {
      console.error("Error calling troubleshoot API:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            className="w-full px-4 py-4 text-gray-900 text-lg border-2 border-[#2218DE] rounded-xl focus:border-[#080198]"
          >
            <option value="">Choose your laptop brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
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
            className="w-full px-4 py-4 text-gray-900 text-lg border-2 border-[#2218DE] rounded-xl focus:border-[#080198]"
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
            className="w-full px-4 py-4 text-gray-900 text-lg border-2 border-[#2218DE] rounded-xl focus:border-[#080198]"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-[#2218DE] hover:bg-[#080198] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl text-lg flex items-center justify-center shadow-lg"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
              Analyzing...
            </>
          ) : (
            "Run Diagnosis"
          )}
        </button>
      </div>
    </div>
  );
}
