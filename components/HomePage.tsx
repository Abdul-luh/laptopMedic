// app/page.tsx
"use client";

import React from "react";
import { Brain, Headphones, BookOpen } from "lucide-react";
import PageHeader from "@/components/Header";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <PageHeader /> */}

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Is your laptop acting up?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Run a quick diagnosis to get expert help immediately
          </p>
          <Link href="/diagnose">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-full transition-colors duration-200 font-medium">
              Start Diagnosis
            </button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-900 text-white p-8 rounded-lg hover:shadow-lg transition-shadow duration-200 h-full">
            <div className="text-center">
              <Brain className="w-16 h-16 mb-4 text-blue-400 mx-auto" />
              <h3 className="text-xl font-bold mb-4">AI-Powered Diagnosis</h3>
              <p className="text-gray-300">
                Our advanced AI analyzes your laptop issues and provides
                accurate diagnoses with step-by-step solutions.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-8 rounded-lg hover:shadow-lg transition-shadow duration-200 h-full">
            <div className="text-center">
              <Headphones className="w-16 h-16 mb-4 text-green-400 mx-auto" />
              <h3 className="text-xl font-bold mb-4">Contact Technician</h3>
              <p className="text-gray-300">
                Need professional help? Connect with certified technicians who
                can provide expert assistance and repairs.
              </p>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-8 rounded-lg hover:shadow-lg transition-shadow duration-200 h-full">
            <div className="text-center">
              <BookOpen className="w-16 h-16 mb-4 text-purple-400 mx-auto" />
              <h3 className="text-xl font-bold mb-4">
                Learn about Common Issues
              </h3>
              <p className="text-gray-300">
                Browse our knowledge base to learn about common laptop problems
                and preventive maintenance tips.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/history">
              <button className="w-full py-6 border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 rounded-lg transition-colors duration-200 font-medium">
                View Previous Diagnoses
              </button>
            </Link>
            <Link href="/contact">
              <button className="w-full py-6 border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 rounded-lg transition-colors duration-200 font-medium">
                Contact Technician
              </button>
            </Link>
            <button className="w-full py-6 border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 rounded-lg transition-colors duration-200 font-medium">
              Learn about Common Issues
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
