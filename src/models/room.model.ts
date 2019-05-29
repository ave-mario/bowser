import { Schema, Model, model } from 'mongoose';
import { IRoom } from '../interfaces';

const schema = new Schema(
  {
    numberOfRoom: {
      type: Number,
      required: true,
      unique: true
    },
    floor: {
      type: Number,
      required: true
    },
    countRooms: {
      type: Number,
      required: true
    },
    countDoubleBeds: {
      type: Number,
      required: true
    },
    countSingleBeds: {
      type: Number,
      required: true
    },
    totalNumberBeds: {
      type: Number,
      required: true
    },
    services: {
      type: [
        {
          name: String,
          price: Number,
          status: Number
        }
      ],
      required: true,
      minlength: 2
    },
    price: {
      type: Number,
      required: true
    },
    photos: {
      type: [
        {
          urlName: {
            type: String,
            required: true
          },
          name: {
            type: String,
            required: true
          }
        }
      ],
      maxlength: 15,
      minlength: 2
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

schema.post('save', function(error: any, doc: any, next: (err: Error) => void): void {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Room alredy exist'));
  } else {
    next(error);
  }
});

schema.set('toObject', {
  transform: function(doc: {}, ret: any): void {
    delete ret.__v;
  }
});

export const Room: Model<IRoom> = model<IRoom>('Rooms', schema);
