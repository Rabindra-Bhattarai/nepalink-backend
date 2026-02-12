import z from "zod";

export const CreateActivityDTO = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  nurseId: z.string().min(1, "Nurse ID is required"),
  notes: z.string().min(5, "Notes must be at least 5 characters"),
});

export type CreateActivityDTO = z.infer<typeof CreateActivityDTO>;
