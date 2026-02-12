import { z } from "zod";

export interface ActivityType {
  _id: string;
  bookingId: string;
  nurseId: {
    _id: string;
    name: string;
    email: string;
    role: "nurse";
  };
  notes: string;
  performedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const ActivitySchema = z.object({
  _id: z.string(),
  bookingId: z.string(),
  nurseId: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.literal("nurse"),
  }),
  notes: z.string(),
  performedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ActivityArraySchema = z.array(ActivitySchema);
