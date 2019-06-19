import { object, string, number, array } from 'joi';
import { StatusService } from '../enums';

export const roomCreate = object().keys({
  numberOfRoom: number()
    .positive()
    .required(),
  floor: number()
    .min(0)
    .required(),
  countRooms: number()
    .positive()
    .required(),
  countDoubleBeds: number()
    .min(0)
    .required(),
  countSingleBeds: number()
    .min(0)
    .required(),
  totalNumberBeds: number()
    .positive()
    .required(),
  services: array()
    .items({
      _id: string().required(),
      status: string()
        .required()
        .allow([StatusService.Available, StatusService.NotAvailable])
        .default(StatusService.Available)
    })
    .required()
    .min(2),
  price: number()
    .positive()
    .required()
});

export const roomService = object().keys({
  name: string().required(),
  price: number()
    .required()
    .min(0)
});
