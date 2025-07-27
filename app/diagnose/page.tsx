// app/diagnose/page.tsx
"use client";

import React, { useState } from "react";
import { Container } from "@mui/material";
import PageHeader from "@/components/Header";
import DiagnosisForm from "@/components/DiagnoseForm";
import DiagnosisResult from "../../components/DiagnosisResult";
import { DiagnosisResponse } from "../../types";
import { useRouter } from "next/navigation";

export default function DiagnosePage() {
  const [diagnosis, setDiagnosis] = useState<DiagnosisResponse | null>(null);
  const router = useRouter();

  const handleDiagnosisComplete = (response: DiagnosisResponse) => {
    setDiagnosis(response);
    // Save to local storage for history
    const history = JSON.parse(
      localStorage.getItem("diagnosisHistory") || "[]"
    );
    history.unshift({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      response,
    });
    localStorage.setItem(
      "diagnosisHistory",
      JSON.stringify(history.slice(0, 10))
    );
  };

  const handleNewDiagnosis = () => {
    setDiagnosis(null);
  };

  const handleContactTechnician = () => {
    router.push("/contact");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      <Container maxWidth="lg" className="py-12">
        {diagnosis ? (
          <DiagnosisResult
            diagnosis={diagnosis}
            onNewDiagnosis={handleNewDiagnosis}
            onContactTechnician={handleContactTechnician}
          />
        ) : (
          <DiagnosisForm onDiagnosisComplete={handleDiagnosisComplete} />
        )}
      </Container>
    </div>
  );
}
