"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
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

const createInitialSession = (daysAgo: number, age: number, rr: number): SavedSession => ({
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
      analysis: `Neural analysis indicates respiration rate of ${rr} BPM is optimal for age group ${age}.`,
      recommendations: "Maintain current physiological equilibrium.",
      routine: "1. 20m morning walk, 2. Optimized hydration, 3. Breath control.",
    },
    advice: {
      advice: "Stable physiological rhythm detected.",
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
    // Initialize with professional baseline records
    setSavedSessions([
      createInitialSession(2, 28, 16),
      createInitialSession(5, 28, 14),
      createInitialSession(10, 28, 18),
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
          title: "System Latency",
          description: result.error || "Uplink failed. Please retry neural connection.",
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
        title: "Telemetry Committed",
        description: "Diagnostic session successfully archived to core memory.",
      });
    }
  }, [formData, analysisResult, toast]);

  const renderStep = () => {
    const variants = {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.98 }
    };

    switch (step) {
      case "info":
        return <motion.div key="info" {...variants} transition={{ duration: 0.2 }}><PatientInfoForm onNext={handleNext} defaultValues={formData} /></motion.div>;
      case "conditions":
        return <motion.div key="conditions" {...variants} transition={{ duration: 0.2 }}><ConditionsChecklist onNext={handleNext} onBack={handleBack} defaultValues={formData} /></motion.div>;
      case "rate":
        return <motion.div key="rate" {...variants} transition={{ duration: 0.2 }}><RateInput onAnalyze={handleAnalysis} onBack={handleBack} defaultValues={formData} isPending={isPending} /></motion.div>;
      case "results":
        return <motion.div key="results" {...variants} transition={{ duration: 0.2 }}><ResultsDisplay result={analysisResult!} patientData={formData as PatientData} onReset={() => setStep("info")} onSave={handleSaveSession} /></motion.div>;
      case "past-sessions":
        return <motion.div key="past-sessions" {...variants} transition={{ duration: 0.2 }}><PastSessions sessions={savedSessions} onBack={() => setStep("info")} /></motion.div>;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tech/1920/1080')] opacity-[0.03] grayscale mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-30" />
      
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
              className="border-accent/20 text-accent hover:bg-accent/5 font-mono text-[10px] uppercase tracking-[0.2em]"
            >
              Access System Archives
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
