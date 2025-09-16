"use client";

import type { AnalysisResult, PatientData } from "@/lib/types";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Repeat, Save } from "lucide-react";
import { useMemo } from "react";
import Logo from "@/components/logo";

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
    return { text: "default" as const, "children": "Normal" };
  }, [rate, low, high]);

  const chartData = [{ name: 'Your Rate', value: rate }];

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl overflow-hidden">
        <CardHeader className="bg-muted/30 p-4 border-b">
            <div className="flex flex-col items-center gap-2">
                <Logo />
                <p className="text-xs text-muted-foreground tracking-widest uppercase">Wellness & Respiration Report</p>
            </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
                <div>
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-bold text-lg">{patientData.age}</p>
                </div>
                 <div>
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-bold text-lg">{patientData.gender}</p>
                </div>
                 <div>
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-bold text-lg">{patientData.weight} kg</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Rate</p>
                    <p className="font-bold text-lg">{rate} <span className="text-xs font-normal">breaths/min</span></p>
                </div>
            </div>
            <Separator />
            <div className="space-y-4">
                <CardTitle className="flex items-center justify-between text-lg">
                    <span>Respiration Analysis</span>
                    <Badge variant={rateStatus.variant}>{rateStatus.text}</Badge>
                </CardTitle>
                <CardDescription>
                    Your rate of {rate} breaths/min is considered {rateStatus.text?.toLowerCase()} for a(n) {status} (Normal: {low}-{high} breaths/min).
                </CardDescription>
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
                            <Cell fill={rateStatus.variant === 'destructive' ? 'hsla(var(--destructive), 0.5)' : 'hsla(var(--accent), 0.8)'} />
                        </Bar>
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-sm bg-muted/50 p-4 rounded-md prose prose-sm dark:prose-invert max-w-none">{result.analysis.analysis}</p>
            </div>
            
            <Separator />

            <div className="space-y-4">
                 <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="text-foreground" />
                    <span>Recommendations & Advice</span>
                </CardTitle>
                 <div className="space-y-3 prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                    <div>
                        <h3 className="font-semibold mb-1 text-sm text-foreground">Personalized Recommendations</h3>
                        <p>{result.analysis.recommendations}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1 text-sm text-foreground">Wellbeing Tips</h3>
                        <p>{result.advice.advice}</p>
                    </div>
                 </div>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 bg-muted/30 p-4 border-t">
            <Button onClick={onSave} variant="secondary" className="w-full"><Save/>Save Session</Button>
            <Button onClick={onReset} className="w-full"><Repeat/>New Session</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
