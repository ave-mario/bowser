import { Document } from 'mongoose';

export interface IClient extends Document {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  address?: string;
  status: number;
  loginCode?: string;
  googleId?: string;
  vkontakteId?: string;
  created_at: string;
  updated_at: string;
}
export interface IClientFieldsToRegister {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
}

export interface IClientToLogin {
  phoneNumber: string;
  loginCode: string;
}
