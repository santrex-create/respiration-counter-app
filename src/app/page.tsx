"use client";

import { useState, useCallback, useTransition, useMemo, useEffect } from "react";
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
import { Activity } from "lucide-react";

type Step = "info" | "conditions" | "rate" | "results" | "past-sessions";

const createMockSession = (daysAgo: number, age: number, rr: number): SavedSession => ({
  id: uuidv4(),
  patientData: {
    age,
    gender: "Male",
    weight: 75,
    activityLevel: "moderate",
    bodyPosture: "sitting",
    stressLevel: "low",
    hydrationStatus: "well_hydrated",
    respirationRate: rr,
  },
  analysisResult: {
    analysis: {
      analysis: `Respiration rate of ${rr} BPM is optimal for age group ${age}.`,
      recommendations: "Continue current lifestyle balance.",
      routine: "1. 20m morning walk, 2. Hydration intervals, 3. Breath work.",
    },
    advice: {
      advice: "Stable respiratory rhythm detected.",
    },
  },
  savedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
});

export default function Home() {
  const [step, setStep] = useState<Step>("info");
  const [formData, setFormData] = useState<Partial<PatientData>>({});
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);

  useEffect(() => {
    setSavedSessions([
      createMockSession(2, 28, 16),
      createMockSession(5, 28, 14),
      createMockSession(10, 28, 18),
    ]);
  }, []);

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
          title: "System Error",
          description: result.error || "Neural link failed. Try again.",
        });
      }
    });
  }, [formData, toast]);

  const handleSaveSession = useCallback(() => {
    if (formData && analysisResult) {
      const newSession: SavedSession = {
        id: uuidv4(),
        patientData: formData as PatientData,
        analysisResult: analysisResult,
        savedAt: new Date(),
      };
      setSavedSessions((prev) => [newSession, ...prev]);
      toast({
        title: "Session Archived",
        description: "Data successfully committed to memory.",
      });
    }
  }, [formData, analysisResult, toast]);

  const renderStep = () => {
    const variants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };

    switch (step) {
      case "info":
        return <motion.div key="info" {...variants}><PatientInfoForm onNext={handleNext} defaultValues={formData} /></motion.div>;
      case "conditions":
        return <motion.div key="conditions" {...variants}><ConditionsChecklist onNext={handleNext} onBack={handleBack} defaultValues={formData} /></motion.div>;
      case "rate":
        return <motion.div key="rate" {...variants}><RateInput onAnalyze={handleAnalysis} onBack={handleBack} defaultValues={formData} isPending={isPending} /></motion.div>;
      case "results":
        return <motion.div key="results" {...variants}><ResultsDisplay result={analysisResult!} patientData={formData as PatientData} onReset={() => setStep("info")} onSave={handleSaveSession} /></motion.div>;
      case "past-sessions":
        return <motion.div key="past-sessions" {...variants}><PastSessions sessions={savedSessions} onBack={() => setStep("info")} /></motion.div>;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/1920/1080')] opacity-[0.05] grayscale mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-20" />
      
      <div className="w-full max-w-xl z-10">
        <header className="mb-12 text-center">
          {step === "info" ? (
            <div className="flex flex-row items-center justify-center gap-3">
              <Activity className="w-10 h-10 text-accent animate-pulse" />
              <h1 className="text-3xl font-mono font-bold tracking-tighter uppercase">
                Respiration <span className="text-accent">Counter</span>
              </h1>
            </div>
          ) : (
            <Logo />
          )}
        </header>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {step === "info" && savedSessions.length > 0 && (
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              onClick={() => setStep("past-sessions")}
              className="border-accent/30 text-accent hover:bg-accent/10 font-mono text-xs uppercase tracking-widest"
            >
              Access Archives
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}