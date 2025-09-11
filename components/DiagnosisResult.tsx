import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Lightbulb,
  CheckCircle2,
  Download,
  Phone,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Monitor,
} from "lucide-react";

// Updated types based on actual data structure
interface Step {
  id: number;
  step_number: number;
  instruction: string;
  completed: boolean;
}

interface DiagnosisData {
  id: number;
  laptop_brand: string;
  laptop_model: string;
  description: string;
  created_at: string;
  solved: boolean;
  steps: Step[];
}

interface DiagnosisResultProps {
  diagnosis?: DiagnosisData;
  onNewDiagnosis: () => void;
  onContactTechnician: () => void;
  onStepToggle?: (stepId: number, completed: boolean) => void;
}

export default function DiagnosisResult({
  diagnosis,
  onNewDiagnosis,
  onContactTechnician,
  onStepToggle,
}: DiagnosisResultProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showTips, setShowTips] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  // Mock diagnosis data for demo (matching your actual structure)
  const mockDiagnosis: DiagnosisData = {
    id: 18,
    laptop_brand: "Dell",
    laptop_model: "XPS 15",
    description: "goes off abruptly",
    created_at: "2025-09-11T03:33:49.438967",
    solved: false,
    steps: [
      {
        id: 217,
        step_number: 1,
        instruction:
          "**a.** Make sure the power adapter is securely plugged into both the laptop and wall outlet. Try a different wall outlet to rule out a power issue.",
        completed: false,
      },
      {
        id: 218,
        step_number: 2,
        instruction:
          "**b.** Inspect the power adapter cable and connector for any visible damage (bent pins, frayed wires). If you see damage, replace the adapter.",
        completed: false,
      },
      {
        id: 219,
        step_number: 3,
        instruction:
          "**a.** If your laptop is running on battery power, check if the issue persists. If it does not, the battery might be faulty.",
        completed: false,
      },
      {
        id: 220,
        step_number: 4,
        instruction:
          "**b.** If possible, try running the laptop on a different (known good) battery (if you have a spare).",
        completed: false,
      },
      {
        id: 221,
        step_number: 5,
        instruction:
          "Simply try restarting your XPS 15. Sometimes a simple restart resolves temporary glitches.",
        completed: false,
      },
      {
        id: 222,
        step_number: 6,
        instruction:
          "Feel the bottom and sides of your laptop. If it feels very hot, overheating may be the cause. Ensure proper ventilation and avoid using it on soft surfaces like beds or blankets.",
        completed: false,
      },
    ],
  };

  const currentDiagnosis = diagnosis || mockDiagnosis;

  useEffect(() => {
    // Initialize completed steps from data
    const initialCompleted = new Set(
      currentDiagnosis.steps
        .filter((step) => step.completed)
        .map((step) => step.id)
    );
    setCompletedSteps(initialCompleted);

    // Animation delay for entrance
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [currentDiagnosis]);

  const toggleStepCompletion = (stepId: number) => {
    const newCompleted = new Set(completedSteps);
    const isCompleted = newCompleted.has(stepId);

    if (isCompleted) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);

    // Call parent callback if provided
    if (onStepToggle) {
      onStepToggle(stepId, !isCompleted);
    }
  };

  // Determine severity based on description and steps count
  const getSeverityLevel = () => {
    const description = currentDiagnosis.description.toLowerCase();
    const stepsCount = currentDiagnosis.steps.length;

    if (
      description.includes("abruptly") ||
      description.includes("crash") ||
      description.includes("dead") ||
      stepsCount > 20
    ) {
      return "error";
    } else if (
      description.includes("slow") ||
      description.includes("hot") ||
      stepsCount > 10
    ) {
      return "warning";
    }
    return "info";
  };

  const getAlertConfig = () => {
    const severity = getSeverityLevel();
    switch (severity) {
      case "error":
        return {
          color: "from-red-50 to-red-100 border-red-300",
          textColor: "text-red-900",
          icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
          bgAccent: "bg-red-600",
          statusText: "Critical Issue",
        };
      case "warning":
        return {
          color: "from-amber-50 to-orange-100 border-amber-300",
          textColor: "text-amber-900",
          icon: <AlertCircle className="w-8 h-8 text-amber-600" />,
          bgAccent: "bg-amber-600",
          statusText: "Warning",
        };
      default:
        return {
          color: "from-blue-50 to-purple-100 border-blue-300",
          textColor: "text-blue-900",
          icon: <Info className="w-8 h-8" style={{ color: "#2218DE" }} />,
          bgAccent: "bg-blue-600",
          statusText: "Diagnostic",
        };
    }
  };

  const getDifficultyConfig = () => {
    const stepsCount = currentDiagnosis.steps.length;
    if (stepsCount <= 5) {
      return {
        level: "Easy Fix",
        color: "bg-green-100 text-green-800 border-green-300",
        icon: "🟢",
      };
    } else if (stepsCount <= 15) {
      return {
        level: "Moderate",
        color: "bg-amber-100 text-amber-800 border-amber-300",
        icon: "🟡",
      };
    } else {
      return {
        level: "Advanced",
        color: "bg-red-100 text-red-800 border-red-300",
        icon: "🔴",
      };
    }
  };

  const getEstimatedTime = () => {
    const stepsCount = currentDiagnosis.steps.length;
    if (stepsCount <= 5) return "10-20 minutes";
    if (stepsCount <= 15) return "30-45 minutes";
    return "1-2 hours";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Process instruction text to remove markdown and clean it up
  const processInstruction = (instruction: string) => {
    return instruction
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
      .replace(/^\*\*(.*?)\*\*\s*/, "$1 ") // Clean up start
      .trim();
  };

  const alertConfig = getAlertConfig();
  const difficultyConfig = getDifficultyConfig();
  const completionPercentage =
    (completedSteps.size / currentDiagnosis.steps.length) * 100;

  if (!currentDiagnosis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Diagnosis Available
          </h2>
          <p className="text-gray-600 mb-6">
            Start a new diagnosis to get personalized troubleshooting steps.
          </p>
          <button
            onClick={onNewDiagnosis}
            className="text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: "#2218DE" }}
          >
            Start New Diagnosis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: "#2218DE" }}
            >
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Laptop Medic</h1>
              <p className="text-gray-600 text-sm">
                Diagnostic Report #{currentDiagnosis.id}
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <span
              className="hover:text-blue-600 cursor-pointer transition-colors"
              style={{ color: "#2218DE" }}
            >
              Home
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              History
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Contact
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Account
            </span>
          </div>
        </div>

        {/* Device Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {currentDiagnosis.laptop_brand} {currentDiagnosis.laptop_model}
              </h2>
              <p className="text-gray-600 capitalize text-lg">
                Issue: {currentDiagnosis.description}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Created: {formatDate(currentDiagnosis.created_at)}
              </p>
            </div>
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentDiagnosis.solved
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {currentDiagnosis.solved ? "✅ Resolved" : "⏳ In Progress"}
            </div>
          </div>
        </div>

        {/* Main Alert Card */}
        <div
          className={`bg-gradient-to-r ${
            alertConfig.color
          } border-2 rounded-2xl p-6 shadow-lg ${
            isAnimating ? "animate-pulse" : ""
          }`}
        >
          <div className="flex items-start space-x-4">
            <div
              className={`p-3 rounded-full shadow-lg`}
              style={{ backgroundColor: "#2218DE" }}
            >
              {alertConfig.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full animate-pulse"
                  style={{ backgroundColor: "#2218DE" }}
                ></div>
                <span
                  className="text-sm font-medium uppercase tracking-wide"
                  style={{ color: "#2218DE" }}
                >
                  {alertConfig.statusText}
                </span>
              </div>
              <h2
                className={`text-2xl font-bold ${alertConfig.textColor} mb-3`}
              >
                System diagnostic for {currentDiagnosis.laptop_brand}{" "}
                {currentDiagnosis.laptop_model}
              </h2>
              <p className={`${alertConfig.textColor} text-lg leading-relaxed`}>
                Your laptop {currentDiagnosis.description}. We`ve identified{" "}
                {currentDiagnosis.steps.length} troubleshooting steps to resolve
                this issue.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8" style={{ color: "#2218DE" }} />
              <div>
                <p className="text-sm text-gray-600">Estimated Time</p>
                <p className="text-lg font-semibold text-gray-800">
                  {getEstimatedTime()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200">
            <div className="flex items-center space-x-3">
              <Lightbulb className="w-8 h-8 text-amber-500" />
              <div>
                <p className="text-sm text-gray-600">Difficulty</p>
                <p className="text-lg font-semibold text-gray-800">
                  {difficultyConfig.icon} {difficultyConfig.level}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-lg font-semibold text-gray-800">
                  {completedSteps.size}/{currentDiagnosis.steps.length} Steps
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Repair Progress
            </h3>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${completionPercentage}%`,
                background: `linear-gradient(90deg, #2218DE, #6B46C1)`,
              }}
            ></div>
          </div>
        </div>

        {/* Solution Steps */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold flex items-center text-gray-800">
              <CheckCircle2 className="w-6 h-6 mr-3 text-green-600" />
              Troubleshooting Steps ({currentDiagnosis.steps.length})
            </h3>
          </div>

          <div className="p-6 space-y-4">
            {currentDiagnosis.steps.map((step) => {
              const isCompleted = completedSteps.has(step.id);
              const isExpanded = expandedStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`border-2 rounded-xl transition-all duration-200 ${
                    isCompleted
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-gray-50 hover:bg-blue-50"
                  }`}
                  style={{
                    borderColor: isCompleted ? "" : isExpanded ? "#2218DE" : "",
                  }}
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStepCompletion(step.id);
                        }}
                        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:bg-blue-50"
                        }`}
                        style={{
                          borderColor: !isCompleted ? "#2218DE" : "",
                          color: !isCompleted ? "#2218DE" : "",
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-bold">
                            {step.step_number}
                          </span>
                        )}
                      </button>

                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            isCompleted
                              ? "text-green-800 line-through"
                              : "text-gray-800"
                          }`}
                        >
                          {processInstruction(step.instruction)}
                        </p>
                        {isExpanded && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600">
                              💡 <strong>Tip:</strong> Take your time with this
                              step and ensure you have the necessary tools
                              before starting.
                              {step.step_number <= 5 &&
                                " This is a basic troubleshooting step that's safe for most users."}
                            </p>
                          </div>
                        )}
                      </div>

                      <button className="flex-shrink-0 p-1">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowTips(!showTips)}
            className="w-full p-4 text-left hover:bg-amber-50 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-amber-800 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Important Safety Notes
              </h4>
              {showTips ? (
                <ChevronUp className="w-5 h-5 text-amber-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-amber-600" />
              )}
            </div>
          </button>

          {showTips && (
            <div className="px-4 pb-4">
              <ul className="space-y-2">
                <li className="flex items-start space-x-2 text-sm text-amber-700">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    Always shut down your laptop completely before performing
                    any hardware-related troubleshooting
                  </span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-amber-700">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    If you`re uncomfortable with any step, contact a
                    professional technician
                  </span>
                </li>
                <li className="flex items-start space-x-2 text-sm text-amber-700">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    Back up important data before attempting any major system
                    changes
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onNewDiagnosis}
            className="text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            style={{ backgroundColor: "#2218DE" }}
          >
            <RefreshCw className="w-5 h-5" />
            <span>New Diagnosis</span>
          </button>

          <button
            onClick={onContactTechnician}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
          >
            <Phone className="w-5 h-5" />
            <span>Contact a Technician</span>
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg">
            <Download className="w-5 h-5" />
            <span>Download Report</span>
          </button>
        </div>

        {/* Decorative Element */}
        <div className="hidden lg:block fixed right-8 top-1/2 transform -translate-y-1/2 opacity-10">
          <div className="relative">
            <div
              className="w-32 h-32 border-4 rounded-lg transform rotate-45"
              style={{ borderColor: "#2218DE" }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Monitor className="w-8 h-8" style={{ color: "#2218DE" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
