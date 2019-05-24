import { Document } from 'mongoose';

export interface IBooking extends Document {
  clientId: string;
  arrivalDate: string;
  departureDate: string;
  countOfPerson: number;
  roomId: number;
  price: number;
  status: number;
}
