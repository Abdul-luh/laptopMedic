// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { motion } from "framer-motion";


export default function HomePage() {
  const [isWakingUp, setIsWakingUp] = useState(true);

  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!apiBaseUrl) {
          console.warn("NEXT_PUBLIC_API_BASE_URL not found in environment variables");
          setIsWakingUp(false);
          return;
        }

        // Make a simple GET request to wake up the backend
        await fetch(`${apiBaseUrl}/`, {
          method: 'GET',
          // Set a reasonable timeout for the wake-up request
          signal: AbortSignal.timeout(30000), // 30 seconds
        });
        
        console.log("Backend wake-up request sent successfully");
      } catch (error) {
        console.log("Backend wake-up request completed (this is expected for sleeping services):", error);
      } finally {
        setIsWakingUp(false);
      }
    };

    wakeUpBackend();
  }, []);

  const { 
  // handleStartDiagnosis, 
  isLoading, 
  isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {isWakingUp && (
        <div className="fixed top-24 right-4 bg-blue-100 border border-[#2218DE] text-[#2218DE] px-3 py-2 rounded-lg z-50 shadow-lg animate-pulse">
          Waking up backend service...
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center flex flex-col justify-center items-center mb-16 min-h-[75vh] md:min-h-[40vh]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-[#2218DE] mb-6">
            Is your laptop acting up?
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Run a quick diagnosis to get expert help immediately
          </motion.p>
          <motion.div variants={itemVariants}>
             {isAuthenticated ? (
              <Link
                href="/diagnose"
                className="bg-[#2218DE] hover:bg-[#2218DE]/80 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-8 py-4 text-lg rounded-full transition-colors duration-200 font-medium"
              >
                Start Diagnosis
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-[#2218DE] hover:bg-[#2218DE]/80 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-8 py-4 text-lg rounded-full transition-colors duration-200 font-medium"
              >
                Sign In to Start Diagnosis
              </Link>
            )}
          </motion.div>
        </motion.div>

        
{/* Feature Cards */}
<motion.div
  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
>
  {/* AI-Powered Diagnosis */}
  <motion.div variants={itemVariants} className="border-[#2218DE] border-2 p-8 rounded-lg hover:shadow-lg transition-shadow duration-200 h-full bg-white">
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <Image
          src="/illustrations/prev-illustration.svg"
          alt="AI-Powered Diagnosis Illustration"
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-xl font-bold text-[#2218DE] mb-4">
        AI-Powered Diagnosis
      </h3>
      <p className="text-gray-900">
        Our advanced AI analyzes your laptop issues and provides
        accurate diagnoses with step-by-step solutions.
      </p>
    </div>
  </motion.div>

  {/* Contact Technician */}
  <motion.div variants={itemVariants} className="border-[#2218DE] border-2 p-8 rounded-lg hover:shadow-lg transition-shadow duration-200 h-full bg-white">
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <Image
          src="/illustrations/contact-illustration.svg"
          alt="Contact Technician Illustration"
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-xl font-bold text-[#2218DE] mb-4">
        Contact Technician
      </h3>
      <p className="text-gray-900">
        Need professional help? Connect with certified technicians who
        can provide expert assistance and repairs.
      </p>
    </div>
  </motion.div>

  {/* Learn about Common Issues */}
  <motion.div variants={itemVariants} className="border-[#2218DE] border-2 p-8 rounded-lg hover:shadow-lg transition-shadow duration-200 h-full bg-white">
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <Image
          src="/illustrations/common-issues-illustration.svg"
          alt="Common Issues Illustration"
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-xl font-bold text-[#2218DE] mb-4">
        Learn about Common Issues
      </h3>
      <p className="text-gray-900">
        Browse our knowledge base to learn about common laptop problems
        and preventive maintenance tips.
      </p>
    </div>
  </motion.div>
</motion.div>


        {/* Quick Actions */}
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-8 text-[#2218DE]">
            Quick Actions
          </motion.h2>
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </motion.div>
        </motion.div>


      </div>
        {/* Footer */}
        <footer className="bg-[#2218DE] w-full text-white py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="mb-4 md:mb-0">
                <Link href="/" className="text-2xl font-bold">
                  Laptop Medic
                </Link>
              </div>
              <nav className="flex flex-wrap justify-center space-x-6">
                <Link href="/about" className="hover:text-blue-200 transition-colors">
                  About
                </Link>
                <Link href="/contact" className="hover:text-blue-200 transition-colors">
                  Contact
                </Link>
                <Link href="/privacy" className="hover:text-blue-200 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-blue-200 transition-colors">
                  Terms of Service
                </Link>
              </nav>
            </div>
            <p className="text-sm text-blue-100">
              &copy; {new Date().getFullYear()} Laptop Medic. All rights reserved.
            </p>
          </div>
        </footer>
    </div>
  );
}