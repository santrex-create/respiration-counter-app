"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RateSchema, PatientData } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Zap, Hand, Wifi, Bluetooth } from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { AnimatePresence, motion } from "framer-motion";

type RateInputProps = {
  onAnalyze: (data: z.infer<typeof RateSchema>) => void;
  onBack: () => void;
  defaultValues?: Partial<PatientData>;
  isPending: boolean;
};

const MemoizedCircularProgress = memo(CircularProgress);

function RateInput({ onAnalyze, onBack, defaultValues, isPending }: RateInputProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCounting, setIsCounting] = useState(false);
  const [timer, setTimer] = useState(60);
  const [tapCount, setTapCount] = useState(0);
  const [tapSound, setTapSound] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("https://cdn.pixabay.com/download/audio/2021/08/04/audio_c668156e33.mp3?filename=mouse-click-153941.mp3");
    audio.preload = "auto";
    setTapSound(audio);
  }, []);

  const form = useForm<z.infer<typeof RateSchema>>({
    resolver: zodResolver(RateSchema),
    defaultValues: {
      respirationRate: defaultValues?.respirationRate,
    },
  });

  const handleConnectSensor = () => {
    setIsConnecting(true);
    setTimeout(() => {
      const randomRate = Math.floor(Math.random() * (22 - 12 + 1)) + 12;
      form.setValue("respirationRate", randomRate);
      setIsConnecting(false);
    }, 2000);
  };
  
  const handleTapCount = useCallback(() => {
    if (tapSound) {
      tapSound.currentTime = 0;
      tapSound.play().catch(() => {});
    }
    if (!isCounting) {
      setIsCounting(true);
      setTapCount(1);
      setTimer(60);
    } else {
      setTapCount((prev) => prev + 1);
    }
  }, [isCounting, tapSound]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCounting) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval!);
            setIsCounting(false);
            form.setValue("respirationRate", tapCount);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCounting, tapCount, form]);
  
  const resetCounter = () => {
    setIsCounting(false);
    setTimer(60);
    setTapCount(0);
  }

  return (
    <Card className="w-full bg-slate-900/50 border-accent/20 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="font-mono uppercase tracking-widest text-accent">Measure Vitals</CardTitle>
        <CardDescription>
          Execute manual count or initiate neural sensor uplink.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onAnalyze)}>
          <CardContent className="space-y-4">
             <AnimatePresence mode="wait">
              {isCounting ? (
                <motion.div
                  key="counting"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6 text-center flex flex-col items-center"
                >
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer relative"
                    onClick={handleTapCount}
                  >
                    <div className="absolute inset-0 bg-accent/5 rounded-full animate-ping" />
                    <MemoizedCircularProgress progress={(timer / 60) * 100}>
                        <span className="text-4xl font-mono font-bold text-accent">{timer}</span>
                        <span className="text-[10px] uppercase font-mono text-muted-foreground">s remaining</span>
                    </MemoizedCircularProgress>
                  </motion.div>
                  <Button type="button" variant="secondary" className="w-full h-24 text-2xl font-mono border-accent/20 bg-accent/5 hover:bg-accent/10" onClick={handleTapCount}>
                        <Hand className="mr-2 text-accent" /> TAP: {tapCount}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={resetCounter} className="text-[10px] uppercase tracking-widest">Abort Measurement</Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="respirationRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase text-muted-foreground">RR (breaths/min)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter value..." {...field} value={field.value ?? ''} className="bg-slate-950 border-accent/20 font-mono text-accent" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-2">
                    <Button type="button" variant="outline" className="w-full border-accent/20 font-mono text-xs uppercase" onClick={handleTapCount} disabled={isConnecting}>
                        <Hand className="mr-2 w-4 h-4" /> Start Tap Counter
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button type="button" variant="secondary" className="w-full bg-accent/10 text-accent border border-accent/20 font-mono text-xs uppercase" disabled={isConnecting}>
                          {isConnecting ? <Loader2 className="animate-spin mr-2" /> : <Zap className="mr-2" />}
                          {isConnecting ? "Initiating Uplink..." : "Connect Neural Sensor"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-accent/20">
                        <DialogHeader>
                          <DialogTitle className="font-mono uppercase text-accent">Protocol Selection</DialogTitle>
                          <DialogDescription>
                            Select transmission frequency for sensor integration.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                          <DialogClose asChild>
                            <Button variant="outline" onClick={handleConnectSensor} className="font-mono text-xs uppercase">
                              <Wifi className="mr-2 w-4 h-4 text-accent" /> WiFi Protocol
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button variant="outline" onClick={handleConnectSensor} className="font-mono text-xs uppercase">
                              <Bluetooth className="mr-2 w-4 h-4 text-accent" /> Bluetooth Mesh
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
             <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-mono uppercase tracking-widest" disabled={isPending || isCounting}>
              {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
              {isPending ? "Analyzing Data..." : "Generate Analysis"}
            </Button>
            <Button type="button" variant="ghost" onClick={onBack} className="w-full text-xs font-mono uppercase tracking-widest" disabled={isPending || isCounting}>Return</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default memo(RateInput);