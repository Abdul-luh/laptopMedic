"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { DiagnosisResponse } from "@/types";

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

export default function DiagnosisResult({ problemId }: { problemId: number }) {
  const [data, setData] = useState<DiagnosisResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch latest problem + steps
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get<TroubleshootResponse>(
          `${API_BASE_URL}/troubleshoot/${problemId}`
        );

        const apiData = res.data;

        // Transform API -> DiagnosisResponse
        const transformed: DiagnosisResponse = {
          problem: `Issue with ${apiData.laptop_brand} ${apiData.laptop_model}`,
          cause: apiData.description,
          solution: apiData.steps.map((s) => s.instruction),
          estimatedTime: "30-60 minutes",
          difficulty: "medium",
          requiredTools: ["Basic tools"],
          additionalTips: [
            "Follow the steps in order",
            "If issues persist, contact a technician",
          ],
          warningLevel: "warning",
        };

        setData(transformed);
      } catch (error) {
        console.error("Error fetching problem details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2218DE] mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading diagnosis...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load diagnosis.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#2218DE]">{data.problem}</h2>
        <p className="text-gray-600 mt-2">{data.cause}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Troubleshooting Steps</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-800">
          {data.solution.map((step, i) => (
            <li key={i} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
        <p>
          <span className="font-semibold">Estimated Time:</span>{" "}
          {data.estimatedTime}
        </p>
        <p>
          <span className="font-semibold">Difficulty:</span> {data.difficulty}
        </p>
        <p>
          <span className="font-semibold">Required Tools:</span>{" "}
          {data.requiredTools.join(", ")}
        </p>
        <p>
          <span className="font-semibold">Tips:</span>{" "}
          {data.additionalTips.join(" • ")}
        </p>
      </div>
    </div>
  );
}
