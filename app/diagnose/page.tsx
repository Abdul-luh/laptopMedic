// app/diagnose/page.tsx
"use client";

import React, { useState } from "react";
import DiagnosisFormNew from "../../components/DiagnoseForm";
import DiagnosisResult from "../../components/DiagnosisResult";
import { useRouter } from "next/navigation";

// This type should ideally be in a shared `types/index.ts` file.
// It represents the raw data structure from the API and is compatible
// with the `DiagnosisData` interface in `DiagnosisResult.tsx`.
interface DiagnosisData {
  id: number;
  laptop_brand: string;
  laptop_model: string;
  description: string;
  created_at: string;
  solved: boolean;
  steps: {
    id: number;
    step_number: number;
    instruction: string;
    completed: boolean;
  }[];
}

export default function DiagnosePage() {
  const [diagnosis, setDiagnosis] = useState<DiagnosisData | null>(null);
  const router = useRouter();

  const handleDiagnosisComplete = (response: DiagnosisData) => {
    setDiagnosis(response);
    // Save to session storage instead of localStorage (artifacts don't support localStorage)
    try {
      const history = JSON.parse(
        sessionStorage.getItem("diagnosisHistory") || "[]"
      );
      history.unshift({
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        response,
      });
      sessionStorage.setItem(
        "diagnosisHistory",
        JSON.stringify(history.slice(0, 10))
      );
    } catch {
      console.warn("Session storage not available, skipping history save");
    }
  };

  const handleNewDiagnosis = () => {
    setDiagnosis(null);
  };

  const handleContactTechnician = () => {
    router.push("/contact");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto mt-20">
          {diagnosis ? (
            <DiagnosisResult
              diagnosis={diagnosis}
              onNewDiagnosis={handleNewDiagnosis}
              onContactTechnician={handleContactTechnician}
            />
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-full mx-auto px-4 sm:px-0">
              {/* Left side - Form */}
              <div className="order-2 lg:order-1">
                <DiagnosisFormNew
                  onDiagnosisComplete={handleDiagnosisComplete}
                />
              </div>

              {/* Right side - Hero Image */}
              <div className="order-1 lg:order-2 flex justify-center items-center w-full">
                <div className="relative ">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                    <div className="w-80 h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-32 h-32 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    {/* Decorative tools */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37-2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Help button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
