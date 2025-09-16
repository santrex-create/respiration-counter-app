"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RateSchema, PatientData } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Zap, Hand } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Progress } from "@/components/ui/progress";

type RateInputProps = {
  onAnalyze: (data: z.infer<typeof RateSchema>) => void;
  onBack: () => void;
  defaultValues?: Partial<PatientData>;
  isPending: boolean;
};

export default function RateInput({ onAnalyze, onBack, defaultValues, isPending }: RateInputProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCounting, setIsCounting] = useState(false);
  const [timer, setTimer] = useState(60);
  const [tapCount, setTapCount] = useState(0);

  const form = useForm<z.infer<typeof RateSchema>>({
    resolver: zodResolver(RateSchema),
    defaultValues: {
      respirationRate: defaultValues?.respirationRate,
    },
  });

  const handleConnectSensor = () => {
    setIsConnecting(true);
    setTimeout(() => {
      const randomRate = Math.floor(Math.random() * (22 - 12 + 1)) + 12; // Random rate between 12 and 22
      form.setValue("respirationRate", randomRate);
      setIsConnecting(false);
    }, 2000);
  };
  
  const handleTapCount = useCallback(() => {
    if (!isCounting) {
      setIsCounting(true);
      setTapCount(1);
      setTimer(60);
    } else {
      setTapCount((prev) => prev + 1);
    }
  }, [isCounting]);

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
             {isCounting ? (
              <div className="space-y-3 text-center">
                 <Button type="button" variant="secondary" className="w-full h-24 text-2xl" onClick={handleTapCount}>
                    <Hand className="mr-2" /> Tap here ({tapCount})
                </Button>
                <Progress value={(timer / 60) * 100} className="w-full" />
                <p className="text-sm text-muted-foreground">Time remaining: {timer}s</p>
                <Button type="button" variant="ghost" size="sm" onClick={resetCounter}>Cancel</Button>
              </div>
            ) : (
             <>
                <FormField
                  control={form.control}
                  name="respirationRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Respiration Rate (breaths per minute)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 16" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <Button type="button" variant="outline" className="w-full" onClick={handleTapCount} disabled={isConnecting}>
                    <Hand /> Tap to Count
                </Button>
                 <Button type="button" variant="secondary" className="w-full" onClick={handleConnectSensor} disabled={isConnecting}>
                  {isConnecting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Zap />
                  )}
                  {isConnecting ? "Connecting..." : "Connect to Respiration Sensor"}
                </Button>
             </>
            )}

          </CardContent>
          <CardFooter className="flex flex-col gap-4">
             <Button type="submit" className="w-full" disabled={isPending || isCounting}>
              {isPending && <Loader2 className="animate-spin" />}
              {isPending ? "Analyzing..." : "Analyze"}
            </Button>
            <Button type="button" variant="outline" onClick={onBack} className="w-full" disabled={isPending || isCounting}>Back</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
