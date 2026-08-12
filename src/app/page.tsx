"use client";

import { useState, useCallback, useTransition, useMemo } from "react";
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
    setStep((prev) => {
      if (prev === "info") return "conditions";
      if (prev === "conditions") return "rate";
      return prev;
    });
  }, []);

  const handleBack = useCallback(() => {
    setStep((prev) => {
      if (prev === "conditions") return "info";
      if (prev === "rate") return "conditions";
      if (prev === "results") return "rate";
      return prev;
    });
  }, []);

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
          title: "Scan Interrupted",
          description: result.error || "A critical error occurred in the analysis core.",
        });
      }
    });
  }, [formData, toast]);
  
  const handleViewPastSessions = useCallback(() => {
    setStep("past-sessions");
  }, []);

  const handleExitPastSessions = useCallback(() => {
    setStep("info");
  }, []);

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
        title: "Session Committed",
        description: "The data has been archived in local storage.",
      });
    }
  }, [formData, analysisResult, toast]);
  
  const handleReset = useCallback(() => {
    setStep("info");
    setFormData({});
    setAnalysisResult(null);
  }, []);

  const currentStepView = useMemo(() => {
    const variants = {
      initial: { opacity: 0, x: 10, filter: "blur(4px)" },
      animate: { opacity: 1, x: 0, filter: "blur(0px)" },
      exit: { opacity: 0, x: -10, filter: "blur(4px)" }
    };

    switch (step) {
      case "info":
        return <motion.div key="info" {...variants} transition={{ duration: 0.4 }}><PatientInfoForm onNext={handleNext} defaultValues={formData} /></motion.div>;
      case "conditions":
        return <motion.div key="conditions" {...variants} transition={{ duration: 0.4 }}><ConditionsChecklist onNext={handleNext} onBack={handleBack} defaultValues={formData} /></motion.div>;
      case "rate":
        return <motion.div key="rate" {...variants} transition={{ duration: 0.4 }}><RateInput onAnalyze={handleAnalysis} onBack={handleBack} defaultValues={formData} isPending={isPending} /></motion.div>;
      case "results":
        return analysisResult && <motion.div key="results" {...variants} transition={{ duration: 0.4 }}><ResultsDisplay result={analysisResult} onReset={handleReset} onSave={handleSaveSession} patientData={formData as PatientData} /></motion.div>;
      case "past-sessions":
        return <motion.div key="past-sessions" {...variants} transition={{ duration: 0.4 }}><PastSessions sessions={savedSessions} onBack={handleExitPastSessions} /></motion.div>;
      default:
        return null;
    }
  }, [step, formData, handleNext, handleBack, handleAnalysis, isPending, analysisResult, handleReset, handleSaveSession, handleExitPastSessions, savedSessions]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-[#020817] text-slate-200 selection:bg-accent selection:text-accent-foreground">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/1920/1080')] opacity-[0.03] grayscale pointer-events-none" />
      <div className="w-full max-w-md mx-auto relative z-10">
        <header className="text-center mb-12">
          <Logo />
        </header>
        
        {step === 'info' && savedSessions.length > 0 && (
          <div className="text-center mb-6">
            <Button variant="outline" onClick={handleViewPastSessions} className="border-accent/30 text-accent hover:bg-accent/10 font-mono text-[10px] uppercase">
              Access Archives
            </Button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {currentStepView}
        </AnimatePresence>
      </div>
    </main>
  );
}
