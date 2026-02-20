
import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";

const bookingService = new BookingService();

export class BookingController {
  async create(req: Request, res: Response) {
    try {
      const booking = await bookingService.createBooking({
        memberId: (req as any).user.id,
        nurseId: req.body.nurseId,
        date: req.body.date,
      });
      res.status(201).json({ success: true, data: booking });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async accept(req: Request, res: Response) {
    try {
      const booking = await bookingService.updateStatus(req.params.id, "accepted");
      if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

      // Auto-create contract when accepted
      const contract = await bookingService.createContractFromBooking(booking);
      res.json({ success: true, data: { booking, contract } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async decline(req: Request, res: Response) {
    try {
      const booking = await bookingService.updateStatus(req.params.id, "declined");
      res.json({ success: true, data: booking });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
