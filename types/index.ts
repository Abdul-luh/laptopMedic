// types/index.ts
export interface DiagnosisRequest {
  brand: string;
  issueCategory: string;
  symptoms: string[];
  description: string;
  urgency: "low" | "medium" | "high";
}

export interface DiagnosisResponse {
  problem: string;
  cause: string;
  solution: string[];
  estimatedTime: string;
  difficulty: "easy" | "medium" | "hard";
  requiredTools: string[];
  warningLevel: "info" | "warning" | "error";
  additionalTips: string[];
}

export interface UserHistory {
  id: string;
  timestamp: Date;
  request: DiagnosisRequest;
  response: DiagnosisResponse;
}
