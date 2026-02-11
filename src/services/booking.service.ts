import mongoose from "mongoose";
import { BookingRepository } from "../repositories/booking.repository";
import { CreateBookingDTO, UpdateBookingStatusDTO } from "../dtos/booking.dto";
import { HttpError } from "../errors/http-error";

const bookingRepo = new BookingRepository();

export class BookingService {
  async createBooking(data: CreateBookingDTO) {
    // Basic validation: memberId ≠ nurseId
    if (data.memberId === data.nurseId) {
      throw new HttpError(400, "Member and Nurse cannot be the same user");
    }

    const booking = await bookingRepo.create({
      memberId: new mongoose.Types.ObjectId(data.memberId),
      nurseId: new mongoose.Types.ObjectId(data.nurseId),
      date: new Date(data.date),
    });

    return booking;
  }

  async getBookingById(id: string) {
    const booking = await bookingRepo.findById(id);
    if (!booking) throw new HttpError(404, "Booking not found");
    return booking;
  }

  async getAllBookings(filters: any, sort: any, page: number, limit: number) {
    return await bookingRepo.findAll(filters, sort, page, limit);
  }

  async updateBookingStatus(id: string, data: UpdateBookingStatusDTO) {
    const booking = await bookingRepo.updateStatus(id, data.status);
    if (!booking) throw new HttpError(404, "Booking not found");
    return booking;
  }
}
