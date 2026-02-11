import { IBooking, BookingModel } from "../models/booking.model";

export class BookingRepository {
  async create(data: Partial<IBooking>): Promise<IBooking> {
    const booking = new BookingModel(data);
    return await booking.save();
  }

  async findById(id: string): Promise<IBooking | null> {
    return await BookingModel.findById(id)
      .populate("memberId nurseId", "name email role");
  }

  async findAll(filters: any, sort: any, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const query = BookingModel.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("memberId nurseId", "name email role");

    const results = await query.exec();
    const total = await BookingModel.countDocuments(filters);

    return { results, total, page, limit };
  }

  async updateStatus(id: string, status: "pending" | "accepted" | "declined"): Promise<IBooking | null> {
    return await BookingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("memberId nurseId", "name email role");
  }
}
