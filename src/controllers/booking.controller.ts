import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";

const bookingService = new BookingService();

export class BookingController {
  // Member: create booking
  async create(req: Request, res: Response) {
    try {
      const memberId = (req as any).user.id;
      const { nurseId, date } = req.body;

      // ✅ Prevent duplicate booking with same nurse
      const existing = await bookingService.findActiveBooking(memberId, nurseId);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "You already have an active booking with this nurse.",
        });
      }

      const booking = await bookingService.createBooking({ memberId, nurseId, date });
      res.status(201).json({ success: true, data: booking });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Nurse: accept booking
  async accept(req: Request, res: Response) {
    try {
      const booking = await bookingService.updateStatus(req.params.id, "accepted");
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      const contract = await bookingService.createContractFromBooking(booking);
      res.json({ success: true, data: { booking, contract } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Nurse: decline booking
  async decline(req: Request, res: Response) {
    try {
      const booking = await bookingService.updateStatus(req.params.id, "declined");
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
      res.json({ success: true, data: booking });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Member or Nurse: cancel booking (terminates contract too)
  async cancel(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const booking = await bookingService.getBookingById(req.params.id);

      // 👇 Debug logs to trace ownership mismatch
      console.log("Cancel attempt by user:", user);
      console.log("Booking found:", booking);

      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      const cancelled = await bookingService.cancelBooking(req.params.id, user);
      res.json({ success: true, data: cancelled });
    } catch (error: any) {
      const statusCode = error.message.includes("authorized") ? 403 : 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  // Member: get all their bookings
  async getMyBookings(req: Request, res: Response) {
    try {
      const memberId = (req as any).user.id;
      const bookings = await bookingService.getBookingsByMember(memberId);
      res.status(200).json({ success: true, data: bookings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
