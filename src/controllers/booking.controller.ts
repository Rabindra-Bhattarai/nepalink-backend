import { Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { CreateBookingDTO, UpdateBookingStatusDTO } from "../dtos/booking.dto";
import { BookingType } from "../types/booking.type";

const bookingService = new BookingService();

export class BookingController {
  async create(req: Request, res: Response) {
    try {
      const parsed = CreateBookingDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues.map((i) => i.message),
        });
      }

      const booking: BookingType = await bookingService.createBooking(parsed.data);

      return res.status(201).json({
        success: true,
        data: booking,
        links: {
          self: `/api/bookings/${booking._id}`,
          accept: `/api/bookings/${booking._id}/accept`,
          decline: `/api/bookings/${booking._id}/decline`,
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { status, nurseId, memberId, sort = "date", page = 1, limit = 10 } = req.query;

      const filters: any = {};
      if (status) filters.status = status;
      if (nurseId) filters.nurseId = nurseId;
      if (memberId) filters.memberId = memberId;

      const sortObj: any = {};
      sortObj[sort as string] = 1;

      const { results, total } = await bookingService.getAllBookings(
        filters,
        sortObj,
        Number(page),
        Number(limit)
      );

      res.set("X-Total-Count", total.toString());

      return res.status(200).json({
        success: true,
        data: results,
        links: {
          self: "/api/bookings",
          filter: "/api/bookings?status=pending",
          sort: "/api/bookings?sort=date",
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const booking: BookingType = await bookingService.getBookingById(req.params.id);
      return res.status(200).json({
        success: true,
        data: booking,
        links: {
          self: `/api/bookings/${booking._id}`,
          accept: `/api/bookings/${booking._id}/accept`,
          decline: `/api/bookings/${booking._id}/decline`,
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const parsed = UpdateBookingStatusDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues.map((i) => i.message),
        });
      }

      const booking: BookingType = await bookingService.updateBookingStatus(req.params.id, parsed.data);

      return res.status(200).json({
        success: true,
        data: booking,
        links: {
          self: `/api/bookings/${booking._id}`,
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  // NEW: Decline booking
  async decline(req: Request, res: Response) {
    try {
      const booking: BookingType = await bookingService.updateBookingStatus(req.params.id, { status: "declined" });

      return res.status(200).json({
        success: true,
        data: booking,
        links: {
          self: `/api/bookings/${booking._id}`,
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
