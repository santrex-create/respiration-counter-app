"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ConditionsSchema, PatientData } from "@/lib/types";
import { ACTIVITY_LEVELS, BODY_POSTURES, STRESS_LEVELS, DEHYDRATION_STATUSES } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ConditionsChecklistProps = {
  onNext: (data: z.infer<typeof ConditionsSchema>) => void;
  onBack: () => void;
  defaultValues?: Partial<PatientData>;
};

const FormRadioGroup = ({ name, control, label, options }: any) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="space-y-3">
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col space-y-1"
          >
            {options.map((option: any) => (
              <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value={option.id} />
                </FormControl>
                <FormLabel className="font-normal">{option.label}</FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default function ConditionsChecklist({ onNext, onBack, defaultValues }: ConditionsChecklistProps) {
  const form = useForm<z.infer<typeof ConditionsSchema>>({
    resolver: zodResolver(ConditionsSchema),
    defaultValues: {
      activityLevel: defaultValues?.activityLevel,
      bodyPosture: defaultValues?.bodyPosture,
      stressLevel: defaultValues?.stressLevel,
      dehydrationStatus: defaultValues?.dehydrationStatus,
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Current Conditions</CardTitle>
        <CardDescription>Select your current state for a more accurate analysis.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onNext)}>
          <CardContent className="space-y-6">
            <FormRadioGroup name="activityLevel" control={form.control} label="Activity Level" options={ACTIVITY_LEVELS} />
            <FormRadioGroup name="bodyPosture" control={form.control} label="Body Posture" options={BODY_POSTURES} />
            <FormRadioGroup name="stressLevel" control={form.control} label="Stress Level" options={STRESS_LEVELS} />
            <FormRadioGroup name="dehydrationStatus" control={form.control} label="Dehydration Status" options={DEHYDRATION_STATUSES} />
          </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="w-full">Back</Button>
            <Button type="submit" className="w-full">Next</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
