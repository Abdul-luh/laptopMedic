// components/DiagnosisForm.tsx
"use client";

import React, { useState } from "react";
import { diagnosisSchema, DiagnosisFormData } from "../lib/validation";
import { DiagnosisResponse } from "../types";
import { generateDiagnosis } from "../lib/ai-diagnosis";

interface DiagnosisFormProps {
  onDiagnosisComplete: (response: DiagnosisResponse) => void;
}

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
const issueCategories = [
  "Overheating",
  "Freezing",
  "Slow Speed",
  "Blue Screen",
  "Not Booting",
];
const symptoms = [
  "Fan running loudly",
  "Laptop feels very hot",
  "Frequent crashes",
  "Slow startup",
  "Applications not responding",
  "Blue screen errors",
  "Won't turn on",
  "Screen flickering",
  "Strange noises",
  "Battery draining quickly",
];

export default function DiagnosisForm({
  onDiagnosisComplete,
}: DiagnosisFormProps) {
  const [formData, setFormData] = useState<Partial<DiagnosisFormData>>({
    symptoms: [],
    urgency: "medium",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = diagnosisSchema.parse(formData);

      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const diagnosis = generateDiagnosis(validatedData);
      onDiagnosisComplete(diagnosis);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "errors" in error &&
        Array.isArray((error as { errors: unknown }).errors)
      ) {
        const newErrors: Record<string, string> = {};
        (
          error as { errors: Array<{ path: string[]; message: string }> }
        ).errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    const currentSymptoms = formData.symptoms || [];
    if (checked) {
      setFormData({ ...formData, symptoms: [...currentSymptoms, symptom] });
    } else {
      setFormData({
        ...formData,
        symptoms: currentSymptoms.filter((s) => s !== symptom),
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Start a Diagnosis
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="brand"
              className="block text-lg font-bold text-black mb-2"
            >
              Select Laptop Brand
            </label>
            <select
              id="brand"
              value={formData.brand || ""}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg  text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.brand ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            {errors.brand && (
              <p className="text-red-500 text-sm mt-1">{errors.brand}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="issueCategory"
              className="block text-lg font-bold text-black mb-2"
            >
              Select Issue Category
            </label>
            <select
              id="issueCategory"
              value={formData.issueCategory || ""}
              onChange={(e) =>
                setFormData({ ...formData, issueCategory: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.issueCategory ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" className="text-black bold">
                Select an issue category
              </option>
              {issueCategories.map((category) => (
                <option
                  key={category}
                  className="text-black bold"
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
            {errors.issueCategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.issueCategory}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-black bold">
              Select Symptoms
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {symptoms.map((symptom) => (
                <label
                  key={symptom}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.symptoms?.includes(symptom) || false}
                    onChange={(e) =>
                      handleSymptomChange(symptom, e.target.checked)
                    }
                    className="w-4 h-4 text-black bold border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">{symptom}</span>
                </label>
              ))}
            </div>
            {errors.symptoms && (
              <p className="text-red-500 text-sm mt-1">{errors.symptoms}</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-black mb-3">Urgency Level</h3>
            <div className="space-y-2">
              {[
                { value: "low", label: "Low - Can wait a few days" },
                { value: "medium", label: "Medium - Need help soon" },
                { value: "high", label: "High - Urgent issue" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="urgency"
                    value={option.value}
                    checked={formData.urgency === option.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        urgency: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-lg font-bold text-black mb-2"
            >
              Describe the Problem
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Please provide detailed information about the issue you're experiencing..."
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-950 cursor-pointer hover:bg-black disabled:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Run Diagnosis</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
