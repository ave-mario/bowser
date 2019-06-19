import { Document, Types } from 'mongoose';

export interface IRoom extends Document {
  _id: string;
  numberOfRoom: number;
  floor: number;
  countRooms: number;
  countDoubleBeds: number;
  countSingleBeds: number;
  totalNumberBeds: number;
  services: [{ _id: string; status: number }];
  price: number;
  photos?: [{ urlName: string; name: string }];
  status: number;
}

export interface IRoomService extends Document {
  name: string;
  price: number;
}

export interface IRoomCreate {
  numberOfRoom: number;
  floor: number;
  countRooms: number;
  countDoubleBeds: number;
  countSingleBeds: number;
  totalNumberBeds: number;
  services: { _id: string; status: string }[];
  price: number;
}
