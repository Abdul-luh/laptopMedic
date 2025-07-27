// lib/ai-diagnosis.ts
import { DiagnosisRequest, DiagnosisResponse } from "../types/index";

const knowledgeBase = {
  overheating: {
    causes: [
      "Dust buildup in cooling system",
      "Thermal paste degradation",
      "Blocked air vents",
      "Heavy CPU/GPU usage",
      "Ambient temperature too high",
    ],
    solutions: [
      "Clean internal fans and heat sinks",
      "Apply new thermal paste",
      "Use laptop on hard, flat surface",
      "Close unnecessary programs",
      "Use cooling pad",
      "Check for malware",
    ],
    tools: [
      "Compressed air",
      "Thermal paste",
      "Screwdriver set",
      "Cooling pad",
    ],
  },
  freezing: {
    causes: [
      "Insufficient RAM",
      "Hard drive failure",
      "Overheating CPU",
      "Corrupted system files",
      "Malware infection",
    ],
    solutions: [
      "Run memory diagnostic test",
      "Check hard drive health",
      "Update device drivers",
      "Run system file checker",
      "Perform malware scan",
      "Consider RAM upgrade",
    ],
    tools: ["System diagnostic tools", "Antivirus software"],
  },
  slowSpeed: {
    causes: [
      "Too many startup programs",
      "Insufficient storage space",
      "Fragmented hard drive",
      "Outdated hardware",
      "Background processes",
    ],
    solutions: [
      "Disable unnecessary startup programs",
      "Free up disk space",
      "Defragment hard drive",
      "Upgrade to SSD",
      "Add more RAM",
      "Update operating system",
    ],
    tools: ["Disk cleanup utility", "Defragmentation tool"],
  },
  blueScreen: {
    causes: [
      "Hardware failure",
      "Driver conflicts",
      "Memory issues",
      "System file corruption",
      "Overheating",
    ],
    solutions: [
      "Update all drivers",
      "Run memory test",
      "Check system logs",
      "Boot in safe mode",
      "System restore",
      "Hardware diagnostics",
    ],
    tools: ["System diagnostic tools", "Driver update software"],
  },
  notBooting: {
    causes: [
      "Power supply failure",
      "Hard drive failure",
      "RAM failure",
      "Motherboard issues",
      "BIOS corruption",
    ],
    solutions: [
      "Check power adapter and battery",
      "Test with minimal hardware",
      "Reset BIOS settings",
      "Boot from external drive",
      "Professional hardware diagnosis",
      "Consider data recovery",
    ],
    tools: ["Multimeter", "External boot drive", "Hardware diagnostic tools"],
  },
};

export function generateDiagnosis(
  request: DiagnosisRequest
): DiagnosisResponse {
  const category = request.issueCategory.toLowerCase().replace(" ", "");
  const knowledge = knowledgeBase[category as keyof typeof knowledgeBase];

  if (!knowledge) {
    return {
      problem: "General Laptop Issue",
      cause:
        "Unable to determine specific cause. Multiple factors could be involved.",
      solution: [
        "Restart your laptop",
        "Update all drivers",
        "Run system diagnostics",
        "Contact technical support if issues persist",
      ],
      estimatedTime: "30-60 minutes",
      difficulty: "medium",
      requiredTools: ["Basic diagnostic tools"],
      warningLevel: "warning",
      additionalTips: ["Always backup your data before attempting repairs"],
    };
  }

  const urgencyMultiplier =
    request.urgency === "high" ? 1.5 : request.urgency === "medium" ? 1.2 : 1;
  const baseTime = 45;
  const estimatedMinutes = Math.round(baseTime * urgencyMultiplier);

  return {
    problem: `${request.issueCategory} Issue`,
    cause:
      knowledge.causes[Math.floor(Math.random() * knowledge.causes.length)],
    solution: knowledge.solutions.slice(0, 4),
    estimatedTime: `${estimatedMinutes}-${estimatedMinutes + 30} minutes`,
    difficulty:
      request.symptoms.length > 3
        ? "hard"
        : request.symptoms.length > 1
        ? "medium"
        : "easy",
    requiredTools: knowledge.tools,
    warningLevel:
      request.urgency === "high"
        ? "error"
        : request.urgency === "medium"
        ? "warning"
        : "info",
    additionalTips: [
      "Always backup important data before repairs",
      "Work in a static-free environment",
      "If unsure, consult a professional technician",
    ],
  };
}
