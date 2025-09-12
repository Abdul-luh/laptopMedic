// ============================================
// 1. UPDATED CONTACT PAGE - app/contact/page.tsx
// ============================================
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { authUtils, authApi } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Engineer {
  id: number;
  name: string;
  email: string;
  service_time: string;
  picture_url?: string;
}

interface Problem {
  id: number;
  laptop_brand: string;
  laptop_model: string;
  description: string;
  created_at: string;
  solved: boolean;
}

export default function ContactPage() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [userProblems, setUserProblems] = useState<Problem[]>([]);
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(
    null
  );
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [scheduledTime, setScheduledTime] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const user = authUtils.getCurrentUser();

  useEffect(() => {
    // Check if user is logged in
    if (!authUtils.isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Check if user is an engineer - redirect to their bookings page
    if (user?.role === "engineer") {
      router.push("/engineer/bookings");
      return;
    }

    fetchEngineers();
    fetchUserProblems();
  }, []);

  const fetchEngineers = async () => {
    try {
      const response = await authApi.get("/troubleshoot/engineers");
      console.log("Engineers fetched:", response.data);
      setEngineers(response.data);
    } catch (error) {
      console.error("Failed to fetch engineers:", error);
      setError("Failed to load engineers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProblems = async () => {
    try {
      const response = await authApi.get("/troubleshoot/user/problems");
      if (response.data && Array.isArray(response.data)) {
        setUserProblems(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch user problems:", error);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedProblem || !selectedEngineer || !scheduledTime) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authApi.post("/troubleshoot/bookings", {
        problem_id: selectedProblem.id,
        engineer_id: selectedEngineer.id,
        scheduled_time: new Date(scheduledTime).toISOString(),
      });

      if (response.status === 200 || response.status === 201) {
        setBookingSuccess(true);
        setShowBookingModal(false);
        setTimeout(() => {
          setBookingSuccess(false);
          setSelectedEngineer(null);
          setSelectedProblem(null);
          setScheduledTime("");
        }, 3000);
      }
    } catch (error) {
      console.error("Booking failed:", error);
      setError("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openBookingModal = (engineer: Engineer) => {
    setSelectedEngineer(engineer);
    setShowBookingModal(true);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading engineers...</div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-lg p-8 rounded-lg shadow-md">
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
          <h1 className="text-3xl font-bold mb-4 text-green-600">
            Booking Successful!
          </h1>
          <p className="text-gray-600">
            Your booking request has been sent to the engineer. You`ll receive a
            confirmation soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-2 text-center">
          Need Technical Support?
        </h1>
        <h2 className="text-xl text-gray-600 mb-8 text-center">
          Choose an engineer to help with your laptop issues
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 max-w-md mx-auto">
            {error}
          </div>
        )}

        {/* Engineers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engineers.map((engineer) => (
            <div
              key={engineer.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-center mb-4">
                {engineer.picture_url &&
                engineer.picture_url.startsWith("http") ? (
                  <Image
                    width={64}
                    height={64}
                    src={engineer.picture_url}
                    alt={engineer.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {engineer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {engineer.name}
                  </h3>
                  <p className="text-sm text-gray-500">{engineer.email}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Service Time:</span>{" "}
                  {engineer.service_time}
                </p>
              </div>

              <button
                onClick={() => openBookingModal(engineer)}
                className="w-full bg-[#2218DE] hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>

        {engineers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No engineers available at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedEngineer && (
        <div className="fixed inset-0 bg-[#2218DE]/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Book Appointment with {selectedEngineer.name}
            </h3>

            {/* Problem Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Problem
              </label>
              {userProblems.length > 0 ? (
                <select
                  value={selectedProblem?.id || ""}
                  onChange={(e) => {
                    const problem = userProblems.find(
                      (p) => p.id === parseInt(e.target.value)
                    );
                    setSelectedProblem(problem || null);
                  }}
                  className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a problem...</option>
                  {userProblems.map((problem) => (
                    <option key={problem.id} value={problem.id}>
                      {problem.laptop_brand} {problem.laptop_model} -{" "}
                      {problem.description.substring(0, 50)}...
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  You need to submit a problem first before booking an engineer.
                  <button
                    onClick={() => router.push("/troubleshoot")}
                    className="block mt-2 text-blue-600 hover:underline"
                  >
                    Submit a problem →
                  </button>
                </div>
              )}
            </div>

            {/* Date/Time Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedEngineer(null);
                  setSelectedProblem(null);
                  setScheduledTime("");
                  setError(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingSubmit}
                disabled={isSubmitting || !selectedProblem || !scheduledTime}
                className="flex-1 bg-[#2218DE] hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
