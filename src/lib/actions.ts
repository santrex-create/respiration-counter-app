"use server";

import { analyzeRespirationRate } from "@/ai/flows/analyze-respiration-rate";
import { getSmartWellbeingAdvice } from "@/ai/flows/get-smart-wellbeing-advice";
import type { PatientData, AnalysisResult } from "./types";

export async function getAnalysis(
  data: PatientData
): Promise<{ success: boolean; data?: AnalysisResult; error?: string }> {
  try {
    // Both AI calls can be made in parallel
    const [analysisResponse, adviceResponse] = await Promise.all([
      analyzeRespirationRate(data),
      getSmartWellbeingAdvice(data),
    ]);

    if (!analysisResponse || !adviceResponse) {
      throw new Error("AI service did not return a valid response.");
    }
    
    return {
      success: true,
      data: {
        analysis: analysisResponse,
        advice: adviceResponse,
      },
    };
  } catch (error) {
    console.error("Error during AI analysis:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during analysis.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
