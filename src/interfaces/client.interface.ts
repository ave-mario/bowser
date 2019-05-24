import { Document } from 'mongoose';

export interface IClient extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: number;
  loginCode?: string;
  googleId?: string;
  vkontakteId?: string;
}
