import { IBooking } from "../models/booking.model";
import { BookingRepository } from "../repositories/booking.repository";
import { ContractService } from "./contract.service";

const bookingRepo = new BookingRepository();
const contractService = new ContractService();

export class BookingService {
  // Create a new booking
  async createBooking(data: any) {
    return bookingRepo.create(data);
  }

  // Update booking status (pending, accepted, declined, cancelled)
  async updateStatus(
    id: string,
    status: "pending" | "accepted" | "declined" | "cancelled"
  ) {
    return bookingRepo.updateStatus(id, status);
  }

  // Create a contract when a booking is accepted
  async createContractFromBooking(booking: IBooking) {
    const memberId =
      typeof booking.memberId === "object" && booking.memberId !== null && "_id" in booking.memberId
        ? (booking.memberId as any)._id
        : booking.memberId;

    const nurseId =
      typeof booking.nurseId === "object" && booking.nurseId !== null && "_id" in booking.nurseId
        ? (booking.nurseId as any)._id
        : booking.nurseId;

    return contractService.createContract({
      memberId,
      nurseId,
      bookingId: booking._id, 
      startDate: booking.date,
      status: "active",
    });
  }

  // Get all bookings for a member (with nurse details populated)
  async getBookingsByMember(memberId: string) {
    return bookingRepo.findByMember(memberId);
  }

  // Get all bookings for a nurse (with member details populated)
  async getBookingsByNurse(nurseId: string) {
    return bookingRepo.findByNurse(nurseId);
  }

  // Prevent duplicate active bookings with the same nurse
  async findActiveBooking(memberId: string, nurseId: string) {
    return bookingRepo.findOne({
      memberId,
      nurseId,
      status: { $in: ["pending", "accepted"] },
    });
  }

  // Get booking by ID (for ownership checks)
  async getBookingById(id: string) {
    return bookingRepo.findById(id);
  }

  // Cancel booking and terminate linked contract
  async cancelBooking(id: string, user: { id: string; role: string }) {
    const booking = await bookingRepo.findById(id);
    if (!booking) return null;

    const memberId =
      typeof booking.memberId === "object" && booking.memberId !== null && "_id" in booking.memberId
        ? (booking.memberId as any)._id.toString()
        : (booking.memberId as any)?.toString();

    const nurseId =
      typeof booking.nurseId === "object" && booking.nurseId !== null && "_id" in booking.nurseId
        ? (booking.nurseId as any)._id.toString()
        : (booking.nurseId as any)?.toString();

    if (
      (user.role === "member" && memberId !== user.id) ||
      (user.role === "nurse" && nurseId !== user.id)
    ) {
      throw new Error("You are not authorized to cancel this booking");
    }

    const cancelled = await bookingRepo.updateStatus(id, "cancelled");

    if (cancelled) {
      await contractService.terminateByBooking(cancelled._id.toString());
    }

    return cancelled;
  }
}
