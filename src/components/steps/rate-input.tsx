
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
      tapSound.play();
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Measure Respiration</CardTitle>
        <CardDescription>
          Count breaths for one minute and enter the value below, use the tap counter, or connect a sensor.
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
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-4 text-center flex flex-col items-center"
                >
                  <MemoizedCircularProgress progress={(timer / 60) * 100}>
                      <span className="text-3xl font-bold">{timer}</span>
                      <span className="text-sm text-muted-foreground">seconds</span>
                  </MemoizedCircularProgress>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                  >
                    <Button type="button" variant="secondary" className="w-full h-24 text-2xl" onClick={handleTapCount}>
                        <Hand className="mr-2" /> Tap here ({tapCount})
                    </Button>
                  </motion.div>
                  <Button type="button" variant="ghost" size="sm" onClick={resetCounter}>Cancel</Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="respirationRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Respiration Rate (breaths per minute)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 16" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="outline" className="w-full" onClick={handleTapCount} disabled={isConnecting}>
                      <Hand /> Tap to Count
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" variant="secondary" className="w-full" disabled={isConnecting}>
                        {isConnecting ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Zap />
                        )}
                        {isConnecting ? "Connecting..." : "Connect to Respiration Sensor"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Connect Sensor</DialogTitle>
                        <DialogDescription>
                          Choose your connection method to sync the respiration sensor.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <DialogClose asChild>
                          <Button variant="outline" onClick={handleConnectSensor}>
                            <Wifi className="mr-2" /> Connect with WiFi
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button variant="outline" onClick={handleConnectSensor}>
                            <Bluetooth className="mr-2" /> Connect with Bluetooth
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
             <Button type="submit" className="w-full" disabled={isPending || isCounting}>
              {isPending && <Loader2 className="animate-spin" />}
              {isPending ? "Generating Report..." : "Get Report"}
            </Button>
            <Button type="button" variant="outline" onClick={onBack} className="w-full" disabled={isPending || isCounting}>Back</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default memo(RateInput);
