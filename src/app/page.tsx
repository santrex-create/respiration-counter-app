"use client";

import { useState, useCallback, useTransition } from "react";
import type { PatientData, SavedSession, AnalysisResult } from "@/lib/types";
import { getAnalysis } from "@/lib/actions";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

import PatientInfoForm from "@/components/steps/patient-info-form";
import ConditionsChecklist from "@/components/steps/conditions-checklist";
import RateInput from "@/components/steps/rate-input";
import ResultsDisplay from "@/components/steps/results-display";
import Logo from "@/components/logo";
import PastSessions from "@/components/steps/past-sessions";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

type Step = "info" | "conditions" | "rate" | "results" | "past-sessions";

export default function Home() {
  const [step, setStep] = useState<Step>("info");
  const [formData, setFormData] = useState<Partial<PatientData>>({});
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleNext = useCallback((data: Partial<PatientData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    if (step === "info") setStep("conditions");
    if (step === "conditions") setStep("rate");
  }, [step]);

  const handleBack = useCallback(() => {
    if (step === "conditions") setStep("info");
    if (step === "rate") setStep("conditions");
    if (step === "results") setStep("rate");
  }, [step]);

  const handleAnalysis = useCallback((data: Partial<PatientData>) => {
    const completeData = { ...formData, ...data } as PatientData;
    setFormData(completeData);

    startTransition(async () => {
      const result = await getAnalysis(completeData);
      if (result.success && result.data) {
        setAnalysisResult(result.data);
        setStep("results");
      } else {
        toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: result.error || "An unknown error occurred.",
        });
      }
    });
  }, [formData, toast]);
  
  const handleViewPastSessions = () => {
    setStep("past-sessions");
  };

  const handleExitPastSessions = () => {
    setStep("info");
  }

  const handleSaveSession = useCallback(() => {
    if (formData && analysisResult) {
      const newSession: SavedSession = {
        id: uuidv4(),
        patientData: formData as PatientData,
        analysisResult: analysisResult,
        savedAt: new Date(),
      };
      setSavedSessions((prev) => [...prev, newSession]);
      toast({
        title: "Session Saved",
        description: "The current session has been saved.",
      });
    }
  }, [formData, analysisResult, toast]);
  
  const handleReset = useCallback(() => {
    setStep("info");
    setFormData({});
    setAnalysisResult(null);
  }, []);

  const renderStep = () => {
    switch (step) {
      case "info":
        return <PatientInfoForm onNext={handleNext} defaultValues={formData} />;
      case "conditions":
        return <ConditionsChecklist onNext={handleNext} onBack={handleBack} defaultValues={formData} />;
      case "rate":
        return <RateInput onAnalyze={handleAnalysis} onBack={handleBack} defaultValues={formData} isPending={isPending} />;
      case "results":
        return analysisResult && <ResultsDisplay result={analysisResult} onReset={handleReset} onSave={handleSaveSession} patientData={formData as PatientData} />;
      case "past-sessions":
        return <PastSessions sessions={savedSessions} onBack={handleExitPastSessions} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background selection:bg-primary selection:text-primary-foreground">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-8">
          <Logo />
        </header>
        
        {step === 'info' && savedSessions.length > 0 && (
          <div className="text-center mb-6">
            <Button variant="outline" onClick={handleViewPastSessions}>View Past Sessions</Button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
