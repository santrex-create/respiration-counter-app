"use client";

import type { AnalysisResult, PatientData } from "@/lib/types";
import { LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, AreaChart, Area } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Repeat, Save, Activity, Zap, ClipboardList, Target } from "lucide-react";
import { useMemo } from "react";
import Logo from "@/components/logo";

type ResultsDisplayProps = {
  result: AnalysisResult;
  patientData: PatientData;
  onReset: () => void;
  onSave: () => void;
};

const getNormalRange = (age: number) => {
  if (age < 1) return { low: 30, high: 60, status: "Infant" };
  if (age <= 2) return { low: 24, high: 40, status: "Toddler" };
  if (age <= 5) return { low: 22, high: 34, status: "Preschooler" };
  if (age <= 12) return { low: 18, high: 30, status: "School-aged Child" };
  return { low: 12, high: 20, status: "Adolescent/Adult" };
};

export default function ResultsDisplay({ result, patientData, onReset, onSave }: ResultsDisplayProps) {
  const { low, high } = getNormalRange(patientData.age);
  const rate = patientData.respirationRate;

  const rateStatus = useMemo(() => {
    if (rate < low) return { text: "Low", variant: "destructive" as const };
    if (rate > high) return { text: "High", variant: "destructive" as const };
    return { text: "Normal" as const, variant: "default" as const };
  }, [rate, low, high]);

  // Generate a simulated wave around the patient's rate for a cooler Jarvis visual
  const chartData = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      name: i,
      value: rate + Math.sin(i * 1.5) * 2,
      base: rate,
    }));
  }, [rate]);

  const chartColor = rateStatus.variant === 'destructive' ? 'hsl(var(--destructive))' : 'hsl(var(--accent))';

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl overflow-hidden border-accent/20 bg-slate-950/50 backdrop-blur-xl">
        <CardHeader className="bg-muted/5 p-4 border-b border-accent/10">
            <div className="flex flex-col items-center gap-2">
                <Logo />
                <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-accent animate-pulse" />
                    <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-mono">Neural Analysis Complete</p>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-6 text-slate-200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-2 rounded-lg bg-accent/5 border border-accent/10">
                    <p className="text-[10px] text-muted-foreground uppercase font-mono mb-1">Subject Age</p>
                    <p className="font-bold text-xl font-mono text-accent">{patientData.age}</p>
                </div>
                 <div className="p-2 rounded-lg bg-accent/5 border border-accent/10">
                    <p className="text-[10px] text-muted-foreground uppercase font-mono mb-1">Gender</p>
                    <p className="font-bold text-xl font-mono text-accent">{patientData.gender}</p>
                </div>
                 <div className="p-2 rounded-lg bg-accent/5 border border-accent/10">
                    <p className="text-[10px] text-muted-foreground uppercase font-mono mb-1">Biomass</p>
                    <p className="font-bold text-xl font-mono text-accent">{patientData.weight} <span className="text-[10px]">KG</span></p>
                </div>
                <div className="p-2 rounded-lg bg-accent/10 border border-accent/30 ring-1 ring-accent/20">
                    <p className="text-[10px] text-muted-foreground uppercase font-mono mb-1">Measured RR</p>
                    <p className="font-bold text-xl font-mono text-accent">{rate} <span className="text-[10px]">BPM</span></p>
                </div>
            </div>

            <div className="space-y-4 relative">
                <div className="absolute -left-2 top-0 bottom-0 w-[1px] bg-accent/20" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-accent" />
                        <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Vitals Waveform</h2>
                    </div>
                    <Badge variant={rateStatus.variant} className="font-mono text-[10px] uppercase tracking-tighter">
                        Status: {rateStatus.text}
                    </Badge>
                </div>
                
                <div className="h-56 w-full bg-accent/[0.02] rounded-lg border border-accent/10 p-2 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--accent),0.05),transparent)] pointer-events-none" />
                    <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" hide />
                            <YAxis 
                                allowDecimals={false} 
                                domain={[Math.max(0, rate - 10), rate + 10]} 
                                tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontFamily: 'monospace'}}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip 
                                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                contentStyle={{
                                    backgroundColor: 'rgba(2, 8, 23, 0.95)', 
                                    border: '1px solid rgba(var(--accent), 0.2)',
                                    borderRadius: '8px',
                                    fontSize: '10px',
                                    fontFamily: 'monospace',
                                    color: 'white'
                                }}
                            />
                            <ReferenceLine y={low} stroke="rgba(var(--accent), 0.2)" strokeDasharray="3 3" />
                            <ReferenceLine y={high} stroke="rgba(var(--accent), 0.2)" strokeDasharray="3 3" />
                            <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke={chartColor} 
                                fillOpacity={1} 
                                fill="url(#colorValue)" 
                                strokeWidth={2}
                                animationDuration={3000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="p-4 rounded-md bg-accent/5 border border-accent/10">
                    <p className="text-xs font-mono text-muted-foreground mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                        ANALYTICS ENGINE: DATA_SUMMARY
                    </p>
                    <p className="text-sm font-body leading-relaxed">{result.analysis.analysis}</p>
                </div>
            </div>
            
            <Separator className="bg-accent/10" />

            <div className="grid gap-6">
                 <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-accent" />
                        <h3 className="text-xs font-mono uppercase tracking-widest text-accent">Strategic Routine</h3>
                    </div>
                    <div className="p-4 rounded-md bg-muted/20 border border-accent/5">
                        <p className="text-sm text-slate-300 leading-relaxed italic">{result.analysis.routine}</p>
                    </div>
                 </div>

                 <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-accent" />
                            <h3 className="text-xs font-mono uppercase tracking-widest text-accent">Directives</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{result.analysis.recommendations}</p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-accent" />
                            <h3 className="text-xs font-mono uppercase tracking-widest text-accent">Optimizations</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{result.advice.advice}</p>
                    </div>
                 </div>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 bg-muted/5 p-6 border-t border-accent/10">
            <Button onClick={onSave} variant="outline" className="w-full border-accent/20 hover:bg-accent/10 hover:text-accent font-mono text-xs uppercase tracking-widest">
                <Save className="w-4 h-4 mr-2" />
                Commit to Memory
            </Button>
            <Button onClick={onReset} className="w-full bg-accent hover:bg-accent/80 text-accent-foreground font-mono text-xs uppercase tracking-widest">
                <Repeat className="w-4 h-4 mr-2" />
                Initialize New Scan
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
