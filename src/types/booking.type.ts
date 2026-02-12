import { z } from "zod";

// Booking status type
export type BookingStatus = "pending" | "accepted" | "declined";

// Booking entity type (TypeScript interface)
export interface BookingType {
  _id: string;
  memberId: {
    _id: string;
    name: string;
    email: string;
    role: "member";
  };
  nurseId: {
    _id: string;
    name: string;
    email: string;
    role: "nurse";
  };
  date: string; // ISO string
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

// Zod schema for runtime validation
export const BookingSchema = z.object({
  _id: z.string(),
  memberId: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.literal("member"),
  }),
  nurseId: z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.literal("nurse"),
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  status: z.enum(["pending", "accepted", "declined"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Optional: array schema for multiple bookings
export const BookingArraySchema = z.array(BookingSchema);
