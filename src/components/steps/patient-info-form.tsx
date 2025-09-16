"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PatientInfoSchema, PatientData } from "@/lib/types";
import { GENDER_OPTIONS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type PatientInfoFormProps = {
  onNext: (data: z.infer<typeof PatientInfoSchema>) => void;
  defaultValues?: Partial<PatientData>;
};

export default function PatientInfoForm({ onNext, defaultValues }: PatientInfoFormProps) {
  const form = useForm<z.infer<typeof PatientInfoSchema>>({
    resolver: zodResolver(PatientInfoSchema),
    defaultValues: {
      age: defaultValues?.age,
      gender: defaultValues?.gender,
      weight: defaultValues?.weight,
      pastDisease: defaultValues?.pastDisease || "",
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
        <CardDescription>Let's start with some basic details.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 35" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 70" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pastDisease"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past illnesses affecting respiration</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Asthma, COPD (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Next</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
