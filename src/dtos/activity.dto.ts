import z from "zod";

export const CreateActivityDTO = z.object({
  description: z.string().min(5, "Description must be at least 5 characters"),
  date: z.string().min(1, "Date is required"),

  vitalSigns: z.object({
    bloodPressure: z.string().optional(),
    heartRate: z.number().optional(),
    temperature: z.number().optional(),
    spo2: z.number().optional(),
  }).optional(),

  dailyCare: z.object({
    meals: z.string().optional(),
    hydration: z.string().optional(),
    hygiene: z.string().optional(),
    mobility: z.string().optional(),
    sleepQuality: z.string().optional(),
  }).optional(),

  medicalTracking: z.object({
    medication: z.string().optional(),
    painLevel: z.number().optional(),
    woundCondition: z.string().optional(),
    bowelBladder: z.string().optional(),
  }).optional(),

  collaboration: z.object({
    suppliesInventory: z.string().optional(),
    shiftSummary: z.string().optional(),
    parentInstructions: z.string().optional(),
    significantEvents: z.string().optional(),
  }).optional(),

  safetyVerification: z.object({
    equipmentCheck: z.string().optional(),
    emergencyContactSync: z.boolean().optional(),
    jointSignature: z.boolean().optional(),
  }).optional(),
});

export type CreateActivityDTO = z.infer<typeof CreateActivityDTO>;
