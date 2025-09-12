// components/DiagnoseForm.tsx
"use client";
import { useState } from "react";
import axios from "axios";
import { diagnosisSchema } from "@/lib/validation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// API Response interface
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
  solved: boolean;
  created_at: string;
  steps: TroubleshootStep[];
}

export default function DiagnosisFormNew({
  onDiagnosisComplete,
}: {
  onDiagnosisComplete: (response: TroubleshootResponse) => void;
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

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No auth token found. Please login first.");
      
      // Step 1: Create the problem
      const createResponse = await axios.post(`${API_BASE_URL}/troubleshoot/`, {
        laptop_brand: laptopBrand,
        laptop_model: laptopModel,
        description: description,
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // 🔥 add token here
          },
        }
  );

      const problemId = createResponse.data.id;
      console.log("Created problem with ID:", problemId);

      // Step 2: Fetch the problem with steps
      const problemResponse = await axios.get(
        `${API_BASE_URL}/troubleshoot/problems/${problemId}`
      );

      const apiData: TroubleshootResponse = problemResponse.data;
      console.log("API Data with steps:", apiData);

      onDiagnosisComplete(apiData);
    } catch (error) {
      console.error("Error calling troubleshoot API:", error);

      // Set a more specific error message
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setErrors({
            general:
              "API endpoint not found. Please check your backend configuration.",
          });
        } else if ((error.response?.status ?? 0) >= 500) {
          setErrors({
            general: "Server error occurred. Please try again later.",
          });
        } else {
          setErrors({
            general:
              "Failed to get diagnosis. Please check your connection and try again.",
          });
        }
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8 mt-16 w-full mx-auto">
      <div>
        <h1 className="text-4xl lg:text-5xl font-bold text-[#2218DE] mb-4">
          Start a Diagnosis
        </h1>
        <p className="text-lg text-gray-600">
          Get instant AI-powered solutions for your laptop issues
        </p>
      </div>

      <div className="space-y-6">
        {/* General Error Display */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Laptop Brand */}
        <div>
          <select
            value={laptopBrand}
            onChange={(e) => setLaptopBrand(e.target.value)}
            className="w-full px-4 py-4 text-gray-900 text-lg border-2 border-[#2218DE] rounded-xl focus:border-[#080198] focus:ring-0 outline-none transition-colors"
          >
            <option value="" className="bg-white/50 backdrop-blur-sm">
              Choose your laptop brand
            </option>
            {brands.map((brand) => (
              <option
                key={brand}
                value={brand}
                className="bg-transparent/50 backdrop-blur-sm"
              >
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
    </section>
  );
}
