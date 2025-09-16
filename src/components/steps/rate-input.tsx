"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RateSchema, PatientData } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Zap } from "lucide-react";
import { useState } from "react";

type RateInputProps = {
  onAnalyze: (data: z.infer<typeof RateSchema>) => void;
  onBack: () => void;
  defaultValues?: Partial<PatientData>;
  isPending: boolean;
};

export default function RateInput({ onAnalyze, onBack, defaultValues, isPending }: RateInputProps) {
  const [isConnecting, setIsConnecting] = useState(false);

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Measure Respiration</CardTitle>
        <CardDescription>
          Count breaths for one minute and enter the value below, or connect a sensor.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onAnalyze)}>
          <CardContent className="space-y-4">
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
             <Button type="button" variant="secondary" className="w-full" onClick={handleConnectSensor} disabled={isConnecting}>
              {isConnecting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Zap />
              )}
              {isConnecting ? "Connecting..." : "Connect to Respiration Sensor"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
             <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              {isPending ? "Analyzing..." : "Analyze"}
            </Button>
            <Button type="button" variant="outline" onClick={onBack} className="w-full" disabled={isPending}>Back</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
