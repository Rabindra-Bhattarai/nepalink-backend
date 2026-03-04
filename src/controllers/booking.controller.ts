import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { ContractService } from "../services/contract.service";
import { IContract } from "../models/contract.model";

const bookingService = new BookingService();
const contractService = new ContractService();

export class BookingController {
  // Member: create booking
  async create(req: Request, res: Response) {
    try {
      const memberId = (req as any).user._id; 
      const { nurseId, date } = req.body;

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

      let contract: IContract | null = await bookingService.createContractFromBooking(booking);
      if (!contract) {
        return res.status(500).json({ success: false, message: "Failed to create contract" });
      }

      contract = await contractService.updateStatus(contract._id.toString(), "active");
      if (!contract) {
        return res.status(404).json({ success: false, message: "Contract not found" });
      }

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

  // Member or Nurse: get bookings
  async getMyBookings(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      let bookings;

      if (user.role === "member") {
        // Member sees their own bookings, with nurse details
        bookings = await bookingService.getBookingsByMember(user._id);
      } else if (user.role === "nurse") {
        // Nurse sees bookings assigned to them, with member details
        bookings = await bookingService.getBookingsByNurse(user._id);
      } else {
        return res.status(403).json({ success: false, message: "Access denied." });
      }

      res.status(200).json({ success: true, data: bookings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
