import { z } from "zod";
import { 
  GENDER_OPTIONS, 
  ACTIVITY_LEVELS, 
  BODY_POSTURES, 
  STRESS_LEVELS, 
  HYDRATION_STATUSES 
} from "./constants";

export const PatientInfoSchema = z.object({
  age: z.coerce.number().min(0, "Age must be a positive number.").max(120),
  gender: z.enum(GENDER_OPTIONS as [string, ...string[]]),
  weight: z.coerce.number().min(20, "Babu, please choose a valid parameter 😘").max(500),
  pastDisease: z.string().optional(),
});

export const ConditionsSchema = z.object({
  activityLevel: z.enum(ACTIVITY_LEVELS.map(o => o.id) as [string, ...string[]], { required_error: "Please select an activity level." }),
  bodyPosture: z.enum(BODY_POSTURES.map(o => o.id) as [string, ...string[]], { required_error: "Please select a body posture." }),
  stressLevel: z.enum(STRESS_LEVELS.map(o => o.id) as [string, ...string[]], { required_error: "Please select a stress level." }),
  hydrationStatus: z.enum(HYDRATION_STATUSES.map(o => o.id) as [string, ...string[]], { required_error: "Please select a hydration status." }),
});

export const RateSchema = z.object({
  respirationRate: z.coerce.number().min(1, "Rate must be a positive number.").max(100),
});

export const PatientDataSchema = PatientInfoSchema.merge(ConditionsSchema).merge(RateSchema);

export type PatientData = z.infer<typeof PatientDataSchema>;

export type AnalysisResult = {
  analysis: {
    analysis: string;
    recommendations: string;
  };
  advice: {
    advice: string;
  };
};

export type SavedSession = {
    id: string;
    patientData: PatientData;
    analysisResult: AnalysisResult;
    savedAt: Date;
};
