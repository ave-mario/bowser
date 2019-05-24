import { Document } from 'mongoose';

export interface IRoom extends Document {
  numberOfRoom: number;
  floor: number;
  countRooms: number;
  countDoubleBeds: number;
  countSingleBeds: number;
  totalNumberBeds: number;
  services: [{ name: string; price: number; status: number }];
  price: number;
  photos: [{ urlName: string; name: string }];
  status: number;
}
