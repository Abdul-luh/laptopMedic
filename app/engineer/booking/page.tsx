// ============================================
// 2. ENGINEER BOOKINGS PAGE - app/engineer/bookings/page.tsx
// ============================================
"use client";

import React, { useState, useEffect } from "react";
import { authUtils, authApi } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface Booking {
  id: number;
  user_id: number;
  engineer_id: number;
  problem_id: number;
  scheduled_time: string;
  confirmed: boolean;
  problem?: {
    laptop_brand: string;
    laptop_model: string;
    description: string;
  };
  user?: {
    name: string;
    email: string;
  };
}

export default function EngineerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "confirmed">(
    "pending"
  );

  const router = useRouter();
  const user = authUtils.getCurrentUser();

  useEffect(() => {
    // Check if user is logged in and is an engineer
    if (!authUtils.isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (user?.role !== "engineer" && user?.role !== "admin") {
      router.push("/contact");
      return;
    }

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // This endpoint would need to be created in the backend to fetch engineer's bookings
      // For now, we'll assume it exists
      const response = await authApi.get("/troubleshoot/engineer/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingResponse = async (
    bookingId: number,
    confirmed: boolean
  ) => {
    setIsSubmitting(true);

    try {
      const response = await authApi.patch(
        `/troubleshoot/bookings/${bookingId}/confirm`,
        {
          confirmed: confirmed,
          message: responseMessage || undefined,
        }
      );

      if (response.status === 200) {
        // Update local state
        setBookings(
          bookings.map((b) => (b.id === bookingId ? { ...b, confirmed } : b))
        );
        setShowResponseModal(false);
        setSelectedBooking(null);
        setResponseMessage("");
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openResponseModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowResponseModal(true);
    setResponseMessage("");
  };

  const pendingBookings = bookings.filter((b) => !b.confirmed);
  const confirmedBookings = bookings.filter((b) => b.confirmed);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your appointment requests</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "pending"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Pending ({pendingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab("confirmed")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "confirmed"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Confirmed ({confirmedBookings.length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {(activeTab === "pending" ? pendingBookings : confirmedBookings).map(
            (booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {booking.problem?.laptop_brand}{" "}
                        {booking.problem?.laptop_model}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {booking.problem?.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Customer:{" "}
                        </span>
                        <span className="text-gray-600">
                          {booking.user?.name || "Unknown"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Email:{" "}
                        </span>
                        <span className="text-gray-600">
                          {booking.user?.email || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Scheduled:{" "}
                        </span>
                        <span className="text-gray-600">
                          {new Date(booking.scheduled_time).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Status:{" "}
                        </span>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            booking.confirmed
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.confirmed ? "Confirmed" : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!booking.confirmed && (
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          handleBookingResponse(booking.id, true);
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => openResponseModal(booking)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {((activeTab === "pending" && pendingBookings.length === 0) ||
            (activeTab === "confirmed" && confirmedBookings.length === 0)) && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600 text-lg">
                No {activeTab} bookings at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Decline Booking Request
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message to Customer (Optional)
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Explain why you're declining or suggest alternative times..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedBooking(null);
                  setResponseMessage("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleBookingResponse(selectedBooking.id, false)
                }
                disabled={isSubmitting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {isSubmitting ? "Declining..." : "Confirm Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
