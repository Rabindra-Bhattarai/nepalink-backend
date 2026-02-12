import mongoose from "mongoose";
import { BookingRepository } from "../repositories/booking.repository";
import { CreateBookingDTO, UpdateBookingStatusDTO } from "../dtos/booking.dto";
import { HttpError } from "../errors/http-error";
import { BookingType, BookingStatus } from "../types/booking.type";

const bookingRepo = new BookingRepository();

export class BookingService {
  async createBooking(data: CreateBookingDTO): Promise<BookingType> {
    // Basic validation: memberId ≠ nurseId
    if (data.memberId === data.nurseId) {
      throw new HttpError(400, "Member and Nurse cannot be the same user");
    }

    const booking = await bookingRepo.create({
      memberId: new mongoose.Types.ObjectId(data.memberId),
      nurseId: new mongoose.Types.ObjectId(data.nurseId),
      date: new Date(data.date),
    });

    return booking as unknown as BookingType;
  }

  async getBookingById(id: string): Promise<BookingType> {
    const booking = await bookingRepo.findById(id);
    if (!booking) throw new HttpError(404, "Booking not found");
    return booking as unknown as BookingType;
  }

  async getAllBookings(
    filters: any,
    sort: any,
    page: number,
    limit: number
  ): Promise<{ results: BookingType[]; total: number }> {
    const { results, total } = await bookingRepo.findAll(filters, sort, page, limit);
    return {
      results: results as unknown as BookingType[],
      total,
    };
  }

  async updateBookingStatus(
    id: string,
    data: UpdateBookingStatusDTO
  ): Promise<BookingType> {
    const booking = await bookingRepo.updateStatus(id, data.status as BookingStatus);
    if (!booking) throw new HttpError(404, "Booking not found");
    return booking as unknown as BookingType;
  }
}
