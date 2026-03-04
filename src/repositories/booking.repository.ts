import { IBooking, BookingModel } from "../models/booking.model";

export class BookingRepository {
  // Create a new booking
  async create(data: Partial<IBooking>): Promise<IBooking> {
    const booking = new BookingModel(data);
    return await booking.save();
  }

  // Find booking by ID (populate both sides)
  async findById(id: string): Promise<IBooking | null> {
    return await BookingModel.findById(id)
      .populate("memberId nurseId", "name email role phone profilePic")
      .exec();
  }

  // Find all bookings for a member (populate nurse details)
  async findByMember(memberId: string): Promise<IBooking[]> {
    return await BookingModel.find({ memberId })
      .populate("nurseId", "name email role phone profilePic")
      .sort({ date: -1 })
      .exec();
  }

  // Find all bookings for a nurse (populate member details)
  async findByNurse(nurseId: string): Promise<IBooking[]> {
    return await BookingModel.find({ nurseId })
      .populate("memberId", "name email role phone profilePic")
      .sort({ date: -1 })
      .exec();
  }

  // Update booking status (pending, accepted, declined, cancelled)
  async updateStatus(
    id: string,
    status: "pending" | "accepted" | "declined" | "cancelled"
  ): Promise<IBooking | null> {
    return await BookingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("memberId nurseId", "name email role phone profilePic")
      .exec();
  }

  // Find one booking by custom query (used for duplicate check)
  async findOne(query: any): Promise<IBooking | null> {
    return await BookingModel.findOne(query)
      .populate("memberId nurseId", "name email role phone profilePic")
      .exec();
  }

  // Cancel booking (wrapper around updateStatus)
  async cancel(id: string): Promise<IBooking | null> {
    return await this.updateStatus(id, "cancelled");
  }
}
