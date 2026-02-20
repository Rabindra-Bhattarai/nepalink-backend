import { BookingRepository } from "../repositories/booking.repository";
import { ContractService } from "./contract.service";
import { IBooking } from "../models/booking.model";

const bookingRepo = new BookingRepository();
const contractService = new ContractService();

export class BookingService {
  async createBooking(data: any) {
    return bookingRepo.create(data);
  }

  async updateStatus(id: string, status: "pending" | "accepted" | "declined") {
    return bookingRepo.updateStatus(id, status);
  }

  async createContractFromBooking(booking: IBooking) {
    return contractService.createContract({
      memberId: booking.memberId,
      nurseId: booking.nurseId,
      startDate: booking.date,
      status: "active",
    });
  }
}
