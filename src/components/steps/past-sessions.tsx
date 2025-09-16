"use client";

import type { SavedSession } from "@/lib/types";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

type PastSessionsProps = {
  sessions: SavedSession[];
  onBack: () => void;
};

const getRateStatus = (age: number, rate: number) => {
    let low = 12, high = 20;
    if (age < 1) { low=30; high=60; }
    else if (age <= 2) { low=24; high=40; }
    else if (age <= 5) { low=22; high=34; }
    else if (age <= 12) { low=18; high=30; }

    if (rate < low) return { text: "Low", variant: "destructive" as const };
    if (rate > high) return { text: "High", variant: "destructive" as const };
    return { text: "Normal", variant: "default" as const };
}

export default function PastSessions({ sessions, onBack }: PastSessionsProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Past Sessions</CardTitle>
          <CardDescription>There are no saved sessions to display.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={onBack} className="w-full">Back to Start</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Sessions</CardTitle>
        <CardDescription>Review your previously saved sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
            {sessions.map((session) => {
                const rateStatus = getRateStatus(session.patientData.age, session.patientData.respirationRate);
                return (
                    <AccordionItem value={session.id} key={session.id}>
                        <AccordionTrigger>
                            <div className="flex justify-between items-center w-full pr-4">
                                <span>{format(session.savedAt, "PPP p")}</span>
                                <Badge variant={rateStatus.variant}>{rateStatus.text}</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 text-sm">
                            <div>
                                <h4 className="font-semibold">Patient Data</h4>
                                <p>Age: {session.patientData.age}, Gender: {session.patientData.gender}, Weight: {session.patientData.weight}kg</p>
                                <p>Rate: {session.patientData.respirationRate} breaths/min</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Analysis</h4>
                                <p className="text-muted-foreground">{session.analysisResult.analysis.analysis}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Recommendations</h4>
                                <p className="text-muted-foreground">{session.analysisResult.analysis.recommendations}</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
      </CardContent>
      <CardFooter>
        <Button onClick={onBack} className="w-full" variant="outline">Back to Start</Button>
      </CardFooter>
    </Card>
  );
}
