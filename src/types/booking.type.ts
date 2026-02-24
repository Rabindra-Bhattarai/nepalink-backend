import { IBooking } from "../models/booking.model";

export type BookingType = IBooking;

export interface BookingResponse {
  success: boolean;
  data: IBooking | IBooking[];
}
