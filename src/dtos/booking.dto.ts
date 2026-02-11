import z from "zod";

// Create Booking DTO
export const CreateBookingDTO = z.object({
  memberId: z.string().min(1, "Member ID is required"),
  nurseId: z.string().min(1, "Nurse ID is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export type CreateBookingDTO = z.infer<typeof CreateBookingDTO>;

// Update Booking Status DTO
export const UpdateBookingStatusDTO = z.object({
  status: z.enum(["pending", "accepted", "declined"]),
});

export type UpdateBookingStatusDTO = z.infer<typeof UpdateBookingStatusDTO>;
