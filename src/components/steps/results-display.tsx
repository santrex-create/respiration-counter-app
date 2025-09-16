"use client";

import type { AnalysisResult, PatientData } from "@/lib/types";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Repeat, Save } from "lucide-react";
import { useMemo } from "react";

type ResultsDisplayProps = {
  result: AnalysisResult;
  patientData: PatientData;
  onReset: () => void;
  onSave: () => void;
};

// Simple heuristic for normal respiration rates by age
const getNormalRange = (age: number) => {
  if (age < 1) return { low: 30, high: 60, status: "Infant" };
  if (age <= 2) return { low: 24, high: 40, status: "Toddler" };
  if (age <= 5) return { low: 22, high: 34, status: "Preschooler" };
  if (age <= 12) return { low: 18, high: 30, status: "School-aged Child" };
  return { low: 12, high: 20, status: "Adolescent/Adult" };
};

export default function ResultsDisplay({ result, patientData, onReset, onSave }: ResultsDisplayProps) {
  const { low, high, status } = getNormalRange(patientData.age);
  const rate = patientData.respirationRate;

  const rateStatus = useMemo(() => {
    if (rate < low) return { text: "Low", variant: "destructive" as const };
    if (rate > high) return { text: "High", variant: "destructive" as const };
    return { text: "Normal", variant: "default" as const };
  }, [rate, low, high]);

  const chartData = [{ name: 'Your Rate', value: rate }];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Analysis Results</span>
            <Badge variant={rateStatus.variant}>{rateStatus.text}</Badge>
          </CardTitle>
          <CardDescription>
            Your respiration rate is {rate} breaths/min. The normal range for a(n) {status} is {low}-{high}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-40 w-full">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} domain={[0, Math.max(rate, high) + 5]} />
                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                <ReferenceLine y={low} label={{ value: 'Normal Low', position: 'insideTopLeft' }} stroke="hsl(var(--primary))" strokeDasharray="3 3" />
                <ReferenceLine y={high} label={{ value: 'Normal High', position: 'insideTopLeft' }} stroke="hsl(var(--primary))" strokeDasharray="3 3" />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    <Cell fill={rateStatus.variant === 'destructive' ? 'hsl(var(--destructive))' : 'hsl(var(--accent))'} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm">{result.analysis.analysis}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-accent" />
            <span>Recommendations & Advice</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
            <h3 className="font-semibold mb-1">Personalized Recommendations</h3>
            <p className="text-sm text-muted-foreground">{result.analysis.recommendations}</p>
           </div>
           <Separator/>
           <div>
            <h3 className="font-semibold mb-1">Wellbeing Tips</h3>
            <p className="text-sm text-muted-foreground">{result.advice.advice}</p>
           </div>
        </CardContent>
         <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button onClick={onSave} variant="secondary" className="w-full"><Save/>Save Session</Button>
            <Button onClick={onReset} className="w-full"><Repeat/>New Session</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
