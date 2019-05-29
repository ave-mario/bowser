import { Schema, Model, model } from 'mongoose';
import { IBooking } from '../interfaces';

const schema: Schema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Clients',
      required: true
    },
    arrivalDate: {
      type: Schema.Types.Date,
      required: true
    },
    departureDate: {
      type: Schema.Types.Date,
      required: true
    },
    countOfPerson: {
      type: Number,
      required: true,
      min: 1
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Rooms',
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

schema.set('toObject', {
  transform: function(doc: {}, ret: any): void {
    delete ret.__v;
  }
});

export const Booking: Model<IBooking> = model<IBooking>('Bookings', schema);
