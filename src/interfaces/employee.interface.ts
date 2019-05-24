import { Document } from 'mongoose';

export interface IEmployee extends Document {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  status: number;
}
